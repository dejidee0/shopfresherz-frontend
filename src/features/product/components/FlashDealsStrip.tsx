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
    scrollRef.current.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' })
  }

  if (!deals.length) return null

  return (
    <section className="w-full bg-[#0D0D0D] py-6" aria-label="Flash deals">
      <div className="max-w-content mx-auto px-10">

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Orange flame accent bar */}
              <div className="w-1 h-7 bg-[#F5820A] rounded-full" />
              <h2 className="text-white text-xl font-bold">FLASH DEALS</h2>
            </div>
            <Countdown endTime={sessionEndTime} variant="dark" />
          </div>

          <Link
            href="/deals"
            className="text-sm text-[#F5820A] font-medium hover:underline flex items-center gap-1"
          >
            Browse All →
          </Link>
        </div>

        {/* Scrollable deal cards */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-[#111111] hover:bg-[#F5820A] hover:text-white transition-colors"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={16} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
          >
            {deals.map((deal) => (
              <FlashDealCard key={deal.id} deal={deal} />
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-[#111111] hover:bg-[#F5820A] hover:text-white transition-colors"
            aria-label="Scroll right"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Individual deal card ─────────────────────────────────────────────────────

function FlashDealCard({ deal }: { deal: FlashDeal }) {
  const { product, salePrice, maxQuantity, soldCount } = deal
  const soldPercent = Math.min(100, Math.round((soldCount / maxQuantity) * 100))
  const originalPrice = product.compareAtPrice ?? product.price
  const discountPercent = Math.round(((originalPrice - salePrice) / originalPrice) * 100)
  const thumb = product.images[0]?.thumb ?? '/images/Rbag.png'

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group shrink-0 w-50 bg-white rounded-card overflow-hidden hover:shadow-md hover:shadow-orange-500/20 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden">
        {/* Discount badge */}
        <div className="absolute top-2 left-2 z-10 bg-[#F5820A] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-badge">
          -{discountPercent}%
        </div>

        <Image
          src={thumb}
          alt={product.name}
          fill
          sizes="200px"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-[#111111] leading-snug line-clamp-2 mb-2 group-hover:text-[#F5820A] transition-colors">
          {product.name}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              size={10}
              className={i < Math.round(product.averageRating) ? 'text-[#F59E0B]' : 'text-[#E5E7EB]'}
            />
          ))}
          <span className="text-[10px] text-[#6B7280] ml-1">({product.reviewCount})</span>
        </div>

        {/* Prices */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-sm font-bold text-[#F5820A]">{formatPrice(salePrice)}</span>
          <span className="text-[11px] text-[#6B7280] line-through">{formatPrice(originalPrice)}</span>
        </div>

        {/* Stock progress bar */}
        <div>
          <div className="flex justify-between text-[10px] text-[#6B7280] mb-1">
            <span>Sold: {soldCount}</span>
            <span>{soldPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                soldPercent >= 80 ? 'bg-[#EF4444]' : 'bg-[#F5820A]'
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