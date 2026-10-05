import { Box, Title, Group, ActionIcon } from '@mantine/core'
import { IconSquarePlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function SidebarHeader({ onCreate }: { readonly onCreate: () => void }) {
  const { t } = useTranslation()

  return (
    <Box w="100%" h={62} style={{ flexShrink: 0 }}>
      <Group h="100%" justify="space-between" align="center">
        <Title order={1} fz={{ base: 16, sm: 24 }}>
          Whisper
        </Title>
        <ActionIcon
          onClick={onCreate}
          size="lg"
          variant="subtle"
          aria-label={t('ui.sidebar.addChannel')}
        >
          <IconSquarePlus />
        </ActionIcon>
      </Group>
    </Box>
  )
}
