import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, afterAll, beforeAll, vi } from 'vitest'
import { server } from '../shared/api/msw/server'
import { sessionStorage } from '@/shared/api'
import { useCurrentChannelStore } from '@/entities/channel/model/currentChannelStore'

const { WebSocket } = await import('ws')
globalThis.WebSocket = WebSocket as unknown as typeof globalThis.WebSocket

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

Object.defineProperty(document, 'fonts', {
  configurable: true,
  value: {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
})

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver

server.listen({ onUnhandledRequest: 'error' })

beforeAll(() => {
  sessionStorage.setSession({ token: 'test-token', username: 'test-username' })
})

afterEach(() => vi.unstubAllGlobals())

afterEach(() => {
  server.resetHandlers()
  useCurrentChannelStore.setState({ currentChannelId: '1' })
})

afterEach(() => {
  cleanup()
})

afterAll(() => {
  sessionStorage.clearSession()
  server.close()
})
