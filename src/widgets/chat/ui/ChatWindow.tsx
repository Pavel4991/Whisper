import { Flex } from '@mantine/core'

import { MessageList } from './MessageList'
import { useCurrentChannelStore } from '@/entities/channel/model'
import { ChatHeader } from './ChatHeader'

export function ChatWindow() {
  const currentChannelId = useCurrentChannelStore((state) => state.currentChannelId)
  return (
    <Flex direction="column" h="100%" w="100%" style={{ overflow: 'hidden' }}>
      <ChatHeader />
      <MessageList channelId={currentChannelId} />
    </Flex>
  )
}
