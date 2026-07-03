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
  const promo2 = promos[promoIndex2];

  return (
    <section className="w-full bg-[#0A0A0A] px-4 py-6 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 min-h-[520px]">
        {isSlideLoading ? (
          <CarouselSkeleton />
        ) : (
          <div
            className="relative overflow-hidden rounded-[24px] min-h-[480px] bg-linear-to-br from-[#1a0800] via-[#0D0D0D] to-[#0a1020] border border-[rgba(249,115,22,0.15)] shadow-[inset_0_0_80px_rgba(249,115,22,0.05)]"
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
                    className="min-w-full min-h-[480px]"
                    aria-roledescription="slide"
                    aria-label={s.title}
                  >
                    <div className="relative grid min-h-[480px] grid-cols-1 md:grid-cols-[1fr_42%] items-end gap-5 px-6 py-10 sm:px-12 sm:py-12">
                      <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.08)_0%,transparent_70%)]" />
                      <div
                        className={cn(
                          "relative z-10 max-w-xl pb-6 transition-all duration-700",
                          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                        )}
                      >
                        <span className="sf-badge sf-badge-orange mb-4">{s.tag ?? "Fresh Deal"}</span>

                        <h1 className="text-[34px] sm:text-[44px] font-bold leading-[1.1] text-white tracking-[-1.5px]">
                          {leadingTitle}{" "}
                          {lastWord && <span className="text-[#F97316] sf-text-glow">{lastWord}</span>}
                        </h1>

                        <p className="mt-3 max-w-[420px] text-[15px] leading-[1.6] text-[#888888]">
                          {s.subTitle}
                        </p>

                        <div className="mt-5 flex items-center gap-3 flex-wrap">
                          <span className="text-[34px] font-bold text-white">Fresh Deal</span>
                          <span className="text-base text-[#555555] line-through">Regular Price</span>
                          <span className="sf-badge sf-badge-orange">Save More</span>
                        </div>

                        <div className="mt-6 flex items-center gap-3">
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

                      <div className="relative hidden h-[360px] md:block">
                        {s.imageUrl && (
                          <Image
                            src={s.imageUrl}
                            alt={s.title}
                            fill
                            sizes="(max-width: 1024px) 40vw, 360px"
                            className="object-contain drop-shadow-2xl"
                            priority={i === 0}
                          />
                        )}
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

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          {isPromoLoading ? (
            <>
              <HeroPromoSkeleton />
              <HeroPromoSkeleton />
              <HeroPromoSkeleton />
            </>
          ) : (
            <>
              <HeroSideCard
                promo={promo1}
                theme="dark"
                onMouseEnter={() => setIsPromoPaused1(true)}
                onMouseLeave={() => setIsPromoPaused1(false)}
              />
              <HeroSideCard
                promo={promo2}
                theme="blue"
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

function HeroSideCard({
  promo,
  theme,
  onMouseEnter,
  onMouseLeave,
}: {
  promo?: PromoCard;
  theme: "dark" | "blue";
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const href = promo?.slug ? `/store/product/${promo.slug}` : promo?.linkUrl ?? "/store/category/all";
  const bg =
    theme === "blue"
      ? "bg-linear-to-br from-[#0a1628] to-[#0f2040] border border-[rgba(96,165,250,0.15)]"
      : "bg-linear-to-br from-[#1A1A1A] to-[#141414] border border-white/[0.08]";

  return (
    <Link
      href={href}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn("sf-card-3d relative min-h-[132px] rounded-[16px] p-5 overflow-hidden group", bg)}
    >
      <span className="sf-badge sf-badge-orange absolute right-4 top-4">Limited</span>
      <div className="flex items-center gap-4 pr-16">
        <div className="relative w-16 h-16 rounded-[12px] bg-linear-to-br from-[#1F1F1F] to-[#2A2A2A] shrink-0 overflow-hidden flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
          {promo?.imageUrl ? (
            <Image
              src={promo.imageUrl}
              alt={promo.title ?? "Promo product"}
              fill
              sizes="70px"
              className="object-contain p-2"
            />
          ) : (
            <span className="text-3xl">💻</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-[#F97316] uppercase tracking-[0.14em] line-clamp-1">
            {promo?.tag ?? promo?.badge ?? "Featured Deal"}
          </p>
          <h3 className="mt-1 text-[15px] font-semibold text-white leading-snug line-clamp-2">
            {promo?.title ?? "Premium gadgets on deal"}
          </h3>
          {promo?.price && (
            <p className={cn("mt-1 text-[17px] font-bold", theme === "blue" ? "text-[#60A5FA] [text-shadow:0_0_20px_rgba(96,165,250,0.4)]" : "text-[#F97316] [text-shadow:0_0_20px_rgba(249,115,22,0.4)]")}>{promo.price}</p>
          )}
        </div>
      </div>
      <FiChevronRight
        size={20}
        className="absolute right-5 bottom-5 text-white/70 transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}

function FlashCountdownCard() {
  return (
    <Link
      href="/store/category/all"
      className="min-h-[132px] rounded-[16px] border border-[rgba(249,115,22,0.2)] bg-[#141414] p-5 flex flex-col justify-center shadow-[0_0_30px_rgba(249,115,22,0.08)]"
    >
      <span className="w-11 h-11 rounded-full bg-linear-to-br from-[#F97316] to-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-[var(--shadow-orange-glow)]">
        <FiZap size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="mt-3 block text-[11px] text-[#666666]">Flash sale ends in</span>
        <span className="mt-1 block text-2xl font-bold tracking-[3px] text-[#F97316] sf-text-glow">16d : 21h</span>
        <span className="sf-btn-primary mt-3 w-full !px-4 !py-2 text-xs">
          View Deals
        </span>
      </span>
    </Link>
  );
}
