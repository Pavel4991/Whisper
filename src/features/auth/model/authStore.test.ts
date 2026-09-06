import { describe, expect, it, afterEach } from 'vitest'
import { useAuthStore } from './authStore'
import { sessionStorage } from '@/shared/api'

describe('useAuthStore', () => {
  const { login, logout } = useAuthStore.getState()

  const getIsAuth = () => useAuthStore.getState().isAuth

  afterEach(() => {
    useAuthStore.setState({ isAuth: false })
  })

  it('isAuth is false by default', () => {
    expect(getIsAuth()).toBe(false)
  })

  it('login sets isAuth to true', () => {
    login({ token: 'test-token', username: 'test-username' })

    expect(getIsAuth()).toBe(true)
    expect(sessionStorage.getSession()).toEqual({ token: 'test-token', username: 'test-username' })
  })

  it('logout sets isAuth to false', () => {
    login({ token: 'test-token', username: 'test-username' })
    logout()

    expect(getIsAuth()).toBe(false)
    expect(sessionStorage.getSession()).toBeNull()
  })
})
