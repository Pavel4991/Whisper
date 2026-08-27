import { setupServer } from 'msw/node'
import { auth } from './handlers/auth'

export const server = setupServer(...auth)
