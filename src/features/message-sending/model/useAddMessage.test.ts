import { describe, expect, it } from 'vitest'
import { mockServerError, renderHookWithProviders } from '@/test/test-utils'
import { messageKeys } from '@/entities/message/api/message.queries'
import { useAddMessage } from './useAddMessage'
import { testMessages } from '@/test/fixtures/messages'
import type { Message } from '@/entities/message/model/types'
import { act, waitFor } from '@testing-library/react'

describe('useAddMessage', () => {
  it('adds message to cache on success', async () => {
    const newMessage = {
      body: 'test-text-message-3',
      channelId: '1',
      username: 'admin',
    }
    const hook = await renderHookWithProviders(() => useAddMessage())
    hook.queryClient.setQueryData<Message[]>(messageKeys.all, testMessages)
    act(() => {
      hook.result.current.mutate(newMessage)
    })
    await waitFor(() => expect(hook.result.current.status).toBe('success'))
    const updatedMessages = hook.queryClient.getQueryData<Message[]>(messageKeys.all)
    expect(updatedMessages).toEqual([...testMessages, { id: '3', ...newMessage }])
  })

  it('does not change cache and returns error status if server fails', async () => {
    const newMessage = {
      body: 'test-text-message-3',
      channelId: '1',
      username: 'admin',
    }
    mockServerError('post', '/messages')
    const hook = await renderHookWithProviders(() => useAddMessage())
    hook.queryClient.setQueryData<Message[]>(messageKeys.all, testMessages)
    act(() => {
      hook.result.current.mutate(newMessage)
    })

    await waitFor(() => expect(hook.result.current.status).toBe('error'))

    const cachedMessages = hook.queryClient.getQueryData<Message[]>(messageKeys.all)
    expect(cachedMessages).toEqual(testMessages)
  })
})
