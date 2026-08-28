import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { AuthModal } from './AuthModal'

describe('AuthModal', () => {
  it('modal is closed by default', () => {
    renderWithProviders(<AuthModal modalType="login" isOpened={false} onClose={() => {}} />)

    expect(screen.queryByRole('heading', { name: 'Вход' })).not.toBeInTheDocument()
  })

  it('renders LoginForm when modalType is login', () => {
    renderWithProviders(<AuthModal modalType="login" isOpened={true} onClose={() => {}} />)

    expect(screen.getByRole('heading', { name: 'Вход' })).toBeInTheDocument()
  })

  it('renders RegisterForm when modalType is register', () => {
    renderWithProviders(<AuthModal modalType="register" isOpened={true} onClose={() => {}} />)

    expect(screen.getByRole('heading', { name: 'Регистрация' })).toBeInTheDocument()
  })
})
