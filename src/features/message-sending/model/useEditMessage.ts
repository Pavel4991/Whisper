import { messageKeys, messageApi, type Message } from '@/entities/message'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import type { EditMessagePayload } from './types'

export function useEditMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: EditMessagePayload) => {
      const response = await messageApi.editMessage(payload)
      return response
    },
    onSuccess(editedMessage) {
      queryClient.setQueryData<Message[]>(messageKeys.all, (messages) =>
        messages
          ? messages.map((message) => (message.id === editedMessage.id ? editedMessage : message))
          : [editedMessage],
      )
    },
  })
}
