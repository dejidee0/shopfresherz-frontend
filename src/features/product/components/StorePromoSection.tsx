'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { productsApi } from "@/lib/api/products";

interface PromoBanner {
  title: string
  subtitle: string
  ctaText: string
  imageUrl: string
  imageAlt: string
  badge: string
}

const FALLBACK: PromoBanner = {
  title: "New Apple\nHomepod Mini",
  subtitle: "Jam-packed with innovation, HomePod mini delivers unexpectedly.",
  ctaText: "Shop Now",
  imageUrl: "/images/speaker.png",
  imageAlt: "Apple Homepod Mini",
  badge: "Introducing",
}

const FALLBACK_2: PromoBanner = {
  title: "Xiaomi Mi 11 Ultra\n12GB+256GB",
  subtitle: "*Data provided by internal laboratories. Industry measurment.",
  ctaText: "Shop Now",
  imageUrl: "/images/xiaomi.png",
  imageAlt: "Xiaomi Mi 11 Ultra",
  badge: "Introducing New",
}

export function StorePromoSection() {
  const [promo, setPromo] = useState<PromoBanner>(FALLBACK)
  const [promo2, setPromo2] = useState<PromoBanner>(FALLBACK_2)

  useEffect(() => {
    productsApi.getPromoBanner()
      .then((data) => {
        if (data) {
          // Card 1 — primary fields
          setPromo({
            title: data.title,
            subtitle: data.subtitle ?? FALLBACK.subtitle,
            ctaText: data.ctaText ?? FALLBACK.ctaText,
            imageUrl: data.imageUrl || FALLBACK.imageUrl,
            imageAlt: data.imageAlt || data.title,
            badge: data.badge ?? FALLBACK.badge,
          })
          // Card 2 — same API data, dark card treatment
          // Uses the same image/title but with the dark card's static fallback
          // for subtitle/badge since the API only returns one set of copy
          setPromo2({
            title: data.title,
            subtitle: data.subtitle ?? FALLBACK_2.subtitle,
            ctaText: data.ctaText ?? FALLBACK_2.ctaText,
            imageUrl: data.imageUrl || FALLBACK_2.imageUrl,
            imageAlt: data.imageAlt || data.title,
            badge: data.badge ?? FALLBACK_2.badge,
          })
          console.log("[StorePromo] ✅ Loaded promo banner:", data.title)
        }
      })
      .catch((err) => {
        console.error("[StorePromo] ❌ Failed to load promo banner:", err)
        // fallbacks already in state
      })
  }, [])

  return (
    <section className="py-8">
      <div className="max-w-content mx-auto px-2 sm:px-4 lg:px-10">

        {/* Two cards side by side — stacks on mobile only */}
        <div className="flex flex-col sm:flex-row gap-4">

          {/* ── Card 1: Light Card ── */}
          <article className="relative flex-1 overflow-hidden rounded-xl bg-[#F5F5F5] px-6 py-7 sm:px-7 sm:py-8">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
              {/* Text column */}
              <div className="flex flex-col gap-3">
                <span className="inline-flex w-fit rounded-sm bg-[#F5820A] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.22em] text-white">
                  {promo.badge}
                </span>
                <h2 className="text-lg font-extrabold leading-snug text-[#111111] sm:text-xl lg:text-2xl xl:text-3xl whitespace-pre-line">
                  {promo.title}
                </h2>
                <p className="text-xs leading-5 text-[#6B7280] sm:text-sm sm:leading-6">
                  {promo.subtitle}
                </p>
                <Link
                  href="/store/category/all"
                  className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F5820A] px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#dc7605]"
                >
                  {promo.ctaText} →
                </Link>
              </div>

              {/* Image column */}
              <div className="w-[80px] sm:w-[80px] lg:w-[150px] xl:w-[180px] shrink-0">
                <Image
                  src={promo.imageUrl}
                  alt={promo.imageAlt}
                  width={180}
                  height={180}
                  className="h-auto w-full object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </article>

          {/* ── Card 2: Dark Card ── */}
          <article className="relative flex-1 overflow-hidden rounded-xl bg-[#181818] px-6 py-7 sm:px-7 sm:py-8">
            {/* Purple price badge — kept as design element */}
            <div className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#7C3AED] text-xs font-extrabold leading-tight text-white shadow-lg sm:h-14 sm:w-14 sm:text-sm">
              $590
            </div>

            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
              {/* Text column */}
              <div className="flex flex-col gap-3">
                <span className="inline-flex w-fit rounded-sm bg-[#F5820A] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.22em] text-white">
                  {promo2.badge}
                </span>
                <h2 className="text-lg font-extrabold leading-snug text-white sm:text-xl lg:text-2xl xl:text-3xl whitespace-pre-line">
                  {promo2.title}
                </h2>
                <p className="text-xs leading-5 text-[#9CA3AF] sm:text-sm sm:leading-6">
                  {promo2.subtitle}
                </p>
                <Link
                  href="/store/category/all"
                  className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[#111111] transition-colors hover:bg-[#F0F0F0]"
                >
                  {promo2.ctaText} →
                </Link>
              </div>

              {/* Image column */}
              <div className="w-[80px] sm:w-[100px] lg:w-[130px] xl:w-[160px] shrink-0">
                <Image
                  src={promo2.imageUrl}
                  alt={promo2.imageAlt}
                  width={160}
                  height={220}
                  className="h-auto w-full object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
