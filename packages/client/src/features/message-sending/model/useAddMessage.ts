import { messageKeys, messageApi, appendMessageToCache, type Message } from '@/entities/message'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import type { AddMessagePayload } from './types'

export function useAddMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddMessagePayload) => {
      const response = await messageApi.addMessage(payload)
      return response
    },
    onSuccess(newMessage) {
      queryClient.setQueryData<Message[]>(messageKeys.all, (messages) =>
        appendMessageToCache(messages, newMessage),
      )
    },
  })
}
