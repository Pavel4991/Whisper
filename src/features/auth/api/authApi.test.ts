import { describe, expect, it } from 'vitest'
import { authApi } from './authApi'
import { type AuthResponse } from '../model/types'

describe('authApi', () => {
  describe('login', () => {
    it('returns auth response', async () => {
      const response = await authApi.login({ username: 'test-username', password: 'test-password' })

      expect(response).toEqual<AuthResponse>({
        token: 'fake-jwt-token-for-testing',
        username: 'test-username',
      })
    })
  })

  describe('register', () => {
    it('returns auth response', async () => {
      const response = await authApi.register({
        username: 'test-username',
        password: 'test-password',
      })

      expect(response).toEqual<AuthResponse>({
        token: 'fake-jwt-token-for-testing',
        username: 'test-username',
      })
    })
  })
})
