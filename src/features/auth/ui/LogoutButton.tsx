import { Button } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { authKeys } from '@/features/auth/api/auth.queries'
import { useAuthStore } from '@/features/auth/model/authStore'

export function LogoutButton() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    queryClient.removeQueries({ queryKey: authKeys.session() })
    navigate('/', { replace: true })
  }

  return (
    <Button
      onClick={() => handleLogout()}
      type="button"
      bg="brand"
      radius="xl"
      px={16}
      py={10}
      fw={500}
    >
      {t('ui.chatPage.logoutButton')}
    </Button>
  )
}
