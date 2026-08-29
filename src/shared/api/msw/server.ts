import { setupServer } from 'msw/node'
import { auth } from './handlers/auth'
import { channels } from './handlers/channels'
import { messages } from './handlers/messages'

export const server = setupServer(...auth, ...channels, ...messages)
