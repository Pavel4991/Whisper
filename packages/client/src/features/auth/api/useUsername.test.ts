import { describe, expect, it, beforeEach } from 'vitest'
import { renderHookWithProviders } from '@/test/test-utils'
import { useUsername } from './useUsername'
import { authKeys } from './auth.queries'
import { act, waitFor } from '@testing-library/react'
import { sessionStorage } from '@/shared/api'

describe('useUsername', () => {
  beforeEach(() => {
    sessionStorage.clearSession()
  })

  it('returns username from cache', async () => {
    const hook = await renderHookWithProviders(() => useUsername())

    act(() => {
      hook.queryClient.setQueryData(authKeys.session(), 'test-username')
    })

    await waitFor(() => expect(hook.result.current.data).toBe('test-username'))
  })

  it('returns stored username after page reload', async () => {
    sessionStorage.setSession({ token: 'test-token', username: 'stored-username' })
    const hook = await renderHookWithProviders(() => useUsername())

    await waitFor(() => expect(hook.result.current.data).toBe('stored-username'))
  })
})
