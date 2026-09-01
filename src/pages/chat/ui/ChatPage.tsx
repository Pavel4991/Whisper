import { Box, Stack, Flex } from '@mantine/core'
import { LogoutButton } from '@/features/auth/ui/LogoutButton'
import { Sidebar } from '@/widgets/sidebar'

function ChatPage() {
  return (
    <Box h="100vh">
      <Flex h="100%">
        <Sidebar />

        <Stack h="100%">
          <h1>Chat</h1>
          <LogoutButton />
        </Stack>
      </Flex>
    </Box>
  )
}

export default ChatPage
