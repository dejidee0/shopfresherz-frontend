'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types/user'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  hasHydrated: boolean

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  updateUser: (partial: Partial<User>) => void
  setHasHydrated: (hasHydrated: boolean) => void
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
      hasHydrated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      updateUser: (partial) =>
        set((s) => ({ user: s.user ? { ...s.user, ...partial } : null })),

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

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
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
)
