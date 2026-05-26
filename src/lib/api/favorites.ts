/**
 * Favorites / Wishlist API
 * POST   /favorites/{productId}  — add to favorites
 * GET    /favorites              — fetch all favorites
 * DELETE /favorites/{productId}  — remove from favorites
 *
 * All endpoints require a valid Bearer token from the logged-in user.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface FavoriteProduct {
  id: string
  productId: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number | null
  primaryImageUrl?: string | null
  imageUrls?: string[]
  brandName?: string
  categoryName?: string
  averageRating?: number
  reviewCount?: number
  stockQty?: number
  availableQty?: number
  isInStock?: boolean
}

/* ─── Add to favorites ───────────────────────────────────────────────────── */

/**
 * Add a product to the authenticated user's favorites list.
 */
export async function addToFavorites(productId: string, token: string): Promise<void> {
  const url = `${BASE_URL}/favorites/${productId}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'text/plain',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })

  if (!response.ok) {
    let message = response.statusText
    try {
      const data = await response.json()
      message = data?.message ?? message
    } catch {
      // ignore parse errors
    }
    throw new Error(`Failed to add to favorites: ${message} (${response.status})`)
  }
  // 204 No Content — nothing to return
}

/* ─── Get all favorites ──────────────────────────────────────────────────── */

/**
 * Fetch all favorite products for the authenticated user.
 */
export async function getFavorites(token: string): Promise<FavoriteProduct[]> {
  const url = `${BASE_URL}/favorites`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  })

  if (!response.ok) {
    let message = response.statusText
    try {
      const data = await response.json()
      message = data?.message ?? message
    } catch {
      // ignore parse errors
    }
    throw new Error(`Failed to fetch favorites: ${message} (${response.status})`)
  }

  // Some APIs return the array directly, others wrap it in { data: [...] }
  const body = await response.json()
  return Array.isArray(body) ? body : (body?.data ?? body?.items ?? [])
}

/* ─── Remove from favorites ──────────────────────────────────────────────── */

/**
 * Remove a product from the authenticated user's favorites list.
 */
export async function removeFromFavorites(productId: string, token: string): Promise<void> {
  const url = `${BASE_URL}/favorites/${productId}`

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  })

  if (!response.ok) {
    let message = response.statusText
    try {
      const data = await response.json()
      message = data?.message ?? message
    } catch {
      // ignore parse errors
    }
    throw new Error(`Failed to remove from favorites: ${message} (${response.status})`)
  }
  // 204 No Content — nothing to return
}
