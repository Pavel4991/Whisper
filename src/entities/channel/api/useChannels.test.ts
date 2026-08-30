import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { useChannels } from './useChannels'
import { renderHookWithProviders } from '@/test/test-utils'
import { tokenStorage } from '@/shared/api'
import { waitFor } from '@testing-library/react'

describe('useChannels', () => {
  beforeAll(() => {
    tokenStorage.setToken('test-token')
  })

  afterAll(() => {
    tokenStorage.clearToken()
  })

  it('returns channels from server', async () => {
    const testData = [
      {
        id: '1',
        name: 'test-channel-name-1',
        removable: true,
      },
      {
        id: '2',
        name: 'test-channel-name-2',
        removable: true,
      },
    ]

    const hook = await renderHookWithProviders(() => useChannels())

    await waitFor(() => expect(hook.result.current.data).toEqual(testData))
  })
})
