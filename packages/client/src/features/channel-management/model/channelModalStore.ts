import { create } from 'zustand'
import type { ChannelModalType } from './types'

interface ChannelModalStore {
  isOpened: boolean
  modalType: ChannelModalType
  channelId: string

  openCreateChannelModal: () => void
  openRenameChannelModal: (channelId: string) => void
  openRemoveChannelModal: (channelId: string) => void
  closeModal: () => void
}

export const useChannelModalStore = create<ChannelModalStore>((set) => ({
  isOpened: false,
  modalType: 'createChannel',
  channelId: '',

  openCreateChannelModal: () => set({ isOpened: true, modalType: 'createChannel', channelId: '' }),
  openRenameChannelModal: (channelId: string) =>
    set({ isOpened: true, modalType: 'renameChannel', channelId }),
  openRemoveChannelModal: (channelId: string) =>
    set({ isOpened: true, modalType: 'removeChannel', channelId }),
  closeModal: () => set({ isOpened: false }),
}))
