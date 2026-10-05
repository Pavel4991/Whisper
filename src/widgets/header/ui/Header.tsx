import { Box, Button, Group, Anchor } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import type { AuthModalType } from '@/features/auth/model/types'
import { Logo } from '@/shared/ui/Logo'
import { ThemeSwitcher } from '@/features/theme-switcher'

import { Link } from 'react-router'

export function Header({ openModal }: { readonly openModal: (modalType: AuthModalType) => void }) {
  const { t } = useTranslation()

  return (
    <Box component="header" py={{ base: 14, sm: 28 }}>
      <Group justify="space-between" align="center">
        <Anchor component={Link} to="/" td="none">
          <Logo />
        </Anchor>

        <Group align="center">
          <ThemeSwitcher />
          <Button
            type="button"
            variant="transparent"
            radius="xl"
            onClick={() => openModal('login')}
            px={16}
            py={10}
            fw={400}
            c="var(--mantine-color-text)"
          >
            {t('ui.header.signinButton')}
          </Button>
          <Button
            type="button"
            bg="brand"
            radius="xl"
            onClick={() => openModal('register')}
            px={16}
            py={10}
            fw={500}
          >
            {t('ui.header.registerButton')}
          </Button>
        </Group>
      </Group>
    </Box>
  )
}
