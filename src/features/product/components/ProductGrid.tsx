'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/format'
import { ProductCard } from './ProductCard'
import type { Product } from '@/lib/types/product'

interface Tab {
  label: string
  key: string
}

interface ProductGridSectionProps {
  title: string
  products: Product[]
  tabs?: Tab[]
  seeAllHref?: string
  /** Number of columns on desktop: 4 (default) or 5 */
  cols?: 4 | 5
  onTabChange?: (key: string) => void
  isLoading?: boolean
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-card overflow-hidden animate-pulse">
      <div className="aspect-square bg-[#F5F5F5]" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-[#F5F5F5] rounded w-1/3" />
        <div className="h-4 bg-[#F5F5F5] rounded w-full" />
        <div className="h-4 bg-[#F5F5F5] rounded w-4/5" />
        <div className="h-5 bg-[#F5F5F5] rounded w-1/2" />
        <div className="h-9 bg-[#F5F5F5] rounded w-full" />
      </div>
    </div>
  )
}

export function ProductGridSection({
  title,
  products,
  tabs,
  seeAllHref,
  cols = 4,
  onTabChange,
  isLoading = false,
}: ProductGridSectionProps) {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.key ?? '')

  function handleTabClick(key: string) {
    setActiveTab(key)
    onTabChange?.(key)
  }

  const gridCols =
    cols === 5
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
      : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'

  return (
    <section className="py-8" aria-label={title}>
      <div className="max-w-content mx-auto px-10">

        {/* Header row */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Title with orange accent */}
            <div className="flex items-center gap-2">
              <div className="w-1 h-7 bg-[#F5820A] rounded-full shrink-0" />
              <h2 className="text-xl font-bold text-[#111111]">{title}</h2>
            </div>

            {/* Tabs */}
            {tabs && tabs.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 bg-[#F5F5F5] rounded-btn p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={cn(
                      'px-3 py-1 text-xs font-semibold rounded transition-all duration-200',
                      activeTab === tab.key
                        ? 'bg-[#F5820A] text-white shadow-sm'
                        : 'text-[#6B7280] hover:text-[#111111]'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* See all link */}
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="text-sm text-[#F5820A] font-medium hover:underline flex items-center gap-1 shrink-0"
            >
              Browse All Product →
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className={cn('grid gap-4', gridCols)}>
          {isLoading
            ? Array.from({ length: cols === 5 ? 10 : 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  )
}