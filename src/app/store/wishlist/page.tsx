'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiHeart, FiShoppingCart, FiTrash2, FiAlertCircle, FiLoader } from 'react-icons/fi'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { getFavorites, removeFromFavorites, type FavoriteProduct } from '@/lib/api/favorites'

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function formatPrice(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`
}

function getStockLabel(item: FavoriteProduct) {
  const qty = item.availableQty ?? item.stockQty ?? 0
  if (item.isInStock === false || qty === 0) return 'out-of-stock'
  if (qty <= 5) return 'low-stock'
  return 'in-stock'
}

/* ─── Skeleton card ──────────────────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-4 flex gap-4 animate-pulse">
      <div className="w-20 h-20 rounded-lg bg-[#1F1F1F] shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 bg-white/[0.08] rounded w-3/4" />
        <div className="h-3 bg-white/[0.08] rounded w-1/2" />
        <div className="h-3 bg-white/[0.08] rounded w-1/4" />
      </div>
    </div>
  )
}

/* ─── Wishlist item card ─────────────────────────────────────────────────── */

interface WishlistCardProps {
  item: FavoriteProduct
  onRemove: (productId: string) => void
  onAddToCart: (item: FavoriteProduct) => void
  isRemoving: boolean
}

function WishlistCard({ item, onRemove, onAddToCart, isRemoving }: WishlistCardProps) {
  const stockStatus = getStockLabel(item)
  const imageSrc = item.primaryImageUrl ?? item.imageUrls?.[0] ?? '/images/device-placeholder.jpg'
  const productId = item.productId ?? item.id

  return (
    <div
      className={`bg-[#141414] border border-white/[0.08] rounded-xl p-4 flex gap-4 transition-all duration-200
        ${isRemoving ? 'opacity-40 pointer-events-none scale-[0.98]' : 'hover:border-[#F97316] hover:shadow-[0_16px_34px_rgba(249,115,22,0.14)]'}`}
    >
      {/* Product image */}
      <Link href={`/store/product/${item.slug}`} className="shrink-0">
        <div className="w-20 h-20 rounded-lg bg-[#1F1F1F] overflow-hidden flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={item.name}
            width={80}
            height={80}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <Link
          href={`/store/product/${item.slug}`}
          className="text-sm font-semibold text-white line-clamp-2 hover:text-[#F97316] transition-colors"
        >
          {item.name}
        </Link>

        {item.brandName && (
          <p className="text-[11px] text-[#6B7280] uppercase tracking-wide">{item.brandName}</p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-[#F97316]">
            {formatPrice(item.price)}
          </span>
          {item.compareAtPrice && item.compareAtPrice > item.price && (
            <span className="text-xs text-[#9CA3AF] line-through">
              {formatPrice(item.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Stock badge */}
        <span
          className={`text-[11px] font-semibold w-fit px-2 py-0.5 rounded-full
            ${stockStatus === 'in-stock'
              ? 'bg-green-500/10 text-green-300'
              : stockStatus === 'low-stock'
              ? 'bg-yellow-500/10 text-yellow-300'
              : 'bg-red-500/10 text-red-300'}`}
        >
          {stockStatus === 'in-stock'
            ? 'In Stock'
            : stockStatus === 'low-stock'
            ? `Only ${item.availableQty ?? item.stockQty} left`
            : 'Out of Stock'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 shrink-0 items-end justify-between">
        {/* Remove */}
        <button
          onClick={() => onRemove(productId)}
          disabled={isRemoving}
          aria-label="Remove from wishlist"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444] hover:bg-red-500/10 transition-colors"
        >
          {isRemoving
            ? <FiLoader size={15} className="animate-spin" />
            : <FiTrash2 size={15} />}
        </button>

        {/* Add to cart */}
        <button
          onClick={() => onAddToCart(item)}
          disabled={stockStatus === 'out-of-stock'}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors
            ${stockStatus === 'out-of-stock'
              ? 'bg-[#252525] text-[#9CA3AF] cursor-not-allowed'
              : 'sf-btn-primary text-white'}`}
        >
          <FiShoppingCart size={13} />
          {stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function WishlistPage() {
  const router = useRouter()
  const { accessToken, isAuthenticated } = useAuthStore()
  const { addItem, openCart } = useCartStore()

  const [items, setItems] = useState<FavoriteProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())

  /* ── Redirect if not logged in ── */
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login')
    }
  }, [isAuthenticated, router])

  /* ── Fetch favorites ── */
  const loadFavorites = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      const data = await getFavorites(accessToken)
      setItems(data)
      console.log(`[Wishlist] ✅ Fetched ${data.length} favorite(s)`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load wishlist'
      setError(msg)
      console.error('[Wishlist] ❌ Failed to fetch favorites:', err)
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      loadFavorites()
    }
  }, [isAuthenticated, accessToken, loadFavorites])

  /* ── Remove handler ── */
  async function handleRemove(productId: string) {
    if (!accessToken) return
    setRemovingIds((prev) => new Set(prev).add(productId))
    try {
      await removeFromFavorites(productId, accessToken)
      setItems((prev) => prev.filter((i) => (i.productId ?? i.id) !== productId))
      console.log(`[Wishlist] ✅ Removed product ${productId} from favorites`)
    } catch (err) {
      console.error(`[Wishlist] ❌ Failed to remove product ${productId}:`, err)
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  /* ── Add to cart handler ── */
  function handleAddToCart(item: FavoriteProduct) {
    addItem({
      productId: item.productId ?? item.id,
      name: item.name,
      slug: item.slug,
      image: item.primaryImageUrl ?? item.imageUrls?.[0] ?? '',
      price: item.price,
      quantity: 1,
      stockQty: item.availableQty ?? item.stockQty ?? 99,
    })
    openCart()
    console.log(`[Wishlist] ✅ Added "${item.name}" to cart`)
  }

  /* ── Render ── */
  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FiHeart size={20} className="text-[#F97316]" />
            <h1 className="text-xl font-bold text-white">My Wishlist</h1>
            {!loading && items.length > 0 && (
              <span className="text-sm text-[#6B7280] font-medium">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </div>
          <Link
            href="/store"
            className="text-sm text-[#F97316] font-medium hover:underline"
          >
            Continue Shopping →
          </Link>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-[#141414] border border-red-500/20 rounded-xl p-6 flex flex-col items-center gap-3 text-center">
            <FiAlertCircle size={32} className="text-[#EF4444]" />
            <p className="text-sm font-semibold text-white">Could not load your wishlist</p>
            <p className="text-xs text-[#6B7280]">{error}</p>
            <button
              onClick={loadFavorites}
              className="mt-1 px-5 py-2 sf-btn-primary text-white text-sm font-bold rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-10 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F97316]/10 flex items-center justify-center">
              <FiHeart size={28} className="text-[#F97316]" />
            </div>
            <p className="text-base font-bold text-white">Your wishlist is empty</p>
            <p className="text-sm text-[#6B7280] max-w-xs">
              Browse our store and tap the heart icon on any product to save it here.
            </p>
            <Link
              href="/store"
              className="mt-2 px-6 py-2.5 sf-btn-primary text-white text-sm font-bold rounded-lg"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Wishlist items */}
        {!loading && !error && items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => {
              const productId = item.productId ?? item.id
              return (
                <WishlistCard
                  key={productId}
                  item={item}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                  isRemoving={removingIds.has(productId)}
                />
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
