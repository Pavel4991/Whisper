import { describe, expect, it } from 'vitest'
import { mockServerError, renderHookWithProviders } from '@/test/test-utils'
import { messageKeys } from '@/entities/message/api/message.queries'
import { useEditMessage } from './useEditMessage'
import { testMessages } from '@/test/fixtures/messages'
import type { Message } from '@/entities/message/model/types'
import { act, waitFor } from '@testing-library/react'

describe('useEditMessage', () => {
  it('updates message in cache on success', async () => {
    const hook = await renderHookWithProviders(() => useEditMessage())
    hook.queryClient.setQueryData<Message[]>(messageKeys.all, testMessages)
    act(() => {
      hook.result.current.mutate({ id: '1', body: 'edited-text-message' })
    })
    await waitFor(() => expect(hook.result.current.status).toBe('success'))
    const updatedMessages = hook.queryClient.getQueryData<Message[]>(messageKeys.all)
    expect(updatedMessages).toEqual([
      { id: '1', body: 'edited-text-message', channelId: '1', username: 'admin' },
      testMessages[1],
    ])
  })

  it('does not change cache and returns error status if server fails', async () => {
    mockServerError('patch', '/messages/1')
    const hook = await renderHookWithProviders(() => useEditMessage())
    hook.queryClient.setQueryData<Message[]>(messageKeys.all, testMessages)
    act(() => {
      hook.result.current.mutate({ id: '1', body: 'edited-text-message' })
    })

    await waitFor(() => expect(hook.result.current.status).toBe('error'))

    const cachedMessages = hook.queryClient.getQueryData<Message[]>(messageKeys.all)
    expect(cachedMessages).toEqual(testMessages)
  })
})
