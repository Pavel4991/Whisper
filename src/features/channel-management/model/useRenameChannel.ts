import { useMutation, useQueryClient } from '@tanstack/react-query'
import { channelApi } from '@/entities/channel/api/channelApi'
import type { RenameChannelPayload } from './types'
import type { Channel } from '@/entities/channel/model'
import { channelKeys } from '@/entities/channel/api/channel.queries'

export const useRenameChannel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RenameChannelPayload) => {
      const response = await channelApi.renameChannel(payload)
      return response
    },
    onSuccess: (renamedChannel) => {
      queryClient.setQueryData<Channel[]>(channelKeys.all, (channels) => {
        if (!channels) {
          return channels
        }
        return channels.map((channel) =>
          channel.id === renamedChannel.id ? renamedChannel : channel,
        )
      })
    },
  })
}
