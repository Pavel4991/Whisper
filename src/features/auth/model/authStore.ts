import { create } from 'zustand'
import { tokenStorage } from '@/shared/api'

interface AuthState {
  isAuth: boolean
  login: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: !!tokenStorage.getToken(),

  login: (token) => {
    tokenStorage.setToken(token)
    set({ isAuth: true })
  },

  logout: () => {
    tokenStorage.clearToken()
    set({ isAuth: false })
  },
}))
