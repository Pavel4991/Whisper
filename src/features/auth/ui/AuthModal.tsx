import { Modal, Title, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { AuthModalType } from '../model/types'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { Logo } from '@/shared/ui/Logo'

interface AuthModalProps {
  readonly modalType: AuthModalType
  readonly isOpened: boolean
  readonly onClose: () => void
}

export function AuthModal({ modalType, isOpened, onClose }: AuthModalProps) {
  const { t } = useTranslation()

  return (
    <Modal.Root opened={isOpened} onClose={onClose} size={500}>
      <Modal.Overlay backgroundOpacity={0.55} blur={3} />
      <Modal.Content radius="xl" p={28}>
        <Modal.Header p={0}>
          <Modal.Title>
            <Logo />
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body p={0}>
          <Title order={2} fz={24} mb={10}>
            {t(`ui.authModals.${modalType}Title`)}
          </Title>
          <Text mb={28} fz="sm" c="var(--mantine-color-gray-7)">
            {t(`ui.authModals.${modalType}Description`)}
          </Text>
          {modalType === 'login' ? <LoginForm /> : <RegisterForm />}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  )
}
