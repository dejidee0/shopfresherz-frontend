"use client";

import { useEffect, useState } from "react";
import { Zap, Sparkles } from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { Reveal } from "@/components/motion/Reveal";
import { GradientPromoCard } from "./GradientPromoCard";

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
    <section className="py-10">
      <div className="max-w-content mx-auto px-3 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {flashSale && (
            <Reveal>
              <GradientPromoCard
                icon={<Zap className="w-4 h-4" strokeWidth={2.5} />}
                eyebrow="Flash Sale"
                title={flashSale.title}
                subtitle={flashSale.subtitle}
                ctaText={flashSale.ctaText}
                href={flashSale.slug ? `/store/product/${flashSale.slug}` : "/store/category/all"}
                imageUrl={flashSale.imageUrl}
                accent="orange"
              />
            </Reveal>
          )}

          {storeBanner && (
            <Reveal delay={0.08}>
              <GradientPromoCard
                icon={<Sparkles className="w-4 h-4" strokeWidth={2.5} />}
                eyebrow="Featured"
                title={storeBanner.title}
                subtitle={storeBanner.subtitle}
                ctaText={storeBanner.ctaText}
                href={storeBanner.slug ? `/store/product/${storeBanner.slug}` : "/store/category/all"}
                imageUrl={storeBanner.imageUrl}
                accent="dark"
              />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
