import { afterAll, describe, expect, it } from 'vitest'
import { act, screen, waitFor } from '@testing-library/react'
import { useNewMessageSubscription } from './socket.subscription'
import { useAddMessage } from '@/features/message-sending/model/useAddMessage'
import { messageKeys } from '../api/message.queries'
import { getSocket, disconnectSocket } from '@/shared/api/socket-instance'
import { emitNewMessage } from '@/shared/api/msw/ws/socketMock'
import { renderWithProviders, renderHookWithProviders } from '@/test/test-utils'
import { ChatWindow } from '@/widgets/chat/ui/ChatWindow'
import { useCurrentChannelStore } from '@/entities/channel/model'
import { testMessages } from '@/test/fixtures/messages'
import type { Message } from './types'

afterAll(() => disconnectSocket())

describe('useNewMessageSubscription', () => {
  it('deduplicates a message delivered via REST and socket', async () => {
    const { queryClient } = renderHookWithProviders(() => useNewMessageSubscription())
    queryClient.setQueryData<Message[]>(messageKeys.all, testMessages)

    const { result: addMessageResult } = renderHookWithProviders(() => useAddMessage(), queryClient)

    await waitFor(() => expect(getSocket().connected).toBe(true))

    act(() => {
      addMessageResult.current.mutate({
        body: 'from first window',
        channelId: '1',
        username: 'admin',
      })
    })

    await waitFor(() => {
      const messages = queryClient.getQueryData<Message[]>(messageKeys.all) ?? []
      expect(messages.filter((message) => message.id === '3')).toHaveLength(1)
    })
  })
})

describe('realtime broadcast', () => {
  it('delivers a message to a window that did not send it', async () => {
    useCurrentChannelStore.setState({ currentChannelId: '2' })
    const { queryClient } = renderWithProviders(<ChatWindow />, { route: '/chat' })
    queryClient.setQueryData<Message[]>(messageKeys.all, testMessages)

    await waitFor(() => expect(getSocket().connected).toBe(true))

    emitNewMessage({
      id: 'broadcast-1',
      channelId: '2',
      body: 'from another user',
      username: 'other',
    })

    await waitFor(() => {
      expect(screen.getByText('from another user')).toBeInTheDocument()
    })
  })
})
