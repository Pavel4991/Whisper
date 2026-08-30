import { useQuery } from '@tanstack/react-query'
import { channelApi } from './channelApi'
import { channelKeys } from './channel.queries'

export const useChannels = () => {
  return useQuery({
    queryKey: channelKeys.all,
    queryFn: channelApi.fetchChannels,
  })
}
