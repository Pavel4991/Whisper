import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from './authApi'
import { authKeys } from './auth.queries'
import { type RegisterCredentials } from '../model/types'
import { useAuthStore } from '../model/authStore'

export const useRegister = () => {
  const queryClient = useQueryClient()
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
    onSuccess: (authResponse) => {
      login(authResponse.token)
      queryClient.setQueryData(authKeys.session(), authResponse.username)
    },
  })
}
