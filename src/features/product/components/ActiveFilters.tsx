'use client'

import { FiX } from 'react-icons/fi'
import { cn } from '@/lib/utils/format'
import type { ShopFilters } from './ShopSideBar'

interface ActiveFiltersProps {
  filters: ShopFilters
  onRemove: (key: keyof ShopFilters, value?: string) => void
  onClearAll: () => void
  resultCount: number
  className?: string
}

export function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
  resultCount,
  className,
}: ActiveFiltersProps) {
  const hasAnyFilter =
    filters.categorySlug ||
    filters.brands.length > 0 ||
    filters.tags.length > 0

  return (
    <div className={cn('flex items-center justify-between gap-3 flex-wrap', className)}>
      {/* Left: chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {hasAnyFilter && (
          <span className="text-xs font-semibold text-[#6B7280] mr-1 shrink-0">
            Active Filters:
          </span>
        )}

        {filters.categorySlug && (
          <Chip
            label={filters.categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            onRemove={() => onRemove('categorySlug')}
          />
        )}

        {filters.brands.map((brand) => (
          <Chip
            key={brand}
            label={brand}
            onRemove={() => onRemove('brands', brand)}
          />
        ))}

        {filters.tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onRemove={() => onRemove('tags', tag)}
          />
        ))}

        {hasAnyFilter && (
          <button
            onClick={onClearAll}
            className="text-xs text-[#EF4444] hover:underline font-medium ml-1"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Right: result count */}
      <p className="text-xs text-[#6B7280] shrink-0">
        <span className="font-bold text-[#111111]">
          {resultCount.toLocaleString()}
        </span>{' '}
        Results found.
      </p>
    </div>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F5F5] border border-[#E5E7EB] rounded-full text-xs font-medium text-[#111111]">
      {label}
      <button
        onClick={onRemove}
        className="text-[#6B7280] hover:text-[#EF4444] transition-colors ml-0.5"
        aria-label={`Remove ${label} filter`}
      >
        <FiX size={11} />
      </button>
    </span>
  )
}