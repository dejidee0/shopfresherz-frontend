

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiHeart } from "react-icons/fi";
import { productsApi } from "@/lib/api/products";
import { useAddToFavorites } from "@/lib/hooks/useAddToFavorites";
import type { CategoryWithImage } from "@/lib/types/product";

/* ─── Types ─────────────────────────────────────────────────────────── */

type BadgeType = "best-deals" | "hot" | "sale" | "discount";

type AccessoriesProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  rating: number;
  reviewCount?: number;
  badge?: string | null;
  badgeType?: BadgeType | null;
  categoryId?: number;
};

/* ─── Star Rating ────────────────────────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="5,0.5 6.12,3.38 9.26,3.62 7,5.64 7.72,8.69 5,7.1 2.28,8.69 3,5.64 0.74,3.62 3.88,3.38"
            fill={i < Math.round(rating) ? "#F5820A" : "#D1D5DB"}
          />
        </svg>
      ))}
    </span>
  );
}

/* ─── Badge ──────────────────────────────────────────────────────────── */

const BADGE_CONFIG: Record<BadgeType, { bg: string; label?: string }> = {
  "best-deals": { bg: "bg-[#22C55E]", label: "BEST DEALS" },
  hot:          { bg: "bg-[#EF4444]", label: "HOT" },
  sale:         { bg: "bg-[#F5820A]", label: "SALE" },
  discount:     { bg: "bg-[#22C55E]" },
};

function CardBadge({ badge, badgeType }: { badge: string; badgeType: BadgeType }) {
  const cfg = BADGE_CONFIG[badgeType];
  return (
    <span
      className={`absolute left-0 top-2.5 z-10 rounded-r px-2 py-[3px] text-[9px] font-bold uppercase tracking-wide text-white ${cfg.bg}`}
    >
      {cfg.label ?? badge}
    </span>
  );
}

/* ─── Product Card ───────────────────────────────────────────────────── */

function ProductCard({ product }: { product: AccessoriesProduct }) {
  const [hovered, setHovered] = useState(false);
  const { handleAddToFavorites, isLoading, isFavorited } = useAddToFavorites();

  return (
    <div
      className="group relative rounded-[8px] block overflow-hidden border border-[#E5E7EB] bg-white transition-shadow duration-200 hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {product.badge && product.badgeType && (
        <CardBadge badge={product.badge} badgeType={product.badgeType} />
      )}

      {/* Heart / Add to Favorites — appears on hover */}
      <div
        className={`absolute top-2 right-2 z-20 translate-x-0 opacity-100 transition-all duration-200 ${
          hovered ? "lg:translate-x-0 lg:opacity-100" : "lg:translate-x-2 lg:opacity-0"
        }`}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToFavorites(product.id);
          }}
          disabled={isLoading(product.id)}
          aria-label={isFavorited(product.id) ? "Added to favorites" : "Add to favorites"}
          className={`w-7 h-7 bg-white rounded-full shadow flex items-center justify-center transition-colors
            ${isFavorited(product.id)
              ? "text-[#F5820A]"
              : "text-[#6B7280] hover:text-[#F5820A]"}
            ${isLoading(product.id) ? "opacity-50 cursor-wait" : ""}
          `}
        >
          <FiHeart
            size={13}
            className={isFavorited(product.id) ? "fill-current" : ""}
          />
        </button>
      </div>

      <Link href={`/store/product/${product.slug}`} className="block">
        {/* Image area */}
        <div className="flex h-[148px] sm:h-[160px]">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={180}
              height={180}
              className="h-full w-full transition-transform duration-300 group-hover:scale-[1.04]"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded bg-[#F3F4F6] text-[11px] text-[#9CA3AF]">
              No image available
            </div>
          )}
        </div>

        {/* Info area */}
        <div className="px-3 py-3 space-y-1.5">
          {/* Stars + review count */}
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} />
            {product.reviewCount !== undefined && (
              <span className="text-[10px] text-[#9CA3AF]">
                ({product.reviewCount.toLocaleString()})
              </span>
            )}
          </div>

          {/* Name */}
          <p className="line-clamp-2 text-[12px] font-semibold leading-snug text-[#111111]">
            {product.name}
          </p>

          {/* Price row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[13px] font-bold text-[#F5820A]">
              ₦{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice ? (
              <span className="text-[11px] text-[#9CA3AF] line-through">
                ₦{product.compareAtPrice.toLocaleString()}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────────────────── */

interface AccessoriesPromo {
  slug: string
  title: string
  imageUrl: string
  price: string
  ctaText: string
}

// const ACCESSORIES_PROMO_FALLBACK: AccessoriesPromo = {
//   slug: "store/category/all",
//   title: "Xiaomi True Wireless Earbuds",
//   imageUrl: "/images/pod.png",
//   price: "$299 USD",
//   ctaText: "SHOP NOW",
// }

export function ComputerAccessoriesSection() {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [products, setProducts] = useState<AccessoriesProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [accessoriesPromo, setAccessoriesPromo] = useState<AccessoriesPromo>();

  /* Load exactly 3 categories + accessories promo card */
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await productsApi.getCategories();
        setCategories(
          data
            .map((c: any) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              imageUrl: c.imageUrl ?? c.image ?? "",
            }))
            .slice(0, 3),
        );
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }

    async function loadAccessoriesPromo() {
      try {
        const data = await productsApi.getAccessoriesPromo();
        if (data) {
          setAccessoriesPromo({
            slug: data.slug ?? "store/category/all",
            title: data.title,
            imageUrl: data.imageUrl ,
            price: data.price || "",
            ctaText: data.ctaText,
          });
          console.log("[AccessoriesPromo] ✅ Loaded:", data.title);
        }
      } catch (err) {
        console.error("[AccessoriesPromo] ❌ Failed to load:", err);
        // fallback already in state
      }
    }

    loadCategories();
    loadAccessoriesPromo();
  }, []);

  /* Load products */
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const response = await productsApi.list({
          categoryId: activeCategoryId ?? undefined,
          pageSize: 8,
          sortBy: "best_selling",
        });

        setProducts(
          response.data.map((p: any, idx: number) => {
            const tags: string[] = p.tags ?? [];

            let badge: string | null = null;
            let badgeType: BadgeType | null = null;

            if (tags.includes("best_deals") || idx === 0) {
              badge = "BEST DEALS"; badgeType = "best-deals";
            } else if (tags.includes("hot") || idx === 2) {
              badge = "HOT"; badgeType = "hot";
            } else if (tags.includes("sale") || idx === 5) {
              badge = "SALE"; badgeType = "sale";
            } else if ((tags.includes("discount") || idx === 7) && p.compareAtPrice) {
              const pct = Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
              badge = `${pct}% OFF`; badgeType = "discount";
            }

            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              price: p.price,
              compareAtPrice: p.compareAtPrice,
              imageUrl: p.primaryImageUrl ?? p.imageUrls?.[0] ?? "",
              rating: Number(p.averageRating ?? 4),
              reviewCount: p.reviewCount ?? p.totalReviews ?? undefined,
              categoryId: p.categoryId,
              badge,
              badgeType,
            };
          }),
        );
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [activeCategoryId]);

  return (
    <section className="py-6 sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-5 lg:px-10">

        {/*
          ── Layout strategy ──────────────────────────────────────────────
          mobile/sm/md : flex-col  → full-width grid, then sidebar row below
          lg+          : flex-row  → YOUR original side-by-side layout
          ────────────────────────────────────────────────────────────────
        */}
        <div className="flex flex-col gap-4 lg:flex-row">

          {/* ════════════════ LEFT COLUMN ════════════════ */}
          {/* mobile/sm/md: full width   |   lg+: flex-3 (your original) */}
          <div className="w-full min-w-0 space-y-4 lg:flex-[3]">

            {/* ── Header row ── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <h2 className="shrink-0 text-xl font-bold text-[#111111] sm:text-2xl">
                Computer Accessories
              </h2>

              {/* Filter tabs + browse link */}
              {/* mobile: scrollable single row so tabs never wrap off-screen */}
              <div className="flex items-center gap-x-3 gap-y-2 overflow-x-auto pb-1 text-[11px] font-semibold
                              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                              sm:flex-wrap sm:overflow-visible sm:pb-0 sm:text-xs">

                {/* All Product tab */}
                <button
                  type="button"
                  onClick={() => setActiveCategoryId(null)}
                  className={`shrink-0 pb-0.5 transition-colors ${
                    activeCategoryId === null
                      ? "border-b-2 border-[#F5820A] text-[#F5820A]"
                      : "text-[#6B7280] hover:text-[#F5820A]"
                  }`}
                >
                  All Product
                </button>

                {/* Dynamic category tabs (max 3) */}
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`shrink-0 pb-0.5 transition-colors ${
                      activeCategoryId === cat.id
                        ? "border-b-2 border-[#F5820A] text-[#F5820A]"
                        : "text-[#6B7280] hover:text-[#F5820A]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}

                <Link
                  href="/store/category/all"
                  className="shrink-0 text-[#F5820A] hover:text-[#D97706]"
                >
                  Browse All Product →
                </Link>
              </div>
            </div>

            {/* ── Product grid ──
                  mobile (<640px) : 2 cols
                  sm  (640–767px) : 3 cols
                  md  (768–1023px): 4 cols   ← full width, no sidebar competing
                  lg+ (1024px+)   : 4 cols   ← your original (sidebar is beside)
            */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-[14px] md:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-56 animate-pulse rounded bg-[#F3F4F6]" />
                  ))
                : products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>

          {/* ════════════════ RIGHT SIDEBAR ════════════════
                mobile/sm/md : flex-row  → two cards side-by-side below the grid
                lg+          : flex-col  → YOUR original stacked vertical sidebar
          ══════════════════════════════════════════════════ */}
          <div className="flex flex-col sm:flex-row gap-3 overflow-x-auto pb-1
                          lg:flex-1 lg:flex-col lg:gap-3 lg:overflow-visible lg:pb-0">

            {/* ── Amber earbuds card ── */}
            {/* mobile/sm/md: fixed min-width so both cards share the row evenly */}
            {/* lg+: your exact original styles */}
            <article className="flex min-w-[200px] flex-1 flex-col rounded-2xl bg-[#F59E0B] p-5
                                 sm:min-w-[240px] md:min-w-[260px] lg:min-w-0">

              {/* Earbuds image */}
              <div className="flex justify-center w-full">
                {
                  accessoriesPromo?.imageUrl && (
                    <Image
                  src={accessoriesPromo.imageUrl}
                  alt={accessoriesPromo.title}
                  width={130}
                  height={130}
                  className="object-contain w-[150px]"
                  priority
                  unoptimized
                />
                  )
                }
              </div>

              <div className="flex flex-col gap-2.5 w-full">
                {/* Title */}
                <h3 className="text-white text-center font-bold text-[clamp(18px,5vw,22px)] leading-snug">
                  {accessoriesPromo?.title}
                </h3>

                {/* Description */}
                <p className="text-white/85 text-center text-[clamp(12px,3vw,13px)] leading-relaxed">
                  Escape the noise, it's time to hear the magic with Xiaomi Earbuds.
                </p>

                {/* Price row */}
                <div className="flex items-center justify-center rounded-lg px-3.5 py-2.5 mt-1">
                  <div>
                    <span className="text-[#FFFFFF] text-[11px] tracking-wide">
                      Only for:
                    </span>
                    <span className="text-black p-2 rounded-[3px] ml-2 bg-white font-extrabold text-[clamp(14px,4vw,16px)]">
                      {accessoriesPromo?.price}
                    </span>
                  </div>
                </div>

                {/* Shop Now button */}
                <div className="flex justify-center">
                  <Link
                    href={`/store/product/${accessoriesPromo?.slug}`}
                    className="mt-1 flex gap-[10px] items-center rounded-lg bg-white px-4 py-3 text-[13px] font-bold text-black tracking-wider hover:bg-gray-100 transition-colors"
                  >
                    <span>{accessoriesPromo?.ctaText}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </article>

            {/* ── Dark discount card ── */}
  <article className="flex  min-w-[180px] flex-1 flex-col bg-[#111111] p-5
                     sm:min-w-[210px] md:min-w-[230px] lg:min-w-0">
  <div className="space-y-3">
    {/* "Summer Sales" pill */}
    <span className="inline-flex mx-auto items-center rounded-sm border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
      Summer Sales
    </span>

    {/* Big discount heading */}
    <h3 className="text-[28px] font-bold leading-none tracking-tight text-white sm:text-[32px]">
      37%
      {/* <br /> */}
      DISCOUNT
    </h3>

    {/* Subtext with orange keyword */}
    <p className="text-[11px] uppercase tracking-wide text-white/60">
      Only for{" "}
      <span className="font-semibold text-[#F5820A]">SMARTPHONE</span>{" "}
      product.
    </p>

    {/* Purple Shop Now button */}
    <Link
      href="/store/category/all"
      className="mt-2 flex w-full items-center justify-between rounded-md bg-[#7C3AED] px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#6D28D9]"
    >
      <span>SHOP NOW</span>
      <span className="text-sm">→</span>
    </Link>
  </div>
</article>

          </div>
          {/* ── end sidebar ── */}

        </div>
      </div>
    </section>
  );
}
