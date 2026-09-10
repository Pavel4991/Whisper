import { ws } from 'msw'
import type { Message } from '@/entities/message/model/types'

const openFrame =
  '0{"sid":"mock-socket-sid","upgrades":[],"pingInterval":25000,"pingTimeout":20000}'

export const socketLink = ws.link(/^ws:\/\/[^/]+(?:\/socket\.io)?\/?$/)

export const socketMockHandler = socketLink.addEventListener('connection', ({ client }) => {
  client.send(openFrame)
  client.addEventListener('message', ({ data }) => {
    if (typeof data !== 'string') return
    if (data === '2') client.send('3')
    if (data.startsWith('40')) client.send('40{"sid":"mock-socket-sid"}')
  })
})

export function emitNewMessage(message: Message): void {
  const frame = `42["newMessage",${JSON.stringify(message)}]`
  socketLink.broadcast(frame)
}
