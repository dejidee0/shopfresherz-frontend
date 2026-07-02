'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { refreshAccessToken } from '@/lib/api/client'

/** How long before expiry to proactively refresh the access token. */
const REFRESH_MARGIN_MS = 60_000

/**
 * Mount once at the app root. Silently refreshes the access token shortly
 * before it expires so authenticated requests don't hit a stale token.
 * Reactive (401 → refresh → retry) is handled in lib/api/client.ts; this
 * covers the proactive case, e.g. an idle tab with no in-flight requests.
 */
export function useSessionManager() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const expiresAt = useAuthStore((s) => s.expiresAt)
  const refreshToken = useAuthStore((s) => s.refreshToken)

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || !expiresAt || !refreshToken) return

    const delay = Math.max(new Date(expiresAt).getTime() - Date.now() - REFRESH_MARGIN_MS, 0)
    const timer = setTimeout(() => {
      refreshAccessToken()
    }, delay)

    return () => clearTimeout(timer)
  }, [hasHydrated, isAuthenticated, expiresAt, refreshToken])
}
