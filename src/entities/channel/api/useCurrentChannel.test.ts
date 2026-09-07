import { describe, expect, it } from 'vitest'
import { renderHookWithProviders } from '@/test/test-utils'
import { useCurrentChannel } from './useCurrentChannel'
import { act, waitFor } from '@testing-library/react'
import { channelKeys } from './channel.queries'
import { testChannels } from '@/test/fixtures/channels'
import { useCurrentChannelStore } from '@/entities/channel/model/currentChannelStore'

describe('useCurrentChannel', () => {
  it('returns current channel from cache', async () => {
    const hook = renderHookWithProviders(() => useCurrentChannel())

    act(() => {
      hook.queryClient.setQueryData(channelKeys.all, testChannels)
    })

    await waitFor(() => expect(hook.result.current.data).toEqual(testChannels[0]))
  })

  it('returns undefined when channel not found', async () => {
    useCurrentChannelStore.setState({ currentChannelId: '999' })
    const hook = renderHookWithProviders(() => useCurrentChannel())

    await waitFor(() => expect(hook.result.current.data).toBeUndefined())
  })

  it('returns undefined when channel is null', async () => {
    useCurrentChannelStore.setState({ currentChannelId: null })
    const hook = renderHookWithProviders(() => useCurrentChannel())

    await waitFor(() => expect(hook.result.current.data).toBeUndefined())
  })
})
