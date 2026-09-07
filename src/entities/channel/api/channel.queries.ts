import { queryOptions } from '@tanstack/react-query'
import { channelApi } from './channelApi'

export const channelKeys = {
  all: ['channels'] as const,
}

export const channelQueryOptions = queryOptions({
  queryKey: channelKeys.all,
  queryFn: channelApi.fetchChannels,
})
