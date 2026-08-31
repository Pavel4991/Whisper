import { useMutation, useQueryClient } from '@tanstack/react-query'
import { channelApi } from '@/entities/channel/api/channelApi'
import type { CreateChannelPayload } from './types'
import type { Channel } from '@/entities/channel/model'
import { channelKeys } from '@/entities/channel/api/channel.queries'

export const useCreateChannel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateChannelPayload) => {
      const response = await channelApi.createChannel(payload)
      return response
    },
    onSuccess: (newChannel) => {
      queryClient.setQueryData<Channel[]>(channelKeys.all, (channels) =>
        channels ? [...channels, newChannel] : [newChannel],
      )
    },
  })
}
