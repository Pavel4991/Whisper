import { Box, Flex } from '@mantine/core'
import { Sidebar } from '@/widgets/sidebar'
import { ChatWindow } from '@/widgets/chat'
import { useChannelSubscription } from '@/features/channel-management/model/socket.subscription'

function ChatPage() {
  useChannelSubscription()

  return (
    <Box h="100vh">
      <Flex h="100%">
        <Sidebar />
        <ChatWindow />
      </Flex>
    </Box>
  )
}

export default ChatPage
