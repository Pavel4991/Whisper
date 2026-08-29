import { createErrorResponse } from './createErrorResponse'

export const authCheck = (request: Request) => {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return createErrorResponse()
  }

  const token = authHeader.split(' ')[1]

  if (token !== 'test-token') {
    return createErrorResponse()
  }
}
