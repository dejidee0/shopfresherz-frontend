'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

type RequiredRole = 'Customer' | 'Admin' | 'SuperAdmin' | 'any'

interface Options {
  role?: RequiredRole   // default 'any' — just requires login
  redirectTo?: string   // default '/auth/login'
}

/**
 * Drop into any client page that requires authentication.
 *
 * Usage:
 *   const { user, isLoading } = useRequireAuth()
 *   const { user } = useRequireAuth({ role: 'Admin', redirectTo: '/' })
 */
export function useRequireAuth({ role = 'any', redirectTo = '/auth/login' }: Options = {}) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Not logged in → go to login
    if (!isAuthenticated || !user) {
      router.replace(redirectTo)
      return
    }

    // Wrong role → go to their correct home
    if (role !== 'any') {
      const isAdmin = user.role === 'Admin' || user.role === 'SuperAdmin'
      const needsAdmin = role === 'Admin' || role === 'SuperAdmin'

      if (needsAdmin && !isAdmin) {
        router.replace('/store')
      } else if (!needsAdmin && isAdmin) {
        router.replace('/admin/dashboard')
      }
    }
  }, [isAuthenticated, user, role, redirectTo, router])

  return { user, isAuthenticated }
}