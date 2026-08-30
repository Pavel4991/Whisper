import { useQuery } from '@tanstack/react-query'
import { messageApi } from './messageApi'
import { messageKeys } from './message.queries'

export const useMessages = (channelId: string) => {
  return useQuery({
    queryKey: messageKeys.all,
    queryFn: messageApi.fetchMessages,
    select: (messages) => messages.filter((message) => message.channelId === channelId),
  })
}
