import { useAuthStore } from '@/store/auth'
import { toast } from '@/store/toast'
import type { RefreshResponse } from './auth'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://fresherz-001-site1.ftempurl.com/api/v1'

type RequestOptions = RequestInit & {
  token?: string
  params?: Record<string, string | number | boolean | undefined>
  /** @internal set on the retried request to prevent infinite refresh loops */
  _retry?: boolean
}

/** Build URL with query params */
function buildUrl(path: string, params?: RequestOptions['params']): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'https://fresherz-001-site1.ftempurl.com/api/v1'
  if (!base) {
    console.error('[ShopFresherz] NEXT_PUBLIC_API_URL is not defined')
    throw new Error('API base URL is not configured')
  }
  const url = new URL(`${base}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v))
      }
    })
  }
  return url.toString()
}

/** Core fetch wrapper — handles auth headers, errors, JSON parsing */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, params, _retry, ...init } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers,
  })

  if (!response.ok) {
    // Session expired mid-request: silently refresh once and retry.
    if (response.status === 401 && token && !_retry && path !== '/auth/refresh') {
      const newToken = await refreshAccessToken()
      if (newToken) {
        return apiFetch<T>(path, { ...options, token: newToken, _retry: true })
      }
    }

    let errorData
    try {
      errorData = await response.json()
    } catch {
      errorData = { message: response.statusText }
    }
    throw { code: errorData.code ?? 'SF-0000', message: errorData.message, status: response.status }
  }

  // 204 No Content
  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

// ─── Silent token refresh ──────────────────────────────────────────────────
// Shared by the 401-retry above and the proactive refresh timer
// (useSessionManager), so concurrent callers dedupe onto one network call
// instead of racing to redeem the same (possibly single-use) refresh token.

let refreshPromise: Promise<string | null> | null = null

export function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const { accessToken, refreshToken } = useAuthStore.getState()
    if (!refreshToken) return null

    try {
      const data = await apiFetch<RefreshResponse>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ accessToken, refreshToken }),
      })
      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken, data.expiresAt)
      useAuthStore.getState().updateUser(data.user)
      return data.accessToken
    } catch {
      const wasAuthenticated = useAuthStore.getState().isAuthenticated
      useAuthStore.getState().logout()
      if (wasAuthenticated) {
        toast.info('Session expired', 'Please sign in again to continue.')
      }
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

// ─── Convenience methods ────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { method: 'GET', ...options }),

  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body), ...options }),

  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body), ...options }),

  delete: <T>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { method: 'DELETE', ...options }),
}