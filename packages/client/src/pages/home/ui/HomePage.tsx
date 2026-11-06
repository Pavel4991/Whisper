import { Container, Flex } from '@mantine/core'
import type { AuthModalType } from '@/features/auth/model/types'
import { AuthModal } from '@/features/auth/ui/AuthModal'
import { Header } from '@/widgets/header'
import { HeroSection } from './HeroSection'
import { HeroVisual } from './HeroVisual'
import { Footer } from '@/widgets/footer'
import { useModalStore } from '@/features/auth/model/modalStore'

function HomePage() {
  const isOpened = useModalStore((state) => state.isOpened)
  const modalType = useModalStore((state) => state.modalType)
  const openLoginModal = useModalStore((state) => state.openLoginModal)
  const openRegisterModal = useModalStore((state) => state.openRegisterModal)
  const closeModal = useModalStore((state) => state.closeModal)

  const handleOpenModal = (type: AuthModalType) =>
    type === 'login' ? openLoginModal() : openRegisterModal()

  return (
    <Container
      size="lg"
      h="100vh"
      display="flex"
      style={{ flexDirection: 'column' }}
      px={{ base: 16, xs: 24, md: 32 }}
    >
      <Header openModal={handleOpenModal} />
      <Flex
        py={{ base: 32, sm: 48, md: 96 }}
        flex={1}
        justify="space-between"
        gap={48}
        direction={{ base: 'column', md: 'row' }}
      >
        <HeroSection openModal={handleOpenModal} />
        <HeroVisual />
      </Flex>
      <Footer />
      <AuthModal modalType={modalType} isOpened={isOpened} onClose={closeModal} />
    </Container>
  )
}

export default HomePage
