'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { cn } from '@/lib/utils/format'
import { productsApi } from '@/lib/api/products'
import type { Banner } from '@/lib/types/product'

// HeroSlide now mirrors the Banner API shape directly
interface HeroSlide {
  id: string
  title: string
  subTitle: string
  imageUrl: string
  linkUrl: string
  ctaText: string
  sortOrder: number
  // UI-only fields with sensible defaults
  tag?: string
  tagColor?: string
  theme?: 'light' | 'dark'
  bgColor?: string
}

// Map a Banner from the API to a HeroSlide (adds UI defaults)
function bannerToSlide(banner: Banner): HeroSlide {
  return {
    ...banner,
    tag: undefined,
    tagColor: 'text-[#F5820A]',
    theme: 'light',
    bgColor: 'bg-[#F5F5F5]',
  }
}

// Static fallback slides shown while the API loads (or if it fails)
const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: 'fallback-1',
    tag: 'THE BEST PLACE TO PLAY',
    tagColor: 'text-[#F5820A]',
    title: 'Video Game Consoles',
    subTitle: 'Save up to 50% on select Xbox and PlayStation games',
    ctaText: 'SHOP NOW',
    linkUrl: '/category/games-consoles',
    imageUrl: '/images/categories/xbox.png',
    sortOrder: 0,
    theme: 'light',
    bgColor: 'bg-[#F5F5F5]',
  },
  {
    id: 'fallback-2',
    tagColor: 'text-[#F5820A]',
    title: 'New Mobile Phones',
    subTitle: 'Experience the ultimate Android/Apple flagship. Available now.',
    ctaText: 'SHOP NOW',
    linkUrl: '/store/',
    imageUrl: '/images/categories/phone.png',
    sortOrder: 1,
    theme: 'light',
    bgColor: 'bg-white',
  },
  {
    id: 'fallback-3',
    tag: 'NEW ARRIVAL',
    tagColor: 'text-[#7B2FBE]',
    title: 'Headphones & Earpods',
    subTitle: 'Premium sound, all-day comfort.',
    ctaText: 'SHOP NOW',
    linkUrl: '/store/',
    imageUrl: '/images/categories/earpod.png',
    sortOrder: 2,
    theme: 'dark',
    bgColor: 'bg-[#0D0D0D]',
  },
]

export function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [slides, setSlides] = useState<HeroSlide[]>(FALLBACK_SLIDES)
  const touchStartX = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = slides.length

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])
  const goTo = useCallback((i: number) => setCurrent(i), [])

  // Fetch banners from API; fall back to static slides on error
  useEffect(() => {
    async function fetchBanners() {
      try {
        const banners = await productsApi.getBanners()
        if (banners.length > 0) {
          setSlides(banners.map(bannerToSlide))
          setCurrent(0)
        }
      } catch {
        // Static fallback already set as initial state — nothing to do
      }
    }
    fetchBanners()
  }, [])

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
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  const slide = slides[current]
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
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={cn('min-w-full', s.bgColor ?? 'bg-[#F5F5F5]')}
            aria-roledescription="slide"
            aria-label={s.title}
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
                    {s.title}
                  </h2>
                  <p
                    className={cn(
                      'text-sm leading-relaxed mb-8 max-w-sm',
                      isDark ? 'text-white/70' : 'text-[#6B7280]'
                    )}
                  >
                    {s.subTitle}
                  </p>
                  <Link
                    href={s.linkUrl}
                    className="inline-flex items-center gap-2 bg-linear-to-r from-[#F5820A] to-[#E06B00] text-white font-semibold px-7 py-3 rounded-btn hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-[0.98]"
                  >
                    {s.ctaText} →
                  </Link>
                </div>

                {/* Image column */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative w-full max-w-105 aspect-4/3">
                    <Image
                      src={s.imageUrl || 'https://placehold.net/default.png'}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                      priority={i === 0}
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
        {slides.map((_, i) => (
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