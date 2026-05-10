import { api } from './client'
import type { User } from '../types/user'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', payload),

  logout: (token: string) =>
    api.post<void>('/auth/logout', {}, { token }),

  /** Exchange refresh token for a new access token */
  refresh: (refreshToken: string) =>
    api.post<Pick<AuthResponse, 'accessToken'>>('/auth/refresh', { refreshToken }),

  /** Validate current token + return fresh user object */
  me: (token: string) =>
    api.get<User>('/auth/me', { token }),
}