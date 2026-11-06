import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import { RegisterForm } from './RegisterForm'

describe('RegisterForm', () => {
  const renderRegisterForm = () => renderWithProviders(<RegisterForm />)

  it('renders form with fields and button', () => {
    renderRegisterForm()

    expect(screen.getByRole('textbox', { name: 'Имя пользователя' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Пароль' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Подтверждение пароля' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeInTheDocument()
  })

  it('renders error message', async () => {
    renderRegisterForm()

    const user = userEvent.setup()
    const usernameField = screen.getByRole('textbox', { name: 'Имя пользователя' })
    const passwordField = screen.getByRole('textbox', { name: 'Пароль' })
    const passwordConfirmField = screen.getByRole('textbox', { name: 'Подтверждение пароля' })
    const registerButton = screen.getByRole('button', { name: 'Зарегистрироваться' })

    await user.type(usernameField, 'duplicated-username')
    await user.type(passwordField, 'duplicated-password')
    await user.type(passwordConfirmField, 'duplicated-password')
    await user.click(registerButton)

    expect(screen.getByTestId('register-form-server-error')).toBeInTheDocument()
  })

  it('calls register api with redirection', async () => {
    const testRoutes = [
      {
        path: '/',
        element: <RegisterForm />,
      },
      {
        path: '/chat',
        element: <div data-testid="chat-page">Добро пожаловать в чат!</div>,
      },
    ]

    renderWithProviders(<RegisterForm />, { routes: testRoutes })
    const user = userEvent.setup()
    const usernameField = screen.getByRole('textbox', { name: 'Имя пользователя' })
    const passwordField = screen.getByRole('textbox', { name: 'Пароль' })
    const passwordConfirmField = screen.getByRole('textbox', { name: 'Подтверждение пароля' })
    const registerButton = screen.getByRole('button', { name: 'Зарегистрироваться' })

    await user.type(usernameField, 'test-username')
    await user.type(passwordField, 'test-password')
    await user.type(passwordConfirmField, 'test-password')
    await user.click(registerButton)

    expect(await screen.findByTestId('chat-page')).toBeInTheDocument()
  })
})
