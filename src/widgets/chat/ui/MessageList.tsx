import { Box, ScrollArea, Flex, Text, Stack, Skeleton } from '@mantine/core'
import { MessageItem } from '@/entities/message/ui'
import { useUsername } from '@/features/auth'
import { useMessages } from '@/entities/message/api/useMessages'
import { useTranslation } from 'react-i18next'
import { useRef, useEffect } from 'react'

const STICK_THRESHOLD_PX = 64

export function MessageList({ channelId }: { channelId: string | null }) {
  const { data: currentUser } = useUsername()
  const { t } = useTranslation()

  const { data: messages, isPending } = useMessages(channelId || '')

  const viewport = useRef<HTMLDivElement>(null)
  const shouldStick = useRef(true)

  useEffect(() => {
    shouldStick.current = true
  }, [channelId])

  useEffect(() => {
    const node = viewport.current
    if (!node || !shouldStick.current) {
      return
    }
    node.scrollTo({ top: node.scrollHeight })
  }, [messages])

  const handleScrollPositionChange = ({ y }: { x: number; y: number }) => {
    const node = viewport.current
    if (!node) {
      return
    }
    const distanceFromBottom = node.scrollHeight - y - node.clientHeight
    shouldStick.current = distanceFromBottom < STICK_THRESHOLD_PX
  }

  if (isPending)
    return (
      <Stack gap={10}>
        <Skeleton height={46} radius="xl" data-testid="message-skeleton" />
        <Skeleton height={46} radius="xl" data-testid="message-skeleton" />
        <Skeleton height={46} radius="xl" data-testid="message-skeleton" />
      </Stack>
    )

  return (
    <Box style={{ flex: 1, minHeight: 0 }} p={{ base: 12, sm: 24 }}>
      <ScrollArea
        h="100%"
        offsetScrollbars
        viewportRef={viewport}
        onScrollPositionChange={handleScrollPositionChange}
      >
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
