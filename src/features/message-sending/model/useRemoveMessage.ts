import { messageKeys, messageApi, type Message } from '@/entities/message'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import type { RemoveMessagePayload } from './types'

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
