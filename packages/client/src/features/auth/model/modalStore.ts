import { create } from 'zustand'
import type { AuthModalType } from './types'

interface ModalStore {
  isOpened: boolean
  modalType: AuthModalType
  openLoginModal: () => void
  openRegisterModal: () => void
  closeModal: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpened: false,
  modalType: 'login',

  openLoginModal() {
    set({ isOpened: true, modalType: 'login' })
  },
  openRegisterModal() {
    set({ isOpened: true, modalType: 'register' })
  },
  closeModal() {
    set({ isOpened: false })
  },
}))
