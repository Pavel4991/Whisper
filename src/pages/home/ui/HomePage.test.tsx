import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import HomePage from './HomePage'
import { useModalStore } from '@/features/auth/model/modalStore'

describe('HomePage', () => {
  const renderHomePage = () => renderWithProviders(<HomePage />)
  beforeEach(() => {
    useModalStore.setState({ isOpened: false, modalType: 'login' })
  })

  it('opens login modal on login button click', async () => {
    renderHomePage()

    const user = userEvent.setup()
    const loginButton = await screen.findByRole('button', { name: 'Войти' })

    await user.click(loginButton)

    expect(await screen.findByRole('heading', { name: 'С возвращением' })).toBeInTheDocument()
  })

  it('opens register modal on register button click', async () => {
    renderHomePage()

    const user = userEvent.setup()
    const registerButton = await screen.findByRole('button', { name: 'Начать' })

    await user.click(registerButton)

    expect(
      await screen.findByRole('heading', { name: 'Создайте рабочее пространство команды' }),
    ).toBeInTheDocument()
  })

  it('opens login modal on secondary cta button click', async () => {
    renderHomePage()

    const user = userEvent.setup()
    const loginButton = await screen.findByRole('button', { name: 'Уже есть аккаунт' })

    await user.click(loginButton)

    expect(await screen.findByRole('heading', { name: 'С возвращением' })).toBeInTheDocument()
  })

  it('opens register modal on primary cta button click', async () => {
    renderHomePage()

    const user = userEvent.setup()
    const registerButton = await screen.findByRole('button', { name: 'Начать диалог' })

    await user.click(registerButton)

    expect(
      await screen.findByRole('heading', { name: 'Создайте рабочее пространство команды' }),
    ).toBeInTheDocument()
  })

  it('switches from login to register modal via redirection link', async () => {
    renderHomePage()

    const user = userEvent.setup()
    const loginButton = await screen.findByRole('button', { name: 'Войти' })
    await user.click(loginButton)
    expect(await screen.findByRole('heading', { name: 'С возвращением' })).toBeInTheDocument()

    const registerLink = await screen.findByRole('link', { name: 'Зарегистрироваться' })
    await user.click(registerLink)

    expect(
      await screen.findByRole('heading', { name: 'Создайте рабочее пространство команды' }),
    ).toBeInTheDocument()
  })

  it('switches from register to login modal via redirection link', async () => {
    renderHomePage()

    const user = userEvent.setup()
    const registerButton = await screen.findByRole('button', { name: 'Начать' })
    await user.click(registerButton)
    expect(
      await screen.findByRole('heading', { name: 'Создайте рабочее пространство команды' }),
    ).toBeInTheDocument()

    const loginLink = await screen.findByRole('link', { name: 'Войти' })
    await user.click(loginLink)

    expect(await screen.findByRole('heading', { name: 'С возвращением' })).toBeInTheDocument()
  })

  it('renders hero visual', () => {
    renderHomePage()
    const placeholder = screen.getByText('Напишите что-то важное...')
    expect(placeholder).toBeInTheDocument()
  })
})
