import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { testMessages } from '@/test/fixtures/messages'
import { MessageList } from './MessageList'
import { messageKeys } from '@/entities/message/api/message.queries'

describe('MessageList', () => {
  it('renders messages from cache', async () => {
    const { queryClient } = renderWithProviders(<MessageList channelId="1" />, { route: '/chat' })

    queryClient.setQueryData(messageKeys.all, testMessages)

    await waitFor(() => expect(screen.getByText('test-text-message-1')).toBeInTheDocument())
  })
  it('renders empty message list when channel not found', async () => {
    renderWithProviders(<MessageList channelId="999" />, { route: '/chat' })

    await waitFor(() => expect(screen.getByText('Пока нет сообщений')).toBeInTheDocument())
  })
})
