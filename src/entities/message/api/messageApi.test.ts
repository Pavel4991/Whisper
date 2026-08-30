import { beforeEach, describe, expect, it } from 'vitest'
import { messageApi } from './messageApi'
import { tokenStorage } from '@/shared/api'
import type { Message } from '../model/types'

describe('messageApi', () => {
  beforeEach(() => {
    tokenStorage.setToken('test-token')
  })

  describe('fetchMessages', () => {
    it('returns messages from server', async () => {
      const result = await messageApi.fetchMessages()

      expect(result).toEqual<Message[]>([
        {
          id: '1',
          body: 'test-text-message-1',
          channelId: '1',
          username: 'admin',
          removable: true,
        },
        {
          id: '2',
          body: 'test-text-message-2',
          channelId: '2',
          username: 'admin',
          removable: true,
        },
      ])
    })

    it('rejects without token', async () => {
      tokenStorage.clearToken()

      await expect(messageApi.fetchMessages()).rejects.toThrow()
    })
  })

  describe('addMessage', () => {
    it('returns newly added message', async () => {
      const result = await messageApi.addMessage({
        body: 'test-text-message-1',
        channelId: '1',
        username: 'admin',
      })

      expect(result).toEqual<Message>({
        id: '1',
        body: 'test-text-message-1',
        channelId: '1',
        username: 'admin',
        removable: true,
      })
    })
  })

  describe('editMessage', () => {
    it('returns edited message', async () => {
      const result = await messageApi.editMessage({ id: '1', body: 'edited-test-text-message' })

      expect(result).toEqual<Message>({
        id: '1',
        body: 'edited-test-text-message',
        channelId: '1',
        username: 'admin',
        removable: true,
      })
    })

    it('rejects for unknown message id', async () => {
      await expect(messageApi.editMessage({ id: '999', body: 'any' })).rejects.toThrow()
    })
  })

  describe('removeMessage', () => {
    it('returns id of removed message', async () => {
      const result = await messageApi.removeMessage({ id: '1' })

      expect(result).toEqual<Pick<Message, 'id'>>({ id: '1' })
    })

    it('rejects for unknown message id', async () => {
      await expect(messageApi.removeMessage({ id: '999' })).rejects.toThrow()
    })
  })
})
