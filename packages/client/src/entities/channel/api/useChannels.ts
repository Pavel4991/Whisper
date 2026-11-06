import { useQuery } from '@tanstack/react-query'
import { channelQueryOptions } from './channel.queries'

export const useChannels = () => {
  return useQuery(channelQueryOptions)
}
