'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { productsApi } from "@/lib/api/products";

interface LaptopPromo {
  slug: string
  title: string
  imageUrl: string
  price: string
  badge: string
  ctaText: string
}

const FALLBACK: LaptopPromo = {
  slug: "macbook-pro",
  title: "Macbook Pro",
  imageUrl: "/images/laptop.png",
  price: "$1999",
  badge: "Save up to $200.00",
  ctaText: "Shop Now",
}

export function LaptopPromoSection() {
  const [promo, setPromo] = useState<LaptopPromo>(FALLBACK)

  useEffect(() => {
    productsApi.getLaptopPromo()
      .then((data) => {
        if (data) {
          setPromo({
            slug: data.slug ?? "store/category/all",
            title: data.title,
            imageUrl: data.imageUrl || FALLBACK.imageUrl,
            price: data.salePrice ?? data.price ?? FALLBACK.price,
            badge: data.badge ?? FALLBACK.badge,
            ctaText: data.ctaText ?? FALLBACK.ctaText,
          })
          console.log("[LaptopPromo] ✅ Loaded promo:", data.title)
        }
      })
      .catch((err) => {
        console.error("[LaptopPromo] ❌ Failed to load promo:", err)
        // fallback already in state
      })
  }, [])

  return (
    <section className="bg-[#f5f5f7] py-12 px-6 sm:px-12 md:px-16 lg:px-24 flex items-center justify-center min-h-[400px]">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Content Column */}
        <div className="flex flex-col items-start space-y-5">
          {/* Discount Badge */}
          <span className="bg-[#FF9A2E] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[2px]">
            {promo.badge}
          </span>

          {/* Product Title */}
          <h2 className="text-4xl sm:text-4xl font-bold text-[#111111] tracking-tight">
            {promo.title}
          </h2>

          {/* Product Specs — kept as static marketing copy */}
          <p className="text-[#333333] md:w-[350px] text-lg sm:text-xl font-normal leading-relaxed max-w-md">
            Apple M1 Max Chip. 32GB Unified Memory, 1TB SSD Storage
          </p>

          {/* Shop Button */}
          <Link
            href={`/store/product/${promo.slug}`}
            className="inline-flex items-center gap-2 bg-[#FF9A2E] text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-[4px] hover:bg-[#e68a2e] transition-colors group"
          >
            {promo.ctaText}
            <svg
              className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Right Image Column with Floating Price */}
        <div className="relative flex justify-center md:justify-end items-center">
          {/* Price Badge Circle */}
          <div className=" max-md:hidden absolute lg:top-[-9] left-4 md:left-12 lg:left-20 z-10 bg-[#FF9A2E] text-white w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl border-4 border-white shadow-sm select-none">
            {promo.price}
          </div>

          {/* Laptop Image */}
          <div className="w-full max-w-[380px]">
            <Image
              src={promo.imageUrl}
              alt={promo.title}
              width={500}
              height={300}
              className="object-contain w-full h-auto"
              priority
              unoptimized
            />
          </div>
        </div>

      </div>
    </section>
  );
}
