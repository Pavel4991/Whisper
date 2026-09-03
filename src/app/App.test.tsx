import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'

import { MantineThemeProvider } from '@/app/providers/mantine'
import { routes } from '@/app/router/routes'
import { useAuthStore } from '@/features/auth/model/authStore'
import '@/app/providers/i18n'

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const queryClient = new QueryClient()
  return render(
    <MantineThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineThemeProvider>,
  )
}

describe('App routing', () => {
  afterEach(() => {
    useAuthStore.setState({ isAuth: false })
  })

  it('renders HomePage at /', () => {
    renderRoute('/')

    expect(
      screen.getByRole('heading', { name: 'Создайте пространство для осмысленного диалога.' }),
    ).toBeInTheDocument()
  })

  it('renders ChatPage at /chat when authenticated', () => {
    useAuthStore.setState({ isAuth: true })
    renderRoute('/chat')

    expect(screen.getByRole('heading', { name: 'Chat' })).toBeInTheDocument()
  })

  it('redirects unauthenticated user from /chat to /', () => {
    renderRoute('/chat')

    expect(screen.queryByRole('heading', { name: 'Chat' })).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Создайте пространство для осмысленного диалога.' }),
    ).toBeInTheDocument()
  })

  it('renders NotFoundPage for unknown routes', () => {
    renderRoute('/unknown')

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
