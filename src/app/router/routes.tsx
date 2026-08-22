import type { RouteObject } from 'react-router'
import { ChatPage } from '@/pages/chat'
import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/chat',
    Component: ChatPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
]
