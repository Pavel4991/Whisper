import { describe, expect, it } from 'vitest'
import { waitFor, act } from '@testing-library/react'
import { renderHookWithProviders, mockServerError } from '@/test/test-utils'
import { useCreateChannel } from './useCreateChannel'
import type { Channel } from '@/entities/channel/model'
import { channelKeys } from '@/entities/channel/api/channel.queries'
import { testChannels } from '@/test/fixtures/channels'

describe('useCreateChannel', () => {
  it('returns new channel from server', async () => {
    const hook = await renderHookWithProviders(() => useCreateChannel())
    hook.queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)
    act(() => {
      hook.result.current.mutate({ name: 'new-test-channel' })
    })
    await waitFor(() => expect(hook.result.current.status).toBe('success'))
    const updatedChannels = hook.queryClient.getQueryData<Channel[]>(channelKeys.all)
    expect(updatedChannels).toEqual([
      ...testChannels,
      { id: '3', name: 'new-test-channel', removable: true },
    ])
  })

  it('does not change cache and returns error status if server fails', async () => {
    mockServerError('post', '/channels')
    const hook = await renderHookWithProviders(() => useCreateChannel())
    hook.queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)
    act(() => {
      hook.result.current.mutate({ name: 'failed-channel' })
    })

    await waitFor(() => expect(hook.result.current.status).toBe('error'))

    const cachedChannels = hook.queryClient.getQueryData<Channel[]>(channelKeys.all)
    expect(cachedChannels).toEqual(testChannels)
  })
})
