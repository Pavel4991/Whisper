import { afterAll, describe, expect, it } from 'vitest'

const sockets: WebSocket[] = []

function waitForOpen(socket: WebSocket, timeoutMs = 2000): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('open timeout')), timeoutMs)
    socket.addEventListener('open', () => {
      clearTimeout(timer)
      resolve()
    })
    socket.addEventListener('error', () => reject(new Error('websocket error')))
  })
}

function waitForMessage(
  socket: WebSocket,
  predicate: (data: string) => boolean,
  timeoutMs = 2000,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('no frame within 2s')), timeoutMs)
    socket.addEventListener('message', (ev) => {
      const data = String(ev.data)
      if (predicate(data)) {
        clearTimeout(timer)
        resolve(data)
      }
    })
  })
}

describe('raw WebSocket over MSW ws', () => {
  it('exchanges engine.io protocol frames', async () => {
    const socket = new WebSocket('ws://localhost:3000/socket.io/?EIO=4&transport=websocket')
    sockets.push(socket)

    const received = waitForMessage(socket, (data) => data.startsWith('0{'))
    await waitForOpen(socket)

    expect((await received).startsWith('0{')).toBe(true)

    const pong = waitForMessage(socket, (data) => data.startsWith('3'))
    socket.send('2')
    expect((await pong).startsWith('3')).toBe(true)

    const connect = waitForMessage(socket, (data) => data.startsWith('40{'))
    socket.send('40')
    expect((await connect).startsWith('40{')).toBe(true)
  })
})

afterAll(() => {
  sockets.forEach((socket) => socket.close())
})
