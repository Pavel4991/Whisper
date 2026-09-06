import { create } from 'zustand'
import { sessionStorage, type Session } from '@/shared/api'

interface AuthState {
  isAuth: boolean
  login: (session: Session) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: !!sessionStorage.getSession(),

  login: (session: Session) => {
    sessionStorage.setSession(session)
    set({ isAuth: true })
  },

  logout: () => {
    sessionStorage.clearSession()
    set({ isAuth: false })
  },
}))
