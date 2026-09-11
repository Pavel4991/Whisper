import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getSocket } from '@/shared/api/socket-instance'
import type { Channel } from '@/entities/channel/model/types'
import type { Message } from '@/entities/message/model/types'
import { channelKeys } from '@/entities/channel/api/channel.queries'
import { upsertChannelToCache, removeChannelFromCache } from '@/entities/channel/model/channelCache'
import { useCurrentChannelStore } from '@/entities/channel/model'
import { removeMessagesByChannelId } from '@/entities/message/model/messageCache'
import { messageKeys } from '@/entities/message/api/message.queries'
import type { RemoveChannelPayload } from './types'

export type ChannelSocketEvents = {
  newChannel: (channel: Channel) => void
  renameChannel: (channel: Channel) => void
  removeChannel: (channelId: RemoveChannelPayload) => void
}

export function useChannelSubscription() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = getSocket<ChannelSocketEvents>()
    const onNewChannel = (channel: Channel) => {
      queryClient.setQueryData<Channel[]>(channelKeys.all, (channels) =>
        upsertChannelToCache(channels, channel),
      )
    }

    const onRenamedChannel = (channel: Channel) => {
      queryClient.setQueryData<Channel[]>(channelKeys.all, (channels) =>
        upsertChannelToCache(channels, channel),
      )
    }

    const onRemovedChannel = (channelId: RemoveChannelPayload) => {
      const { currentChannelId, setCurrentChannelId } = useCurrentChannelStore.getState()
      if (currentChannelId === channelId.id) {
        setCurrentChannelId('1')
      }
      queryClient.setQueryData<Channel[]>(channelKeys.all, (channels) =>
        removeChannelFromCache(channels, channelId),
      )
      queryClient.setQueryData<Message[]>(messageKeys.all, (messages) =>
        removeMessagesByChannelId(messages, channelId.id),
      )
    }

    socket.on('newChannel', onNewChannel)
    socket.on('renameChannel', onRenamedChannel)
    socket.on('removeChannel', onRemovedChannel)

    return () => {
      socket.off('newChannel', onNewChannel)
      socket.off('renameChannel', onRenamedChannel)
      socket.off('removeChannel', onRemovedChannel)
    }
  }, [queryClient])
}
