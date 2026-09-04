import { messageKeys } from '@/entities/message/api/message.queries'
import { messageApi } from '@/entities/message/api/messageApi'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import type { RemoveMessagePayload } from './types'
import type { Message } from '@/entities/message/model/types'

export function useRemoveMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RemoveMessagePayload) => {
      const response = await messageApi.removeMessage(payload)
      return response
    },
    onSuccess: (removedMessageId) => {
      queryClient.setQueryData<Message[]>(messageKeys.all, (messages) => {
        if (messages) {
          return messages.filter((message) => message.id !== removedMessageId.id)
        } else {
          return messages
        }
      })
    },
  })
}
