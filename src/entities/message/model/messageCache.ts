import type { Message } from './types'

export function appendMessageToCache(
  existing: Message[] | undefined,
  incoming: Message,
): Message[] {
  if (existing?.some((m) => m.id === incoming.id)) return existing
  return existing ? [...existing, incoming] : [incoming]
}
