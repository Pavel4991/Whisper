import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Channel } from '../model/types'
import { channelQueryOptions } from './channel.queries'

export const useChannelById = (channelId: string) => {
  const selectChannel = useCallback(
    (channels: Channel[]) => channels.find((channel) => channel.id === channelId),
    [channelId],
  )
  return useQuery({
    ...channelQueryOptions,
    enabled: !!channelId,
    select: selectChannel,
  })
}
