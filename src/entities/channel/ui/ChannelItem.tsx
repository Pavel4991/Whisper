import { Paper, Group, Text, Menu, ActionIcon, Box } from '@mantine/core'
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react'
import type { Channel } from '../model/types'
import { useTranslation } from 'react-i18next'

const Pallete = {
  isActive: {
    bg: '#d4e9f2',
  },
  isNotActive: {
    bg: 'inherit',
  },
}

export function ChannelItem({
  channel,
  isActive,
  onSelect,
  onRename,
  onRemove,
}: {
  readonly channel: Channel
  readonly isActive: boolean
  readonly onSelect: () => void
  readonly onRename: () => void
  readonly onRemove: () => void
}) {
  const { t } = useTranslation()
  const bg = isActive ? Pallete.isActive.bg : Pallete.isNotActive.bg

  return (
    <Paper withBorder p={10} radius="xl" bg={bg} onClick={() => onSelect()}>
      <Group justify="space-between">
        <Text ml={20}>{channel.name}</Text>
        {channel.removable && (
          <Box display="contents" onClick={(event) => event.stopPropagation()}>
            <Menu shadow="md" width={200} position="bottom-end" withinPortal>
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  aria-label={t('ui.channelModals.menuLabel')}
                  size={16}
                >
                  <IconDotsVertical />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>{t('ui.channelModals.menuLabel')}</Menu.Label>
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={onRename}>
                  {t('ui.channelModals.renameChannel')}
                </Menu.Item>
                <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={onRemove}>
                  {t('ui.channelModals.removeChannel')}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        )}
      </Group>
    </Paper>
  )
}
