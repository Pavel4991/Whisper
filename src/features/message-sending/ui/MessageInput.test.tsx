import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import { testMessages } from '@/test/fixtures/messages'
import { MessageInput } from './MessageInput'
import { messageKeys } from '@/entities/message/api/message.queries'
import { mockServerError } from '@/test/test-utils'

describe('MessageInput', () => {
  it('renders message input', () => {
    renderWithProviders(<MessageInput channelId="1" username="admin" />, { route: '/chat' })

    expect(screen.getByRole('textbox', { name: 'Напишите сообщение' })).toBeInTheDocument()
  })

  it('sends trimmed message to server and adds it to cache', async () => {
    const user = userEvent.setup()
    const { queryClient } = renderWithProviders(<MessageInput channelId="1" username="admin" />, {
      route: '/chat',
    })
    const messageInput = screen.getByRole('textbox', { name: 'Напишите сообщение' })
    const sendButton = screen.getByRole('button', { name: 'Отправить' })
    queryClient.setQueryData(messageKeys.all, testMessages)

    await user.type(messageInput, ' test-text-message-3   ')
    await user.click(sendButton)

    await waitFor(() => {
      const messages = queryClient.getQueryData(messageKeys.all)
      expect(messages).toEqual([
        ...testMessages,
        { id: '3', body: 'test-text-message-3', channelId: '1', username: 'admin' },
      ])
    })
  })

  it('do not send message to server if server fails', async () => {
    mockServerError('post', '/messages')
    const user = userEvent.setup()
    const { queryClient } = renderWithProviders(<MessageInput channelId="1" username="admin" />, {
      route: '/chat',
    })
    const messageInput = screen.getByRole('textbox', { name: 'Напишите сообщение' })
    const sendButton = screen.getByRole('button', { name: 'Отправить' })
    queryClient.setQueryData(messageKeys.all, testMessages)

    await user.type(messageInput, 'test-text-message-3')
    await user.click(sendButton)

    await waitFor(() => {
      const messages = queryClient.getQueryData(messageKeys.all)
      expect(messages).toEqual(testMessages)
    })
  })

  it('do not send message to server if message is empty', async () => {
    const user = userEvent.setup()
    const { queryClient } = renderWithProviders(<MessageInput channelId="1" username="admin" />, {
      route: '/chat',
    })
    const messageInput = screen.getByRole('textbox', { name: 'Напишите сообщение' })
    const sendButton = screen.getByRole('button', { name: 'Отправить' })
    queryClient.setQueryData(messageKeys.all, testMessages)

    await user.type(messageInput, '   ')
    await user.keyboard('{Enter}')

    expect(sendButton).toBeDisabled()

    await waitFor(() => {
      const messages = queryClient.getQueryData(messageKeys.all)
      expect(messages).toEqual(testMessages)
    })
  })

  it('do not send message to server if channel id and username are not set', async () => {
    const user = userEvent.setup()
    const { queryClient } = renderWithProviders(<MessageInput channelId={null} username={null} />, {
      route: '/chat',
    })
    const messageInput = screen.getByRole('textbox', { name: 'Напишите сообщение' })
    const sendButton = screen.getByRole('button', { name: 'Отправить' })
    queryClient.setQueryData(messageKeys.all, testMessages)

    await user.type(messageInput, 'test-text-message-3')
    await user.click(sendButton)

    expect(sendButton).toBeDisabled()

    await waitFor(() => {
      const messages = queryClient.getQueryData(messageKeys.all)
      expect(messages).toEqual(testMessages)
    })
  })
})
