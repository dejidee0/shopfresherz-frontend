'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { TrustSignals } from "@/components/layout/TrustSignals";
import { FlashDealsStrip } from "@/features/product/components/FlashDealsStrip";
import { CategoryGrid } from "@/features/product/components/CategoryGrid";
import { StorePromoSection } from "@/features/product/components/StorePromoSection";
import { ComputerAccessoriesSection } from "@/features/product/components/ComputerAccessoriesSection";
import { LaptopPromoSection } from "@/features/product/components/LaptopPromoSection";
import { TopHighlightsSection } from "@/features/product/components/TopHighlightsSection";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import { productsApi } from "@/lib/api/products";
import type { CategoryWithImage, FlashDeal } from "@/lib/types/product";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useAddToFavorites } from "@/lib/hooks/useAddToFavorites";
import { Reveal } from "@/components/motion/Reveal";

type HomeProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  compareAtPrice?: number;
  image?: string;
  primaryImageUrl?: string;
  imageUrls?: string[];
  badge?: string | null;
  badgeType?: string | null;
  rating: number;
  categoryId?: number;
  categoryName?: string;
  category?: CategoryWithImage | null;
};

// ─── MOCK IMAGES (using picsum as placeholder) ────────────────────────────────
// Replace these src values with your real image paths when ready

// ─── MOCK PRODUCTS — removed because homepage now loads live API data
const BEST_SELLERS: HomeProduct[] = [];
const NEW_ARRIVALS: HomeProduct[] = [];

// ─── PROMO CARD DATA ──────────────────────────────────────────────────────────
// const BEST_DEALS_PROMO = {
//   image: "/images/categories/image2.png",
//   name: "Xbox Series S - 512GB SSD Console with Wireless Controller - EU Versio...",
//   rating: 4.5,
//   reviewCount: 52677,
//   originalPrice: "10,000",
//   salePrice: "5,000",
//   description:
//     "Games built using the Xbox Series X|S development kit showcase unparalleled load times, visuals.",
//   slug: "xbox-series-s-512gb",
//   badge: "32% OFF",
//   hotBadge: true,
// };

// ─── COUNTDOWN HOOK ───────────────────────────────────────────────────────────
function useCountdown(endTime: string) {
  const calc = () => {
    const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
    return {
      days: String(Math.floor(diff / 86400000)).padStart(2, "0"),
      hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
      minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
      seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
    };
  };
  // Start from a stable placeholder so the server-rendered HTML matches the
  // first client render (avoids a hydration mismatch); compute the real value
  // only after mount, then tick every second.
  const [t, setT] = useState({ days: "--", hours: "--", minutes: "--", seconds: "--" });
  useEffect(() => {
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [endTime]);
  return t;
}

// ─── STAR RATING ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="text-[#F97316]">
          {rating >= i ? (
            <FaStar size={11} />
          ) : rating >= i - 0.5 ? (
            <FaStarHalfAlt size={11} />
          ) : (
            <FaRegStar size={11} />
          )}
        </span>
      ))}
    </div>
  );
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: HomeProduct }) {
  const { handleAddToFavorites, isLoading, isFavorited } = useAddToFavorites();
  const imageSrc =
    product.image ??
    product.primaryImageUrl ??
    product.imageUrls?.[0];
  const originalPrice = product.originalPrice ?? product.compareAtPrice;
  const discountPercent =
    originalPrice && originalPrice > product.price
      ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
      : null;

  return (
    <div
      className={`sf-product-card group relative block ${
        isFavorited(product.id) ? "border-2 border-[#F97316]" : "border border-transparent"
      }`}
    >
      {Boolean(discountPercent || product.badge) && (
        <div className="absolute top-2 left-2 z-10">
          <span className="badge badge-orange">
            {discountPercent ? `-${discountPercent}%` : product.badge}
          </span>
        </div>
      )}

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddToFavorites(product.id);
        }}
        disabled={isLoading(product.id)}
        aria-label={isFavorited(product.id) ? "Added to favorites" : "Add to favorites"}
        className={`absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 rounded-full border border-black/[0.08] shadow-sm flex items-center justify-center transition-colors ${
          isFavorited(product.id)
            ? "text-[#F97316]"
            : "text-[#666666] hover:text-[#111111]"
        } ${isLoading(product.id) ? "opacity-50 cursor-wait" : ""}`}
      >
        <FiHeart
          size={14}
          className={isFavorited(product.id) ? "fill-current" : ""}
        />
      </button>

      <Link href={`/store/product/${product.slug}`} className="flex flex-col flex-1 z-10">
        <div className="product-image relative h-[190px] sm:h-[200px] bg-[#F5F2ED] overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="transition-transform duration-300 group-hover:scale-110"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-[#EEEAE3] flex items-center justify-center text-[#888888] text-[11px]">
              No image
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col gap-2 flex-1">
          <p className="text-[10px] text-[#888888] uppercase tracking-[0.8px] leading-none">
            {product.categoryName ?? product.category?.name ?? "ShopFresherz"}
          </p>

          <p className="text-[13px] text-[#111111] font-medium leading-[1.45] line-clamp-2 min-h-[38px] group-hover:text-[#F97316] transition-colors">
            {product.name}
          </p>

          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} />
            <span className="text-[11px] text-[#888888]">(0)</span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-[#F97316] leading-tight">
                ₦{product.price.toLocaleString()}
              </span>
              {originalPrice != null && (
                <span className="text-[11px] text-[#888888] line-through">
                  ₦{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <span className="w-9 h-9 rounded-[10px] bg-linear-to-br from-[#F97316] to-[#EA580C] text-white flex items-center justify-center shrink-0 transition-all shadow-[0_4px_12px_rgba(249,115,22,0.3)] group-hover:scale-105">
              <FiShoppingCart size={16} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
// ─── BEST DEALS PROMO CARD ────────────────────────────────────────────────────
interface PromoProduct {
  slug: string
  name: string
  image: string
  // prices come from the API as formatted strings e.g. "₦7,000"
  originalPrice: string
  salePrice: string
  rating: number
  reviewCount: number
  description: string
  badge: string
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({
  title,
  seeAllHref,
  endTime,
}: {
  title: string;
  seeAllHref: string;
  endTime?: string;
}) {
  const t = useCountdown(endTime ?? new Date(Date.now() + 6 * 3600000).toISOString());

  return (
    <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <span className="h-8 w-1 rounded-[2px] bg-linear-to-b from-[#F97316] to-[#EA580C] shadow-[0_0_16px_rgba(249,115,22,0.4)]" />
        <div className="flex flex-col gap-1">
          <h2 className="sf-section-title">{title}</h2>

        {/* Countdown pill */}
          {endTime && (
          <div className="flex items-center gap-1.5 text-xs text-[#666666]">
            <span>Deals end in</span>
            <div className="sf-badge sf-badge-orange ml-2 flex items-center text-xs font-semibold gap-0.5">
              <span>{t.days}d</span>
              <span className="opacity-60 mx-0.5">:</span>
              <span>{t.hours}h</span>
              <span className="opacity-60 mx-0.5">:</span>
              <span>{t.minutes}m</span>
              <span className="opacity-60 mx-0.5">:</span>
              <span>{t.seconds}s</span>
            </div>
          </div>
          )}
        </div>
      </div>

      <Link
        href={seeAllHref}
        className="text-[13px] text-[#F97316] font-medium hover:text-[#EA580C] flex items-center gap-1 shrink-0"
      >
        Browse all &rarr;
      </Link>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
// NOTE: API fetching is commented out — using mock data below instead.
// When ready, uncomment productsApi calls in getHomeData() and remove mock arrays above.

// export const revalidate = 60;
// async function getHomeData() {
//   const [flashDeals, bestSellers, newArrivals] = await Promise.allSettled([
//     productsApi.flashDeals(),
//     productsApi.bestSellers(6),
//     productsApi.newArrivals(6),
//   ]);
//   return {
//     flashDeals: flashDeals.status === "fulfilled" ? flashDeals.value : [],
//     bestSellers: bestSellers.status === "fulfilled" ? bestSellers.value : [],
//     newArrivals: newArrivals.status === "fulfilled" ? newArrivals.value : [],
//   };
// }

const DEALS_END_TIME = new Date(Date.now() + 16 * 86400000 + 21 * 3600000 + 57 * 60000 + 33000).toISOString();

export default function HomePage() {
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([]);
  const [flashDealsEndTime, setFlashDealsEndTime] = useState<string>(DEALS_END_TIME);
  const [bestSellers, setBestSellers] = useState<HomeProduct[]>(BEST_SELLERS);
  const [newArrivals, setNewArrivals] = useState<HomeProduct[]>(NEW_ARRIVALS);
  const [featuredCategories, setFeaturedCategories] = useState<CategoryWithImage[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState("all");
  const [, setPromoProduct] = useState<PromoProduct | null>(null);

  const filteredNewArrivals =
    activeCategorySlug === "all"
      ? newArrivals
      : newArrivals.filter(
          (product) =>
            product.category?.slug === activeCategorySlug ||
            product.categoryName?.toLowerCase().replace(/\s+/g, "-") === activeCategorySlug,
        );

  useEffect(() => {
    Promise.allSettled([
      productsApi.flashDeals(),
      productsApi.bestSellers(8),
      productsApi.newArrivals(8),
      productsApi.getCategories(),
      productsApi.getBestDealPromo(),
    ])
      .then(([flashDealsResult, bestSellersResult, newArrivalsResult, categoriesResult, promoResult]) => {
        if (flashDealsResult.status === "fulfilled") {
          const deals = flashDealsResult.value;
          setFlashDeals(deals);

          if (deals.length > 0) {
            const sessionEndTime = deals.reduce(
              (earliest, deal) => (deal.endsAt < earliest ? deal.endsAt : earliest),
              deals[0].endsAt,
            );
            setFlashDealsEndTime(sessionEndTime);
          }
        }

        if (bestSellersResult.status === "fulfilled") {
          setBestSellers(
            bestSellersResult.value.map((product) => ({
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              originalPrice: product.compareAtPrice ?? null,
              image: product.primaryImageUrl ?? product.imageUrls?.[0],
              badge: null,
              badgeType: null,
              rating: Math.round(product.averageRating ?? 0),
              categoryId: product.categoryId,
              categoryName: product.categoryName,
              category: product.category,
            })),
          );
        }

        if (newArrivalsResult.status === "fulfilled") {
          setNewArrivals(
            newArrivalsResult.value.map((product) => ({
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              originalPrice: product.compareAtPrice ?? null,
              image: product.primaryImageUrl ?? product.imageUrls?.[0],
              badge: null,
              badgeType: null,
              rating: Math.round(product.averageRating ?? 0),
              categoryId: product.categoryId,
              categoryName: product.categoryName,
              category: product.category,
            })),
          );
        }

        if (categoriesResult.status === "fulfilled") {
          setFeaturedCategories(
            categoriesResult.value
              .map((category: any) => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                imageUrl: category.imageUrl ?? category.image ?? "",
              }))
              .slice(0, 4),
          );
        }

        // Fetch the dedicated Best Deal promo card from /promotions/best-deal
        if (promoResult.status === "fulfilled") {
          const p = promoResult.value;
          if (p) {
            setPromoProduct({
              slug: p.slug ?? p.id,
              name: p.name,
              image: p.imageUrl,
              originalPrice: p.originalPrice,
              salePrice: p.salePrice,
              rating: p.rating ?? 4,
              reviewCount: 0,
              description: p.description,
              badge: p.badge,
            });
          }
        }
      })
      .catch((error) => {
        console.error("Failed to load home products", error);
      });
  }, []);

  return (
    <>
      {/* 1. Hero carousel */}
      <HeroBanner />

      {/* 2. Trust signals */}
      <div className="bg-[#F5F2ED] px-0 py-0">
        <TrustSignals />
      </div>

      {/* 3. Marquee banner */}
      <MarqueeBanner />

      {/* 4. Flash deals */}
      {/* {flashDeals.length > 0 && (
        <FlashDealsStrip deals={flashDeals} sessionEndTime={flashDealsEndTime} />
      )} */}
      
      {/* ─── 6. BEST DEALS ──────────────────────────────────────────────── */}

      <div className="bg-[#FFFFFF] py-10">
        <div className="px-4 md:px-8">
          <SectionHeader
            title="Best Deals"
            seeAllHref="/store/category/all"
            endTime={flashDealsEndTime}
          />

          <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestSellers.slice(0, 8).map((product, i) => (
              <Reveal key={product.id} delay={Math.min(i * 0.05, 0.4)} duration={0.3}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
          {/* Mobile Layout: fallback unchanged 2-column view */}
          <div className="grid grid-cols-2 gap-3  sm:hidden">
            {bestSellers.map((product) => (
              <div key={`mob-${product.id}`} className="col-span-1">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Shop by category */}
      <Reveal>
        <CategoryGrid />
      </Reveal>





      <div className="bg-[#F5F2ED] py-10">
        <div className="px-4 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
            <h2 className="sf-section-title">Featured Products</h2>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide md:justify-center">
              <button
                type="button"
                onClick={() => setActiveCategorySlug("all")}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  activeCategorySlug === "all"
                    ? "bg-[#F97316] text-white"
                    : "border border-black/[0.1] bg-transparent text-[#666666] hover:border-black/[0.25] hover:text-[#111111]"
                }`}
              >
                All
              </button>
              {featuredCategories.slice(0, 3).map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setActiveCategorySlug(category.slug)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                    activeCategorySlug === category.slug
                      ? "bg-[#F97316] text-white"
                      : "border border-black/[0.1] bg-transparent text-[#666666] hover:border-black/[0.25] hover:text-[#111111]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <Link
              href="/store/category/all"
              className="text-[13px] text-[#F97316] font-medium hover:text-[#EA580C]"
            >
              Browse all &rarr;
            </Link>
          </div>

          <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredNewArrivals.slice(0, 8).map((product, i) => (
              <Reveal key={product.id} delay={Math.min(i * 0.05, 0.4)} duration={0.3}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <div className="sm:hidden">
            <div className="grid grid-cols-2 gap-3">
              {filteredNewArrivals.map((product) => (
                <div key={`mob-${product.id}`} className="col-span-1">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Reveal><StorePromoSection /></Reveal>
      <Reveal><ComputerAccessoriesSection /></Reveal>
      <Reveal><LaptopPromoSection /></Reveal>
      <Reveal><TopHighlightsSection /></Reveal>

      {/* Spacer */}
      <div className="h-8" />
    </>
  );
}
