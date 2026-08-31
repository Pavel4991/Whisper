import { useMutation, useQueryClient } from '@tanstack/react-query'
import { channelApi } from '@/entities/channel/api/channelApi'
import type { RemoveChannelPayload } from './types'
import { useCurrentChannelStore, type Channel } from '@/entities/channel/model'
import { channelKeys } from '@/entities/channel/api/channel.queries'

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

      queryClient.setQueryData<Channel[]>(channelKeys.all, (channels) => {
        if (channels) {
          return channels.filter((channel) => channel.id !== removedChannelId.id)
        } else {
          return channels
        }
      })
    },
  })
}
