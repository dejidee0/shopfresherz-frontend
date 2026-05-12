'use client'

import { useState, useMemo, useTransition } from 'react'
import { FiSearch, FiGrid, FiChevronDown, FiFilter, FiX } from 'react-icons/fi'
import { Breadcrumb } from '@/components/ui/BreadCrumbs'
import { Pagination } from '@/components/ui/Pagination'
import { ProductCard } from '@/features/product/components/ProductCard'
import { ShopSidebar } from '@/features/product/components/ShopSideBar'
import { ActiveFilters } from '@/features/product/components/ActiveFilters'
import type { ShopFilters } from '@/features/product/components/ShopSideBar'
import type { Product } from '@/lib/types/product'

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'best_selling' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Rated', value: 'best_rated' },
]

const DEFAULT_FILTERS: ShopFilters = {
  categorySlug: null,
  priceRange: [0, 80_000],
  brands: [],
  tags: [],
}

interface ShopClientProps {
  initialProducts: Product[]
  categoryName?: string
  categorySlug?: string
}

// This is the interactive client shell.
// The parent page.tsx handles the ISR data fetch and passes products down.
export function ShopClient({
  initialProducts,
  categoryName,
  categorySlug,
}: ShopClientProps) {
  const [isPending, startTransition] = useTransition()

  const [filters, setFilters] = useState<ShopFilters>({
    ...DEFAULT_FILTERS,
    categorySlug: categorySlug ?? null,
  })
  const [sort, setSort] = useState('best_selling')
  const [sortOpen, setSortOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [localSearch, setLocalSearch] = useState('')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

   const breadcrumbs = [
     { label: 'Shop', href: '/shop' },
     ...(categoryName ? [{ label: categoryName }] : []),
   ]

   // ── Derived filtered & sorted products ─────────────────────────────────────
   const { filteredProducts, filteredTotalCount } = useMemo(() => {
     let result = initialProducts

     // Search filter (name or description)
     if (localSearch.trim()) {
       const q = localSearch.toLowerCase().trim()
       result = result.filter(
         (p) =>
           p.name.toLowerCase().includes(q) ||
           p.description?.toLowerCase().includes(q)
       )
     }

     // Price range filter
     const [minPrice, maxPrice] = filters.priceRange
     result = result?.filter((p) => p.price >= minPrice && p.price <= maxPrice)

// Brand filter
      if (filters.brands.length > 0) {
        result = result.filter((p) => filters.brands.includes(p.brandName ?? p.brand?.name ?? ''))
      }

     // Tags filter
     if (filters.tags.length > 0 && result.length > 0) {
       result = result.filter((p) => p.tags && filters.tags.some((tag) => p.tags!.includes(tag)))
     }

// Sorting
      const sorted = [...result].sort((a, b) => {
        switch (sort) {
          case 'price_asc':
            return a.price - b.price
          case 'price_desc':
            return b.price - a.price
          case 'newest':
            return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
          case 'best_rated':
            return (b.averageRating ?? 0) - (a.averageRating ?? 0)
          case 'best_selling':
            return (b.soldCount ?? 0) - (a.soldCount ?? 0)
          case 'relevance':
          default:
            return 0
        }
      })

     return { filteredProducts: sorted, filteredTotalCount: sorted.length }
   }, [initialProducts, localSearch, filters, sort])

   const totalPages = Math.ceil(filteredTotalCount / 24)

  // ── Filter helpers ────────────────────────────────────────────────────────

  function handleFilterChange(next: ShopFilters) {
    setFilters(next)
    setPage(1)
    // TODO: sync to URL params for shareable filter links
  }

  function handleRemoveFilter(key: keyof ShopFilters, value?: string) {
    if (key === 'categorySlug') {
      setFilters((f) => ({ ...f, categorySlug: null }))
    } else if (key === 'brands' && value) {
      setFilters((f) => ({ ...f, brands: f.brands.filter((b) => b !== value) }))
    } else if (key === 'tags' && value) {
      setFilters((f) => ({ ...f, tags: f.tags.filter((t) => t !== value) }))
    }
    setPage(1)
  }

  function handleClearAll() {
    setFilters({ ...DEFAULT_FILTERS, categorySlug: categorySlug ?? null })
    setPage(1)
  }

   // ── Client-side filter/search (placeholder until API filtering is wired) ──
   // In production, these params get sent to productsApi.list() and the server
   // does the heavy lifting. For now, we filter the initial product set locally
   // so the UI is immediately interactive.

const activeSort = SORT_OPTIONS.find((o) => o.value === sort)

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10 py-4 sm:py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* Mobile filter button */}
      <div className="flex items-center justify-between mt-2 mb-3 sm:hidden">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center gap-2 h-9 px-4 border border-[#E5E7EB] rounded-btn text-sm text-[#111111] hover:border-[#F5820A] transition-colors bg-white"
        >
          <FiFilter size={15} />
          Filters
        </button>
      </div>

      <div className="flex gap-4 sm:gap-6 md:gap-8 mt-2">
        {/* ── Sidebar ── */}
        {/* Desktop sidebar */}
        <div className="hidden sm:block">
          <ShopSidebar filters={filters} onChange={handleFilterChange} />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 sm:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-[280px] max-w-[85vw] bg-white overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
                <h2 className="text-lg font-bold text-[#111111]">Filters</h2>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-[#6B7280] hover:text-[#111111]"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-4">
                <ShopSidebar filters={filters} onChange={handleFilterChange} />
              </div>
            </div>
          </div>
        )}

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Top bar: inline search + sort */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            {/* Inline search */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search for anything..."
                className="w-full h-9 sm:h-10 pl-3 sm:pl-4 pr-9 sm:pr-10 text-sm border border-[#E5E7EB] rounded-btn outline-none focus:border-[#F5820A] focus:ring-2 focus:ring-[#F5820A]/20 transition-all"
              />
              <FiSearch
                size={14}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
              />
            </div>

            {/* Sort dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-2 sm:px-3 border border-[#E5E7EB] rounded-btn text-xs sm:text-sm text-[#111111] hover:border-[#F5820A] transition-colors bg-white"
              >
                <span className="text-[#6B7280] text-[10px] sm:text-xs mr-0.5 sm:mr-1 hidden xs:inline">Sort by:</span>
                <span className="max-w-[80px] sm:max-w-none truncate">{activeSort?.label}</span>
                <FiChevronDown
                  size={11}
                  className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {sortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-card shadow-lg z-20 py-1 min-w-40 sm:min-w-45">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSort(opt.value); setSortOpen(false); setPage(1) }}
                        className={`w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-colors hover:bg-orange-50 hover:text-[#F5820A] ${
                          sort === opt.value ? 'text-[#F5820A] font-medium' : 'text-[#111111]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Active filter chips + result count */}
          <ActiveFilters
            filters={filters}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
            resultCount={filteredTotalCount}
            className="mb-3 sm:mb-4"
          />

          {/* Product grid */}
          {filteredProducts?.length === 0 ? (
            <EmptyState onClear={handleClearAll} />
          ) : (
            <div
              className={`grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 transition-opacity duration-300 ${
                isPending ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {filteredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-8 sm:mt-10"
            />
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-24 text-center px-4">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3 sm:mb-4">
        <FiGrid size={20} className="text-[#D1D5DB]" />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-[#111111] mb-1.5 sm:mb-2">No products found</h3>
      <p className="text-xs sm:text-sm text-[#6B7280] mb-4 sm:mb-6 max-w-xs">Try adjusting your filters or search terms.</p>
      <button
        onClick={onClear}
        className="h-9 sm:h-10 px-4 sm:px-6 bg-linear-to-r from-[#F5820A] to-[#E06B00] text-white font-semibold rounded-btn text-xs sm:text-sm hover:shadow-md transition-all"
      >
        Clear Filters
      </button>
    </div>
  )
}