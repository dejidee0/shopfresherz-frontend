'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/format'
import { productsApi } from '@/lib/api/products'
import type { Banner } from '@/lib/types/product'
import { FiArrowRight } from 'react-icons/fi'

/* ─── Slide types ─────────────────────────────────────────────────── */

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
    tagColor: 'text-[#A5F3FC]',
    theme: 'dark',
    bgColor: 'bg-gradient-to-br from-[#0B1120] via-[#0D2758] to-[#0B4A8D]',
  }
}

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: 'fallback-1',
    tag: 'THE BEST PLACE TO PLAY',
    tagColor: 'text-[#A5F3FC]',
    title: 'Xbox 360 Console',
    subTitle: 'Save up to 50% on select Xbox games. Get 3 months of PC Game Pass for $2 USD.',
    ctaText: 'SHOP NOW',
    linkUrl: '/store/category/games-consoles',
    imageUrl: '/images/categories/Image1.png',
    sortOrder: 0,
    theme: 'dark',
    bgColor: 'bg-gradient-to-br from-[#0B1120] via-[#0D2758] to-[#0B4A8D]',
  },
  {
    id: 'fallback-2',
    tag: 'PREMIUM GAMING GEAR',
    tagColor: 'text-[#A5F3FC]',
    title: 'Xbox Elite Controllers',
    subTitle: 'Designed for the ultimate gaming experience. Precision engineered for pros.',
    ctaText: 'SHOP NOW',
    linkUrl: '/store/category/games-consoles',
    imageUrl: '/images/categories/Image2.png',
    sortOrder: 1,
    theme: 'dark',
    bgColor: 'bg-gradient-to-br from-[#0B1120] via-[#0D2758] to-[#0B4A8D]',
  },
  {
    id: 'fallback-3',
    tag: 'NEW ARRIVAL',
    tagColor: 'text-[#A5F3FC]',
    title: 'PlayStation 5',
    subTitle: 'Experience lightning-fast loading, deeper immersion and an all-new generation of gaming.',
    ctaText: 'SHOP NOW',
    linkUrl: '/store/category/games-consoles',
    imageUrl: '/images/categories/Image3.png',
    sortOrder: 2,
    theme: 'dark',
    bgColor: 'bg-gradient-to-br from-[#0B1120] via-[#0D2758] to-[#0B4A8D]',
  },
]

/* ─── Promo card fallbacks ────────────────────────────────────────── */

const PROMO_CARD_1_FALLBACK = {
  tag: 'SUMMER SALES',
  title: 'New Google\nPixel 6 Pro',
  badge: '29% OFF',
  ctaText: 'SHOP NOW',
  linkUrl: '/store/',
  imageUrl: '/images/categories/pixel.png',
}

const PROMO_CARD_2_FALLBACK = {
  title: 'Xiaomi\nFlipBuds Pro',
  price: '₦10,000',
  ctaText: 'SHOP NOW',
  linkUrl: '/store/',
  imageUrl: '/images/categories/earpod.png',
}

/* ─── Component ───────────────────────────────────────────────────── */

export function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [slides, setSlides] = useState<HeroSlide[]>(FALLBACK_SLIDES)
  const [promoCard1, setPromoCard1] = useState(PROMO_CARD_1_FALLBACK)
  const [promoCard2, setPromoCard2] = useState(PROMO_CARD_2_FALLBACK)
  const touchStartX = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = slides.length

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])
  const goTo = useCallback((i: number) => setCurrent(i), [])

  /* Fetch real banners + hero promo cards */
  useEffect(() => {
    async function fetchBanners() {
      try {
        // Main slider — existing /banners endpoint
        const banners = await productsApi.getBanners()
        if (banners.length > 0) {
          setSlides(banners.map(bannerToSlide))
          setCurrent(0)
        }
      } catch {
        // static fallback already in state
      }
    }

    async function fetchHeroPromos() {
      try {
        const promos = await productsApi.getHeroPromos()
        if (!promos || promos.length === 0) return

        // Sort by sortOrder so admin controls the order
        const sorted = [...promos].sort((a, b) => a.sortOrder - b.sortOrder)

        const p1 = sorted[0]
        if (p1) {
          setPromoCard1({
            tag: p1.tag ?? PROMO_CARD_1_FALLBACK.tag,
            title: p1.title,
            badge: p1.badge ?? PROMO_CARD_1_FALLBACK.badge,
            ctaText: p1.ctaText ?? PROMO_CARD_1_FALLBACK.ctaText,
            linkUrl: p1.linkUrl ?? PROMO_CARD_1_FALLBACK.linkUrl,
            imageUrl: p1.imageUrl || PROMO_CARD_1_FALLBACK.imageUrl,
          })
        }

        const p2 = sorted[1]
        if (p2) {
          setPromoCard2({
            title: p2.title,
            price: p2.price ?? p2.subTitle ?? PROMO_CARD_2_FALLBACK.price,
            ctaText: p2.ctaText ?? PROMO_CARD_2_FALLBACK.ctaText,
            linkUrl: p2.linkUrl ?? PROMO_CARD_2_FALLBACK.linkUrl,
            imageUrl: p2.imageUrl || PROMO_CARD_2_FALLBACK.imageUrl,
          })
        }

        console.log('[HeroBanner] ✅ Hero promos loaded:', sorted.length, 'items')
      } catch (err) {
        console.error('[HeroBanner] ❌ Failed to load hero promos:', err)
        // fallbacks already in state
      }
    }

    fetchBanners()
    fetchHeroPromos()
  }, [])

  /* Auto-play */
  useEffect(() => {
    if (isPaused) return
    intervalRef.current = setInterval(next, 7000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, next])

  /* Touch swipe */
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <section className="max-w-content mx-auto px-3 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">

        {/* ━━━━━━ LEFT: Auto-playing Slider ━━━━━━ */}
        <div
          className="lg:col-span-2 relative overflow-hidden rounded-2xl h-[200px] sm:h-[280px] lg:h-[420px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="Featured products carousel"
          aria-roledescription="carousel"
        >
          {/* Slide track */}
          <div
            className="flex h-full transition-transform duration-1200 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((s, i) => {
              const dark = s.theme === 'dark'
              const isActive = i === current
              return (
                <div
                  key={s.id}
                  className={cn('min-w-full h-full', s.bgColor ?? 'bg-gradient-to-br from-[#0B1120] via-[#0D2758] to-[#0B4A8D]')}
                  aria-roledescription="slide"
                  aria-label={s.title}
                >
                  {/* 
                    Mobile/Tablet: image sits as absolute background on the right,
                    text overlays on the left — clean app-like layout.
                    Desktop (md+): side-by-side flex row (unchanged).
                  */}
                  <div className="relative h-full md:flex md:flex-row md:items-center md:px-8 lg:px-10">

                    {/* ── Mobile/Tablet image (absolute, right side, decorative bg) ── */}
                    <div className={cn(
                      "absolute inset-y-0 right-0 w-[55%] md:hidden pointer-events-none select-none",
                      "transition-all duration-1200 ease-out delay-300 will-change-transform",
                      isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    )}>
                      <Image
                        src={s.imageUrl || '/images/device-placeholder.jpg'}
                        alt={s.title}
                        fill
                        sizes="55vw"
                        className="object-contain object-right-center"
                        style={{ mixBlendMode: 'multiply' }}
                        priority={i === 0}
                      />
                    </div>

                    {/* ── Text block ── */}
                    <div className={cn(
                      "relative z-10 flex flex-col items-start text-left h-full justify-center",
                      "pl-4 pr-[48%] py-5 sm:pl-6 sm:pr-[50%] sm:py-7 md:flex-1 md:pr-0 md:pl-0 md:py-8 md:items-start",
                      "transition-all duration-1200 ease-out will-change-transform",
                      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                      {s.tag && (
                        <p className={cn(
                          'text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 sm:mb-1.5 md:mb-2 flex items-center gap-1.5',
                          s.tagColor,
                          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
                          'transition-all duration-1200 ease-out delay-300'
                        )}>
                          <span className="w-4 h-[2px] bg-current hidden md:inline-block" />
                          {s.tag}
                        </p>
                      )}

                      <h2 className={cn(
                        'font-extrabold leading-tight mb-1.5 sm:mb-2 md:mb-3',
                        'text-base sm:text-xl md:text-3xl lg:text-4xl',
                        dark ? 'text-white' : 'text-[#111111]',
                        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                        'transition-all duration-1200 ease-out delay-400'
                      )}>
                        {s.title}
                      </h2>

                      <p className={cn(
                        'leading-relaxed mb-3 sm:mb-4 md:mb-6',
                        'text-[10px] sm:text-xs md:text-sm',
                        'max-w-[160px] sm:max-w-[200px] md:max-w-xs',
                        'hidden xs:block sm:block',
                        dark ? 'text-white/70' : 'text-[#6B7280]',
                        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                        'transition-all duration-1200 ease-out delay-500'
                      )}>
                        {s.subTitle}
                      </p>

                      <Link
                        href={s.linkUrl}
                        className={cn(
                          "inline-flex items-center gap-1.5",
                          "text-[10px] sm:text-xs md:text-sm font-semibold",
                          "px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg",
                          "bg-gradient-to-r from-[#F5820A] to-[#E06B00] text-white",
                          "hover:shadow-lg hover:shadow-orange-200/50 transition-all active:scale-[0.97]",
                          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                          'duration-1200 ease-out delay-600'
                        )}
                      >
                        {s.ctaText}
                        <FiArrowRight size={12} />
                      </Link>
                    </div>

                    {/* ── Desktop image (flex col, unchanged from original) ── */}
                    <div className={cn(
                      "hidden md:flex flex-1 items-center justify-center w-full",
                      "transition-all duration-1200 ease-out delay-300 will-change-transform",
                      isActive ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.98]"
                    )}>
                      <div className="relative w-full h-[300px] sm:h-[340px] md:h-[360px] lg:h-[400px] md:aspect-square md:max-w-[380px] lg:max-w-[440px]">
                        <Image
                          src={s.imageUrl || '/images/device-placeholder.jpg'}
                          alt={s.title}
                          fill
                          sizes="(max-width: 768px) 80vw, 40vw"
                          className="object-contain"
                          style={{ mixBlendMode: 'multiply' }}
                          priority={i === 0}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>

          {/* Dot indicators — bottom-left */}
          <div className="absolute bottom-3  sm:bottom-4 left-[35px] sm:left-6 lg:left-10 flex items-center gap-1.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  'rounded-full transition-all duration-300',
                  i === current
                    ? 'w-4 sm:w-5 h-1.5 sm:h-2 bg-[#F5820A]'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#D1D5DB] hover:bg-[#F5820A]/50'
                )}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === current}
              />
            ))}
          </div>
        </div>

        {/* ━━━━━━ RIGHT: Two Promotional Cards ━━━━━━ */}
        {/*
          Mobile: side-by-side row (2 cards next to each other, compact height)
          Tablet (sm): side-by-side row, slightly taller
          Desktop (lg): stacked column (original layout, untouched)
        */}
        <div className="
          grid grid-cols-2 gap-3
          sm:gap-4
          lg:flex lg:flex-col lg:gap-5 lg:h-[420px]
        ">

          {/* ── Card 1: Google Pixel 6 Pro (Dark) ── */}
          <Link
            href={promoCard1.linkUrl}
            className="
              group relative
              bg-[#0B0C0E] rounded-xl lg:rounded-2xl overflow-hidden
              flex flex-col
              /* mobile/tablet height */
              h-[160px] sm:h-[200px]
              /* desktop: flex-1 to share space equally */
              lg:flex-1 lg:h-auto
              transition-all duration-300
              hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-0.5
              border border-white/5
            "
          >
            {/* Badge */}
            <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 lg:top-4 lg:right-4 bg-[#7B2FBE] text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-1 rounded shadow-lg z-20">
              {promoCard1.badge}
            </span>

            {/* Text — bottom-left */}
            <div className="absolute bottom-0 left-0 z-10 p-3 sm:p-4 lg:p-7 flex flex-col justify-end">
              <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-extrabold uppercase tracking-widest text-[#F5820A] mb-0.5 sm:mb-1">
                {promoCard1.tag}
              </p>
              <h3 className="text-white text-sm sm:text-base lg:text-2xl font-extrabold leading-tight whitespace-pre-line mb-2 sm:mb-3 tracking-tight">
                {promoCard1.title}
              </h3>
              <span className="inline-flex items-center gap-1.5 self-start bg-white text-[#0B1528] text-[9px] sm:text-[10px] lg:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 rounded-lg shadow-md group-hover:bg-[#F3F4F6] transition-all duration-300">
                {promoCard1.ctaText}
                <FiArrowRight size={10} className="stroke-[2.5]" />
              </span>
            </div>

            {/* Image — right side */}
            <div className="absolute hidden sm:block md:right-0 md:bottom-0 w-[55%] h-[110%] md:pointer-events-none md:select-none z-10">
              <Image
                src={promoCard1.imageUrl}
                alt={promoCard1.title}
                fill
                sizes="(max-width: 640px) 30vw, 25vw"
                className="object-contain object-right-bottom"
                priority
              />
            </div>
          </Link>

          {/* ── Card 2: Xiaomi FlipBuds Pro (Light) ── */}
          <Link
            href={promoCard2.linkUrl}
            className="
              group
              bg-[#F5F5F5] border border-neutral-200/80 rounded-xl lg:rounded-2xl overflow-hidden
              flex flex-col justify-end
              /* mobile/tablet height */
              h-[160px] sm:h-[200px]
              /* desktop */
              lg:flex-1 lg:h-auto lg:flex-row lg:items-center lg:justify-start
              transition-all duration-300
              hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-0.5
            "
          >
            {/* Image — top on mobile, left on desktop */}
            <div className="
              relative
              /* mobile/tablet: sits at top, fills most of the card height */
              absolute inset-x-0 top-0 h-[55%]
              /* desktop: side-by-side */
              lg:static lg:h-full lg:w-[130px] xl:w-[150px] lg:shrink-0 lg:ml-4 xl:ml-6
            ">
              <div className="relative w-full h-full">
                <Image
                  src={promoCard2.imageUrl}
                  alt={promoCard2.title}
                  fill
                  sizes="(max-width: 640px) 25vw, 150px"
                  className="object-contain object-center"
                  priority
                />
              </div>
            </div>

            {/* Text — bottom on mobile, right on desktop */}
            <div className="
              relative z-10
              /* mobile/tablet: bottom portion */
              p-3 sm:p-4
              flex flex-col
              /* desktop */
              lg:flex-1 lg:p-5 xl:p-6 lg:pl-4
            ">
              <h3 className="text-neutral-950 text-xs sm:text-sm lg:text-xl font-extrabold leading-tight whitespace-pre-line mb-0.5 sm:mb-1">
                {promoCard2.title}
              </h3>
              <p className="text-[#F5820A] text-xs sm:text-sm lg:text-lg font-extrabold mb-2 sm:mb-3">
                {promoCard2.price}
              </p>
              <span className="inline-flex items-center gap-1.5 self-start bg-[#F5820A] text-white text-[9px] sm:text-[10px] lg:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 rounded-lg shadow-md group-hover:bg-[#E06B00] transition-all duration-300">
                {promoCard2.ctaText}
                <FiArrowRight size={10} className="stroke-[2.5]" />
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  )
}
