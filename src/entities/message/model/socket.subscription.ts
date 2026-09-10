import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getSocket } from '@/shared/api/socket-instance'
import { messageKeys } from '../api/message.queries'
import { appendMessageToCache } from './messageCache'
import type { Message } from './types'

export type SocketEvents = {
  newMessage: (message: Message) => void
}

export function useNewMessageSubscription() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = getSocket<SocketEvents>()
    const onNewMessage = (message: Message) => {
      queryClient.setQueryData<Message[]>(messageKeys.all, (messages) =>
        appendMessageToCache(messages, message),
      )
    }

    socket.on('newMessage', onNewMessage)

    return () => {
      socket.off('newMessage', onNewMessage)
    }
  }, [queryClient])
}
