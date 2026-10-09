import { describe, expect, it, afterEach, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderWithProviders, matchMediaMock } from '@/test/test-utils'
import ChatPage from './ChatPage'
import { useChannelListStore } from '@/entities/channel'

describe('ChatPage', () => {
  afterEach(() => {
    useChannelListStore.setState({ isOpened: true })
  })

  it('renders sidebar without dialog on desktop', async () => {
    renderWithProviders(<ChatPage />, { route: '/chat' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Whisper' })).toBeInTheDocument()
  })

  it('renders the channel list drawer on mobile', async () => {
    vi.stubGlobal('matchMedia', matchMediaMock(true))
    renderWithProviders(<ChatPage />, { route: '/chat' })
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('heading', { name: 'Whisper' })).toBeInTheDocument()
    expect(await within(dialog).findByText('test-channel-name-1')).toBeInTheDocument()
  })
})
