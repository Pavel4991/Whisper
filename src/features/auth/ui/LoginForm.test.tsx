import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  const renderLoginForm = () => renderWithProviders(<LoginForm />)

  it('renders form with fields and button', () => {
    renderLoginForm()
    expect(screen.getByRole('textbox', { name: 'Имя пользователя' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Пароль' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
  })

  it('renders validation errors', async () => {
    renderLoginForm()
    const user = userEvent.setup()
    const loginButton = screen.getByRole('button', { name: 'Войти' })

    await user.click(loginButton)

    expect(screen.getByTestId('username-error')).toBeInTheDocument()
    expect(screen.getByTestId('password-error')).toBeInTheDocument()
  })

  it('renders error message', async () => {
    renderLoginForm()
    const user = userEvent.setup()
    const usernameField = screen.getByRole('textbox', { name: 'Имя пользователя' })
    const passwordField = screen.getByRole('textbox', { name: 'Пароль' })
    const loginButton = screen.getByRole('button', { name: 'Войти' })

    await user.type(usernameField, 'test-error-username')
    await user.type(passwordField, 'test-error-password')
    await user.click(loginButton)

    expect(screen.getByTestId('login-form-server-error')).toBeInTheDocument()
  })

  it('calls login api with redirection', async () => {
    const testRoutes = [
      {
        path: '/',
        element: <LoginForm />,
      },
      {
        path: '/chat',
        element: <div data-testid="chat-page">Добро пожаловать в чат!</div>,
      },
    ]

    renderWithProviders(<LoginForm />, { routes: testRoutes })
    const user = userEvent.setup()
    const usernameField = screen.getByRole('textbox', { name: 'Имя пользователя' })
    const passwordField = screen.getByRole('textbox', { name: 'Пароль' })
    const loginButton = screen.getByRole('button', { name: 'Войти' })

    await user.type(usernameField, 'test-username')
    await user.type(passwordField, 'test-password')
    await user.click(loginButton)

    expect(await screen.findByTestId('chat-page')).toBeInTheDocument()
  })
})
