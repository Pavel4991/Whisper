import { Container } from '@mantine/core'
import type { AuthModalType } from '@/features/auth/model/types'
import { AuthModal } from '@/features/auth/ui/AuthModal'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { Header } from '@/widgets/header'
import { useTranslation } from 'react-i18next'

function HomePage() {
  const [opened, { open, close }] = useDisclosure(false)
  const [modalType, setModalType] = useState<AuthModalType>('login')
  const { t } = useTranslation()

  const handleModalType = (type: AuthModalType) => {
    setModalType(type)
    open()
  }

  return (
    <Container size="lg">
      <Header openModal={handleModalType} />
      <h1>{t('ui.homePage.header')}</h1>
      <AuthModal modalType={modalType} isOpened={opened} onClose={close} />
    </Container>
  )
}

export default HomePage
