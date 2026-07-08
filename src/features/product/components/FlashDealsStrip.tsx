'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { Countdown } from '@/components/ui/CountDown'
import { cn, formatPrice } from '@/lib/utils/format'
import type { FlashDeal } from '@/lib/types/product'

interface FlashDealsStripProps {
  deals: FlashDeal[]
  /** Shared end time — all deals in a session expire together */
  sessionEndTime: string
}

export function FlashDealsStrip({ deals, sessionEndTime }: FlashDealsStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    const scrollAmount = window.innerWidth < 640 ? 200 : 280
    scrollRef.current.scrollBy({ left: dir === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' })
  }

  if (!deals.length) return null

  return (
    <section className="w-full bg-[#FFFFFF] py-4 sm:py-6" aria-label="Flash deals">
      <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10">

        {/* Section header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Orange flame accent bar */}
              <div className="w-1 h-5 sm:h-7 bg-[#F97316] rounded-full" />
              <h2 className="text-[#111111] text-base sm:text-xl font-bold">FLASH DEALS</h2>
            </div>
            <Countdown endTime={sessionEndTime} variant="dark" />
          </div>

          <Link
            href="/deals"
            className="text-[10px] sm:text-sm text-[#F97316] font-medium hover:underline flex items-center gap-0.5 sm:gap-1"
          >
            Browse All <span className="hidden xs:inline">→</span>
          </Link>
        </div>

        {/* Scrollable deal cards */}
        <div className="relative">
          {/* Left arrow - hidden on mobile */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFFFFF] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-center justify-center text-[#111111] hover:bg-[#F97316] hover:text-white transition-colors hidden sm:flex"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={14} className="sm:size-16" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
          >
            {deals.map((deal) => (
              <FlashDealCard key={deal.id} deal={deal} />
            ))}
          </div>

          {/* Right arrow - hidden on mobile */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFFFFF] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-center justify-center text-[#111111] hover:bg-[#F97316] hover:text-white transition-colors hidden sm:flex"
            aria-label="Scroll right"
          >
            <FiChevronRight size={14} className="sm:size-16" />
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Individual deal card ─────────────────────────────────────────────────────

function FlashDealCard({ deal }: { deal: FlashDeal }) {
  const soldPercent = Math.min(100, Math.round((deal.soldQuantity / deal.maxQuantity) * 100))
  const thumb = deal.productImageUrl ?? '/images/device-placeholder.jpg'

  return (
    <Link
      href={`/store/product/${deal.productSlug}`}
      className="group shrink-0 w-40 sm:w-50 bg-[#FFFFFF] border border-black/[0.06] rounded-card overflow-hidden hover:border-[#F97316]/60 hover:shadow-[0_16px_34px_rgba(249,115,22,0.14)] transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden">
        {/* Discount badge */}
        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 z-10 bg-[#F97316] text-white text-[10px] sm:text-[11px] font-bold px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-badge">
          -{deal.discountPercent}%
        </div>

        <Image
          src={thumb}
          alt={deal.productName}
          fill
          sizes="200px"
          className="object-contain p-2 sm:p-3 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="p-2 sm:p-3">
        <p className="text-[10px] sm:text-xs text-[#111111] leading-snug line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-[#F97316] transition-colors">
          {deal.productName}
        </p>

        {/* Prices */}
        <div className="flex items-baseline gap-1 mb-1.5 sm:mb-2">
          <span className="text-xs sm:text-sm font-bold text-[#F97316]">{formatPrice(deal.salePrice)}</span>
          <span className="text-[10px] sm:text-[11px] text-[#6B7280] line-through">{formatPrice(deal.originalPrice)}</span>
        </div>

        {/* Stock progress bar */}
        <div>
          <div className="flex justify-between text-[9px] sm:text-[10px] text-[#6B7280] mb-0.5 sm:mb-1">
            <span>Sold: {deal.soldQuantity}</span>
            <span>{soldPercent}%</span>
          </div>
          <div className="w-full h-1 sm:h-1.5 bg-black/[0.08] rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                soldPercent >= 80 ? 'bg-[#EF4444]' : 'bg-[#F97316]'
              )}
              style={{ width: `${soldPercent}%` }}
              role="progressbar"
              aria-valuenow={soldPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${soldPercent}% sold`}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
