import type { ReactNode } from 'react'

import './i18n'
import { MantineThemeProvider } from './mantine'
import { QueryProvider } from './query'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MantineThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </MantineThemeProvider>
  )
}
