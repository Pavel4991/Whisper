import { apiInstance } from '@/shared/api'
import type { Message } from '../model/types'

type DeletedMessageResponse = Pick<Message, 'id'>

export const messageApi = {
  fetchMessages: async (): Promise<Message[]> => {
    const response = await apiInstance.get('/messages')
    return response.data
  },

  addMessage: async (payload: {
    body: string
    channelId: string
    username: string
  }): Promise<Message> => {
    const response = await apiInstance.post('/messages', payload)
    return response.data
  },

  editMessage: async (payload: { id: string; body: string }): Promise<Message> => {
    const response = await apiInstance.patch(`/messages/${payload.id}`, { body: payload.body })
    return response.data
  },

  removeMessage: async (payload: { id: string }): Promise<DeletedMessageResponse> => {
    const response = await apiInstance.delete(`/messages/${payload.id}`)
    return response.data
  },
}
