const BASE_URL = process.env.NEXT_PUBLIC_API_URL

type RequestOptions = RequestInit & {
  token?: string
  params?: Record<string, string | number | boolean | undefined>
}

/** Build URL with query params */
function buildUrl(path: string, params?: RequestOptions['params']): string {
  const url = new URL(`${BASE_URL}${path}`)
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
  const { token, params, ...init } = options

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