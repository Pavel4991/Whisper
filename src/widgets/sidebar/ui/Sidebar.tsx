import { Flex, Stack, ScrollArea } from '@mantine/core'
import { ChannelModal } from '@/features/channel-management/ui/ChannelModal'
import { SidebarHeader } from './SidebarHeader'
import { ChannelList } from './ChannelList'
import { useChannelModalStore } from '@/features/channel-management/model'

export function Sidebar() {
  const modalType = useChannelModalStore((state) => state.modalType)
  const isOpened = useChannelModalStore((state) => state.isOpened)
  const channelId = useChannelModalStore((state) => state.channelId)
  const closeModal = useChannelModalStore((state) => state.closeModal)
  const openCreateChannelModal = useChannelModalStore((state) => state.openCreateChannelModal)

  return (
    <Flex
      direction="column"
      h="100%"
      w={{ base: '100%', sm: 300, md: 400 }}
      style={{
        flexShrink: 0,
        overflow: 'hidden',
        borderRight: '1px solid var(--mantine-color-gray-4)',
      }}
      px={{ base: 12, sm: 24 }}
      py={12}
    >
      <Stack h="100%" gap={5}>
        <SidebarHeader onCreate={openCreateChannelModal} />
        <ScrollArea h="100%" offsetScrollbars>
          <ChannelList />
        </ScrollArea>
      </Stack>
      <ChannelModal
        modalType={modalType}
        isOpened={isOpened}
        onClose={closeModal}
        channelId={channelId}
      />
    </Flex>
  )
}
