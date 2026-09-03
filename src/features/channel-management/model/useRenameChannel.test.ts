import { describe, expect, it } from 'vitest'
import { waitFor, act } from '@testing-library/react'
import { renderHookWithProviders, mockServerError } from '@/test/test-utils'
import { useRenameChannel } from './useRenameChannel'
import type { Channel } from '@/entities/channel/model'
import { channelKeys } from '@/entities/channel/api/channel.queries'
import { testChannels } from '@/test/fixtures/channels'

describe('useRenameChannel', () => {
  it('returns renamed channel from server', async () => {
    const hook = await renderHookWithProviders(() => useRenameChannel())
    hook.queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)
    act(() => {
      hook.result.current.mutate({ id: '1', name: 'renamed-test-channel' })
    })
    await waitFor(() => expect(hook.result.current.status).toBe('success'))
    const updatedChannels = hook.queryClient.getQueryData<Channel[]>(channelKeys.all)
    expect(updatedChannels).toEqual([
      { id: '1', name: 'renamed-test-channel', removable: true },
      testChannels[1],
    ])
  })

  it('does not change cache and returns error status if server fails', async () => {
    mockServerError('patch', '/channels/1')
    const hook = await renderHookWithProviders(() => useRenameChannel())
    hook.queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)
    act(() => {
      hook.result.current.mutate({ id: '1', name: 'renamed-test-channel' })
    })

    await waitFor(() => expect(hook.result.current.status).toBe('error'))

    const cachedChannels = hook.queryClient.getQueryData<Channel[]>(channelKeys.all)
    expect(cachedChannels).toEqual(testChannels)
  })
})
