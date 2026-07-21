'use client'

import { useEffect, useState } from "react";
import { Zap, Laptop } from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { Reveal } from "@/components/motion/Reveal";
import { GradientPromoCard } from "./GradientPromoCard";

interface LaptopPromo {
  slug: string
  title: string
  imageUrl: string
  price: string
  badge: string
  ctaText: string
}

interface FlashSalePromo {
  slug?: string
  title: string
  subtitle?: string
  ctaText: string
  imageUrl?: string
}

export function LaptopPromoSection() {
  const [promo, setPromo] = useState<LaptopPromo>()
  const [flashSale, setFlashSale] = useState<FlashSalePromo>()

  useEffect(() => {
    productsApi.getLaptopPromo()
      .then((data) => {
        if (data) {
          setPromo({
            slug: data.slug ?? "store/category/all",
            title: data.title,
            imageUrl: data.imageUrl,
            price: data.salePrice ?? data.price ?? "",
            badge: data.badge ?? "",
            ctaText: data.ctaText,
          })
        }
      })
      .catch((err) => {
        console.error("[LaptopPromo] Failed to load promo:", err)
        // fallback already in state
      })

    productsApi.getFlashSalePromos()
      .then((data) => {
        if (data && data.length > 0) {
          const top = [...data].sort((a, b) => a.sortOrder - b.sortOrder)[0];
          setFlashSale({
            slug: top.slug,
            title: top.title,
            subtitle: top.price,
            ctaText: top.ctaText,
            imageUrl: top.imageUrl,
          });
        }
      })
      .catch((err) => {
        console.error("[LaptopPromo] Failed to load flash sale promo:", err)
      })
  }, [])

  const featuredHref = promo?.slug ? `/store/product/${promo.slug}` : "/store/category/all";
  const flashSaleHref = flashSale?.slug ? `/store/product/${flashSale.slug}` : "/store/category/all";

  return (
    <section className="bg-[#0A0A0A] py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 px-4 md:px-8 pb-14">
        <Reveal>
          <GradientPromoCard
            icon={<Zap className="w-4 h-4" strokeWidth={2.5} />}
            eyebrow="Flash Sale"
            title={flashSale?.title ?? "Up to 40% Off Top Brands"}
            subtitle={
              flashSale?.subtitle || "Limited time deals on iPhones, Samsung, Sony and more."
            }
            ctaText={flashSale?.ctaText ?? "View All Deals"}
            href={flashSaleHref}
            imageUrl={flashSale?.imageUrl}
            accent="orange"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <GradientPromoCard
            icon={<Laptop className="w-4 h-4" strokeWidth={2.5} />}
            eyebrow="Featured"
            title={promo?.title ?? "MacBook Pro M4 — Built for Creators"}
            subtitle="M4 chip, 24-hour battery, Liquid Retina XDR display. The ultimate creative machine."
            price={promo?.price ? `From ${promo.price}` : "From ₦2,750,000"}
            ctaText={promo?.ctaText ?? "Shop MacBooks"}
            href={featuredHref}
            imageUrl={promo?.imageUrl}
            accent="dark"
          />
        </Reveal>
      </div>
    </section>
  );
}
