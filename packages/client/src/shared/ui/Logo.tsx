import { Group, ThemeIcon, Text } from '@mantine/core'
import { IconMessageCircle } from '@tabler/icons-react'

interface LogoProps {
  readonly hideTextOnMobile?: boolean
}

export function Logo({ hideTextOnMobile = false }: LogoProps) {
  return (
    <Group align="center">
      <ThemeIcon radius="xl" size={36} bg="brand.1" c="brand">
        <IconMessageCircle size={20} />
      </ThemeIcon>
      <Text
        className="font-mono"
        tt="uppercase"
        fz="sm"
        c="var(--mantine-color-text)"
        {...(hideTextOnMobile ? { visibleFrom: 'sm' as const } : {})}
      >
        Whisper
      </Text>
    </Group>
  )
}
