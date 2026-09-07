import { Box, Flex } from '@mantine/core'
import { Sidebar } from '@/widgets/sidebar'
import { ChatWindow } from '@/widgets/chat'

function ChatPage() {
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
