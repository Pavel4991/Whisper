import { io, type Socket } from 'socket.io-client'
import { sessionStorage } from './session-storage'

type SocketEventMap = Record<string, (...args: never[]) => void>

let socket: Socket | null = null

export function getSocket<Events extends SocketEventMap = Record<string, never>>(): Socket<Events> {
  if (!socket) {
    socket = io({
      transports: ['websocket'],
      auth: { token: sessionStorage.getToken() },
    })
  }
  return socket as Socket<Events>
}

export function disconnectSocket(): void {
  socket?.disconnect()
  socket = null
}
