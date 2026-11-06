import { it, expect, describe, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { ChannelList } from './ChannelList'
import { renderWithProviders } from '@/test/test-utils'
import { channelKeys } from '@/entities/channel/api/channel.queries'
import { testChannels } from '@/test/fixtures/channels'
import { http, HttpResponse, delay } from 'msw'
import { BASE_URL } from '@/shared/api/api-instance'
import { server } from '@/shared/api/msw/server'
import { mockServerError } from '@/test/test-utils'
import { useChannelListStore, useCurrentChannelStore } from '@/entities/channel'

describe('ChannelList', () => {
  afterEach(() => {
    useChannelListStore.setState({ isOpened: true })
    useCurrentChannelStore.setState({ currentChannelId: '1' })
  })

  it('renders channel list', async () => {
    const { queryClient } = renderWithProviders(<ChannelList />)
    queryClient.setQueryData(channelKeys.all, testChannels)

    expect(await screen.findByText('test-channel-name-1')).toBeInTheDocument()
    expect(await screen.findByText('test-channel-name-2')).toBeInTheDocument()
  })

  it('shows three skeletons while channels are pending', async () => {
    server.use(
      http.get(`${BASE_URL}/channels`, async () => {
        await delay(50)
        return HttpResponse.json(testChannels)
      }),
    )

    renderWithProviders(<ChannelList />)

    expect(screen.getAllByTestId('channel-skeleton')).toHaveLength(3)
    expect(await screen.findByText('test-channel-name-1')).toBeInTheDocument()
  })

  it('shows an error when channels fail to load', async () => {
    mockServerError('get', '/channels')

    renderWithProviders(<ChannelList />)

    expect(await screen.findByText('Ошибка загрузки каналов')).toBeInTheDocument()
  })

  it('shows empty state when there are no channels', async () => {
    server.use(http.get(`${BASE_URL}/channels`, async () => HttpResponse.json([])))

    renderWithProviders(<ChannelList />)

    expect(await screen.findByText('Пока нет каналов')).toBeInTheDocument()
  })

  it('selects a channel and closes the list', async () => {
    const { queryClient } = renderWithProviders(<ChannelList />)
    queryClient.setQueryData(channelKeys.all, testChannels)

    fireEvent.click(await screen.findByText('test-channel-name-2'))

    expect(useCurrentChannelStore.getState().currentChannelId).toBe('2')
    expect(useChannelListStore.getState().isOpened).toBe(false)
  })
})
