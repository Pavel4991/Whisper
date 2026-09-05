import { describe, expect, it } from 'vitest'
import { renderHookWithProviders } from '@/test/test-utils'
import { useUsername } from './useUsername'
import { authKeys } from './auth.queries'
import { act, waitFor } from '@testing-library/react'

describe('useUsername', () => {
  it('returns username from cache', async () => {
    const hook = await renderHookWithProviders(() => useUsername())

    act(() => {
      hook.queryClient.setQueryData(authKeys.session(), 'test-username')
    })

    await waitFor(() => expect(hook.result.current.data).toBe('test-username'))
  })
})
