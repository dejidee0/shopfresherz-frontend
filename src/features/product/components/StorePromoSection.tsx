"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { productsApi } from "@/lib/api/products";

interface PromoBanner {
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
  imageAlt: string;
  badge: string;
}

const FALLBACK: PromoBanner = {
  title: "New Apple\nHomepod Mini",
  subtitle: "Jam-packed with innovation, HomePod mini delivers unexpectedly.",
  ctaText: "Shop Now",
  imageUrl: "/images/speaker.png",
  imageAlt: "Apple Homepod Mini",
  badge: "Introducing",
};

const FALLBACK_2: PromoBanner = {
  title: "Xiaomi Mi 11 Ultra\n12GB+256GB",
  subtitle: "*Data provided by internal laboratories. Industry measurment.",
  ctaText: "Shop Now",
  imageUrl: "/images/xiaomi.png",
  imageAlt: "Xiaomi Mi 11 Ultra",
  badge: "Introducing New",
};

export function StorePromoSection() {
  const [promo, setPromo] = useState<PromoBanner>(FALLBACK);
  const [promo2, setPromo2] = useState<PromoBanner>(FALLBACK_2);

  useEffect(() => {
    productsApi
      .getPromoBanner()
      .then((data) => {
        if (data) {
          setPromo({
            title: data.title,
            subtitle: data.subtitle,
            ctaText: data.ctaText,
            imageUrl: data.imageUrl || FALLBACK.imageUrl,
            imageAlt: data.imageAlt || data.title,
            badge: data.badge,
          });
          setPromo2({
            title: data.title,
            subtitle: data.subtitle,
            ctaText: data.ctaText,
            imageUrl: data.imageUrl || FALLBACK_2.imageUrl,
            imageAlt: data.imageAlt || data.title,
            badge: data.badge,
          });
          console.log("[StorePromo] ✅ Loaded promo banner:", data.title);
        }
      })
      .catch((err) => {
        console.error("[StorePromo] ❌ Failed to load promo banner:", err);
      });
  }, []);

  return (
    <section className="py-8">
      <div className="max-w-content mx-auto px-3 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="relative overflow-hidden rounded-[16px] bg-linear-to-br from-[#F97316] to-[#EA580C] p-7 min-h-[190px]">
            <div className="relative z-10 max-w-[70%]">
              <span className="text-[11px] uppercase text-white/70 tracking-[0.12em]">
                Flash Sale
              </span>
              <h2 className="mt-2 text-[22px] font-bold leading-tight text-white">
                Up to 40% Off Top Brands
              </h2>
              <p className="mt-2 text-xs leading-5 text-white/80">
                {promo.subtitle}
              </p>
              <Link
                href="/store/category/all"
                className="mt-5 inline-flex rounded-[8px] bg-[#F97316] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#EA580C]"
              >
                {promo.ctaText} &rarr;
              </Link>
            </div>
            <div className="absolute right-7 top-1/2 -translate-y-1/2 text-[64px] text-white/80">
              &#9889;
            </div>
          </article>

          <article className="relative overflow-hidden rounded-[16px] bg-linear-to-br from-[#1a1a2e] to-[#2d3561] p-7 min-h-[190px]">
            <div className="relative z-10 max-w-[66%]">
              <span className="text-[11px] uppercase text-white/70 tracking-[0.12em]">
                Laptop Promo
              </span>
              <h2 className="mt-2 text-[22px] font-bold leading-tight text-white whitespace-pre-line">
                {promo2.title}
              </h2>
              <p className="mt-2 text-xs leading-5 text-white/80">
                {promo2.subtitle}
              </p>
              <Link
                href="/store/category/all"
                className="mt-5 inline-flex rounded-[8px] bg-[#F97316] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#EA580C]"
              >
                {promo2.ctaText} &rarr;
              </Link>
            </div>

            <div className="absolute right-5 bottom-0 w-[120px] sm:w-[150px]">
              {promo2.imageUrl && (
                <Image
                  src={promo2.imageUrl}
                  alt={promo2.imageAlt}
                  width={160}
                  height={160}
                  className="h-auto w-full object-contain"
                  priority
                  unoptimized
                />
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
