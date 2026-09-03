import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import HomePage from './HomePage'

describe('HomePage', () => {
  const renderHomePage = () => renderWithProviders(<HomePage />)

  it('opens login modal on login button click', async () => {
    renderHomePage()

    const user = userEvent.setup()
    const loginButton = await screen.findByRole('button', { name: 'Войти' })

    await user.click(loginButton)

    expect(await screen.findByRole('heading', { name: 'Вход' })).toBeInTheDocument()
  })

  it('opens register modal on register button click', async () => {
    renderHomePage()

    const user = userEvent.setup()
    const registerButton = await screen.findByRole('button', { name: 'Начать' })

    await user.click(registerButton)

    expect(await screen.findByRole('heading', { name: 'Регистрация' })).toBeInTheDocument()
  })
})
