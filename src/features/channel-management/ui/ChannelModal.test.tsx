import { describe, expect, it, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { ChannelModal } from './ChannelModal'
import { renderWithProviders } from '@/test/test-utils'
import { mockServerError } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { tokenStorage } from '@/shared/api'
import type { Channel } from '@/entities/channel/model'
import { channelKeys } from '@/entities/channel/api/channel.queries'
import { testChannels } from '@/test/fixtures/channels'

describe('ChannelModal', () => {
  it('renders create channel modal', () => {
    renderWithProviders(
      <ChannelModal modalType="createChannel" isOpened={true} onClose={() => {}} channelId="" />,
    )

    expect(screen.getByRole('heading', { name: 'Добавить канал' })).toBeInTheDocument()
  })

  it('renders rename channel modal', () => {
    renderWithProviders(
      <ChannelModal modalType="renameChannel" isOpened={true} onClose={() => {}} channelId="" />,
    )

    expect(screen.getByRole('heading', { name: 'Переименовать канал' })).toBeInTheDocument()
  })

  it('renders remove channel modal', () => {
    renderWithProviders(
      <ChannelModal modalType="removeChannel" isOpened={true} onClose={() => {}} channelId="" />,
    )

    expect(screen.getByRole('heading', { name: 'Удалить канал' })).toBeInTheDocument()
    expect(screen.getByTestId('channel-remove-confirmation')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('renders validation error', () => {
    renderWithProviders(
      <ChannelModal modalType="createChannel" isOpened={true} onClose={() => {}} channelId="" />,
    )
    const submitButton = screen.getByRole('button', { name: 'Отправить' })

    fireEvent.click(submitButton)
    expect(screen.getByTestId('channel-name-error')).toBeInTheDocument()
  })

  it('closes after submission and adds channel to cache', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    tokenStorage.setToken('test-token')

    const { queryClient } = renderWithProviders(
      <ChannelModal modalType="createChannel" isOpened={true} onClose={onClose} channelId="" />,
    )

    const channelNameInput = screen.getByRole('textbox', { name: 'Добавить канал' })
    const submitButton = screen.getByRole('button', { name: 'Отправить' })

    await user.type(channelNameInput, 'Новый канал')
    await user.click(submitButton)
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
    const cachedChannels = queryClient.getQueryData<Channel[]>(channelKeys.all)

    expect(cachedChannels).toContainEqual(expect.objectContaining({ name: 'Новый канал' }))
  })

  it('closes after submission and adds renamed channel to cache', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    tokenStorage.setToken('test-token')

    const { queryClient } = renderWithProviders(
      <ChannelModal modalType="renameChannel" isOpened={true} onClose={onClose} channelId="1" />,
    )

    queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)

    const channelNameInput = screen.getByRole('textbox', { name: 'Переименовать канал' })
    const submitButton = screen.getByRole('button', { name: 'Отправить' })

    await user.type(channelNameInput, 'Новый канал')
    await user.click(submitButton)
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
    const cachedChannels = queryClient.getQueryData<Channel[]>(channelKeys.all)

    expect(cachedChannels).toContainEqual(expect.objectContaining({ id: '1', name: 'Новый канал' }))
  })

  it('closes after submission and removes channel from cache', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    tokenStorage.setToken('test-token')

    const { queryClient } = renderWithProviders(
      <ChannelModal modalType="removeChannel" isOpened={true} onClose={onClose} channelId="1" />,
    )

    queryClient.setQueryData<Channel[]>(channelKeys.all, testChannels)

    const submitButton = screen.getByRole('button', { name: 'Удалить' })

    await user.click(submitButton)
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
    const cachedChannels = queryClient.getQueryData<Channel[]>(channelKeys.all)

    expect(cachedChannels).not.toContainEqual(expect.objectContaining({ id: '1' }))
  })

  it('renders server error', async () => {
    const user = userEvent.setup()

    mockServerError('post', '/channels')

    renderWithProviders(
      <ChannelModal modalType="createChannel" isOpened={true} onClose={() => {}} channelId="" />,
    )
    const channelNameInput = screen.getByRole('textbox', { name: 'Добавить канал' })
    const submitButton = screen.getByRole('button', { name: 'Отправить' })

    await user.type(channelNameInput, 'Новый канал')
    await user.click(submitButton)
    expect(await screen.findByTestId('channel-modal-server-error')).toBeInTheDocument()
  })
})
