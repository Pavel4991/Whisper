import '@mantine/core/styles.css' // 1. Сначала базовые стили Mantine
import '../styles/global.css'
import { MantineProvider } from '@mantine/core'
import type { ReactNode } from 'react'

export function MantineThemeProvider({ children }: { children: ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>
}
