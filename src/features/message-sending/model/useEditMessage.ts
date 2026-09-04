import { messageKeys } from '@/entities/message/api/message.queries'
import { messageApi } from '@/entities/message/api/messageApi'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import type { EditMessagePayload } from './types'
import type { Message } from '@/entities/message/model/types'

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
