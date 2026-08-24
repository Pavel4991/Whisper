import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from './authApi'
import { authKeys } from './auth.queries'
import { type LoginCredentials } from '../model/types'
import { useAuthStore } from '../model/authStore'

export const useLogin = () => {
  const queryClient = useQueryClient()
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (authResponse) => {
      login(authResponse.token)
      queryClient.setQueryData(authKeys.session(), authResponse.username)
    },
  })
}
