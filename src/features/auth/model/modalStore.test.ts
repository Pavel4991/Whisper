import { it, expect, describe, beforeEach } from 'vitest'
import { useModalStore } from './modalStore'

describe('useModalStore', () => {
  const getIsOpened = () => useModalStore.getState().isOpened
  const getModalType = () => useModalStore.getState().modalType
  const openLoginModal = useModalStore.getState().openLoginModal
  const openRegisterModal = useModalStore.getState().openRegisterModal
  const closeModal = useModalStore.getState().closeModal

  beforeEach(() => {
    useModalStore.setState({ isOpened: false, modalType: 'login' })
  })

  it('modal is closed by default', () => {
    expect(getIsOpened()).toBe(false)
  })

  it('modal type is login by default', () => {
    expect(getModalType()).toBe('login')
  })

  it('opens login modal', () => {
    openLoginModal()
    expect(getIsOpened()).toBe(true)
    expect(getModalType()).toBe('login')
  })

  it('opens register modal', () => {
    openRegisterModal()
    expect(getIsOpened()).toBe(true)
    expect(getModalType()).toBe('register')
  })

  it('closes modal', () => {
    closeModal()
    expect(getIsOpened()).toBe(false)
  })
})
