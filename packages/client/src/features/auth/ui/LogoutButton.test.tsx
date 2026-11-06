import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import { LogoutButton } from './LogoutButton'
import { useAuthStore } from '@/features/auth/model/authStore'
import { sessionStorage } from '@/shared/api'

describe('LogoutButton', () => {
  it('clears session and redirects to / on logout', async () => {
    const testRoutes = [
      {
        path: '/',
        element: <div data-testid="home-page">Вы на главной странице!</div>,
      },
      {
        path: '/chat',
        element: <LogoutButton />,
      },
    ]

    const user = userEvent.setup()
    const login = useAuthStore.getState().login
    login({ token: 'test-token', username: 'test-username' })

    renderWithProviders(<LogoutButton />, { routes: testRoutes, initialEntries: ['/chat'] })
    const logoutButton = screen.getByRole('button', { name: 'Выйти' })

    await user.click(logoutButton)

    expect(sessionStorage.getSession()).toBeNull()
    expect(await screen.findByTestId('home-page')).toBeInTheDocument()
  })
})
