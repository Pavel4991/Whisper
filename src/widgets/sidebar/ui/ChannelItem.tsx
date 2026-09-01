import { Paper, Group, Text, Menu, ActionIcon } from '@mantine/core'
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react'
import type { Channel } from '@/entities/channel/model'
import type { ChannelModalType } from '@/features/channel-management/model/types'
import { useTranslation } from 'react-i18next'
import { useCurrentChannelStore } from '@/entities/channel/model'

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
  openModal,
}: {
  channel: Channel
  openModal: (modelType: ChannelModalType, id: string) => void
}) {
  const { t } = useTranslation()
  const currentChannelId = useCurrentChannelStore((state) => state.currentChannelId)
  const setCurrentChannelId = useCurrentChannelStore((state) => state.setCurrentChannelId)
  const isActive = currentChannelId === channel.id
  const bg = isActive ? Pallete.isActive.bg : Pallete.isNotActive.bg

  return (
    <Paper withBorder p={10} radius="xl" bg={bg} onClick={() => setCurrentChannelId(channel.id)}>
      <Group justify="space-between">
        <Text ml={20}>{channel.name}</Text>
        {channel.removable && (
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
              <Menu.Item
                leftSection={<IconEdit size={14} />}
                onClick={() => openModal('renameChannel', channel.id)}
              >
                {t('ui.channelModals.renameChannel')}
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconTrash size={14} />}
                onClick={() => openModal('removeChannel', channel.id)}
              >
                {t('ui.channelModals.removeChannel')}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </Paper>
  )
}
