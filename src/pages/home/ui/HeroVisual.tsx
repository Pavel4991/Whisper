import { Box, Group, Paper, Stack, Text, Divider } from '@mantine/core'
import { MessageItem } from '@/entities/message/ui/MessageItem'
import { useTranslation } from 'react-i18next'
import type { Message } from '@/entities/message/model/types'

export function HeroVisual() {
  const { t } = useTranslation()

  const messages = [
    {
      id: '1',
      channelId: '1',
      body: t('ui.homePage.heroVisual.messages.0'),
      username: 'user',
    },
    {
      id: '2',
      channelId: '1',
      body: t('ui.homePage.heroVisual.messages.1'),
      username: t('ui.homePage.heroVisual.chatName'),
    },
    { id: '3', channelId: '1', body: t('ui.homePage.heroVisual.messages.2'), username: 'user' },
  ] satisfies Message[]

  return (
    <Box h="100%" visibleFrom="sm" aria-hidden>
      <Paper
        w={454}
        bg="var(--mantine-color-body)"
        radius="xl"
        p="lg"
        style={{
          border: '1px solid var(--mantine-color-default-border)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.20), 0 4px 12px rgba(0, 0, 0, 0.12)',
        }}
      >
        <Box
          bdrs="lg"
          style={{ border: '1px solid var(--mantine-color-default-border)' }}
          bg="var(--page-background)"
        >
          <Group align="center" justify="space-between" px={20} py={16}>
            <Stack gap={0}>
              <Text fz="sm" fw={500}>
                {t('ui.homePage.heroVisual.chatName')}
              </Text>
              <Text fz="xs" fw={400} c="brand">
                {t('ui.homePage.heroVisual.onlineStatus')}
              </Text>
            </Stack>
            <Text fz={10} fw={400}>
              11:24
            </Text>
          </Group>
          <Divider color="var(--mantine-color-default-border)" />
          <Stack px={20} py={28} gap={0}>
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} currentUser="user" />
            ))}
          </Stack>
          <Paper p={12} bg="transparent" w="100%">
            <Group
              justify="space-between"
              align="center"
              px={16}
              py={12}
              bg="var(--mantine-color-body)"
              bdrs="xl"
              style={{
                border: '1px solid var(--mantine-color-default-border)',
              }}
            >
              <Text fz={12} fw={400} c="var(--mantine-color-dimmed)">
                {t('ui.homePage.heroVisual.placeholder')}
              </Text>
              <Text fz={12} fw={400} ml={8} c="brand">
                {t('ui.homePage.heroVisual.sendButton')}
              </Text>
            </Group>
          </Paper>
        </Box>
      </Paper>
    </Box>
  )
}
