import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { MantineThemeProvider } from '@/app/providers/mantine'
import { routes } from '@/app/router/routes'

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(
    <MantineThemeProvider>
      <RouterProvider router={router} />
    </MantineThemeProvider>,
  )
}

describe('App routing', () => {
  it('renders HomePage at /', () => {
    renderRoute('/')

    expect(screen.getByRole('heading', { name: 'HomePage' })).toBeInTheDocument()
  })

  it('renders ChatPage at /chat', () => {
    renderRoute('/chat')

    expect(screen.getByRole('heading', { name: 'Chat' })).toBeInTheDocument()
  })

  it('renders NotFoundPage for unknown routes', () => {
    renderRoute('/unknown')

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
