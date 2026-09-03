import { describe, expect, it } from 'vitest'
import { waitFor, act } from '@testing-library/react'
import { renderHookWithProviders, mockServerError } from '@/test/test-utils'
import { useRemoveChannel } from './useRemoveChannel'
import { useCurrentChannelStore, type Channel } from '@/entities/channel/model'
import { channelKeys } from '@/entities/channel/api/channel.queries'
import { testChannels } from '@/test/fixtures/channels'

describe('useRemoveChannel', () => {
  it('returns removed channel id from server', async () => {
    const setCurrentChannelId = useCurrentChannelStore.getState().setCurrentChannelId
    setCurrentChannelId('2')
    const hook = await renderHookWithProviders(() => useRemoveChannel())
    hook.queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)
    act(() => {
      hook.result.current.mutate({ id: '2' })
    })
    await waitFor(() => expect(hook.result.current.status).toBe('success'))
    const updatedChannels = hook.queryClient.getQueryData<Channel[]>(channelKeys.all)
    expect(updatedChannels).toEqual([testChannels[0]])

    const defaultCurrentChannelId = useCurrentChannelStore.getState().currentChannelId
    expect(defaultCurrentChannelId).toBe('1')
  })

  it('does not change cache and returns error status if server fails', async () => {
    mockServerError('delete', '/channels/1')

    const hook = await renderHookWithProviders(() => useRemoveChannel())
    hook.queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)
    act(() => {
      hook.result.current.mutate({ id: '1' })
    })

    await waitFor(() => expect(hook.result.current.status).toBe('error'))

    const cachedChannels = hook.queryClient.getQueryData<Channel[]>(channelKeys.all)
    expect(cachedChannels).toEqual(testChannels)
  })
})
