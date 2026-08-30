import { http, HttpResponse, type HttpResponseResolver, type PathParams } from 'msw'
import { BASE_URL } from '../../api-instance'
import { createErrorResponse } from '../lib/createErrorResponse'
import { authCheck } from '../lib/authCheck'
import { testMessages } from '@/test/fixtures/messages'

interface MessageCredentials {
  body: string
  channelId: string
  username: string
}

interface MessageSuccessResponse {
  id: string
  body: string
  channelId: string
  username: string
  removable: boolean
}

type DeletedMessageSuccessResponse = Pick<MessageSuccessResponse, 'id'>

interface MessageErrorResponse {
  error: string
}

const fetchMessagesRequest: HttpResponseResolver<
  PathParams,
  MessageCredentials,
  MessageSuccessResponse[] | MessageErrorResponse
> = async ({ request }) => {
  const authError = authCheck(request)
  if (authError) return authError
  return HttpResponse.json<MessageSuccessResponse[]>(testMessages)
}

const addMessageRequest: HttpResponseResolver<
  PathParams,
  MessageCredentials,
  MessageSuccessResponse | MessageErrorResponse
> = async ({ request }) => {
  const authError = authCheck(request)
  if (authError) return authError

  const requestData = await request.json()

  if (!requestData || typeof requestData.body !== 'string') {
    return createErrorResponse<MessageErrorResponse>('Bad Request', 400)
  }

  return HttpResponse.json<MessageSuccessResponse>({
    id: '1',
    body: requestData.body,
    channelId: requestData.channelId,
    username: requestData.username,
    removable: true,
  })
}

type MessagePathParams = Pick<MessageSuccessResponse, 'id'>

const editMessageRequest: HttpResponseResolver<
  MessagePathParams,
  MessageCredentials,
  MessageSuccessResponse | MessageErrorResponse
> = async ({ params, request }) => {
  const authError = authCheck(request)
  if (authError) return authError

  const messagesToEdit = structuredClone(testMessages)
  const { id } = params
  const requestData = await request.json()

  if (!requestData || typeof requestData.body !== 'string') {
    return createErrorResponse<MessageErrorResponse>('Bad Request', 400)
  }

  const messageToEdit = messagesToEdit.find((message) => message.id === id)

  if (!messageToEdit) {
    return createErrorResponse<MessageErrorResponse>('Not Found', 404)
  }

  messageToEdit.body = requestData.body

  return HttpResponse.json<MessageSuccessResponse>(messageToEdit)
}

const removeMessageRequest: HttpResponseResolver<
  MessagePathParams,
  MessageCredentials,
  DeletedMessageSuccessResponse | MessageErrorResponse
> = async ({ params, request }) => {
  const authError = authCheck(request)
  if (authError) return authError

  const { id } = params

  const messageToRemove = testMessages.find((message) => message.id === id)

  if (!messageToRemove) {
    return createErrorResponse<MessageErrorResponse>('Not Found', 404)
  }

  const deletedChannelId = { id: id }

  return HttpResponse.json<DeletedMessageSuccessResponse>(deletedChannelId)
}

export const messages = [
  http.get(`${BASE_URL}/messages`, fetchMessagesRequest),

  http.post(`${BASE_URL}/messages`, addMessageRequest),

  http.patch(`${BASE_URL}/messages/:id`, editMessageRequest),

  http.delete(`${BASE_URL}/messages/:id`, removeMessageRequest),
]
