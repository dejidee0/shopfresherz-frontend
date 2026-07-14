'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  FiSearch, FiShoppingCart, FiHeart, FiUser, FiChevronDown,
  FiChevronRight, FiHeadphones, FiHelpCircle, FiMapPin,
  FiMenu, FiX, FiHome, FiGrid,
} from 'react-icons/fi'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { productsApi } from '@/lib/api/products'
import { cn, formatPrice } from '@/lib/utils/format'
import { MegaMenu } from './MegaMenu'
import type { Product } from '@/lib/types/product'
import { PageSpinner } from '../ui/Spinner'

export function Navbar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{
    products: Product[]
    categories: { id: number; name: string; slug: string }[]
  } | null>(null)
  const [allCategories, setAllCategories] = useState<{ id: number; name: string; slug: string }[]>([])
  const [isMegaOpen, setIsMegaOpen] = useState(false)
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isMobileCatsOpen, setIsMobileCatsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalItems = useCartStore((s) => s.totalItems())
  const openCart = useCartStore((s) => s.openCart)
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await productsApi.getCategories()
        setAllCategories(categories.map(c => ({ id: c.id, name: c.name, slug: c.slug })))
      } catch {
        // silent
      }
    }
    fetchCategories()
  }, [])

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
        const instantData = await productsApi.instantSearch(query)
        const filteredCategories = allCategories
          .filter(cat => cat.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 3)
        setSuggestions({ products: instantData.products, categories: filteredCategories })
        setIsSuggestionsOpen(true)
      } catch {
        // silent
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, allCategories])

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (
        searchRef.current && !searchRef.current.contains(target) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(target)
      ) {
        setIsSuggestionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (query.trim()) {
      setIsSuggestionsOpen(false)
      setIsMobileSearchOpen(false)
      setIsMobileMenuOpen(false)
      router.push(`/store/search?q=${encodeURIComponent(query.trim())}`)
    }
    setIsLoading(false)
  }, [query, router])

  function closeMenu() {
    setIsMobileMenuOpen(false)
    setIsMobileCatsOpen(false)
  }

  const navCategories = allCategories.slice(0, 5)

  const SuggestionsDropdown = () =>
    isSuggestionsOpen && suggestions ? (
      <div className="absolute top-full left-0 right-0 bg-[#242436] shadow-2xl rounded-b-[12px] border border-t-0 border-white/[0.08] z-50 overflow-hidden">
        {suggestions.categories.length > 0 && (
          <div className="px-3 py-2 border-b border-white/[0.06]">
            <p className="text-[10px] font-bold uppercase text-[#888888] mb-1 tracking-wide">
              Categories
            </p>
            {suggestions.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/store/category/${cat.slug}`}
                onClick={() => setIsSuggestionsOpen(false)}
                className="flex items-center gap-2 px-1 py-1.5 text-sm text-white hover:text-[#F97316] transition-colors"
              >
                <FiSearch size={12} className="text-[#888888]" />
                {cat.name}
              </Link>
            ))}
          </div>
        )}
        {suggestions.products.length > 0 && (
          <div className="p-3">
            <p className="text-[10px] font-bold uppercase text-[#888888] mb-2 tracking-wide">
              Products
            </p>
            {suggestions.products.map((product) => (
              <Link
                key={product.id}
                href={`/store/product/${product.slug}`}
                onClick={() => setIsSuggestionsOpen(false)}
                className="flex items-center gap-3 p-1.5 rounded-[8px] hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-10 h-10 bg-[#1F1F1F] rounded-[8px] shrink-0 overflow-hidden">
                  <Image
                    src={product.imageUrls?.[0] ?? '/images/device-placeholder.jpg'}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">{product.name}</p>
                  <p className="text-sm font-bold text-[#F97316]">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {suggestions.products.length === 0 && suggestions.categories.length === 0 && (
          <div className="p-4 text-center text-sm text-[#666666]">
            No results for &quot;{query}&quot;
          </div>
        )}
      </div>
    ) : null

  return (
    <div className="sticky top-0 z-30 w-full bg-[#1A1A2E]">
      <header className="bg-[#1A1A2E] border-b border-white/[0.06]">
        <div className="px-4 md:px-8 py-3.5 flex items-center gap-4 lg:gap-6">
          <Link href="/store" className="shrink-0 flex items-center gap-2.5">
            <Image
              src="/icons/logo-mark.png"
              alt="ShopFresherz"
              width={38}
              height={38}
              style={{ borderRadius: '10px', objectFit: 'contain' }}
            />
            <span className="flex flex-col leading-none">
              <span className="text-[17px] font-bold text-white tracking-[-0.3px]">ShopFresherz</span>
              <span className="mt-1 text-[9px] text-[#555555] uppercase tracking-[2px]">
                Gadget Store
              </span>
            </span>
          </Link>

          <div ref={searchRef} className="hidden md:flex flex-1 relative max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <button
                  type="submit"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555555] hover:text-[#F97316] transition-colors"
                  aria-label="Search"
                >
                  <FiSearch size={16} />
                </button>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search phones, laptops, gaming..."
                  className="sf-glass w-full rounded-[12px] py-[11px] pl-11 pr-4 text-[13px] text-white outline-none placeholder:text-[#444444] transition-all focus:border-[rgba(249,115,22,0.5)] focus:shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                  aria-label="Search products"
                  aria-autocomplete="list"
                  aria-expanded={isSuggestionsOpen}
                />
              </div>
            </form>
            <SuggestionsDropdown />
          </div>

          <div className="flex items-center gap-5 shrink-0 ml-auto md:ml-0">
            <button
              onClick={() => setIsMobileSearchOpen((v) => !v)}
              className="md:hidden text-white hover:text-[#F97316] transition-colors"
              aria-label="Search"
            >
              <FiSearch size={22} />
            </button>

            <button
              onClick={openCart}
              className="relative text-white hover:text-[#F97316] transition-colors"
              aria-label={`Cart, ${mounted ? totalItems : 0} items`}
            >
              <FiShoppingCart size={22} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#F97316] text-white text-[9px] font-bold flex items-center justify-center leading-none shadow-[0_2px_8px_rgba(249,115,22,0.5)]">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            <Link href="/store/wishlist" className="hidden sm:block text-[#666666] hover:text-white transition-colors" aria-label="Wishlist">
              <FiHeart size={22} />
            </Link>

            <Link
              href={isAuthenticated ? '/account' : '/auth/login'}
              className="hidden sm:block text-[#666666] hover:text-white transition-colors"
              aria-label={isAuthenticated ? `Account: ${user?.firstName}` : 'Sign in'}
            >
              <FiUser size={22} />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-white hover:text-[#F97316] transition-colors"
              aria-label="Open menu"
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>

        {isMobileSearchOpen && (
          <div ref={mobileSearchRef} className="md:hidden bg-[#1A1A2E] px-4 pb-3 relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <button
                  type="submit"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]"
                  aria-label="Search"
                >
                  <FiSearch size={16} />
                </button>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for anything..."
                  autoFocus
                  className="sf-glass w-full rounded-[12px] py-2.5 pl-10 pr-3.5 text-sm text-white outline-none placeholder:text-[13px] placeholder:text-[#444444]"
                  aria-label="Search products"
                />
              </div>
            </form>
            <SuggestionsDropdown />
          </div>
        )}
      </header>

      <nav className="hidden md:block bg-[rgba(36,36,54,0.95)] backdrop-blur-xl border-b border-white/[0.05] relative">
        <div className="px-8 py-2.5 flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setIsMegaOpen((v) => !v)}
              className="flex items-center gap-2 rounded-[8px] bg-linear-to-br from-[#F97316] to-[#EA580C] text-white px-4 py-2.5 text-[13px] font-semibold shadow-[0_4px_12px_rgba(249,115,22,0.3)] transition-transform hover:scale-[1.02]"
              aria-expanded={isMegaOpen}
              aria-haspopup="true"
            >
              <FiGrid size={14} />
              <span>All Categories</span>
              <FiChevronDown size={14} className={cn('transition-transform duration-200', isMegaOpen && 'rotate-180')} />
            </button>
            <MegaMenu isOpen={isMegaOpen} onClose={() => setIsMegaOpen(false)} />
          </div>

          <div className="flex items-center gap-6 text-[13px] text-[#777777]">
            {navCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/store/category/${cat.slug}`}
                className="hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/store/category/all" className="relative pl-3 text-[#F97316] font-semibold transition-colors before:absolute before:left-0 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-[#F97316] before:animate-pulse">
              Flash Sale
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-4 text-[13px] text-[#666666]">
            <Link href="/account/orders" className="hover:text-white transition-colors">
              Track Order
            </Link>
            <Link href="/store/support" className="hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 z-50 w-72 bg-[#242436] shadow-2xl md:hidden flex flex-col border-l border-white/[0.08]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <Link href="/store" onClick={closeMenu} className="flex items-center gap-2.5">
                <Image
                  src="/icons/logo-mark.png"
                  alt="ShopFresherz"
                  width={32}
                  height={32}
                  style={{ borderRadius: '8px', objectFit: 'contain' }}
                />
                <span className="flex flex-col leading-none">
                  <span className="text-sm font-bold text-white">ShopFresherz</span>
                  <span className="mt-1 text-[9px] text-[#555555] uppercase tracking-[1.5px]">
                    Gadget Store
                  </span>
                </span>
              </Link>
              <button onClick={closeMenu} className="text-[#777777] hover:text-white transition-colors" aria-label="Close menu">
                <FiX size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.05]">
                <div className="w-9 h-9 rounded-[8px] bg-[rgba(249,115,22,0.12)] flex items-center justify-center">
                  <FiUser size={18} className="text-[#F97316]" />
                </div>
                {isAuthenticated ? (
                  <div>
                    <p className="text-sm font-medium text-white">{user?.firstName}</p>
                    <Link href="/account" onClick={closeMenu} className="text-xs text-[#F97316]">
                      View Account →
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Link href="/auth/login" onClick={closeMenu} className="text-sm font-medium text-white hover:text-[#F97316] transition-colors">
                      Sign In
                    </Link>
                    <p className="text-xs text-[#888888]">
                      or{' '}
                      <Link href="/auth/register" onClick={closeMenu} className="text-[#F97316]">
                        Create account
                      </Link>
                    </p>
                  </div>
                )}
                <Link href="/account/wishlist" onClick={closeMenu} className="ml-auto text-[#444444] hover:text-[#F97316] transition-colors" aria-label="Wishlist">
                  <FiHeart size={20} />
                </Link>
              </div>

              <nav className="py-2 border-b border-white/[0.05]">
                {[
                  { id: 1, href: '/store',          icon: FiHome,       label: 'Home'             },
                  { id: 2, href: '/store/support',   icon: FiHeadphones, label: 'Customer Support' },
                  { id: 3, href: '/store/need-help', icon: FiHelpCircle, label: 'Need Help'        },
                  { id: 4, href: '/account/orders', icon: FiMapPin,     label: 'Track Order'      },
                ].map(({ id, href, icon: Icon, label }) => (
                  <Link
                    key={id}
                    href={href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-[#A0A0A0] hover:bg-white/[0.04] hover:text-white transition-colors"
                  >
                    <Icon size={16} className="text-[#888888]" />
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="py-2">
                <button
                  onClick={() => setIsMobileCatsOpen((v) => !v)}
                  className="flex items-center justify-between w-full px-5 py-3 text-sm font-medium text-white hover:bg-white/[0.04] hover:text-[#F97316] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <FiGrid size={16} className="text-[#888888]" />
                    All Categories
                  </span>
                  <FiChevronRight
                    size={15}
                    className={cn('text-[#888888] transition-transform duration-200', isMobileCatsOpen && 'rotate-90')}
                  />
                </button>

                {isMobileCatsOpen && (
                  <div className="bg-[#242436] border-t border-white/[0.05]">
                    <Link
                      href="/store/category/all"
                      onClick={closeMenu}
                      className="flex items-center gap-2 px-8 py-2.5 text-sm text-[#F97316] font-medium hover:bg-[#FFF0E6] transition-colors"
                    >
                      All Products
                    </Link>

                    {allCategories.length === 0 ? (
                      <p className="px-8 py-3 text-xs text-[#888888]">Loading…</p>
                    ) : (
                      allCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/store/category/${cat.slug}`}
                          onClick={closeMenu}
                          className="flex items-center gap-2 px-8 py-2.5 text-sm text-[#A0A0A0] hover:bg-white/[0.04] hover:text-[#F97316] transition-colors"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#AAAAAA] shrink-0" />
                          {cat.name}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-white/[0.06] p-4">
              <button
                onClick={() => { openCart(); closeMenu() }}
                className="w-full flex items-center justify-center gap-2 bg-[#F97316] text-white text-sm font-medium py-2.5 rounded-[8px] hover:bg-[#EA580C] transition-colors"
              >
                <FiShoppingCart size={16} />
                View Cart
                {mounted && totalItems > 0 && (
                  <span className="bg-white text-[#F97316] text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {isLoading && <PageSpinner label="Searching…" />}
    </div>
  )
}
