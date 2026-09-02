import { describe, expect, it, afterEach, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import { ChannelItem } from './ChannelItem'
import { useCurrentChannelStore } from '@/entities/channel/model'

describe('ChannelItem', () => {
  afterEach(() => {
    useCurrentChannelStore.setState({ currentChannelId: '1' })
  })

  it('channels is visible on the page', () => {
    const channel = { id: '1', name: 'general', removable: false }
    renderWithProviders(<ChannelItem channel={channel} openModal={() => {}} />)

    expect(screen.getByText('general')).toBeInTheDocument()
  })

  it('change current channel id by click', () => {
    const channel = { id: '2', name: 'random', removable: false }
    renderWithProviders(<ChannelItem channel={channel} openModal={() => {}} />)
    const channelItem = screen.getByText('random')

    fireEvent.click(channelItem)

    const currentChannelId = useCurrentChannelStore.getState().currentChannelId

    expect(currentChannelId).toBe('2')
  })

  it('not removable channels has not channel-manegment button', () => {
    const channel = { id: '1', name: 'general', removable: false }
    renderWithProviders(<ChannelItem channel={channel} openModal={() => {}} />)

    expect(screen.queryByRole('button', { name: 'Управление каналом' })).not.toBeInTheDocument()
  })

  it('channel menu rename button open the modal', async () => {
    const user = userEvent.setup()
    const openModal = vi.fn()
    const channel = { id: '1', name: 'general', removable: true }
    renderWithProviders(<ChannelItem channel={channel} openModal={openModal} />)
    const channelMenuButton = screen.getByRole('button', { name: 'Управление каналом' })
    expect(channelMenuButton).toBeInTheDocument()

    await user.click(channelMenuButton)

    const renameChannelButton = await screen.findByRole('menuitem', { name: 'Переименовать канал' })

    await user.click(renameChannelButton)

    expect(openModal).toHaveBeenCalledWith('renameChannel', '1')
  })

  it('channel menu remove button open the modal', async () => {
    const user = userEvent.setup()
    const openModal = vi.fn()
    const channel = { id: '1', name: 'general', removable: true }
    renderWithProviders(<ChannelItem channel={channel} openModal={openModal} />)
    const channelMenuButton = screen.getByRole('button', { name: 'Управление каналом' })
    expect(channelMenuButton).toBeInTheDocument()

    await user.click(channelMenuButton)

    const removeChannelButton = await screen.findByRole('menuitem', { name: 'Удалить канал' })

    await user.click(removeChannelButton)

    expect(openModal).toHaveBeenCalledWith('removeChannel', '1')
  })
})
