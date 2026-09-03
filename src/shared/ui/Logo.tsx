import { Group, ThemeIcon, Text } from '@mantine/core'
import { IconMessageCircle } from '@tabler/icons-react'

export function Logo() {
  return (
    <Group align="center">
      <ThemeIcon radius="xl" size={36} bg="var(--brand-subtle)" c="var(--brand)">
        <IconMessageCircle size={20} />
      </ThemeIcon>
      <Text className="font-mono" tt="uppercase" fz="sm" c="var(--text-primary)">
        Whisper
      </Text>
    </Group>
  )
}
