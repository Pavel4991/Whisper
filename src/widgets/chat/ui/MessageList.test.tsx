import { describe, expect, it, vi } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { testMessages } from '@/test/fixtures/messages'
import { MessageList } from './MessageList'
import { messageKeys } from '@/entities/message/api/message.queries'
import { http, HttpResponse, delay } from 'msw'
import { BASE_URL } from '@/shared/api/api-instance'
import { server } from '@/shared/api/msw/server'

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

  it('shows three skeletons while messages are pending', async () => {
    server.use(
      http.get(`${BASE_URL}/messages`, async () => {
        await delay(50)
        return HttpResponse.json(testMessages)
      }),
    )
    renderWithProviders(<MessageList channelId="2" />, { route: '/chat' })

    expect(screen.getAllByTestId('message-skeleton')).toHaveLength(3)
    expect(await screen.findByText('test-text-message-2')).toBeInTheDocument()
  })

  it('sticks to the bottom when messages arrive', async () => {
    vi.mocked(Element.prototype.scrollTo).mockClear()
    const { queryClient } = renderWithProviders(<MessageList channelId="1" />, { route: '/chat' })

    queryClient.setQueryData(messageKeys.all, testMessages)

    await waitFor(() => expect(Element.prototype.scrollTo).toHaveBeenCalled())
  })

  it('stops sticking after scrolling up', async () => {
    const { container, queryClient } = renderWithProviders(<MessageList channelId="1" />, {
      route: '/chat',
    })
    queryClient.setQueryData(messageKeys.all, testMessages)

    const viewport = await waitFor(() => {
      const node = container.querySelector('div[data-scrollarea-viewport]')
      if (!node) throw new Error('Viewport not found')
      return node
    })

    Object.defineProperty(viewport, 'scrollHeight', { value: 1000, configurable: true })
    Object.defineProperty(viewport, 'clientHeight', { value: 300, configurable: true })
    fireEvent.scroll(viewport)

    vi.mocked(Element.prototype.scrollTo).mockClear()

    queryClient.setQueryData(messageKeys.all, [
      ...testMessages,
      { id: '3', channelId: '1', body: 'test-text-message-3', username: 'admin' },
    ])

    await screen.findByText('test-text-message-3')

    expect(Element.prototype.scrollTo).not.toHaveBeenCalled()
  })
})
