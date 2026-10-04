import { Drawer, Box, Flex } from '@mantine/core'
import { Sidebar } from '@/widgets/sidebar'
import { ChatWindow } from '@/widgets/chat'
import { useChannelSubscription } from '@/features/channel-management/model/socket.subscription'
import { useMediaQuery } from '@mantine/hooks'
import { MOBILE_MEDIA_QUERY } from '@/shared/config/breakpoints'
import { useChannelListStore } from '@/entities/channel'
import { useTranslation } from 'react-i18next'
import classes from './ChatPage.module.css'

function ChatPage() {
  useChannelSubscription()
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY, false, { getInitialValueInEffect: false })
  const isOpened = useChannelListStore((state) => state.isOpened)
  const closeChannelList = useChannelListStore((state) => state.closeChannelList)
  const { t } = useTranslation()

  return (
    <Box className={classes['chat-page']}>
      <Flex h="100%">
        {isMobile ? (
          <Drawer
            opened={isOpened}
            onClose={closeChannelList}
            size="100%"
            aria-label={t('ui.sidebar.title')}
          >
            <Sidebar />
          </Drawer>
        ) : (
          <Sidebar />
        )}
        <ChatWindow />
      </Flex>
    </Box>
  )
}

export default ChatPage
