import type { RouteObject } from 'react-router'
import { ChatPage } from '@/pages/chat'
import { LoginPage } from '@/pages/login'
import { NotFoundPage } from '@/pages/not-found'

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: ChatPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
]