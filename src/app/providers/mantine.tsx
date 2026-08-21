import { MantineProvider } from '@mantine/core'
import type { ReactNode } from 'react'

import '@mantine/core/styles.css'

export function MantineThemeProvider({ children }: { children: ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>
}
