import { afterAll, describe, expect, it } from 'vitest'
import { act, screen, waitFor } from '@testing-library/react'
import { useChannelSubscription } from './socket.subscription'
import { useCreateChannel } from './useCreateChannel'
import { channelKeys } from '@/entities/channel/api/channel.queries'
import { messageKeys } from '@/entities/message/api/message.queries'
import { getSocket, disconnectSocket } from '@/shared/api/socket-instance'
import {
  emitNewChannel,
  emitRenameChannel,
  emitRemoveChannel,
} from '@/shared/api/msw/ws/socketMock'
import { renderWithProviders, renderHookWithProviders } from '@/test/test-utils'
import { ChatPage } from '@/pages/chat'
import { useCurrentChannelStore, type Channel } from '@/entities/channel/model'
import { testChannels } from '@/test/fixtures/channels'
import { testMessages } from '@/test/fixtures/messages'
import type { Message } from '@/entities/message/model/types'

afterAll(() => disconnectSocket())

describe('useChannelSubscription', () => {
  it('deduplicates a channel delivered via REST and socket', async () => {
    const { queryClient } = renderHookWithProviders(() => useChannelSubscription())
    queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)

    const { result: createChannelResult } = renderHookWithProviders(
      () => useCreateChannel(),
      queryClient,
    )

    await waitFor(() => expect(getSocket().connected).toBe(true))

    act(() => {
      createChannelResult.current.mutate({ name: 'new channel' })
    })

    await waitFor(() => {
      const channels = queryClient.getQueryData<Channel[]>(channelKeys.all) ?? []
      expect(channels.filter((channel) => channel.id === '3')).toHaveLength(1)
    })
  })
})

describe('realtime channel events', () => {
  it('reflects channels created, renamed and removed by another window', async () => {
    useCurrentChannelStore.setState({ currentChannelId: '2' })
    const { queryClient } = renderWithProviders(<ChatPage />, { route: '/chat' })
    queryClient.setQueryData<Message[]>(messageKeys.all, testMessages)

    await waitFor(() => expect(getSocket().connected).toBe(true))

    emitNewChannel({ id: 'new-1', name: 'realtime-channel', removable: true })
    expect(await screen.findByText('realtime-channel')).toBeInTheDocument()

    emitRenameChannel({ id: 'new-1', name: 'renamed-channel', removable: true })
    expect(await screen.findByText('renamed-channel')).toBeInTheDocument()

    emitRemoveChannel('2')

    await waitFor(() => {
      const channels = queryClient.getQueryData<Channel[]>(channelKeys.all) ?? []
      expect(channels.some((channel) => channel.id === '2')).toBe(false)
    })

    await waitFor(() => {
      const messages = queryClient.getQueryData<Message[]>(messageKeys.all) ?? []
      expect(messages.some((message) => message.channelId === '2')).toBe(false)
    })

    expect(useCurrentChannelStore.getState().currentChannelId).toBe('1')
  })
})
