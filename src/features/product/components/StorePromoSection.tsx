"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { productsApi } from "@/lib/api/products";

interface FlashSalePromo {
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
  slug?: string;
}

interface StoreBannerPromo {
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
  imageAlt: string;
  slug?: string;
}

export function StorePromoSection() {
  const [flashSale, setFlashSale] = useState<FlashSalePromo | null>(null);
  const [storeBanner, setStoreBanner] = useState<StoreBannerPromo | null>(null);

  useEffect(() => {
    productsApi
      .getFlashSalePromos()
      .then((data) => {
        if (data && data.length > 0) {
          const top = [...data].sort((a, b) => a.sortOrder - b.sortOrder)[0];
          setFlashSale({
            title: top.title,
            subtitle: top.price ?? "",
            ctaText: top.ctaText,
            imageUrl: top.imageUrl,
            slug: top.slug,
          });
        }
      })
      .catch((err) => {
        console.error("[StorePromo] Failed to load flash sale promo:", err);
      });

    productsApi
      .getStorePromoBanner()
      .then((data) => {
        if (data) {
          setStoreBanner({
            title: data.title,
            subtitle: data.subtitle,
            ctaText: data.ctaText,
            imageUrl: data.imageUrl,
            imageAlt: data.imageAlt || data.title,
            slug: data.slug,
          });
        }
      })
      .catch((err) => {
        console.error("[StorePromo] Failed to load store promo banner:", err);
      });
  }, []);

  if (!flashSale && !storeBanner) return null;

  return (
    <section className="py-8">
      <div className="max-w-content mx-auto px-3 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flashSale && (
            <article className="relative overflow-hidden rounded-[16px] bg-linear-to-br from-[#F97316] to-[#EA580C] p-7 min-h-[190px]">
              <div className="relative z-10 max-w-[70%]">
                <span className="text-[11px] uppercase text-white/70 tracking-[0.12em]">
                  Flash Sale
                </span>
                <h2 className="mt-2 text-[22px] font-bold leading-tight text-white whitespace-pre-line">
                  {flashSale.title}
                </h2>
                {flashSale.subtitle && (
                  <p className="mt-2 text-xs leading-5 text-white/80">{flashSale.subtitle}</p>
                )}
                <Link
                  href={flashSale.slug ? `/store/product/${flashSale.slug}` : "/store/category/all"}
                  className="mt-5 inline-flex rounded-[8px] bg-white/15 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-white/25"
                >
                  {flashSale.ctaText} &rarr;
                </Link>
              </div>
              <div className="absolute right-7 top-1/2 -translate-y-1/2 text-[64px] text-white/80">
                &#9889;
              </div>
            </article>
          )}

          {storeBanner && (
            <article className="relative overflow-hidden rounded-[16px] bg-linear-to-br from-[#1a1a2e] to-[#2d3561] p-7 min-h-[190px]">
              <div className="relative z-10 max-w-[66%]">
                <span className="text-[11px] uppercase text-white/70 tracking-[0.12em]">
                  Featured
                </span>
                <h2 className="mt-2 text-[22px] font-bold leading-tight text-white whitespace-pre-line">
                  {storeBanner.title}
                </h2>
                {storeBanner.subtitle && (
                  <p className="mt-2 text-xs leading-5 text-white/80">{storeBanner.subtitle}</p>
                )}
                <Link
                  href={storeBanner.slug ? `/store/product/${storeBanner.slug}` : "/store/category/all"}
                  className="mt-5 inline-flex rounded-[8px] bg-[#F97316] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#EA580C]"
                >
                  {storeBanner.ctaText} &rarr;
                </Link>
              </div>

              <div className="absolute right-5 bottom-0 w-[120px] sm:w-[150px]">
                {storeBanner.imageUrl && (
                  <Image
                    src={storeBanner.imageUrl}
                    alt={storeBanner.imageAlt}
                    width={160}
                    height={160}
                    className="h-auto w-full object-contain"
                    priority
                    unoptimized
                  />
                )}
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
