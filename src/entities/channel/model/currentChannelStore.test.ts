import { describe, expect, it, afterEach } from 'vitest'
import { useCurrentChannelStore } from './currentChannelStore'

describe('currentChannelStore', () => {
  afterEach(() => {
    useCurrentChannelStore.getState().setCurrentChannelId('1')
  })

  it('returns the default current channel', () => {
    const currentChannelId = useCurrentChannelStore.getState().currentChannelId
    expect(currentChannelId).toBe('1')
  })

  it('sets the current channel', () => {
    const setCurrentChannelId = useCurrentChannelStore.getState().setCurrentChannelId
    setCurrentChannelId('2')
    const updatedCurrentChannelId = useCurrentChannelStore.getState().currentChannelId
    expect(updatedCurrentChannelId).toBe('2')
  })
})
