import { Container, Flex } from '@mantine/core'
import type { AuthModalType } from '@/features/auth/model/types'
import { AuthModal } from '@/features/auth/ui/AuthModal'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { Header } from '@/widgets/header'
import { HeroSection } from './HeroSection'
import { HeroVisual } from './HeroVisual'
import { Footer } from '@/widgets/footer'

function HomePage() {
  const [opened, { open, close }] = useDisclosure(false)
  const [modalType, setModalType] = useState<AuthModalType>('login')

  const handleModalType = (type: AuthModalType) => {
    setModalType(type)
    open()
  }

  return (
    <Container
      size="lg"
      h="100vh"
      display="flex"
      style={{ flexDirection: 'column' }}
      px={{ base: 16, xs: 24, md: 32 }}
    >
      <Header openModal={handleModalType} />
      <Flex
        py={{ base: 32, sm: 48, md: 96 }}
        flex={1}
        justify="space-between"
        gap={48}
        direction={{ base: 'column', md: 'row' }}
      >
        <HeroSection openModal={handleModalType} />
        <HeroVisual />
      </Flex>
      <Footer />
      <AuthModal modalType={modalType} isOpened={opened} onClose={close} />
    </Container>
  )
}

export default HomePage
