import { Box, Group, Title } from '@mantine/core'
import { LogoutButton } from '@/features/auth/ui/LogoutButton'
import { useCurrentChannel } from '@/entities/channel/api/useCurrentChannel'

export function ChatHeader() {
  const { data: currentChannel } = useCurrentChannel()

  return (
    <Box
      w="100%"
      h={62}
      style={{ flexShrink: 0, borderBottom: '1px solid var(--mantine-color-gray-3)' }}
      px={24}
      py={12}
    >
      <Group h="100%" justify="space-between" align="center">
        <Title order={2}>{currentChannel ? currentChannel.name : 'Chat'}</Title>
        <LogoutButton />
      </Group>
    </Box>
  )
}
