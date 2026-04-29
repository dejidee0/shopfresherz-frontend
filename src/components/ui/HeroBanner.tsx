'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { cn } from '@/lib/utils/format'

interface HeroSlide {
  id: string
  tag?: string
  tagColor?: string
  headline: string
  subtext: string
  ctaLabel: string
  ctaHref: string
  image: string
  imageAlt: string
  /** 'light' = dark text on light bg | 'dark' = white text on dark bg */
  theme: 'light' | 'dark'
  bgColor: string
}

// Static slides — swap with CMS/admin banner data when the banners API is ready
const SLIDES: HeroSlide[] = [
  {
    id: '1',
    tag: 'THE BEST PLACE TO PLAY',
    tagColor: 'text-[#F5820A]',
    headline: 'Xbox Consoles',
    subtext: 'Save up to 50% on select Xbox games. Get 3 months of PC Game Pass for $2 USD.',
    ctaLabel: 'SHOP NOW',
    ctaHref: '/category/games-consoles',
    image: '/images/banners/xbox.png',
    imageAlt: 'Xbox Series X console',
    theme: 'light',
    bgColor: 'bg-[#F5F5F5]',
  },
  {
    id: '2',
    tag: 'SUMMER SALES',
    tagColor: 'text-[#F5820A]',
    headline: 'New Google Pixel 6 Pro',
    subtext: 'Experience the ultimate Android flagship. Available now.',
    ctaLabel: 'SHOP NOW',
    ctaHref: '/product/google-pixel-6-pro',
    image: '/images/banners/pixel6.png',
    imageAlt: 'Google Pixel 6 Pro',
    theme: 'light',
    bgColor: 'bg-white',
  },
  {
    id: '3',
    tag: 'NEW ARRIVAL',
    tagColor: 'text-[#7B2FBE]',
    headline: 'Xiaomi FlipBuds Pro',
    subtext: 'Premium sound, all-day comfort. Starting at ₦10,000.',
    ctaLabel: 'SHOP NOW',
    ctaHref: '/product/xiaomi-flipbuds-pro',
    image: '/images/banners/flipbuds.png',
    imageAlt: 'Xiaomi FlipBuds Pro',
    theme: 'dark',
    bgColor: 'bg-[#0D0D0D]',
  },
]

export function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = SLIDES.length

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])
  const goTo = useCallback((i: number) => setCurrent(i), [])

  // Auto-rotate every 5s, pause on hover
  useEffect(() => {
    if (isPaused) return
    intervalRef.current = setInterval(next, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, next])

  // Touch/swipe support
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev()
    }
    touchStartX.current = null
  }

  const slide = SLIDES[current]
  const isDark = slide.theme === 'dark'

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Featured products carousel"
      aria-roledescription="carousel"
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((s) => (
          <div
            key={s.id}
            className={cn('min-w-full', s.bgColor)}
            aria-roledescription="slide"
            aria-label={s.headline}
          >
            <div className="max-w-content mx-auto px-10">
              <div className="flex items-center min-h-85 md:min-h-105 py-10 gap-8">

                {/* Text column */}
                <div className="flex-1 max-w-120">
                  {s.tag && (
                    <p className={cn('text-xs font-bold uppercase tracking-widest mb-3', s.tagColor)}>
                      {s.tag}
                    </p>
                  )}
                  <h2
                    className={cn(
                      'text-4xl md:text-5xl font-extrabold leading-tight mb-4',
                      isDark ? 'text-white' : 'text-[#111111]'
                    )}
                  >
                    {s.headline}
                  </h2>
                  <p
                    className={cn(
                      'text-sm leading-relaxed mb-8 max-w-sm',
                      isDark ? 'text-white/70' : 'text-[#6B7280]'
                    )}
                  >
                    {s.subtext}
                  </p>
                  <Link
                    href={s.ctaHref}
                    className="inline-flex items-center gap-2 bg-linear-to-r from-[#F5820A] to-[#E06B00] text-white font-semibold px-7 py-3 rounded-btn hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-[0.98]"
                  >
                    {s.ctaLabel} →
                  </Link>
                </div>

                {/* Image column */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative w-full max-w-105 aspect-4/3">
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                      priority={s.id === '1'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-[#111111] hover:bg-white hover:shadow-md transition-all z-10"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-[#111111] hover:bg-white hover:shadow-md transition-all z-10"
        aria-label="Next slide"
      >
        <FiChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              'rounded-full transition-all duration-300',
              i === current
                ? 'w-5 h-2 bg-[#F5820A]'
                : 'w-2 h-2 bg-[#D1D5DB] hover:bg-[#F5820A]/50'
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current}
          />
        ))}
      </div>
    </div>
  )
}