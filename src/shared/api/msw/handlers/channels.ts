import { http, HttpResponse, type HttpResponseResolver, type PathParams } from 'msw'
import { BASE_URL } from '../../api-instance'
import { createErrorResponse } from '../lib/createErrorResponse'
import { authCheck } from '../lib/authCheck'
import { testChannels } from '@/test/fixtures/channels'

interface ChannelCredentials {
  name: string
}

interface ChannelSuccessResponse {
  id: string
  name: string
  removable: boolean
}

type DeleteChannelSuccessResponse = Pick<ChannelSuccessResponse, 'id'>

interface ChannelErrorResponse {
  error: string
}

const fetchChannelsRequest: HttpResponseResolver<
  PathParams,
  ChannelCredentials,
  ChannelSuccessResponse[] | ChannelErrorResponse
> = async ({ request }) => {
  const authError = authCheck(request)
  if (authError) return authError

  return HttpResponse.json<ChannelSuccessResponse[]>(testChannels)
}

const createChannelRequest: HttpResponseResolver<
  PathParams,
  ChannelCredentials,
  ChannelSuccessResponse | ChannelErrorResponse
> = async ({ request }) => {
  const authError = authCheck(request)
  if (authError) return authError

  const requestData = await request.json()

  if (!requestData || typeof requestData.name !== 'string') {
    return createErrorResponse<ChannelErrorResponse>('Bad Request', 400)
  }

  return HttpResponse.json<ChannelSuccessResponse>({
    id: '3',
    name: requestData.name,
    removable: true,
  })
}

interface ChannelPathParams {
  id: string
}

const renameChannelRequest: HttpResponseResolver<
  ChannelPathParams,
  ChannelCredentials,
  ChannelSuccessResponse | ChannelErrorResponse
> = async ({ params, request }) => {
  const authError = authCheck(request)
  if (authError) return authError

  const channelsToEdit = structuredClone(testChannels)
  const { id } = params
  const requestData = await request.json()

  if (!requestData || typeof requestData.name !== 'string') {
    return createErrorResponse<ChannelErrorResponse>('Bad Request', 400)
  }

  const channelToRename = channelsToEdit.find((channel) => channel.id === id)

  if (!channelToRename) {
    return createErrorResponse<ChannelErrorResponse>('Not Found', 404)
  }

  channelToRename.name = requestData.name

  return HttpResponse.json<ChannelSuccessResponse>(channelToRename)
}

const removeChannelRequest: HttpResponseResolver<
  ChannelPathParams,
  ChannelCredentials,
  DeleteChannelSuccessResponse | ChannelErrorResponse
> = async ({ params, request }) => {
  const authError = authCheck(request)
  if (authError) return authError

  const { id } = params

  const channelToRemove = testChannels.find((channel) => channel.id === id)

  if (!channelToRemove) {
    return createErrorResponse<ChannelErrorResponse>('Not Found', 404)
  }

  const deletedChannelId = { id: id }

  return HttpResponse.json<DeleteChannelSuccessResponse>(deletedChannelId)
}

export const channels = [
  http.get(`${BASE_URL}/channels`, fetchChannelsRequest),

  http.post(`${BASE_URL}/channels`, createChannelRequest),

  http.patch(`${BASE_URL}/channels/:id`, renameChannelRequest),

  http.delete(`${BASE_URL}/channels/:id`, removeChannelRequest),
]
