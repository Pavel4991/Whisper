import '@mantine/core/styles.css' // 1. Сначала базовые стили Mantine
import '../styles/global.css'
import { MantineProvider, createTheme } from '@mantine/core'
import type { ReactNode } from 'react'

const theme = createTheme({
  primaryColor: 'brand',
  colors: {
    brand: [
      '#e6faf9',
      '#cff5f7',
      '#a5e9ec',
      '#78dcdb',
      '#47ccca',
      '#19bab8',
      '#05aca9',
      '#00a29c',
      '#0a8580',
      '#0d6d69',
    ],
  },
  primaryShade: 7,
})

export function MantineThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {children}
    </MantineProvider>
  )
}
