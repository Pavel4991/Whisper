import { beforeEach, describe, expect, it } from 'vitest'
import { channelApi } from './channelApi'
import { sessionStorage } from '@/shared/api'
import type { Channel } from '../model/types'
import { testChannels } from '@/test/fixtures/channels'

describe('channelApi', () => {
  beforeEach(() => {
    sessionStorage.setSession({ token: 'test-token', username: 'test-username' })
  })

  describe('fetchChannels', () => {
    it('returns channels from server', async () => {
      const result = await channelApi.fetchChannels()

      expect(result).toEqual<Channel[]>(testChannels)
    })

    it('rejects without token', async () => {
      sessionStorage.clearSession()

      await expect(channelApi.fetchChannels()).rejects.toThrow()
    })
  })

  describe('createChannel', () => {
    it('returns newly created channel', async () => {
      const result = await channelApi.createChannel({ name: 'new-test-channel' })

      expect(result).toEqual<Channel>({ id: '3', name: 'new-test-channel', removable: true })
    })
  })

  describe('renameChannel', () => {
    it('returns renamed channel', async () => {
      const result = await channelApi.renameChannel({ id: '1', name: 'renamed-test-channel' })

      expect(result).toEqual<Channel>({ id: '1', name: 'renamed-test-channel', removable: true })
    })

    it('rejects for unknown channel id', async () => {
      await expect(channelApi.renameChannel({ id: '999', name: 'any' })).rejects.toThrow()
    })
  })

  describe('removeChannel', () => {
    it('returns id of removed channel', async () => {
      const result = await channelApi.removeChannel({ id: '1' })

      expect(result).toEqual<Pick<Channel, 'id'>>({ id: '1' })
    })

    it('rejects for unknown channel id', async () => {
      await expect(channelApi.removeChannel({ id: '999' })).rejects.toThrow()
    })
  })
})
