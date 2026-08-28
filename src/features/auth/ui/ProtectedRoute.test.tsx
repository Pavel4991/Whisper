import { describe, it, expect, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { ProtectedRoute } from './ProtectedRoute'
import { useAuthStore } from '@/features/auth/model/authStore'

describe('ProtectedRoute', () => {
  const testRoutes = [
    {
      path: '/',
      element: <div data-testid="home-page">Вы на главной странице!</div>,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: '/chat',
          element: <div data-testid="chat-page">Добро пожаловать в чат!</div>,
        },
      ],
    },
  ]

  afterEach(() => {
    useAuthStore.setState({ isAuth: false })
  })

  it('redirects unauthenticated user to /', () => {
    renderWithProviders(<ProtectedRoute />, { routes: testRoutes, initialEntries: ['/chat'] })
    expect(screen.getByTestId('home-page')).toBeInTheDocument()
  })

  it('renders chat page when authenticated', () => {
    useAuthStore.setState({ isAuth: true })
    renderWithProviders(<ProtectedRoute />, { routes: testRoutes, initialEntries: ['/chat'] })
    expect(screen.getByTestId('chat-page')).toBeInTheDocument()
  })
})
