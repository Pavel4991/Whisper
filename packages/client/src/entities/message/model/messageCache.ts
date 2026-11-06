import type { Message } from './types'

export function appendMessageToCache(
  existing: Message[] | undefined,
  incoming: Message,
): Message[] {
  if (existing?.some((message) => message.id === incoming.id)) return existing
  return existing ? [...existing, incoming] : [incoming]
}

export function removeMessagesByChannelId(
  messages: Message[] | undefined,
  channelId: string,
): Message[] {
  return messages ? messages.filter((message) => message.channelId !== channelId) : []
}
