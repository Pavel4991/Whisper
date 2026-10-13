import { describe, expect, it } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '@/test/test-utils'
import { useChannelById } from './useChannelById'
import { channelKeys } from '@/entities/channel/api/channel.queries'
import { testChannels } from '@/test/fixtures/channels'

describe('useChannelById', () => {
  it('returns channel by id', async () => {
    const hook = renderHookWithProviders(() => useChannelById('1'))

    act(() => {
      hook.queryClient.setQueryData(channelKeys.all, testChannels)
    })

    await waitFor(() => expect(hook.result.current.data).toEqual(testChannels[0]))
  })

  it('returns undefined when channel not found', async () => {
    const hook = renderHookWithProviders(() => useChannelById('999'))

    act(() => {
      hook.queryClient.setQueryData(channelKeys.all, testChannels)
    })

    await waitFor(() => expect(hook.result.current.data).toBeUndefined())
  })

  it('does not fetch and returns undefined when channel id is empty string', async () => {
    const hook = renderHookWithProviders(() => useChannelById(''))

    await waitFor(() => expect(hook.result.current.data).toBeUndefined())
    expect(hook.result.current.isFetched).toBe(false)
    expect(hook.result.current.fetchStatus).toBe('idle')
  })
})
