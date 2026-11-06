import { HttpResponse, type JsonBodyType } from 'msw'

export interface DefaultErrorResponse {
  error: string
}

/**
 * Хелпер для создания типизированных ответов с ошибкой.
 * Ограничение extends JsonBodyType гарантирует совместимость с HttpResponse.json
 */
export const createErrorResponse = <T extends JsonBodyType = DefaultErrorResponse>(
  message: string = 'Unauthorized',
  status: number = 401,
) => {
  return HttpResponse.json<T>({ error: message } as unknown as T, { status })
}
