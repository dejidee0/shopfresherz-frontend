'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiChevronDown,
  FiHeadphones,
  FiHelpCircle,
  FiMapPin,
} from 'react-icons/fi'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { productsApi } from '@/lib/api/products'
import { cn, formatPrice } from '@/lib/utils/format'
import { MegaMenu } from './MegaMenu'
import type { Product } from '@/lib/types/product'

export function Navbar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{
    products: Product[]
    categories: { id: number; name: string; slug: string }[]
  } | null>(null)
  const [isMegaOpen, setIsMegaOpen] = useState(false)
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalItems = useCartStore((s) => s.totalItems())
  const openCart = useCartStore((s) => s.openCart)
  const { isAuthenticated, user } = useAuthStore()

  // Debounced instant search
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions(null)
      setIsSuggestionsOpen(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await productsApi.instantSearch(query)
        setSuggestions(data)
        setIsSuggestionsOpen(true)
      } catch {
        // silent — search dropdown is non-critical
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSuggestionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (query.trim()) {
        setIsSuggestionsOpen(false)
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    },
    [query, router]
  )

  return (
    <div className="sticky top-0 z-30 w-full shadow-sm">
      {/* ── Main orange header ── */}
      <header className="bg-[#F5820A] w-full">
        <div className="max-w-content mx-auto px-10 h-18 flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/icons/shopfresherz_logo_white_transparent.svg"
              alt="ShopFresherz"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Search bar */}
          <div ref={searchRef} className="flex-1 relative">
            <form onSubmit={handleSearch}>
              <div className="flex">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for anything..."
                  className="flex-1 h-11 px-4 text-sm text-[#111111] bg-white border-none outline-none rounded-l-md placeholder:text-[#9CA3AF]"
                  aria-label="Search products"
                  aria-autocomplete="list"
                  aria-expanded={isSuggestionsOpen}
                />
                <button
                  type="submit"
                  className="h-11 px-4 bg-white border-l border-[#E5E7EB] rounded-r-md text-[#6B7280] hover:text-[#F5820A] transition-colors"
                  aria-label="Search"
                >
                  <FiSearch size={18} />
                </button>
              </div>
            </form>

            {/* Suggestions dropdown */}
            {isSuggestionsOpen && suggestions && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-lg border border-t-0 border-[#E5E7EB] z-50 overflow-hidden">
                {suggestions.categories.length > 0 && (
                  <div className="px-3 py-2 border-b border-[#F5F5F5]">
                    <p className="text-[10px] font-bold uppercase text-[#6B7280] mb-1 tracking-wide">
                      Categories
                    </p>
                    {suggestions.categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={() => {
                          setQuery(cat.name)
                          setIsSuggestionsOpen(false)
                        }}
                        className="flex items-center gap-2 px-1 py-1.5 text-sm text-[#111111] hover:text-[#F5820A] transition-colors"
                      >
                        <FiSearch size={12} className="text-[#6B7280]" />
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}

                {suggestions.products.length > 0 && (
                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase text-[#6B7280] mb-2 tracking-wide">
                      Products
                    </p>
                    {suggestions.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => setIsSuggestionsOpen(false)}
                        className="flex items-center gap-3 p-1.5 rounded hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded shrink-0 overflow-hidden">
                          <Image
                            src={product.images[0]?.thumb ?? '/images/placeholder.png'}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#111111] truncate">{product.name}</p>
                          <p className="text-sm font-bold text-[#F5820A]">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {suggestions.products.length === 0 && suggestions.categories.length === 0 && (
                  <div className="p-4 text-center text-sm text-[#6B7280]">
                    No results for &quot;{query}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Cart */}
            <button
              onClick={openCart}
              className="relative text-white hover:text-white/80 transition-colors"
              aria-label={`Cart, ${totalItems} items`}
            >
              <FiShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#0D0D0D] text-white text-[10px] font-bold w-4.5 min-w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none px-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="text-white hover:text-white/80 transition-colors"
              aria-label="Wishlist"
            >
              <FiHeart size={22} />
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <Link
                href="/account"
                className="text-white hover:text-white/80 transition-colors"
                aria-label={`Account: ${user?.firstName}`}
              >
                <FiUser size={22} />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="text-white hover:text-white/80 transition-colors"
                aria-label="Sign in"
              >
                <FiUser size={22} />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── White sub-nav ── */}
      <nav className="bg-white border-b border-[#E5E7EB] relative">
        <div className="max-w-content mx-auto px-10 h-11 flex items-center gap-6">
          {/* All Category dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setIsMegaOpen((v) => !v)}
              className={cn(
                'flex items-center gap-2 h-11 px-4 text-sm font-semibold transition-colors',
                isMegaOpen
                  ? 'bg-[#F5820A] text-white'
                  : 'bg-[#F5820A] text-white hover:bg-[#E06B00]'
              )}
              aria-expanded={isMegaOpen}
              aria-haspopup="true"
            >
              <span>All Category</span>
              <FiChevronDown
                size={14}
                className={cn('transition-transform duration-200', isMegaOpen && 'rotate-180')}
              />
            </button>

            <MegaMenu isOpen={isMegaOpen} onClose={() => setIsMegaOpen(false)} />
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-5 text-sm text-[#111111]">
            <Link
              href="/support"
              className="flex items-center gap-1.5 hover:text-[#F5820A] transition-colors"
            >
              <FiHeadphones size={15} />
              Customer Support
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-1.5 hover:text-[#F5820A] transition-colors"
            >
              <FiHelpCircle size={15} />
              Need Help
            </Link>
          </div>

          {/* Track order — right-aligned */}
          <div className="ml-auto">
            <Link
              href="/account/orders"
              className="flex items-center gap-1.5 text-sm text-[#111111] hover:text-[#F5820A] transition-colors"
            >
              <FiMapPin size={15} />
              Track Order
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}