import { Box, Group, Title, ActionIcon } from '@mantine/core'
import { LogoutButton } from '@/features/auth/ui/LogoutButton'
import { useCurrentChannel, useChannelListStore } from '@/entities/channel'
import { ThemeSwitcher } from '@/features/theme-switcher'
import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function ChatHeader() {
  const { data: currentChannel } = useCurrentChannel()
  const openChannelList = useChannelListStore((state) => state.openChannelList)
  const { t } = useTranslation()

  return (
    <Box
      w="100%"
      h={62}
      style={{ flexShrink: 0, borderBottom: '1px solid var(--mantine-color-gray-3)' }}
      px={{ base: 12, sm: 24 }}
      py={12}
    >
      <Group h="100%" justify="space-between" align="center">
        <Group gap="lg">
          <ActionIcon
            type="button"
            onClick={openChannelList}
            size="lg"
            variant="subtle"
            hiddenFrom="sm"
            aria-label={t('ui.chatPage.openChannelList')}
          >
            <IconLayoutSidebarLeftCollapse />
          </ActionIcon>
          <Title order={2} fz={{ base: 16, sm: 24 }}>
            {currentChannel ? currentChannel.name : 'Chat'}
          </Title>
        </Group>
        <Group gap="lg">
          <ThemeSwitcher />
          <LogoutButton />
        </Group>
      </Group>
    </Box>
  )
}
