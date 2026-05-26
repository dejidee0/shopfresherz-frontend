'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { addToFavorites } from '@/lib/api/favorites'

/**
 * Hook that wraps the add-to-favorites API call.
 *
 * - Reads the JWT token directly from the auth store (set on login).
 * - Redirects unauthenticated users to /auth/login.
 * - Tracks per-product loading and favorited state locally.
 * - Logs success/error to the console as requested.
 */
export function useAddToFavorites() {
  const { accessToken, isAuthenticated } = useAuthStore()
  const router = useRouter()

  // Track which product IDs are currently being added (loading)
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
  // Track which product IDs have been successfully added this session
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set())

  async function handleAddToFavorites(productId: string) {
    // Guard: user must be logged in
    if (!isAuthenticated || !accessToken) {
      console.warn('[Favorites] User not authenticated — redirecting to login')
      router.push('/auth/login')
      return
    }

    // Prevent duplicate requests for the same product
    if (loadingIds.has(productId)) return

    setLoadingIds((prev) => new Set(prev).add(productId))

    try {
      await addToFavorites(productId, accessToken)

      setFavoritedIds((prev) => new Set(prev).add(productId))
      console.log(`[Favorites] ✅ Product ${productId} added to favorites successfully`)
    } catch (error) {
      console.error(`[Favorites] ❌ Failed to add product ${productId} to favorites:`, error)
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  return {
    handleAddToFavorites,
    isLoading: (productId: string) => loadingIds.has(productId),
    isFavorited: (productId: string) => favoritedIds.has(productId),
  }
}
