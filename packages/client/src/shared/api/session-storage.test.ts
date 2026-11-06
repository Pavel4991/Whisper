import { describe, afterEach, expect, it, vi } from 'vitest'
import { sessionStorage, SESSION_KEY } from './session-storage'

describe('sessionStorage', () => {
  afterEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('getSession', () => {
    it('returns null on server side', () => {
      vi.stubGlobal('window', undefined)

      expect(sessionStorage.getSession()).toBeNull()
    })

    it('returns stored session on browser side', () => {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ token: 'test-token', username: 'test-username' }),
      )

      expect(sessionStorage.getSession()).toEqual({
        token: 'test-token',
        username: 'test-username',
      })
    })
    it('returns null for a partial session', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ username: 'test-username' }))

      expect(sessionStorage.getSession()).toBeNull()
    })
    it('returns null when session fields have wrong types', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ token: 'test-token', username: null }))

      expect(sessionStorage.getSession()).toBeNull()
    })
  })

  describe('getToken', () => {
    it('returns null on server side', () => {
      vi.stubGlobal('window', undefined)

      expect(sessionStorage.getToken()).toBeNull()
    })

    it('returns stored token on browser side', () => {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ token: 'test-token', username: 'test-username' }),
      )

      expect(sessionStorage.getToken()).toBe('test-token')
    })

    it('returns null when username is missing', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ username: 'test-username' }))

      expect(sessionStorage.getToken()).toBeNull()
    })
  })

  describe('getUsername', () => {
    it('returns null on server side', () => {
      vi.stubGlobal('window', undefined)

      expect(sessionStorage.getUsername()).toBeNull()
    })

    it('returns stored username on browser side', () => {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ token: 'test-token', username: 'test-username' }),
      )

      expect(sessionStorage.getUsername()).toBe('test-username')
    })

    it('returns null when token is missing', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ token: 'test-token' }))

      expect(sessionStorage.getUsername()).toBeNull()
    })
  })

  describe('setSession', () => {
    it('stores session in localStorage', () => {
      sessionStorage.setSession({ token: 'new-token', username: 'new-username' })

      expect(localStorage.getItem(SESSION_KEY)).toBe(
        JSON.stringify({ token: 'new-token', username: 'new-username' }),
      )
    })
  })

  describe('clearSession', () => {
    it('removes session from localStorage', () => {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ token: 'token-to-delete', username: 'username-to-delete' }),
      )

      sessionStorage.clearSession()

      expect(localStorage.getItem(SESSION_KEY)).toBeNull()
    })
  })
})
