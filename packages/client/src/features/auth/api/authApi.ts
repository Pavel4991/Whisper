import { apiInstance } from '@/shared/api'
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../model/types'

export const authApi = {
  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiInstance.post<AuthResponse>('/login', data)
    return response.data
  },

  register: async (data: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiInstance.post<AuthResponse>('/signup', data)
    return response.data
  },
}
