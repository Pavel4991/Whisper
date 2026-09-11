import { useMutation, useQueryClient } from '@tanstack/react-query'
import { channelApi } from '@/entities/channel/api/channelApi'
import type { RemoveChannelPayload } from './types'
import { useCurrentChannelStore, type Channel } from '@/entities/channel/model'
import { channelKeys } from '@/entities/channel/api/channel.queries'
import { removeChannelFromCache } from '@/entities/channel/model/channelCache'
import { removeMessagesByChannelId } from '@/entities/message/model/messageCache'
import { messageKeys } from '@/entities/message/api/message.queries'
import type { Message } from '@/entities/message/model/types'

export const useRemoveChannel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RemoveChannelPayload) => {
      const response = await channelApi.removeChannel(payload)
      return response
    },
    onSuccess: (removedChannelId) => {
      const { currentChannelId, setCurrentChannelId } = useCurrentChannelStore.getState()
      if (currentChannelId === removedChannelId.id) {
        setCurrentChannelId('1')
      }

      queryClient.setQueryData<Channel[]>(channelKeys.all, (channels) =>
        removeChannelFromCache(channels, removedChannelId),
      )

      queryClient.setQueryData<Message[]>(messageKeys.all, (messages) =>
        removeMessagesByChannelId(messages, removedChannelId.id),
      )
    },
  })
}
