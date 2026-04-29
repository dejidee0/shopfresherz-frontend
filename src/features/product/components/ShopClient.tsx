'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { FiSearch, FiGrid, FiList, FiChevronDown } from 'react-icons/fi'
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
  totalCount: number
  categoryName?: string
  categorySlug?: string
}

// This is the interactive client shell.
// The parent page.tsx handles the ISR data fetch and passes products down.
export function ShopClient({
  initialProducts,
  totalCount,
  categoryName,
  categorySlug,
}: ShopClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [filters, setFilters] = useState<ShopFilters>({
    ...DEFAULT_FILTERS,
    categorySlug: categorySlug ?? null,
  })
  const [sort, setSort] = useState('best_selling')
  const [sortOpen, setSortOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [localSearch, setLocalSearch] = useState('')

  const breadcrumbs = [
    { label: 'Shop', href: '/shop' },
    ...(categoryName ? [{ label: categoryName }] : []),
  ]

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

  const totalPages = Math.ceil(totalCount / 24)

  return (
    <div className="max-w-content mx-auto px-10 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      <div className="flex gap-8 mt-2">
        {/* ── Sidebar ── */}
        <ShopSidebar filters={filters} onChange={handleFilterChange} />

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Top bar: inline search + sort */}
          <div className="flex items-center gap-3 mb-4">
            {/* Inline search */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search for anything..."
                className="w-full h-10 pl-4 pr-10 text-sm border border-[#E5E7EB] rounded-btn outline-none focus:border-[#F5820A] focus:ring-2 focus:ring-[#F5820A]/20 transition-all"
              />
              <FiSearch
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
              />
            </div>

            {/* Sort dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-2 h-10 px-3 border border-[#E5E7EB] rounded-btn text-sm text-[#111111] hover:border-[#F5820A] transition-colors bg-white"
              >
                <span className="text-[#6B7280] text-xs mr-1">Sort by:</span>
                {activeSort?.label}
                <FiChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {sortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-card shadow-lg z-20 py-1 min-w-45">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSort(opt.value); setSortOpen(false); setPage(1) }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-orange-50 hover:text-[#F5820A] ${
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
            resultCount={totalCount}
            className="mb-4"
          />

          {/* Product grid */}
          {initialProducts.length === 0 ? (
            <EmptyState onClear={handleClearAll} />
          ) : (
            <div
              className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${
                isPending ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {initialProducts.map((product) => (
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
              className="mt-10"
            />
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
        <FiGrid size={24} className="text-[#D1D5DB]" />
      </div>
      <h3 className="text-base font-bold text-[#111111] mb-2">No products found</h3>
      <p className="text-sm text-[#6B7280] mb-6">Try adjusting your filters or search terms.</p>
      <button
        onClick={onClear}
        className="h-10 px-6 bg-linear-to-r from-[#F5820A] to-[#E06B00] text-white font-semibold rounded-btn text-sm hover:shadow-md transition-all"
      >
        Clear Filters
      </button>
    </div>
  )
}