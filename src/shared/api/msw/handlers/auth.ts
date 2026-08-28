import { http, HttpResponse } from 'msw'
import type { StrictRequest } from 'msw'
import { BASE_URL } from '../../api-instance'

interface AuthCredentials {
  username: string
  password: string
}

const authRequest = async ({ request }: { request: StrictRequest<AuthCredentials> }) => {
  const requestData = await request.json()

  const createErrorResponse = () =>
    new HttpResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })

  if (requestData.username !== 'test-username' || requestData.password !== 'test-password') {
    return createErrorResponse()
  }

  return HttpResponse.json({
    username: requestData.username,
    token: 'fake-jwt-token-for-testing',
  })
}

export const auth = [
  http.post(`${BASE_URL}/login`, authRequest),

  http.post(`${BASE_URL}/signup`, authRequest),
]
