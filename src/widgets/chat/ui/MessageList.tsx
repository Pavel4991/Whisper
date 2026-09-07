import { Box, ScrollArea, Flex, Text } from '@mantine/core'
import { MessageItem } from '@/entities/message/ui'
import { useUsername } from '@/features/auth'
import { useMessages } from '@/entities/message/api/useMessages'
import { useTranslation } from 'react-i18next'

export function MessageList({ channelId }: { channelId: string | null }) {
  const { data: currentUser } = useUsername()
  const { t } = useTranslation()

  const { data: messages } = useMessages(channelId || '')

  return (
    <Box style={{ flex: 1, minHeight: 0 }} p={24}>
      <ScrollArea h="100%" offsetScrollbars>
        <Flex direction="column" align="flex-start">
          {messages && messages.length ? (
            messages.map((message) => (
              <MessageItem key={message.id} message={message} currentUser={currentUser || ''} />
            ))
          ) : (
            <Text>{t('ui.messageList.isEmpty')}</Text>
          )}
        </Flex>
      </ScrollArea>
    </Box>
  )
}
