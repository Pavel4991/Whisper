import { Navigate, Outlet } from 'react-router'

import { useAuthStore } from '@/features/auth/model/authStore'

export function ProtectedRoute() {
  const isAuth = useAuthStore((state) => state.isAuth)

  if (!isAuth) return <Navigate to="/" replace />

  return <Outlet />
}
