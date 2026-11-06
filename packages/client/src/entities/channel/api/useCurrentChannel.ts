import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCurrentChannelStore } from '../model/currentChannelStore'
import type { Channel } from '../model/types'
import { channelQueryOptions } from './channel.queries'

export const useCurrentChannel = () => {
  const currentChannelId = useCurrentChannelStore((state) => state.currentChannelId)

  const selectChannel = useCallback(
    (channels: Channel[]) => channels.find((channel) => channel.id === currentChannelId),
    [currentChannelId],
  )

  return useQuery({
    ...channelQueryOptions,
    enabled: !!currentChannelId,
    select: selectChannel,
  })
}
