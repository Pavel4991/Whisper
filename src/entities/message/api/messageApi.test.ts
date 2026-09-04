import { beforeEach, describe, expect, it } from 'vitest'
import { messageApi } from './messageApi'
import { tokenStorage } from '@/shared/api'
import type { Message } from '../model/types'
import { testMessages } from '@/test/fixtures/messages'

describe('messageApi', () => {
  beforeEach(() => {
    tokenStorage.setToken('test-token')
  })

  describe('fetchMessages', () => {
    it('returns messages from server', async () => {
      const result = await messageApi.fetchMessages()

      expect(result).toEqual<Message[]>(testMessages)
    })

    it('rejects without token', async () => {
      tokenStorage.clearToken()

      await expect(messageApi.fetchMessages()).rejects.toThrow()
    })
  })

  describe('addMessage', () => {
    it('returns newly added message', async () => {
      const result = await messageApi.addMessage({
        body: 'test-text-message-3',
        channelId: '1',
        username: 'admin',
      })

      expect(result).toEqual<Message>({
        id: '3',
        body: 'test-text-message-3',
        channelId: '1',
        username: 'admin',
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
