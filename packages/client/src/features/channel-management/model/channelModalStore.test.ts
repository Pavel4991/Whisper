import { it, expect, describe, afterEach } from 'vitest'
import { useChannelModalStore } from './channelModalStore'

describe('ChannelModalStore', () => {
  afterEach(() => {
    useChannelModalStore.setState({ isOpened: false, modalType: 'createChannel', channelId: '' })
  })

  it('modal is closed by default', () => {
    expect(useChannelModalStore.getState().isOpened).toBeFalsy()
  })

  it('opens create modal and resets channel id', () => {
    useChannelModalStore.setState({ channelId: '2' })
    useChannelModalStore.getState().openCreateChannelModal()

    expect(useChannelModalStore.getState().isOpened).toBeTruthy()
    expect(useChannelModalStore.getState().modalType).toBe('createChannel')
    expect(useChannelModalStore.getState().channelId).toBe('')
  })

  it('opens rename modal', () => {
    useChannelModalStore.getState().openRenameChannelModal('1')

    expect(useChannelModalStore.getState().isOpened).toBeTruthy()
    expect(useChannelModalStore.getState().modalType).toBe('renameChannel')
    expect(useChannelModalStore.getState().channelId).toBe('1')
  })

  it('opens remove modal', () => {
    useChannelModalStore.getState().openRemoveChannelModal('1')

    expect(useChannelModalStore.getState().isOpened).toBeTruthy()
    expect(useChannelModalStore.getState().modalType).toBe('removeChannel')
    expect(useChannelModalStore.getState().channelId).toBe('1')
  })

  it('closes modal', () => {
    useChannelModalStore.getState().openRenameChannelModal('1')
    useChannelModalStore.getState().closeModal()

    expect(useChannelModalStore.getState().isOpened).toBeFalsy()
  })
})
