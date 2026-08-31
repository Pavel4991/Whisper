import { create } from 'zustand'

interface CurrentChannelState {
  currentChannelId: string | null
  setCurrentChannelId: (channelId: string) => void
}

export const useCurrentChannelStore = create<CurrentChannelState>((set) => ({
  currentChannelId: '1',

  setCurrentChannelId: (channelId) => {
    set({ currentChannelId: channelId })
  },
}))
