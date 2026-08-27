import { http, HttpResponse } from 'msw'
import type { StrictRequest } from 'msw'
import { BASE_URL } from '../../api-instance'

interface AuthCredentials {
  username: string
  password: string
}

const authRequest = async ({ request }: { request: StrictRequest<AuthCredentials> }) => {
  const requestData = await request.json()

  if (!requestData.username || !requestData.password) {
    return new HttpResponse(JSON.stringify({ error: 'Username and password are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
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
