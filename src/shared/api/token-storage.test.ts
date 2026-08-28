import { describe, afterEach, expect, it, vi } from 'vitest'
import { tokenStorage, TOKEN_KEY } from './token-storage'

describe('tokenStorage', () => {
  afterEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('getToken', () => {
    it('returns null on server side', () => {
      // Подменяем window на undefined, чтобы сработал "server side"
      vi.stubGlobal('window', undefined)

      expect(tokenStorage.getToken()).toBeNull()
    })

    it('returns stored token on browser side', () => {
      localStorage.setItem(TOKEN_KEY, 'test-token')

      expect(tokenStorage.getToken()).toBe('test-token')
    })
  })

  describe('setToken', () => {
    it('stores token in localStorage', () => {
      tokenStorage.setToken('new-token')

      expect(localStorage.getItem(TOKEN_KEY)).toBe('new-token')
    })
  })

  describe('clearToken', () => {
    it('removes token from localStorage', () => {
      localStorage.setItem(TOKEN_KEY, 'token-to-delete')

      tokenStorage.clearToken()

      expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    })
  })
})
