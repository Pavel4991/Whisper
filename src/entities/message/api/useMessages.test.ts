import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { useMessages } from './useMessages'
import { renderHookWithProviders } from '@/test/test-utils'
import { tokenStorage } from '@/shared/api'
import { waitFor } from '@testing-library/react'

describe('useMessages', () => {
  beforeAll(() => {
    tokenStorage.setToken('test-token')
  })

  afterAll(() => {
    tokenStorage.clearToken()
  })

  it('returns messages for current channel from server', async () => {
    const testData = [
      {
        id: '1',
        body: 'test-text-message-1',
        channelId: '1',
        username: 'admin',
        removable: true,
      },
    ]

    const hook = await renderHookWithProviders(() => useMessages('1'))

    await waitFor(() => expect(hook.result.current.data).toEqual(testData))
  })
})
