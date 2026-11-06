import { it, expect, describe, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { ChatHeader } from './ChatHeader'
import { useChannelListStore } from '@/entities/channel'

describe('ChatHeader', () => {
  afterEach(() => {
    useChannelListStore.setState({ isOpened: true })
  })

  it('includes hidden channel list button on desktop', () => {
    renderWithProviders(<ChatHeader />)

    expect(screen.getByRole('button', { name: 'Открыть список каналов' })).toHaveClass(
      'mantine-hidden-from-sm',
    )
  })

  it('opens channel list on mobile', () => {
    useChannelListStore.setState({ isOpened: false })

    renderWithProviders(<ChatHeader />)

    const openChannelListButton = screen.getByRole('button', { name: 'Открыть список каналов' })

    fireEvent.click(openChannelListButton)

    expect(useChannelListStore.getState().isOpened).toBe(true)
  })
})
