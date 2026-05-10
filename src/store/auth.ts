'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types/user'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  updateUser: (partial: Partial<User>) => void
  logout: () => void

  // Derived helpers
  isAdmin: () => boolean
  isCustomer: () => boolean
  redirectPath: () => '/admin/dashboard' | '/store'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      updateUser: (partial) =>
        set((s) => ({ user: s.user ? { ...s.user, ...partial } : null })),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),

      isAdmin: () => {
        const role = get().user?.role
        return role === 'Admin' || role === 'SuperAdmin'
      },

      isCustomer: () => get().user?.role === 'Customer',

      redirectPath: () =>
        get().isAdmin() ? '/admin/dashboard' : '/store',
    }),
    {
      name: 'sf-auth',
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
)