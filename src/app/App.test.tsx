import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { routes } from '@/app/router/routes'

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('App routing', () => {
  it('renders ChatPage at /', () => {
    renderRoute('/')

    expect(screen.getByRole('heading', { name: 'Chat' })).toBeInTheDocument()
  })

  it('renders LoginPage at /login', () => {
    renderRoute('/login')

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('renders NotFoundPage for unknown routes', () => {
    renderRoute('/unknown')

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})