import type { Message } from '@/entities/message/model/types'

export const testMessages: Message[] = [
  { id: '1', body: 'test-text-message-1', channelId: '1', username: 'admin', removable: true },
  { id: '2', body: 'test-text-message-2', channelId: '2', username: 'admin', removable: true },
]
