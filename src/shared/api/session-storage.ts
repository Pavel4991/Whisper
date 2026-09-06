export const SESSION_KEY = 'whisper_auth_session'

export interface Session {
  token: string
  username: string
}

const isSession = (value: unknown): value is Session => {
  if (typeof value !== 'object' || value === null) return false
  const session = value as Session
  return typeof session.token === 'string' && typeof session.username === 'string'
}

export const sessionStorage = {
  getSession: (): Session | null => {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
      const session = JSON.parse(raw)
      return isSession(session) ? session : null
    } catch {
      return null
    }
  },

  getToken: (): string | null => sessionStorage.getSession()?.token ?? null,

  getUsername: (): string | null => sessionStorage.getSession()?.username ?? null,

  setSession: (session: Session): void => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  },

  clearSession: (): void => {
    localStorage.removeItem(SESSION_KEY)
  },
}
