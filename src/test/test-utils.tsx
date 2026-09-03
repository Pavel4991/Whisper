import React, { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, renderHook, type RenderOptions } from '@testing-library/react'
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router'
import { MantineThemeProvider } from '@/app/providers/mantine'
import '@/app/providers/i18n'
import { BASE_URL } from '@/shared/api/api-instance'
import { http, HttpResponse } from 'msw'
import { server } from '@/shared/api/msw/server'

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

export function renderHookWithProviders<Result, Props>(callback: (initialProps: Props) => Result) {
  const queryClient = createTestQueryClient()

  const result = renderHook(callback, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  })
  return { ...result, queryClient }
}

// TODO: status захардкожен 400; расширить на (method, path, status = 400)
// при появлении необходимости возвращать разные коды ошибок (404, 500 и т.д.)
export function mockServerError(
  method: 'get' | 'post' | 'patch' | 'delete',
  path: string,
  status = 400,
) {
  server.use(
    http[method](`${BASE_URL}${path}`, () =>
      HttpResponse.json({ error: 'Bad Request' }, { status }),
    ),
  )
}
