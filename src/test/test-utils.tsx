import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router'
import { MantineThemeProvider } from '@/app/providers/mantine'

import '@/app/providers/i18n'

interface RenderOptionsWithRouter extends Omit<RenderOptions, 'wrapper'> {
  route?: string
  routes?: RouteObject[]
  initialEntries?: string[]
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: { retry: false },
    },
  })
}

export function renderWithProviders(
  ui: React.ReactElement,
  { route = '/', routes, initialEntries, ...renderOptions }: RenderOptionsWithRouter = {},
) {
  const testRoutes = routes ?? [{ path: route, element: ui }]

  const router = createMemoryRouter(testRoutes, {
    initialEntries: initialEntries ?? [route],
  })

  const queryClient = createTestQueryClient()

  const result = render(
    <MantineThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineThemeProvider>,
    renderOptions,
  )

  return {
    ...result,
    queryClient,
  }
}
