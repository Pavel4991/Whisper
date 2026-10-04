import { Stack, Text, Alert, Skeleton } from '@mantine/core'
import {
  useChannels,
  ChannelItem,
  useCurrentChannelStore,
  useChannelListStore,
} from '@/entities/channel'
import { useChannelModalStore } from '@/features/channel-management/model'
import { useTranslation } from 'react-i18next'

export function ChannelList() {
  const { t } = useTranslation()

  const { data: channels, isPending, isError } = useChannels()
  const currentChannelId = useCurrentChannelStore((state) => state.currentChannelId)
  const setCurrentChannelId = useCurrentChannelStore((state) => state.setCurrentChannelId)
  const openRenameChannelModal = useChannelModalStore((state) => state.openRenameChannelModal)
  const openRemoveChannelModal = useChannelModalStore((state) => state.openRemoveChannelModal)
  const closeChannelList = useChannelListStore((state) => state.closeChannelList)

  const handleChannelSelect = (channelId: string) => {
    setCurrentChannelId(channelId)
    closeChannelList()
  }

  if (isPending)
    return (
      <Stack gap={10}>
        <Skeleton height={46} radius="xl" data-testid="channel-skeleton" />
        <Skeleton height={46} radius="xl" data-testid="channel-skeleton" />
        <Skeleton height={46} radius="xl" data-testid="channel-skeleton" />
      </Stack>
    )
  if (isError) return <Alert color="red">{t('ui.sidebar.loadError')}</Alert>
  if (!channels?.length) return <Text>{t('ui.sidebar.isEmpty')}</Text>

  return (
    <Stack gap={10}>
      {channels.map((channel) => (
        <ChannelItem
          key={channel.id}
          channel={channel}
          isActive={channel.id === currentChannelId}
          onSelect={() => handleChannelSelect(channel.id)}
          onRename={() => openRenameChannelModal(channel.id)}
          onRemove={() => openRemoveChannelModal(channel.id)}
        />
      ))}
    </Stack>
  )
}
