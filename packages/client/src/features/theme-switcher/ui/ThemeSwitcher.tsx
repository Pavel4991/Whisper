import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function ThemeSwitcher() {
  const { t } = useTranslation()
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: false })
  const { toggleColorScheme } = useMantineColorScheme()

  return (
    <ActionIcon
      type="button"
      onClick={toggleColorScheme}
      aria-label={t('ui.themeSwitcher.toggle')}
      variant="subtle"
      radius="xl"
    >
      {computedColorScheme === 'dark' ? (
        <IconSun data-testid="theme-icon-sun" />
      ) : (
        <IconMoon data-testid="theme-icon-moon" />
      )}
    </ActionIcon>
  )
}
