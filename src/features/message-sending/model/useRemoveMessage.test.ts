import { describe, expect, it } from 'vitest'
import { mockServerError, renderHookWithProviders } from '@/test/test-utils'
import { messageKeys } from '@/entities/message/api/message.queries'
import { useRemoveMessage } from './useRemoveMessage'
import { testMessages } from '@/test/fixtures/messages'
import type { Message } from '@/entities/message/model/types'
import { act, waitFor } from '@testing-library/react'

describe('useRemoveMessage', () => {
  it('removes message from cache on success', async () => {
    const hook = await renderHookWithProviders(() => useRemoveMessage())
    hook.queryClient.setQueryData<Message[]>(messageKeys.all, testMessages)
    act(() => {
      hook.result.current.mutate({ id: '1' })
    })
    await waitFor(() => expect(hook.result.current.status).toBe('success'))
    const updatedMessages = hook.queryClient.getQueryData<Message[]>(messageKeys.all)
    expect(updatedMessages).toEqual([testMessages[1]])
  })

  it('does not change cache and returns error status if server fails', async () => {
    mockServerError('delete', '/messages/1')
    const hook = await renderHookWithProviders(() => useRemoveMessage())
    hook.queryClient.setQueryData<Message[]>(messageKeys.all, testMessages)
    act(() => {
      hook.result.current.mutate({ id: '1' })
    })

    await waitFor(() => expect(hook.result.current.status).toBe('error'))

    const cachedMessages = hook.queryClient.getQueryData<Message[]>(messageKeys.all)
    expect(cachedMessages).toEqual(testMessages)
  })
})
