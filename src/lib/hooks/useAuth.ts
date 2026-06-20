'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi, type LoginPayload, type RegisterPayload } from '@/lib/api/auth'
import { useAuthStore } from '@/store/auth'
import { toast } from '@/store/toast'

// ─── useLogin ─────────────────────────────────────────────────────────────────

export function useLogin() {
  const { setAuth, redirectPath } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),

    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)

      toast.success(
        `Welcome back, ${data.user.firstName}!`,
        'You have been signed in successfully.'
      )

      // Role-based redirect
      router.push(redirectPath())
    },

    onError: (error: { message?: string; status?: number }) => {
      const message =
        error.status === 401
          ? 'Incorrect email or password. Please try again.'
          : error.status === 429
          ? 'Too many attempts. Please wait a moment and try again.'
          : error.message ?? 'Something went wrong. Please try again.'

      toast.error('Sign in failed', message)
    },
  })
}

// ─── useRegister ──────────────────────────────────────────────────────────────

export function useRegister() {
  const { setAuth, redirectPath } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),

    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)

      toast.success(
        'Account created!',
        `Welcome to ShopFresherz, ${data.user.firstName}!`
      )

      router.push(redirectPath())
    },

    onError: (error: { message?: string; status?: number }) => {
      const message =
        error.status === 409
          ? 'An account with this email already exists. Try signing in.'
          : error.message ?? 'Could not create account. Please try again.'

      toast.error('Sign up failed', message)
    },
  })
}

// ─── useLogout ────────────────────────────────────────────────────────────────

export function useLogout() {
  const { accessToken, logout } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: () =>
      accessToken ? authApi.logout(accessToken) : Promise.resolve(),

    onSettled: () => {
      // Always clear local state even if the API call fails
      logout()
      toast.info('Signed out', 'See you next time!')
      router.push('/auth/login')
    },
  })
}

export function useGoogleAuth() {
  const { setAuth, redirectPath } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (idToken: string) => authApi.googleLogin({ idToken }),

    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)

      toast.success(
        `Welcome, ${data.user.firstName}!`,
        'You have been signed in successfully.'
      )

      router.push(redirectPath())
    },

    onError: (error: { message?: string; status?: number }) => {
      const message =
        error.status === 401
          ? 'Google sign-in failed. Please try again.'
          : error.message ?? 'Something went wrong. Please try again.'

      toast.error('Google sign in failed', message)
    },
  })
}