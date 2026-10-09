import { describe, expect, it, afterEach, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import { ChannelItem } from './ChannelItem'
import { useCurrentChannelStore } from '../model/currentChannelStore'

describe('ChannelItem', () => {
  afterEach(() => {
    useCurrentChannelStore.setState({ currentChannelId: '1' })
  })

  it('renders channel name', () => {
    const channel = { id: '1', name: 'general', removable: false }
    renderWithProviders(
      <ChannelItem
        channel={channel}
        isActive={true}
        onSelect={() => {}}
        onRename={() => {}}
        onRemove={() => {}}
      />,
    )

    expect(screen.getByText('general')).toBeInTheDocument()
  })

  it('sets current channel on click', () => {
    const channel = { id: '2', name: 'random', removable: false }
    const setCurrentChannelId = useCurrentChannelStore.getState().setCurrentChannelId

    renderWithProviders(
      <ChannelItem
        channel={channel}
        isActive={false}
        onSelect={() => setCurrentChannelId(channel.id)}
        onRename={() => {}}
        onRemove={() => {}}
      />,
    )
    const channelItem = screen.getByText('random')

    fireEvent.click(channelItem)

    const currentChannelId = useCurrentChannelStore.getState().currentChannelId

    expect(currentChannelId).toBe('2')
  })

  it('does not show management button for non-removable channels', () => {
    const channel = { id: '1', name: 'general', removable: false }
    renderWithProviders(
      <ChannelItem
        channel={channel}
        isActive={true}
        onSelect={() => {}}
        onRename={() => {}}
        onRemove={() => {}}
      />,
    )

    expect(screen.queryByRole('button', { name: 'Управление каналом' })).not.toBeInTheDocument()
  })

  it('opens the modal on rename menu click', async () => {
    const user = userEvent.setup()
    const openModal = vi.fn()
    const channel = { id: '1', name: 'general', removable: true }
    renderWithProviders(
      <ChannelItem
        channel={channel}
        isActive={true}
        onSelect={() => {}}
        onRename={() => openModal('renameChannel', '1')}
        onRemove={() => {}}
      />,
    )
    const channelMenuButton = screen.getByRole('button', { name: 'Управление каналом' })
    expect(channelMenuButton).toBeInTheDocument()

    await user.click(channelMenuButton)

    const renameChannelButton = await screen.findByRole(
      'menuitem',
      { name: 'Переименовать канал' },
      { timeout: 3000 },
    )

    await user.click(renameChannelButton)

    expect(openModal).toHaveBeenCalledWith('renameChannel', '1')
  })

  it('opens the modal on remove menu click', async () => {
    const user = userEvent.setup()
    const openModal = vi.fn()
    const channel = { id: '1', name: 'general', removable: true }
    renderWithProviders(
      <ChannelItem
        channel={channel}
        isActive={true}
        onSelect={() => {}}
        onRename={() => {}}
        onRemove={() => openModal('removeChannel', '1')}
      />,
    )
    const channelMenuButton = screen.getByRole('button', { name: 'Управление каналом' })
    expect(channelMenuButton).toBeInTheDocument()

    await user.click(channelMenuButton)

    const removeChannelButton = await screen.findByRole(
      'menuitem',
      { name: 'Удалить канал' },
      { timeout: 3000 },
    )

    await user.click(removeChannelButton)

    expect(openModal).toHaveBeenCalledWith('removeChannel', '1')
  })

  it('does not select the channel when the menu button is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const channel = { id: '1', name: 'general', removable: true }

    renderWithProviders(
      <ChannelItem
        channel={channel}
        isActive={true}
        onSelect={() => onSelect()}
        onRename={() => {}}
        onRemove={() => {}}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Управление каналом' }))

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('does not select the channel when a menu action is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onRename = vi.fn()
    const channel = { id: '1', name: 'general', removable: true }

    renderWithProviders(
      <ChannelItem
        channel={channel}
        isActive={true}
        onSelect={() => onSelect()}
        onRename={() => onRename('renameChannel', channel.id)}
        onRemove={() => {}}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Управление каналом' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Переименовать канал' }))

    expect(onRename).toHaveBeenCalledWith('renameChannel', '1')
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('selects the channel on name click even when it has a menu', async () => {
    const onSelect = vi.fn()
    const channel = { id: '1', name: 'general', removable: true }

    renderWithProviders(
      <ChannelItem
        channel={channel}
        isActive={true}
        onSelect={() => onSelect()}
        onRename={() => {}}
        onRemove={() => {}}
      />,
    )
    fireEvent.click(screen.getByText('general'))

    expect(onSelect).toHaveBeenCalled()
  })
})
