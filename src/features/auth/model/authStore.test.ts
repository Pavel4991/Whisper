import { describe, expect, it, afterEach } from 'vitest'
import { useAuthStore } from './authStore'
import { tokenStorage } from '@/shared/api'

describe('useAuthStore', () => {
  const { login, logout } = useAuthStore.getState()

  const getIsAuth = () => useAuthStore.getState().isAuth

  afterEach(() => {
    useAuthStore.setState({ isAuth: false })
    tokenStorage.clearToken()
  })

  it('isAuth is false by default', () => {
    expect(getIsAuth()).toBe(false)
  })

  it('login sets isAuth to true', () => {
    login('test-token')

    expect(getIsAuth()).toBe(true)
    expect(tokenStorage.getToken()).toBe('test-token')
  })

  it('logout sets isAuth to false', () => {
    login('test-token')
    logout()

    expect(getIsAuth()).toBe(false)
    expect(tokenStorage.getToken()).toBeNull()
  })
})
