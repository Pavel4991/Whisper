import { useQuery } from '@tanstack/react-query'
import { authKeys } from './auth.queries'

export const useUsername = () => {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      throw new Error('Session not found')
    },
    staleTime: Infinity,
    retry: false,
  })
}
