"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/format";
import { productsApi } from "@/lib/api/products";
import type { Banner } from "@/lib/types/product";
import { FiArrowRight } from "react-icons/fi";
import { CarouselSkeleton, HeroPromoSkeleton } from "./Skeletons";

/* ─── Slide types ─────────────────────────────────────────────────── */

interface HeroSlide {
  id: string;
  title: string;
  subTitle: string;
  imageUrl: string;
  linkUrl: string;
  ctaText: string;
  sortOrder: number;
  tag?: string;
  tagColor?: string;
  theme?: "light" | "dark";
  bgColor?: string;
}

interface PromoCard {
  tag?: string;
  title?: string;
  price?: string;
  badge?: string;
  ctaText?: string;
  linkUrl?: string;
  imageUrl?: string;
  slug?: string;
}

function bannerToSlide(banner: Banner): HeroSlide {
  return {
    ...banner,
    tag: undefined,
    tagColor: "text-[#A5F3FC]",
    theme: "dark",
    bgColor: "bg-linear-to-br from-[#0B1120] via-[#0D2758] to-[#0B4A8D]",
  };
}

/* ─── Component ───────────────────────────────────────────────────── */

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSlideLoading, setIsSlideLoading] = useState(false);
  const [isPromoLoading, setIsPromoLoading] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>();
  const [promos, setPromos] = useState<PromoCard[]>([]);

  const [promoIndex1, setPromoIndex1] = useState(0);
  const [promoIndex2, setPromoIndex2] = useState(0);
  const [isPromoPaused1, setIsPromoPaused1] = useState(false);
  const [isPromoPaused2, setIsPromoPaused2] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const promoInterval1Ref = useRef<ReturnType<typeof setInterval> | null>(null);
  const promoInterval2Ref = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = slides?.length || 0;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total],
  );
  const goTo = useCallback((i: number) => setCurrent(i), []);

  useEffect(() => {
    async function fetchBanners() {
      try {
        setIsSlideLoading(true);
        const banners = await productsApi.getBanners();
        if (banners.length > 0) {
          setSlides(banners.map(bannerToSlide));
          setCurrent(0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSlideLoading(false);
      }
    }

    async function fetchHeroPromos() {
      try {
        setIsPromoLoading(true);
        const raw = await productsApi.getHeroPromos();
        if (!raw || raw.length === 0) return;

        const sorted = [...raw].sort((a, b) => a.sortOrder - b.sortOrder);
        const cards: PromoCard[] = sorted.map((p) => ({
          tag: p.tag,
          title: p.title,
          badge: p.badge,
          price: p.price ?? p.subTitle,
          ctaText: p.ctaText,
          linkUrl: p.linkUrl,
          imageUrl: p.imageUrl,
          slug: p.slug,
        }));

        setPromos(cards);
        setPromoIndex1(0);
        setPromoIndex2(cards.length > 1 ? 1 % cards.length : 0);
        console.log("[HeroBanner] ✅ Hero promos loaded:", cards.length, "items");
      } catch (err) {
        console.error("[HeroBanner] ❌ Failed to load hero promos:", err);
      } finally {
        setIsPromoLoading(false);
      }
    }

    fetchBanners();
    fetchHeroPromos();
  }, []);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(next, 7000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, next]);

  useEffect(() => {
    if (isPromoPaused1 || promos.length < 2) return;
    promoInterval1Ref.current = setInterval(() => {
      setPromoIndex1((i) => (i + 1) % promos.length);
    }, 5000);
    return () => { if (promoInterval1Ref.current) clearInterval(promoInterval1Ref.current); };
  }, [isPromoPaused1, promos.length]);

  useEffect(() => {
    if (isPromoPaused2 || promos.length < 2) return;
    promoInterval2Ref.current = setInterval(() => {
      setPromoIndex2((i) => (i + 1) % promos.length);
    }, 7000);
    return () => { if (promoInterval2Ref.current) clearInterval(promoInterval2Ref.current); };
  }, [isPromoPaused2, promos.length]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  }

  return (
    <section className="max-w-content mx-auto px-3 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">

        {/* ━━━━━━ LEFT: Hero Slider ━━━━━━ */}
        {isSlideLoading ? (
          <CarouselSkeleton />
        ) : (
          <div
            className="lg:col-span-2 relative overflow-hidden rounded-2xl h-50 sm:h-70 lg:h-105"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Featured products carousel"
            aria-roledescription="carousel"
          >
            <div
              className="flex h-full transition-transform duration-1200 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {slides?.map((s, i) => {
                const dark = s.theme === "dark";
                const isActive = i === current;
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "min-w-full h-full",
                      s.bgColor ?? "bg-linear-to-br from-[#0B1120] via-[#0D2758] to-[#0B4A8D]",
                    )}
                    aria-roledescription="slide"
                    aria-label={s.title}
                  >
                    <div className="relative h-full md:flex md:flex-row md:items-center md:px-8 lg:px-10">
                      <div
                        className={cn(
                          "absolute inset-y-0 right-0 w-[55%] md:hidden pointer-events-none select-none",
                          "transition-all duration-1200 ease-out delay-300 will-change-transform",
                          isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
                        )}
                      >
                        {s.imageUrl && (
                          <Image src={s.imageUrl} alt={s.title} fill sizes="55vw"
                            className="object-contain object-right-center"
                            style={{ mixBlendMode: "multiply" }} priority={i === 0} />
                        )}
                      </div>

                      <div
                        className={cn(
                          "relative z-10 flex flex-col items-start text-left h-full justify-center",
                          "pl-4 pr-[48%] py-5 sm:pl-6 sm:pr-[50%] sm:py-7 md:flex-1 md:pr-0 md:pl-0 md:py-8",
                          "transition-all duration-1200 ease-out will-change-transform",
                          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                        )}
                      >
                        {s.tag && (
                          <p className={cn(
                            "text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 sm:mb-1.5 md:mb-2 flex items-center gap-1.5",
                            s.tagColor,
                            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                            "transition-all duration-1200 ease-out delay-300",
                          )}>
                            <span className="w-4 h-0.5 bg-current hidden md:inline-block" />
                            {s.tag}
                          </p>
                        )}
                        <h2 className={cn(
                          "font-extrabold leading-tight mb-1.5 sm:mb-2 md:mb-3",
                          "text-base sm:text-xl md:text-3xl lg:text-4xl",
                          dark ? "text-white" : "text-[#111111]",
                          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                          "transition-all duration-1200 ease-out delay-400",
                        )}>
                          {s.title}
                        </h2>
                        <p className={cn(
                          "leading-relaxed mb-3 sm:mb-4 md:mb-6",
                          "text-[10px] sm:text-xs md:text-sm",
                          "max-w-40 sm:max-w-50 md:max-w-xs",
                          "hidden xs:block sm:block",
                          dark ? "text-white/70" : "text-[#6B7280]",
                          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                          "transition-all duration-1200 ease-out delay-500",
                        )}>
                          {s.subTitle}
                        </p>
                        <Link href={s.linkUrl} className={cn(
                          "inline-flex items-center gap-1.5",
                          "text-[10px] sm:text-xs md:text-sm font-semibold",
                          "px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg",
                          "bg-linear-to-r from-[#F5820A] to-[#E06B00] text-white",
                          "hover:shadow-lg hover:shadow-orange-200/50 transition-all active:scale-[0.97]",
                          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                          "duration-1200 ease-out delay-600",
                        )}>
                          {s.ctaText}
                          <FiArrowRight size={12} />
                        </Link>
                      </div>

                      <div className={cn(
                        "hidden md:flex flex-1 items-center justify-center w-full",
                        "transition-all duration-1200 ease-out delay-300 will-change-transform",
                        isActive ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.98]",
                      )}>
                        <div className="relative w-full h-75 sm:h-85 md:h-90 lg:h-100 md:aspect-square md:max-w-95 lg:max-w-110">
                          {s.imageUrl && (
                            <Image src={s.imageUrl} alt={s.title} fill
                              sizes="(max-width: 768px) 80vw, 40vw"
                              className="object-contain"
                              style={{ mixBlendMode: "multiply" }} priority={i === 0} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-3 sm:bottom-4 left-8.75 sm:left-6 lg:left-10 flex items-center gap-1.5 z-10">
              {slides?.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === current
                      ? "w-4 sm:w-5 h-1.5 sm:h-2 bg-[#F5820A]"
                      : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#D1D5DB] hover:bg-[#F5820A]/50",
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === current}
                />
              ))}
            </div>
          </div>
        )}

        {/* ━━━━━━ RIGHT: Two Promo Carousels ━━━━━━ */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:flex lg:flex-col lg:gap-5 lg:h-105">
          {isPromoLoading ? (
            <>
              <HeroPromoSkeleton />
              <HeroPromoSkeleton />
            </>
          ) : (
            <>
              {/* ── Card 1: Dark ── */}
              <div
                className="group relative bg-[#0B0C0E] rounded-xl lg:rounded-2xl overflow-hidden flex flex-col h-40 sm:h-50 lg:flex-1 lg:h-auto border border-white/5"
                onMouseEnter={() => setIsPromoPaused1(true)}
                onMouseLeave={() => setIsPromoPaused1(false)}
              >
                <div
                  className="flex h-full w-full transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${promoIndex1 * 100}%)` }}
                >
                  {promos.map((p, i) => (
                    <Link
                      key={i}
                      href={p.slug ? `/store/product/${p.slug}` : "#"}
                      className="min-w-full h-full relative shrink-0 block"
                    >
                      {p.badge && (
                        <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 lg:top-4 lg:right-4 bg-[#7B2FBE] text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-1 rounded shadow-lg z-20">
                          {p.badge}
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 z-10 p-3 sm:p-4 lg:p-5 flex flex-col justify-end max-w-[55%]">
                        {p.tag && (
                          <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-extrabold uppercase tracking-widest text-[#F5820A] mb-0.5 sm:mb-1">
                            {p.tag}
                          </p>
                        )}
                        <h3 className="text-white text-xs sm:text-sm lg:text-lg font-extrabold leading-tight mb-2 sm:mb-3 tracking-tight line-clamp-2">
                          {p.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 self-start bg-white text-[#0B1528] text-[9px] sm:text-[10px] font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg shadow-md group-hover:bg-[#F3F4F6] transition-all duration-300">
                          {p.ctaText}
                          <FiArrowRight size={9} className="stroke-[2.5]" />
                        </span>
                      </div>
                      <div className="absolute right-0 bottom-0 w-[48%] h-full pointer-events-none select-none z-10">
                        {p.imageUrl && (
                          <Image src={p.imageUrl} alt={p.title ?? ""} fill
                            sizes="(max-width: 640px) 30vw, 25vw"
                            className="object-contain object-bottom-right" priority={i === 0} />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {promos.length > 1 && (
                  <div className="absolute bottom-2 left-3 flex items-center gap-1 z-20">
                    {promos.map((_, i) => (
                      <button key={i} onClick={() => setPromoIndex1(i)}
                        className={cn(
                          "rounded-full transition-all duration-300",
                          i === promoIndex1
                            ? "w-3 h-1 bg-[#F5820A]"
                            : "w-1 h-1 bg-white/40 hover:bg-white/70",
                        )}
                        aria-label={`Go to promo ${i + 1}`} />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Card 2: Light ── */}
              <div
                className="group relative bg-[#F5F5F5] border border-neutral-200/80 rounded-xl lg:rounded-2xl overflow-hidden flex flex-col h-40 sm:h-50 lg:flex-1 lg:h-auto"
                onMouseEnter={() => setIsPromoPaused2(true)}
                onMouseLeave={() => setIsPromoPaused2(false)}
              >
                <div
                  className="flex h-full w-fit transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${promoIndex2 * 100}%)` }}
                >
                  {promos.map((p, i) => (
                    <Link
                      key={i}
                      href={p.slug ? `/store/product/${p.slug}` : "#"}
                      className="min-w-full h-full relative shrink-0"
                    >
                      {/* ── Mobile/tablet: image top-right absolute, text bottom-left ── */}
                      <div className="lg:hidden absolute inset-0 flex items-end">
                        <div className="absolute top-0 right-0 w-[48%] h-full pointer-events-none select-none">
                          {p.imageUrl && (
                            <Image src={p.imageUrl} alt={p.title ?? ""} fill
                              sizes="25vw"
                              className="object-contain object-top-right" priority={i === 0} />
                          )}
                        </div>
                        <div className="relative z-10 p-3 sm:p-4 flex flex-col max-w-[55%]">
                          <h3 className="text-neutral-950 text-xs sm:text-sm font-extrabold leading-tight mb-1 line-clamp-2">
                            {p.title}
                          </h3>
                          {p.price && (
                            <p className="text-[#F5820A] text-xs sm:text-sm font-extrabold mb-2">
                              {p.price}
                            </p>
                          )}
                          <span className="inline-flex items-center gap-1 self-start bg-[#F5820A] text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg shadow-md group-hover:bg-[#E06B00] transition-all duration-300">
                            {p.ctaText}
                            <FiArrowRight size={9} className="stroke-[2.5]" />
                          </span>
                        </div>
                      </div>

                      {/* ── Desktop: clean flex row, no absolute conflicts ── */}
                      <div className="hidden lg:flex flex-row items-center h-full w-full px-4 gap-3">
                        <div className="relative w-28 shrink-0 self-stretch">
                          {p.imageUrl && (
                            <Image src={p.imageUrl} alt={p.title ?? ""} fill
                              sizes="112px"
                              className="object-contain object-center" priority={i === 0} />
                          )}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 w-fit py-4">
                          <h3 className="text-neutral-950 w-72 text-base font-extrabold leading-tight mb-1.5 line-clamp-2 text-wrap">
                            {p.title}
                          </h3>
                          {p.price && (
                            <p className="text-[#F5820A] text-base font-extrabold mb-3">
                              {p.price}
                            </p>
                          )}
                          <span className="inline-flex items-center gap-1.5 self-start bg-[#F5820A] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md group-hover:bg-[#E06B00] transition-all duration-300">
                            {p.ctaText}
                            <FiArrowRight size={10} className="stroke-[2.5]" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {promos.length > 1 && (
                  <div className="absolute bottom-2 left-3 flex items-center gap-1 z-20">
                    {promos.map((_, i) => (
                      <button key={i} onClick={() => setPromoIndex2(i)}
                        className={cn(
                          "rounded-full transition-all duration-300",
                          i === promoIndex2
                            ? "w-3 h-1 bg-[#F5820A]"
                            : "w-1 h-1 bg-neutral-400/50 hover:bg-neutral-500/70",
                        )}
                        aria-label={`Go to promo ${i + 1}`} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}