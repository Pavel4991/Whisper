import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { AuthModal } from './AuthModal'
import { useModalStore } from '@/features/auth/model/modalStore'

describe('AuthModal', () => {
  beforeEach(() => {
    useModalStore.setState({ isOpened: false, modalType: 'login' })
  })

  it('modal is closed by default', () => {
    renderWithProviders(<AuthModal modalType="login" isOpened={false} onClose={() => {}} />)

    expect(screen.queryByRole('heading', { name: 'С возвращением' })).not.toBeInTheDocument()
  })

  it('renders LoginForm when modalType is login', () => {
    renderWithProviders(<AuthModal modalType="login" isOpened={true} onClose={() => {}} />)

    expect(screen.getByRole('heading', { name: 'С возвращением' })).toBeInTheDocument()
  })

  it('renders RegisterForm when modalType is register', () => {
    renderWithProviders(<AuthModal modalType="register" isOpened={true} onClose={() => {}} />)

    expect(
      screen.getByRole('heading', { name: 'Создайте рабочее пространство команды' }),
    ).toBeInTheDocument()
  })
})
