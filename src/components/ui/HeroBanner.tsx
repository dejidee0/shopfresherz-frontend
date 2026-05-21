'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { cn } from '@/lib/utils/format'
import { productsApi } from '@/lib/api/products'
import type { Banner } from '@/lib/types/product'

interface HeroSlide {
  id: string
  title: string
  subTitle: string
  imageUrl: string
  linkUrl: string
  ctaText: string
  sortOrder: number
  tag?: string
  tagColor?: string
  theme?: 'light' | 'dark'
  bgColor?: string
}

function bannerToSlide(banner: Banner): HeroSlide {
  return {
    ...banner,
    tag: undefined,
    tagColor: 'text-[#F5820A]',
    theme: 'light',
    bgColor: 'bg-[#F5F5F5]',
  }
}

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

  useEffect(() => {
    async function fetchBanners() {
      try {
        const banners = await productsApi.getBanners()
        if (banners.length > 0) {
          setSlides(banners.map(bannerToSlide))
          setCurrent(0)
        }
      } catch {
        // static fallback already in state
      }
    }
    fetchBanners()
  }, [])

  useEffect(() => {
    if (isPaused) return
    intervalRef.current = setInterval(next, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, next])

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
      {/* ── Slides track ── */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((s, i) => {
          const dark = s.theme === 'dark'
          return (
            <div
              key={s.id}
              className={cn('min-w-full', s.bgColor ?? 'bg-[#F5F5F5]')}
              aria-roledescription="slide"
              aria-label={s.title}
            >
              <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10">
                {/*
                  Mobile  : column layout — text on top, image below
                  Desktop : row layout   — text left, image right
                */}
                <div className="flex flex-col-reverse md:flex-row items-center gap-4 md:gap-8 py-8 md:py-0 md:min-h-105 lg:min-h-110">

                  {/* ── Text column ── */}
                  <div className="flex-1 flex flex-col items-center text-center md:items-start md:text-left md:max-w-120">
                    {s.tag && (
                      <p className={cn(
                        'text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 md:mb-3',
                        s.tagColor
                      )}>
                        {s.tag}
                      </p>
                    )}

                    <h2 className={cn(
                      'font-extrabold leading-tight mb-2 md:mb-4',
                      // Fluid type: smaller on mobile, full size on desktop
                      'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
                      dark ? 'text-white' : 'text-[#111111]'
                    )}>
                      {s.title}
                    </h2>

                    <p className={cn(
                      'text-xs sm:text-sm leading-relaxed mb-5 md:mb-8 max-w-70 sm:max-w-sm',
                      dark ? 'text-white/70' : 'text-[#6B7280]'
                    )}>
                      {s.subTitle}
                    </p>

                    <Link
                      href={s.linkUrl}
                      className={cn(
                        'rounded inline-flex items-center gap-2 font-semibold rounded-btn transition-all active:scale-[0.98]',
                        // Smaller tap target on mobile, full size on desktop
                        'text-xs sm:text-sm px-5 py-2.5 sm:px-7 sm:py-3',
                        'bg-linear-to-r from-[#F5820A] to-[#E06B00] text-white',
                        'hover:shadow-lg hover:shadow-orange-200'
                      )}
                    >
                      {s.ctaText} →
                    </Link>
                  </div>

                  {/* ── Image column ── */}
                  {/*
                    Mobile  : fixed height so it doesn't dominate the screen
                    Desktop : aspect-ratio box that fills available space
                  */}
                  <div className="flex-1 flex items-center justify-center w-full">
                    <div className={cn(
                      'relative w-full',
                      // Mobile: constrained height; Desktop: aspect-ratio driven
                      'h-45 sm:h-60 md:h-auto md:aspect-4/3 md:max-w-105 lg:max-w-120'
                    )}>
                      <Image
                        src={s.imageUrl || 'https://placehold.net/default.png'}
                        alt={s.title}
                        fill
                        sizes="(max-width: 768px) 80vw, 45vw"
                        className="object-contain"
                        priority={i === 0}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Arrow controls — hidden on mobile (swipe instead) ── */}
      <button
        onClick={prev}
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 shadow items-center justify-center text-[#111111] hover:bg-white hover:shadow-md transition-all z-10"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={17} />
      </button>
      <button
        onClick={next}
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 shadow items-center justify-center text-[#111111] hover:bg-white hover:shadow-md transition-all z-10"
        aria-label="Next slide"
      >
        <FiChevronRight size={17} />
      </button>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              'rounded-full transition-all duration-300',
              i === current
                ? 'w-4 h-1.5 md:w-5 md:h-2 bg-[#F5820A]'
                : 'w-1.5 h-1.5 md:w-2 md:h-2 bg-[#D1D5DB] hover:bg-[#F5820A]/50'
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current}
          />
        ))}
      </div>
    </div>
  )
}