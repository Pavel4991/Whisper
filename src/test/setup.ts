import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, afterAll, beforeAll, vi } from 'vitest'
import { server } from '../shared/api/msw/server'
import { tokenStorage } from '@/shared/api/token-storage'
import { useCurrentChannelStore } from '@/entities/channel/model/currentChannelStore'

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

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
  tokenStorage.setToken('test-token')
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
  tokenStorage.clearToken()
  server.close()
})
