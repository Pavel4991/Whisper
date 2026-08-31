import { apiInstance } from '@/shared/api'
import type { Channel } from '../model/types'

type DeletedChannelResponse = Pick<Channel, 'id'>

export const channelApi = {
  fetchChannels: async (): Promise<Channel[]> => {
    const response = await apiInstance.get('/channels')
    return response.data
  },

  createChannel: async (payload: { name: string }): Promise<Channel> => {
    const response = await apiInstance.post('/channels', payload)
    return response.data
  },

  renameChannel: async (payload: { id: string; name: string }): Promise<Channel> => {
    const response = await apiInstance.patch(`/channels/${payload.id}`, { name: payload.name })
    return response.data
  },

  removeChannel: async (payload: { id: string }): Promise<DeletedChannelResponse> => {
    const response = await apiInstance.delete(`/channels/${payload.id}`)
    return response.data
  },
}
