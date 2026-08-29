import { http, HttpResponse, type HttpResponseResolver, type PathParams } from 'msw'
import { BASE_URL } from '../../api-instance'
import { createErrorResponse } from '../lib/createErrorResponse'

interface AuthCredentials {
  username: string
  password: string
}

interface AuthSuccessResponse {
  username: string
  token: string
}

export interface AuthErrorResponse {
  error: string
}

const authRequest: HttpResponseResolver<
  PathParams,
  AuthCredentials,
  AuthSuccessResponse | AuthErrorResponse
> = async ({ request }) => {
  const requestData = await request.json()

  if (requestData.username !== 'test-username' || requestData.password !== 'test-password') {
    return createErrorResponse<AuthErrorResponse>()
  }

  return HttpResponse.json<AuthSuccessResponse>({
    username: requestData.username,
    token: 'fake-jwt-token-for-testing',
  })
}

export const auth = [
  http.post(`${BASE_URL}/login`, authRequest),
  http.post(`${BASE_URL}/signup`, authRequest),
]
