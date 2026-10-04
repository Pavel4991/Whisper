import { create } from 'zustand'

interface ChannelListStore {
  isOpened: boolean
  openChannelList: () => void
  toggleChannelList: () => void
  closeChannelList: () => void
}

export const useChannelListStore = create<ChannelListStore>((set) => ({
  isOpened: true,

  openChannelList: () => set({ isOpened: true }),
  toggleChannelList: () => set((state) => ({ isOpened: !state.isOpened })),
  closeChannelList: () => set({ isOpened: false }),
}))
