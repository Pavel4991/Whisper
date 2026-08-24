export type AuthModalType = 'login' | 'register'

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  username: string
}
