import { Box, Flex, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  return (
    <Box
      component="footer"
      py={{ base: 14, sm: 28 }}
      style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={6}
        align="center"
        justify="space-between"
      >
        <Text>Whisper</Text>
        <Text>{t('ui.homePage.footer')}</Text>
        <Text>© 2026 Whisper</Text>
      </Flex>
    </Box>
  )
}
