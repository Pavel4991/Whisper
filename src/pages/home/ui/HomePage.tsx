import { Button } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { AuthModalType } from '@/features/auth/model/types'
import { AuthModal } from '@/features/auth/ui/AuthModal'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'

function HomePage() {
  const { t } = useTranslation()
  const [opened, { open, close }] = useDisclosure(false)
  const [modalType, setModalType] = useState<AuthModalType>('login')

  const handleModalType = (type: AuthModalType) => {
    setModalType(type)
    open()
  }

  return (
    <div>
      <h1>HomePage</h1>
      <Button onClick={() => handleModalType('login')}>{t('ui.homePage.loginButton')}</Button>
      <Button onClick={() => handleModalType('register')}>{t('ui.homePage.registerButton')}</Button>
      <AuthModal modalType={modalType} isOpened={opened} onClose={close} />
    </div>
  )
}

export default HomePage
