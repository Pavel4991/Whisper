import { afterAll, describe, expect, it } from 'vitest'
import { io, type Socket } from 'socket.io-client'

const sockets: Socket[] = []

function waitForConnect(socket: Socket, timeoutMs = 3000): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('connect timeout')), timeoutMs)
    socket.once('connect', () => {
      clearTimeout(timer)
      resolve()
    })
    socket.once('connect_error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
  })
}

describe('socket.io-client over MSW ws', () => {
  it('connects through the intercepted WebSocket', async () => {
    const socket = io({ transports: ['websocket'], timeout: 2000 })
    sockets.push(socket)

    await waitForConnect(socket)

    expect(socket.connected).toBe(true)

    const transport = (
      socket.io as unknown as {
        engine?: { transport?: { name?: string; ws?: { constructor?: { name?: string } } } }
      }
    ).engine?.transport

    expect(transport?.name).toBe('websocket')
    expect(transport?.ws?.constructor?.name ?? '').toContain('Override')
  })
})

afterAll(() => {
  sockets.forEach((socket) => socket.disconnect())
})
