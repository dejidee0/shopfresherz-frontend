// 'use client'

// import { useState, useRef, useEffect, useCallback } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import {
//   FiSearch,
//   FiShoppingCart,
//   FiHeart,
//   FiUser,
//   FiChevronDown,
//   FiHeadphones,
//   FiHelpCircle,
//   FiMapPin,
// } from 'react-icons/fi'
// import { useCartStore } from '@/store/cart'
// import { useAuthStore } from '@/store/auth'
// import { productsApi } from '@/lib/api/products'
// import { cn, formatPrice } from '@/lib/utils/format'
// import { MegaMenu } from './MegaMenu'
// import type { Product } from '@/lib/types/product'

// export function Navbar() {
//   const router = useRouter()
//   const [query, setQuery] = useState('')
//   const [suggestions, setSuggestions] = useState<{
//     products: Product[]
//     categories: { id: number; name: string; slug: string }[]
//   } | null>(null)
//   const [isMegaOpen, setIsMegaOpen] = useState(false)
//   const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
//   const searchRef = useRef<HTMLDivElement>(null)
//   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

//   const totalItems = useCartStore((s) => s.totalItems())
//   const openCart = useCartStore((s) => s.openCart)
//   const { isAuthenticated, user } = useAuthStore()

//   // Debounced instant search
//   useEffect(() => {
//     if (query.length < 2) {
//       setSuggestions(null)
//       setIsSuggestionsOpen(false)
//       return
//     }

//     if (debounceRef.current) clearTimeout(debounceRef.current)
//     debounceRef.current = setTimeout(async () => {
//       try {
//         const data = await productsApi.instantSearch(query)
//         setSuggestions(data)
//         setIsSuggestionsOpen(true)
//       } catch {
//         // silent — search dropdown is non-critical
//       }
//     }, 300)

//     return () => {
//       if (debounceRef.current) clearTimeout(debounceRef.current)
//     }
//   }, [query])

//   // Close suggestions on outside click
//   useEffect(() => {
//     function handleClick(e: MouseEvent) {
//       if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
//         setIsSuggestionsOpen(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClick)
//     return () => document.removeEventListener('mousedown', handleClick)
//   }, [])

//   const handleSearch = useCallback(
//     (e: React.FormEvent) => {
//       e.preventDefault()
//       if (query.trim()) {
//         setIsSuggestionsOpen(false)
//         router.push(`/search?q=${encodeURIComponent(query.trim())}`)
//       }
//     },
//     [query, router]
//   )

//   return (
//     <div className="sticky top-0 z-30 w-full shadow-sm">
//       {/* ── Main orange header ── */}
//       <header className="bg-[#F5820A] w-full">
//         <div className="max-w-content mx-auto px-10 h-18 flex items-center gap-6">
//           {/* Logo */}
//           <Link href="/" className="shrink-0">
//             <Image
//               src="/icons/shopfresherz_logo_white_transparent.svg"
//               alt="ShopFresherz"
//               width={160}
//               height={40}
//               className="h-10 w-auto"
//               priority
//             />
//           </Link>

//           {/* Search bar */}
//           <div ref={searchRef} className="flex-1 relative">
//             <form onSubmit={handleSearch}>
//               <div className="flex">
//                 <input
//                   type="text"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="Search for anything..."
//                   className="flex-1 h-11 px-4 text-sm text-[#111111] bg-white border-none outline-none rounded-l-md placeholder:text-[#9CA3AF]"
//                   aria-label="Search products"
//                   aria-autocomplete="list"
//                   aria-expanded={isSuggestionsOpen}
//                 />
//                 <button
//                   type="submit"
//                   className="h-11 px-4 bg-white border-l border-[#E5E7EB] rounded-r-md text-[#6B7280] hover:text-[#F5820A] transition-colors"
//                   aria-label="Search"
//                 >
//                   <FiSearch size={18} />
//                 </button>
//               </div>
//             </form>

//             {/* Suggestions dropdown */}
//             {isSuggestionsOpen && suggestions && (
//               <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-lg border border-t-0 border-[#E5E7EB] z-50 overflow-hidden">
//                 {suggestions.categories.length > 0 && (
//                   <div className="px-3 py-2 border-b border-[#F5F5F5]">
//                     <p className="text-[10px] font-bold uppercase text-[#6B7280] mb-1 tracking-wide">
//                       Categories
//                     </p>
//                     {suggestions.categories.map((cat) => (
//                       <Link
//                         key={cat.id}
//                         href={`/category/${cat.slug}`}
//                         onClick={() => {
//                           setQuery(cat.name)
//                           setIsSuggestionsOpen(false)
//                         }}
//                         className="flex items-center gap-2 px-1 py-1.5 text-sm text-[#111111] hover:text-[#F5820A] transition-colors"
//                       >
//                         <FiSearch size={12} className="text-[#6B7280]" />
//                         {cat.name}
//                       </Link>
//                     ))}
//                   </div>
//                 )}

//                 {suggestions.products.length > 0 && (
//                   <div className="p-3">
//                     <p className="text-[10px] font-bold uppercase text-[#6B7280] mb-2 tracking-wide">
//                       Products
//                     </p>
//                     {suggestions.products.map((product) => (
//                       <Link
//                         key={product.id}
//                         href={`/product/${product.slug}`}
//                         onClick={() => setIsSuggestionsOpen(false)}
//                         className="flex items-center gap-3 p-1.5 rounded hover:bg-gray-50 transition-colors"
//                       >
//                         <div className="w-10 h-10 bg-gray-100 rounded shrink-0 overflow-hidden">
//                           <Image
//                             src={product.images[0]?.thumb ?? '/images/Rbag.png'}
//                             alt={product.name}
//                             width={40}
//                             height={40}
//                             className="w-full h-full object-contain"
//                           />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-xs text-[#111111] truncate">{product.name}</p>
//                           <p className="text-sm font-bold text-[#F5820A]">
//                             {formatPrice(product.price)}
//                           </p>
//                         </div>
//                       </Link>
//                     ))}
//                   </div>
//                 )}

//                 {suggestions.products.length === 0 && suggestions.categories.length === 0 && (
//                   <div className="p-4 text-center text-sm text-[#6B7280]">
//                     No results for &quot;{query}&quot;
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Right icons */}
//           <div className="flex items-center gap-4 shrink-0">
//             {/* Cart */}
//             <button
//               onClick={openCart}
//               className="relative text-white hover:text-white/80 transition-colors"
//               aria-label={`Cart, ${totalItems} items`}
//             >
//               <FiShoppingCart size={22} />
//               {totalItems > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-[#0D0D0D] text-white text-[10px] font-bold w-4.5 min-w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none px-1">
//                   {totalItems > 99 ? '99+' : totalItems}
//                 </span>
//               )}
//             </button>

//             {/* Wishlist */}
//             <Link
//               href="/account/wishlist"
//               className="text-white hover:text-white/80 transition-colors"
//               aria-label="Wishlist"
//             >
//               <FiHeart size={22} />
//             </Link>

//             {/* Auth */}
//             {isAuthenticated ? (
//               <Link
//                 href="/account"
//                 className="text-white hover:text-white/80 transition-colors"
//                 aria-label={`Account: ${user?.firstName}`}
//               >
//                 <FiUser size={22} />
//               </Link>
//             ) : (
//               <Link
//                 href="/auth/login"
//                 className="text-white hover:text-white/80 transition-colors"
//                 aria-label="Sign in"
//               >
//                 <FiUser size={22} />
//               </Link>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* ── White sub-nav ── */}
//       <nav className="bg-white border-b border-[#E5E7EB] relative">
//         <div className="max-w-content mx-auto px-10 h-11 flex items-center gap-6">
//           {/* All Category dropdown trigger */}
//           <div className="relative">
//             <button
//               onClick={() => setIsMegaOpen((v) => !v)}
//               className={cn(
//                 'flex items-center gap-2 h-11 px-4 text-sm font-semibold transition-colors',
//                 isMegaOpen
//                   ? 'bg-[#F5820A] text-white'
//                   : 'bg-[#F5820A] text-white hover:bg-[#E06B00]'
//               )}
//               aria-expanded={isMegaOpen}
//               aria-haspopup="true"
//             >
//               <span>All Category</span>
//               <FiChevronDown
//                 size={14}
//                 className={cn('transition-transform duration-200', isMegaOpen && 'rotate-180')}
//               />
//             </button>

//             <MegaMenu isOpen={isMegaOpen} onClose={() => setIsMegaOpen(false)} />
//           </div>

//           {/* Nav links */}
//           <div className="flex items-center gap-5 text-sm text-[#111111]">
//             <Link
//               href="/support"
//               className="flex items-center gap-1.5 hover:text-[#F5820A] transition-colors"
//             >
//               <FiHeadphones size={15} />
//               Customer Support
//             </Link>
//             <Link
//               href="/help"
//               className="flex items-center gap-1.5 hover:text-[#F5820A] transition-colors"
//             >
//               <FiHelpCircle size={15} />
//               Need Help
//             </Link>
//           </div>

//           {/* Track order — right-aligned */}
//           <div className="ml-auto">
//             <Link
//               href="/account/orders"
//               className="flex items-center gap-1.5 text-sm text-[#111111] hover:text-[#F5820A] transition-colors"
//             >
//               <FiMapPin size={15} />
//               Track Order
//             </Link>
//           </div>
//         </div>
//       </nav>
//     </div>
//   )
// }


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
  FiMenu,
  FiX,
  FiHome,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
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
        // silent
      }
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (query.trim()) {
        setIsSuggestionsOpen(false)
        setIsMobileSearchOpen(false)
        setIsMobileMenuOpen(false)
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    },
    [query, router]
  )

  // Shared suggestions dropdown markup
  const SuggestionsDropdown = () =>
    isSuggestionsOpen && suggestions ? (
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
                onClick={() => { setQuery(cat.name); setIsSuggestionsOpen(false) }}
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
                    src={product.images[0]?.thumb ?? '/images/Rbag.png'}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#111111] truncate">{product.name}</p>
                  <p className="text-sm font-bold text-[#F5820A]">{formatPrice(product.price)}</p>
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
    ) : null

  return (
    <div className="sticky top-0 z-30 w-full shadow-sm">

      {/* ══════════════════════════════════════════
          DESKTOP header  (md and up)
      ══════════════════════════════════════════ */}
      <header className="bg-[#F5820A] w-full">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10 h-16 lg:h-18 flex items-center gap-3 lg:gap-6">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/icons/ShopFreshersV2LogoWhite.png"
              alt="ShopFresherz"
              width={160}
              height={40}
              className="h-8 lg:h-10 w-auto"
              priority
            />
          </Link>

          {/* Search bar — hidden on mobile, shown md+ */}
          <div ref={searchRef} className="hidden md:flex flex-1 relative">
            <form onSubmit={handleSearch} className="w-full">
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
            <SuggestionsDropdown />
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3 lg:gap-4 shrink-0 ml-auto md:ml-0">
            {/* Mobile search toggle */}
            <button
              onClick={() => setIsMobileSearchOpen((v) => !v)}
              className="md:hidden text-white hover:text-white/80 transition-colors"
              aria-label="Search"
            >
              <FiSearch size={21} />
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative text-white hover:text-white/80 transition-colors"
              aria-label={`Cart, ${totalItems} items`}
            >
              <FiShoppingCart size={21} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#0D0D0D] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none px-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Wishlist — hidden on smallest screens */}
            <Link
              href="/account/wishlist"
              className="hidden sm:block text-white hover:text-white/80 transition-colors"
              aria-label="Wishlist"
            >
              <FiHeart size={21} />
            </Link>

            {/* Auth */}
            <Link
              href={isAuthenticated ? '/account' : '/auth/login'}
              className="hidden sm:block text-white hover:text-white/80 transition-colors"
              aria-label={isAuthenticated ? `Account: ${user?.firstName}` : 'Sign in'}
            >
              <FiUser size={21} />
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-white hover:text-white/80 transition-colors"
              aria-label="Open menu"
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>

        {/* ── Mobile search bar (expands below header) ── */}
        {isMobileSearchOpen && (
          <div ref={mobileSearchRef} className="md:hidden bg-[#E06B00] px-4 pb-3 relative">
            <form onSubmit={handleSearch}>
              <div className="flex">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for anything..."
                  autoFocus
                  className="flex-1 h-10 px-4 text-sm text-[#111111] bg-white border-none outline-none rounded-l-md placeholder:text-[#9CA3AF]"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="h-10 px-4 bg-white border-l border-[#E5E7EB] rounded-r-md text-[#6B7280] hover:text-[#F5820A] transition-colors"
                  aria-label="Search"
                >
                  <FiSearch size={17} />
                </button>
              </div>
            </form>
            <SuggestionsDropdown />
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════
          Sub-nav  (hidden on mobile)
      ══════════════════════════════════════════ */}
      <nav className="hidden md:block bg-white border-b border-[#E5E7EB] relative">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10 h-11 flex items-center gap-6">
          {/* All Category */}
          <div className="relative">
            <button
              onClick={() => setIsMegaOpen((v) => !v)}
              className="flex items-center gap-2 h-11 px-4 text-sm font-semibold bg-[#F5820A] text-white hover:bg-[#E06B00] transition-colors"
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

          <div className="flex items-center gap-5 text-sm text-[#111111]">
            <Link href="/support" className="flex items-center gap-1.5 hover:text-[#F5820A] transition-colors">
              <FiHeadphones size={15} />
              Customer Support
            </Link>
            <Link href="/help" className="flex items-center gap-1.5 hover:text-[#F5820A] transition-colors">
              <FiHelpCircle size={15} />
              Need Help
            </Link>
          </div>

          <div className="ml-auto">
            <Link href="/account/orders" className="flex items-center gap-1.5 text-sm text-[#111111] hover:text-[#F5820A] transition-colors">
              <FiMapPin size={15} />
              Track Order
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          Mobile full-screen menu drawer
      ══════════════════════════════════════════ */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-2xl md:hidden flex flex-col">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#F5820A]">
              <Image
                src="/icons/shopfresherz_logo_white_transparent.svg"
                alt="ShopFresherz"
                width={120}
                height={30}
                className="h-7 w-auto"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-white/70 transition-colors"
                aria-label="Close menu"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto">

              {/* Auth row */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full bg-[#F5820A]/10 flex items-center justify-center">
                  <FiUser size={18} className="text-[#F5820A]" />
                </div>
                {isAuthenticated ? (
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{user?.firstName}</p>
                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xs text-[#F5820A]"
                    >
                      View Account →
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm font-semibold text-[#111111] hover:text-[#F5820A] transition-colors"
                    >
                      Sign In
                    </Link>
                    <p className="text-xs text-[#6B7280]">
                      or{' '}
                      <Link
                        href="/auth/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[#F5820A]"
                      >
                        Create account
                      </Link>
                    </p>
                  </div>
                )}
                <Link
                  href="/account/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="ml-auto text-[#6B7280] hover:text-[#F5820A] transition-colors"
                  aria-label="Wishlist"
                >
                  <FiHeart size={20} />
                </Link>
              </div>

              {/* Nav links */}
              <nav className="py-2">
                {[
                  { href: '/',               icon: FiHome,        label: 'Home'             },
                  { href: '/category/all',   icon: FiChevronDown, label: 'All Categories'   },
                  { href: '/support',        icon: FiHeadphones,  label: 'Customer Support' },
                  { href: '/help',           icon: FiHelpCircle,  label: 'Need Help'        },
                  { href: '/account/orders', icon: FiMapPin,      label: 'Track Order'      },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-[#111111] hover:bg-orange-50 hover:text-[#F5820A] transition-colors"
                  >
                    <Icon size={16} className="text-[#6B7280]" />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Drawer footer — cart CTA */}
            <div className="border-t border-gray-100 p-4">
              <button
                onClick={() => { openCart(); setIsMobileMenuOpen(false) }}
                className="w-full flex items-center justify-center gap-2 bg-[#F5820A] text-white text-sm font-semibold py-2.5 rounded hover:bg-[#E06B00] transition-colors"
              >
                <FiShoppingCart size={16} />
                View Cart
                {totalItems > 0 && (
                  <span className="bg-white text-[#F5820A] text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  )
}