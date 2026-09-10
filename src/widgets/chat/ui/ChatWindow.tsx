import { Flex } from '@mantine/core'
import { MessageList } from './MessageList'
import { useCurrentChannelStore } from '@/entities/channel/model'
import { ChatHeader } from './ChatHeader'
import { MessageInput } from '@/features/message-sending'
import { useUsername } from '@/features/auth'
import { useNewMessageSubscription } from '@/entities/message/model/socket.subscription'

export function ChatWindow() {
  const { data: currentUser } = useUsername()
  const currentChannelId = useCurrentChannelStore((state) => state.currentChannelId)
  useNewMessageSubscription()
  return (
    <Flex direction="column" h="100%" w="100%" style={{ overflow: 'hidden' }}>
      <ChatHeader />
      <MessageList channelId={currentChannelId} />
      <MessageInput channelId={currentChannelId ?? null} username={currentUser ?? null} />
    </Flex>
  )
}
