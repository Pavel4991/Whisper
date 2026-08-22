import { Modal } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { AuthModalType } from '../model/types'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

interface AuthModalProps {
  modalType: AuthModalType
  isOpened: boolean
  onClose: () => void
}

export function AuthModal({ modalType, isOpened, onClose }: AuthModalProps) {
  const { t } = useTranslation()

  return (
    <Modal
      title={modalType === 'login' ? t('ui.modals.login') : t('ui.modals.register')}
      opened={isOpened}
      onClose={onClose}
    >
      {modalType === 'login' ? <LoginForm /> : <RegisterForm />}
    </Modal>
  )
}
