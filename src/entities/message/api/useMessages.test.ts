import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { useMessages } from './useMessages'
import { renderHookWithProviders } from '@/test/test-utils'
import { tokenStorage } from '@/shared/api'
import { waitFor } from '@testing-library/react'
import { testMessages } from '@/test/fixtures/messages'

describe('useMessages', () => {
  beforeAll(() => {
    tokenStorage.setToken('test-token')
  })

  afterAll(() => {
    tokenStorage.clearToken()
  })

  it('returns messages for current channel from server', async () => {
    const hook = await renderHookWithProviders(() => useMessages('1'))

    await waitFor(() => expect(hook.result.current.data).toEqual([testMessages[0]]))
  })
})
