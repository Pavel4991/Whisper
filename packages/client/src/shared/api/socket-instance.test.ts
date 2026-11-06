import { afterAll, describe, expect, it } from 'vitest'
import { disconnectSocket, getSocket } from './socket-instance'

afterAll(() => disconnectSocket())

describe('socket-instance', () => {
  it('returns the same instance on multiple calls', () => {
    const first = getSocket()
    const second = getSocket()
    expect(first).toBe(second)
  })

  it('creates a new instance after disconnect', () => {
    const first = getSocket()
    disconnectSocket()
    const second = getSocket()
    expect(first).not.toBe(second)
  })
})
