import { describe, expect, it } from 'vitest'
import { useChannels } from './useChannels'
import { renderHookWithProviders } from '@/test/test-utils'
import { waitFor } from '@testing-library/react'
import { testChannels } from '@/test/fixtures/channels'

describe('useChannels', () => {
  it('returns channels from server', async () => {
    const hook = await renderHookWithProviders(() => useChannels())

    await waitFor(() => expect(hook.result.current.data).toEqual(testChannels))
  })
})
