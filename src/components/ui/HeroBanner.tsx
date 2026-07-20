"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/format";
import { productsApi } from "@/lib/api/products";
import type { Banner } from "@/lib/types/product";
import { FiArrowRight, FiChevronRight, FiZap } from "react-icons/fi";
import { CarouselSkeleton, HeroPromoSkeleton } from "./Skeletons";

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
    tagColor: "text-[#F97316]",
    theme: "dark",
    bgColor: "bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
  };
}

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

  const next = useCallback(() => {
    if (!total) return;
    setCurrent((c) => (c + 1) % total);
  }, [total]);
  const prev = useCallback(() => {
    if (!total) return;
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);
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
      setIsPromoLoading(true);
      let cards: PromoCard[] = [];

      try {
        const raw = await productsApi.getHeroPromos();
        if (raw && raw.length > 0) {
          const sorted = [...raw].sort((a, b) => a.sortOrder - b.sortOrder);
          cards = sorted.map((p) => ({
            tag: p.tag,
            title: p.title,
            badge: p.badge,
            price: p.price,
            ctaText: p.ctaText,
            linkUrl: p.linkUrl,
            imageUrl: p.imageUrl,
            slug: p.slug,
          }));
        }
      } catch (err) {
        console.error("[HeroBanner] ❌ Failed to load hero promos:", err);
      }

      // Render exactly what's configured in admin — no substituting in
      // random best-sellers when there are fewer than 2 hero promos. If
      // there's only 1 (or 0), the cards below render accordingly.
      if (cards.length > 0) {
        setPromos(cards);
        setPromoIndex1(0);
        setPromoIndex2(cards.length > 1 ? 1 % cards.length : 0);
      }
      setIsPromoLoading(false);
    }

    fetchBanners();
    fetchHeroPromos();
  }, []);

  useEffect(() => {
    if (isPaused || total < 2) return;
    intervalRef.current = setInterval(next, 7000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, next, total]);

  useEffect(() => {
    if (isPromoPaused1 || promos.length < 2) return;
    promoInterval1Ref.current = setInterval(() => {
      setPromoIndex1((i) => (i + 1) % promos.length);
    }, 5000);
    return () => {
      if (promoInterval1Ref.current) clearInterval(promoInterval1Ref.current);
    };
  }, [isPromoPaused1, promos.length]);

  useEffect(() => {
    if (isPromoPaused2 || promos.length < 2) return;
    promoInterval2Ref.current = setInterval(() => {
      setPromoIndex2((i) => (i + 1) % promos.length);
    }, 7000);
    return () => {
      if (promoInterval2Ref.current) clearInterval(promoInterval2Ref.current);
    };
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

  const promo1 = promos[promoIndex1];
  // Only show a second card when there are genuinely 2+ distinct promos —
  // otherwise this would render the same single promo twice.
  const promo2 = promos.length > 1 ? promos[promoIndex2] : undefined;

  return (
    <section className="w-full bg-[#F5F2ED] px-4 py-6 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 min-h-[520px]">
        {isSlideLoading ? (
          <CarouselSkeleton />
        ) : (
          <div
            className="relative overflow-hidden rounded-[24px] min-h-[480px] bg-[linear-gradient(135deg,#1a0800_0%,#1A1A2E_40%,#0f1628_100%)] border border-[rgba(249,115,22,0.15)] shadow-[inset_0_0_80px_rgba(249,115,22,0.05)]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Featured products carousel"
            aria-roledescription="carousel"
          >
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {slides?.map((s, i) => {
                const isActive = i === current;
                const titleWords = s.title.split(" ");
                const lastWord = titleWords.pop();
                const leadingTitle = titleWords.join(" ");

                return (
                  <div
                    key={s.id}
                    className="relative min-w-full min-h-[480px] overflow-hidden rounded-[24px]"
                    aria-roledescription="slide"
                    aria-label={s.title}
                  >
                    {s.imageUrl ? (
                      <>
                        <Image
                          src={s.imageUrl}
                          alt={s.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 70vw"
                          style={{ objectFit: "cover", objectPosition: "center right" }}
                          priority={i === 0}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 1,
                            background:
                              "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.15) 100%)",
                          }}
                        />
                      </>
                    ) : (
                      <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.08)_0%,transparent_70%)]" />
                    )}

                    <div
                      className={cn(
                        "absolute bottom-0 left-0 right-0 p-7 sm:p-12 transition-all duration-700",
                        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                      )}
                      style={{ zIndex: 2 }}
                    >
                      <div className="hero-badge block" style={{ marginBottom: "16px" }}>
                        <span className="sf-badge sf-badge-orange">{s.tag ?? "Fresh Deal"}</span>
                      </div>

                      <h1
                        className="hero-title max-w-[520px] text-[34px] sm:text-[44px] font-extrabold leading-[1.1] text-white tracking-[-1.5px]"
                      >
                        {leadingTitle}{" "}
                        {lastWord && <span className="text-[#F97316] sf-text-glow">{lastWord}</span>}
                      </h1>

                      <p className="hero-subtitle mt-3 max-w-[440px] text-[15px] leading-[1.6] text-[#999999]">
                        {s.subTitle}
                      </p>

                      <div className="hero-price mt-4 flex items-center gap-3 flex-wrap">
                        <span className="text-[34px] font-bold text-white">Fresh Deal</span>
                        <span className="text-base text-[#555555] line-through">Regular Price</span>
                        <span className="sf-badge sf-badge-orange">Save More</span>
                      </div>

                      <div className="hero-buttons mt-6 flex gap-3 flex-wrap">
                        <Link
                          href={s.linkUrl}
                          className="sf-btn-primary"
                        >
                          {s.ctaText || "Shop Now"} <FiArrowRight size={15} />
                        </Link>
                        <Link
                          href={s.linkUrl}
                          className="sf-btn-ghost"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-6 right-6 flex items-center gap-2 z-10">
              {slides?.slice(0, 4).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === current ? "w-7 bg-[#F97316] shadow-[0_0_8px_rgba(249,115,22,0.6)]" : "w-2 bg-[#6B7280]",
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === current}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-[10px] w-full lg:w-[340px]">
          {isPromoLoading ? (
            <>
              <HeroPromoSkeleton />
              <HeroPromoSkeleton />
              <HeroPromoSkeleton />
            </>
          ) : (
            <>
              <PromoFeatureCard
                promo={promo1}
                onMouseEnter={() => setIsPromoPaused1(true)}
                onMouseLeave={() => setIsPromoPaused1(false)}
              />
              <PromoCompactCard
                promo={promo2}
                onMouseEnter={() => setIsPromoPaused2(true)}
                onMouseLeave={() => setIsPromoPaused2(false)}
              />
              <FlashCountdownCard />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/** Card 1 — big product feature card: dark, image-topped, editorial style */
function PromoFeatureCard({
  promo,
  onMouseEnter,
  onMouseLeave,
}: {
  promo?: PromoCard;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const href = promo?.slug ? `/store/product/${promo.slug}` : (promo?.linkUrl ?? "/store/category/all");

  return (
    <Link
      href={href}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group relative min-h-[160px] overflow-hidden rounded-[18px] bg-[#1C1C1E] transition-transform duration-[250ms] ease-out hover:scale-[1.01]"
    >
      <div className="relative h-[130px] w-full">
        {promo?.imageUrl ? (
          <Image
            src={promo.imageUrl}
            alt={promo.title ?? "Featured product"}
            fill
            sizes="340px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#1C1C1E_0%,#2A2A2E_100%)]">
            <span className="text-4xl">💻</span>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60px]"
          style={{ background: "linear-gradient(to top, #1C1C1E 0%, transparent 100%)" }}
        />
      </div>

      <div className="px-4 pb-4 pt-3.5">
        <div className="flex items-center justify-between">
          <span className="rounded-[4px] bg-[rgba(249,115,22,0.2)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#F97316]">
            {promo?.tag ?? promo?.badge ?? "Featured"}
          </span>
          <span className="text-white transition-transform group-hover:translate-x-1">→</span>
        </div>
        <h3 className="mt-1.5 text-[15px] font-bold text-white line-clamp-1">
          {promo?.title ?? "Premium gadgets on deal"}
        </h3>
        {promo?.price && (
          <p className="mt-1 text-[18px] font-extrabold text-[#F97316]">{promo.price}</p>
        )}
      </div>
    </Link>
  );
}

/** Card 2 — horizontal compact card: warm cream, square thumbnail */
function PromoCompactCard({
  promo,
  onMouseEnter,
  onMouseLeave,
}: {
  promo?: PromoCard;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const href = promo?.slug ? `/store/product/${promo.slug}` : (promo?.linkUrl ?? "/store/category/all");

  return (
    <Link
      href={href}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="flex items-center gap-3 rounded-[14px] border-[1.5px] border-[rgba(249,115,22,0.15)] bg-[#F5F2ED] p-3.5 transition-all duration-200 ease-out hover:border-[#F97316] hover:bg-[#FFF8F3]"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white">
        {promo?.imageUrl ? (
          <Image
            src={promo.imageUrl}
            alt={promo.title ?? "Promo product"}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl">📱</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#F97316]">
          {promo?.tag ?? promo?.badge ?? "Limited Offer"}
        </p>
        <h3 className="mt-0.5 text-[13px] font-semibold text-[#111111] line-clamp-1">
          {promo?.title ?? "Premium gadgets on deal"}
        </h3>
        {promo?.price && (
          <p className="mt-0.5 text-[15px] font-bold text-[#F97316]">{promo.price}</p>
        )}
      </div>
      <FiChevronRight size={16} className="shrink-0 text-[#CCCCCC]" />
    </Link>
  );
}

/** Card 3 — flash sale countdown: gradient editorial banner */
function FlashCountdownCard() {
  return (
    <Link
      href="/store/category/all"
      className="relative flex items-center justify-between overflow-hidden rounded-[14px] px-4 py-3.5"
      style={{ background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" }}
    >
      <div
        className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }}
      />

      <div className="relative z-10">
        <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/80">
          <FiZap size={11} /> Flash Sale
        </p>
        <p className="text-[20px] font-extrabold tracking-[1px] text-white">16d : 21h : 57m</p>
      </div>

      <span className="relative z-10 shrink-0 rounded-[8px] border border-white/30 bg-white/20 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-white/30">
        View Deals →
      </span>
    </Link>
  );
}
