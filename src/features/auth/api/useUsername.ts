import { useQuery } from '@tanstack/react-query'
import { authKeys } from './auth.queries'
import { sessionStorage } from '@/shared/api'

export const useUsername = () => {
  const storedUsername = sessionStorage.getUsername()

  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      throw new Error('Session not found')
    },
    staleTime: Infinity,
    retry: false,
    ...(storedUsername ? { initialData: storedUsername } : {}),
  })
}
