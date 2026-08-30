import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { useChannels } from './useChannels'
import { renderHookWithProviders } from '@/test/test-utils'
import { tokenStorage } from '@/shared/api'
import { waitFor } from '@testing-library/react'
import { testChannels } from '@/test/fixtures/channels'

describe('useChannels', () => {
  beforeAll(() => {
    tokenStorage.setToken('test-token')
  })

  afterAll(() => {
    tokenStorage.clearToken()
  })

  it('returns channels from server', async () => {
    const hook = await renderHookWithProviders(() => useChannels())

    await waitFor(() => expect(hook.result.current.data).toEqual(testChannels))
  })
})
