import { it, expect, describe, afterEach } from 'vitest'
import { useChannelListStore } from './channelListStore'

describe('ChannelListStore', () => {
  afterEach(() => {
    useChannelListStore.setState({ isOpened: true })
  })

  it('isOpened is true by default', () => {
    expect(useChannelListStore.getState().isOpened).toBeTruthy()
  })

  it('channel list is opened by openChannelList', () => {
    useChannelListStore.setState({ isOpened: false })

    expect(useChannelListStore.getState().isOpened).toBeFalsy()

    useChannelListStore.getState().openChannelList()

    expect(useChannelListStore.getState().isOpened).toBeTruthy()
  })

  it('channel list is opened and closed by toggle', () => {
    expect(useChannelListStore.getState().isOpened).toBeTruthy()

    useChannelListStore.getState().toggleChannelList()

    expect(useChannelListStore.getState().isOpened).toBeFalsy()

    useChannelListStore.getState().toggleChannelList()

    expect(useChannelListStore.getState().isOpened).toBeTruthy()
  })

  it('channel list is closed by closeChannelList', () => {
    useChannelListStore.getState().closeChannelList()

    expect(useChannelListStore.getState().isOpened).toBeFalsy()
  })
})
