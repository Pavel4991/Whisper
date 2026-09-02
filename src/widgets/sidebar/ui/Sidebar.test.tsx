import { describe, expect, it, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import { Sidebar } from './Sidebar'
import { useCurrentChannelStore } from '@/entities/channel/model'
import { channelKeys } from '@/entities/channel/api/channel.queries'
import { testChannels } from '@/test/fixtures/channels'
import type { Channel } from '@/entities/channel/model'
import { mockServerError } from '@/test/test-utils'

describe('Sidebar', () => {
  afterEach(() => {
    useCurrentChannelStore.setState({ currentChannelId: '1' })
  })

  it('renders with channels', async () => {
    const { queryClient } = renderWithProviders(<Sidebar />)
    queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)

    expect(await screen.findByText('test-channel-name-1')).toBeInTheDocument()
    expect(await screen.findByText('test-channel-name-2')).toBeInTheDocument()
  })

  it('current channel id is change by click to channel item', async () => {
    const { queryClient } = renderWithProviders(<Sidebar />)
    queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)

    const channelItem = await screen.findByText('test-channel-name-2')
    fireEvent.click(channelItem)

    const currentChannelId = useCurrentChannelStore.getState().currentChannelId
    expect(currentChannelId).toBe('2')
  })

  it('adding channel button open the modal', async () => {
    const { queryClient } = renderWithProviders(<Sidebar />)
    queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)

    const addChannelButton = await screen.findByRole('button', { name: 'Добавить канал' })

    expect(addChannelButton).toBeInTheDocument()

    fireEvent.click(addChannelButton)

    const createChannelModal = await screen.findByRole('heading', { name: 'Добавить канал' })

    expect(createChannelModal).toBeInTheDocument()
  })

  it('channel menu rename button open the modal', async () => {
    const user = userEvent.setup()
    const { queryClient } = renderWithProviders(<Sidebar />)
    queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)

    const channelMenuButtons = await screen.findAllByRole('button', { name: 'Управление каналом' })

    if (!channelMenuButtons[0]) {
      throw new Error('Кнопка управления каналом не найдена')
    }

    await user.click(channelMenuButtons[0])

    const renameChannelButton = await screen.findByRole('menuitem', { name: 'Переименовать канал' })

    await user.click(renameChannelButton)

    expect(await screen.findByRole('heading', { name: 'Переименовать канал' })).toBeInTheDocument()
  })

  it('channel menu remove button open the modal', async () => {
    const user = userEvent.setup()
    const { queryClient } = renderWithProviders(<Sidebar />)
    queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)

    const channelMenuButtons = await screen.findAllByRole('button', { name: 'Управление каналом' })

    if (!channelMenuButtons[0]) {
      throw new Error('Кнопка управления каналом не найдена')
    }

    await user.click(channelMenuButtons[0])

    const removeChannelButton = await screen.findByRole('menuitem', { name: 'Удалить канал' })

    await user.click(removeChannelButton)

    expect(await screen.findByRole('heading', { name: 'Удалить канал' })).toBeInTheDocument()
  })

  it('adding channel throw server error', async () => {
    mockServerError('get', '/channels')
    const { queryClient } = renderWithProviders(<Sidebar />)
    queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)

    expect(await screen.findByTestId('channel-list-server-error')).toBeInTheDocument()
  })
})
