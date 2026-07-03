'use client'

import { useEffect, useState } from "react";
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

export function LaptopPromoSection() {
  const [promo, setPromo] = useState<LaptopPromo>()

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
          console.log("[LaptopPromo] ✅ Loaded promo:", data.title)
        }
      })
      .catch((err) => {
        console.error("[LaptopPromo] ❌ Failed to load promo:", err)
        // fallback already in state
      })
  }, [])

  const featuredHref = promo?.slug ? `/store/product/${promo.slug}` : "/store/category/all";

  return (
    <section className="bg-[#0A0A0A]">
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4 md:px-8 pb-14"
        style={{ paddingTop: "8px" }}
      >
        {/* ── LEFT CARD — Flash Sale ─────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #F97316 0%, #C2410C 60%, #9A3412 100%)",
            borderRadius: "24px",
            padding: "48px 40px",
            minHeight: "280px",
            border: "1px solid rgba(249,115,22,0.3)",
            boxShadow: "0 20px 60px rgba(249,115,22,0.2)",
          }}
        >
          <div
            className="pointer-events-none absolute"
            style={{
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
              top: "-60px",
              right: "-60px",
            }}
          />

          <span
            className="inline-flex items-center uppercase"
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              padding: "4px 12px",
              borderRadius: "20px",
              marginBottom: "16px",
            }}
          >
            ⚡ FLASH SALE
          </span>

          <h2
            className="text-white"
            style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.15 }}
          >
            Up to 40% Off Top Brands
          </h2>

          <p
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.75)",
              marginTop: "10px",
              marginBottom: "24px",
              maxWidth: "340px",
            }}
          >
            Limited time deals on iPhones, Samsung, Sony and more.
          </p>

          <Link
            href="/store/category/all"
            className="inline-flex items-center transition-transform duration-200 hover:scale-[1.03]"
            style={{
              background: "#fff",
              color: "#F97316",
              fontWeight: 700,
              borderRadius: "10px",
              padding: "12px 24px",
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
            }}
          >
            View All Deals →
          </Link>

          <span
            className="float absolute select-none"
            style={{
              right: "40px",
              bottom: "32px",
              fontSize: "72px",
              opacity: 0.9,
              filter: "drop-shadow(0 0 20px rgba(249,115,22,0.4))",
            }}
            aria-hidden="true"
          >
            ⚡
          </span>
        </div>

        {/* ── RIGHT CARD — MacBook / Premium Tech ────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0D1B3E 0%, #162040 40%, #1a2744 100%)",
            borderRadius: "24px",
            padding: "48px 40px",
            minHeight: "280px",
            border: "1px solid rgba(99,179,237,0.15)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="pointer-events-none absolute"
            style={{
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,179,237,0.08) 0%, transparent 70%)",
              top: "-60px",
              right: "-60px",
            }}
          />

          <span
            className="inline-flex items-center uppercase"
            style={{
              background: "rgba(99,179,237,0.15)",
              color: "#60A5FA",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              padding: "4px 12px",
              borderRadius: "20px",
              marginBottom: "16px",
            }}
          >
            🖥️ FEATURED
          </span>

          <h2
            className="text-white"
            style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.15 }}
          >
            {promo?.title ?? "MacBook Pro M4 — Built for Creators"}
          </h2>

          <p
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.75)",
              marginTop: "10px",
              maxWidth: "360px",
            }}
          >
            M4 chip, 24-hour battery, Liquid Retina XDR display. The ultimate creative machine.
          </p>

          <p
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#60A5FA",
              marginTop: "8px",
              marginBottom: "20px",
            }}
          >
            {promo?.price ? `From ${promo.price}` : "From ₦2,750,000"}
          </p>

          <Link href={featuredHref} className="sf-btn-primary">
            {promo?.ctaText ?? "Shop MacBooks →"}
          </Link>

          <span
            className="float absolute select-none"
            style={{
              right: "40px",
              bottom: "32px",
              fontSize: "72px",
              opacity: 0.9,
              filter: "drop-shadow(0 0 20px rgba(99,179,237,0.4))",
              animationDelay: "-2s",
            }}
            aria-hidden="true"
          >
            💻
          </span>
        </div>
      </div>
    </section>
  );
}
