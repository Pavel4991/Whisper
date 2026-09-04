import { messageKeys } from '@/entities/message/api/message.queries'
import { messageApi } from '@/entities/message/api/messageApi'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import type { AddMessagePayload } from './types'
import type { Message } from '@/entities/message/model/types'

export function useAddMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddMessagePayload) => {
      const response = await messageApi.addMessage(payload)
      return response
    },
    onSuccess(newMessage) {
      queryClient.setQueryData<Message[]>(messageKeys.all, (messages) =>
        messages ? [...messages, newMessage] : [newMessage],
      )
    },
  })
}
