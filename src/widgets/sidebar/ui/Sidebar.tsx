import { Paper, Stack, Button, Text } from '@mantine/core'
import { ChannelItem } from './ChannelItem'
import { ChannelModal } from '@/features/channel-management/ui/ChannelModal'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import type { ChannelModalType } from '@/features/channel-management/model/types'
import { useChannels } from '@/entities/channel/api/useChannels'
import { useTranslation } from 'react-i18next'

export function Sidebar() {
  const [opened, { open, close }] = useDisclosure(false)
  const [modalType, setModalType] = useState<ChannelModalType>('createChannel')
  const [channelModalId, setChannelModalId] = useState('')
  const { data: channels, error } = useChannels()
  const { t } = useTranslation()

  const openModalHandler = (modalType: ChannelModalType, id?: string) => {
    setModalType(modalType)
    if (id) {
      setChannelModalId(id)
    }
    open()
  }

  return channels ? (
    <Paper withBorder p={20} radius={0} h="100%" bg="#F7F8FA" w={400}>
      <Stack h="100%" gap={5}>
        <Button onClick={() => openModalHandler('createChannel')}>
          {t('ui.channelModals.createChannel')}
        </Button>
        {channels.map((channel) => (
          <ChannelItem key={channel.id} channel={channel} openModal={openModalHandler} />
        ))}
        {error && (
          <Text color="red" data-testid="channel-list-server-error">
            Ошибка: {error.message}
          </Text>
        )}
      </Stack>
      <ChannelModal
        modalType={modalType}
        isOpened={opened}
        onClose={close}
        channelId={channelModalId}
      />
    </Paper>
  ) : null
}
