import { Box, Group, Text, Title, Badge, Button } from '@mantine/core'
import { Trans, useTranslation } from 'react-i18next'
import type { AuthModalType } from '@/features/auth/model/types'
import classes from './HeroSection.module.css'
import { IconArrowRight } from '@tabler/icons-react'

export function HeroSection({
  openModal,
}: {
  readonly openModal: (modalType: AuthModalType) => void
}) {
  const { t } = useTranslation()
  return (
    <Box maw={540}>
      <Badge
        bg="var(--mantine-color-body)"
        variant="filled"
        mb={28}
        px={14}
        py={8}
        tt="none"
        style={{ border: '1px solid var(--mantine-color-default-border)' }}
      >
        <Group align="center" gap={8}>
          <Box w={6} h={6} bg="var(--mantine-color-brand-filled)" bdrs="xl" />
          <Text c="var(--mantine-color-dimmed)" fz="xs" fw={400}>
            {t('ui.homePage.heroSection.badge')}
          </Text>
        </Group>
      </Badge>
      <Title order={1} mb={28} fz={{ base: 48, xs: 56, md: 72 }} lh={1}>
        <Trans
          i18nKey="ui.homePage.heroSection.title"
          components={{
            accent: <span className={classes.accent} />,
          }}
        />
      </Title>
      <Text mb={36}>{t('ui.homePage.heroSection.description')}</Text>
      <Group>
        <Button
          type="button"
          bg="brand"
          fz="md"
          px={20}
          py={14}
          radius="lg"
          variant="filled"
          onClick={() => openModal('register')}
          w={{ base: '100%', xs: 'auto' }}
          h={54}
          rightSection={<IconArrowRight size={16} stroke={2.6} />}
          className={classes.ctaButton}
          classNames={{
            section: classes.ctaButtonRightSection,
          }}
        >
          {t('ui.homePage.heroSection.cta')}
        </Button>
        <Button
          type="button"
          fz="md"
          px={20}
          py={14}
          radius="lg"
          variant="outline"
          color="var(--mantine-color-text)"
          onClick={() => openModal('login')}
          w={{ base: '100%', xs: 'auto' }}
          h={54}
        >
          {t('ui.homePage.heroSection.ctaSecondary')}
        </Button>
      </Group>
    </Box>
  )
}
