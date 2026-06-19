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
import { FaArrowRight, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { useAddToFavorites } from "@/lib/hooks/useAddToFavorites";

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

const NEW_ARRIVALS_PROMO = {
  tag: "COMPUTER & ACCESSORIES",
  name: "Up to 32% Discount",
  headline: "For the tech lovers",
  subtext: "Computer and accessories",
  label: "starting from",
  price: "100,000",
  slug: "computer-accessories",
  image: "/images/categories/promo.png",
};

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
  const [t, setT] = useState(calc);
  useEffect(() => {
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
        <span key={i} className="text-[#F5820A]">
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
function Badge({ text, type }: { text: string; type: string | null }) {
  const colors: Record<string, string> = {
    soldout: "bg-[#6B7280] text-white",
    discount: "bg-[#F5820A] text-white",
    hot: "bg-[#EF4444] text-white",
    new: "bg-[#10B981] text-white",
  };
  return (
    <span
      className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${colors[type ?? "discount"] ?? colors.discount}`}
    >
      {text}
    </span>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: HomeProduct }) {
  const [hovered, setHovered] = useState(false);
  const { handleAddToFavorites, isLoading, isFavorited } = useAddToFavorites();
  const imageSrc =
    product.image ??
    product.primaryImageUrl ??
    product.imageUrls?.[0];
  const originalPrice = product.originalPrice ?? product.compareAtPrice;

  return (
    <div
      className="group relative block overflow-hidden border border-[#E5E7EB] bg-white transition-shadow duration-200 hover:shadow-md rounded-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-2 left-2 z-10">
          <Badge text={product.badge} type={product.badgeType ?? null} />
        </div>
      )}

      {/* Wishlist + action icons — top right, appear on hover */}
      <div
        className={`absolute top-2 right-2 z-20 flex translate-x-0 flex-col gap-1.5 opacity-100 transition-all duration-200 ${hovered ? "lg:translate-x-0 lg:opacity-100" : "lg:translate-x-2 lg:opacity-0"}`}
      >
        {/* Heart / Add to Favorites */}
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
        {/* <button className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-[#6B7280] hover:text-[#F5820A] transition-colors">
          <FiShoppingCart size={13} />
        </button> */}
        <Link href={`/store/product/${product.slug}`} className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-[#6B7280] hover:text-[#F5820A] transition-colors">
          <FiShoppingCart size={13} />
        </Link>
        
        <Link
        href={`/store/product/${product.slug}`}>
       
        <button className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-[#6B7280] hover:text-[#F5820A] transition-colors">
          <FiEye size={13} />
        </button>
         </Link>
      </div>

      <Link href={`/store/product/${product.slug}`} className="flex flex-col flex-1 z-10">
        {/* Image — fixed height instead of aspect-square */}
        <div
          className=" pt- overflow-hidden"
          style={{ height: '160px' }}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              width={200}
              height={200}
              style={{ mixBlendMode: 'multiply' }}
              className=" w-full h-full transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-[#F9F9F9] flex items-center justify-center text-[#9CA3AF] text-xs">
              No image available
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col gap-1 flex-1">
          <p className="text-[11px] text-[#111111] font-medium leading-snug line-clamp-2 group-hover:text-[#F5820A] transition-colors">
            {product.name}
          </p>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-sm  text-[#F5820A]">
              ₦{product.price.toLocaleString()}
            </span>
            {originalPrice != null && (
              <span className="text-[10px] text-[#9CA3AF] line-through">
                ₦{originalPrice.toLocaleString()}
              </span>
            )}
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

function BestDealsPromoCard({ product }: { product: PromoProduct | null }) {
  // While loading, show a skeleton
  if (!product) {
    return (
      <div className="relative bg-white overflow-hidden flex flex-col h-full animate-pulse">
        <div className="flex-1 bg-[#F3F4F6] m-4 rounded" />
        <div className="p-4 space-y-2 border-t border-[#F0F0F0]">
          <div className="h-2.5 bg-[#F3F4F6] rounded w-3/4" />
          <div className="h-2.5 bg-[#F3F4F6] rounded w-1/2" />
          <div className="h-2.5 bg-[#F3F4F6] rounded w-1/3" />
        </div>
        <div className="p-4 pt-0 flex gap-2">
          <div className="flex-1 h-9 bg-[#F3F4F6] rounded" />
          <div className="w-9 h-9 bg-[#F3F4F6] rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-white overflow-hidden flex flex-col h-full group">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        <Badge text={product.badge} type="discount" />
        <Badge text="HOT" type="hot" />
      </div>

      <Link href={`/store/product/${product.slug}`} className="flex-1 flex flex-col">
        {/* Image — top half */}
        <div className="flex-1  min-h-0">
          <Image
            src={product.image}
            alt={product.name}
            width={220}
            height={220}
            className=" w-full h-full transition-transform duration-300 hover:scale-105"
            style={{ mixBlendMode: 'multiply' }}
            unoptimized
          />
        </div>

        {/* Info — bottom half */}
        <div className="p-4 flex flex-col gap-2 border-t border-[#F0F0F0] flex-1">
          {/* Stars + review count */}
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} />
            <span className="text-[10px] text-[#6B7280]">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Title */}
          <p className="text-[12px] font-bold text-[#111111] leading-snug line-clamp-2 group-hover:text-[#F5820A] transition-colors">
            {product.name}
          </p>

          {/* Description */}
          <p className="text-[10px] text-[#6B7280] leading-relaxed line-clamp-3">
            {product.description}
          </p>

          {/* Price — API returns pre-formatted strings */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#9CA3AF] line-through">
              {product.originalPrice}
            </span>
            <span className="text-base text-[#F5820A]">
              {product.salePrice}
            </span>
          </div>
        </div>
      </Link>

      {/* Buttons */}
      <div className="p-4 pt-0 flex items-center gap-2 mt-auto z-10">
        <Link
          href={`/store/product/${product.slug}`}
          className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-[#F5820A] hover:bg-[#E06B00] text-white text-[11px] font-bold rounded transition-colors"
        >
          <FiShoppingCart size={13} />
          ADD TO CART
        </Link>
        <button className="w-9 h-9 flex items-center justify-center border border-[#E5E7EB] rounded hover:border-[#F5820A] hover:text-[#F5820A] text-[#6B7280] transition-colors">
          <FiEye size={14} />
        </button>
      </div>
    </div>
  )
}

function NewArrivalsPromoCard() {
  return (
    <Link href={`/store/categories/${NEW_ARRIVALS_PROMO.slug}`} className="flex flex-col h-full overflow-hidden group">
      {/* Top — Orange branded area styled to match image exactly */}
      <div className="flex flex-col bg-[#F5820A] items-center text-center px-5 pt-12.5 pb-5 text-white flex-1 select-none">
        {/* Category Header */}
        <p className="text-[11px] font-bold tracking-wide uppercase opacity-90 mb-1">
          COMPUTER & ACCESSORIES
        </p>

        {/* Main Discount Headline */}
        <h3 className="text-3xl font-extrabold tracking-tight leading-none mb-3">
          32% Discount
        </h3>

        {/* Sub-headline */}
        <p className="text-xs font-medium opacity-90 mb-4">
          For all electronics products
        </p>

        {/* Offers Ends In Section */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[11px] font-semibold tracking-wide text-white opacity-90">
            Offers ends in:
          </span>
          <div className="bg-white text-[#111111] text-[10px] font-extrabold tracking-wider px-2.5 py-1.5 rounded uppercase shadow-sm">
            ENDS OF CHRISTMAS
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full max-w-45 h-10 flex items-center justify-center gap-2 bg-white text-[#F5820A] text-xs font-bold rounded shadow-sm group-hover:bg-[#F0F0F0] transition-all active:scale-[0.98]">
          SHOP NOW <FaArrowRight size={11} className="text-[#F5820A]" />
        </div>
      </div>

      {/* Bottom — Product image block remains completely safe */}
      <div className="w-full ">
        <Image
          src={NEW_ARRIVALS_PROMO.image}
          alt="Featured promo product"
          width={180}
          height={160}
          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>
    </Link>
  );
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
    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
      <div className="flex items-center   gap-3 flex-wrap">
        {/* Orange accent bar + title */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-7 bg-[#F5820A] rounded-full" />
          <h2 className="text-xl font-bold text-[#111111]">{title}</h2>
        </div>

        {/* Countdown pill */}
        {endTime && (
          <div className="flex items-center justify-between md:justify-start gap-1.5 w-full md:w-auto">
            <span className="text-xs text-[#6B7280] font-medium">Deals ends in</span>
            <div className="flex items-center bg-[#F5820A] text-white text-[11px] font-bold rounded px-2.5 py-1 gap-0.5 tracking-wide">
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

      <Link
        href={seeAllHref}
        className="text-sm text-[#F5820A] font-medium hover:underline flex items-center gap-1 shrink-0"
      >
        Browse All Product →
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
  const [promoProduct, setPromoProduct] = useState<PromoProduct | null>(null);

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
      <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8">
        <TrustSignals />
      </div>

      {/* 3. Marquee banner */}
      <MarqueeBanner />

      {/* 4. Flash deals */}
      {/* {flashDeals.length > 0 && (
        <FlashDealsStrip deals={flashDeals} sessionEndTime={flashDealsEndTime} />
      )} */}
      
      {/* ─── 6. BEST DEALS ──────────────────────────────────────────────── */}

      <div className="bg-white py-8">
        <div className="max-w-content mx-auto lg:mx-0 px-2 md:px-4 lg:px-10">
          <SectionHeader
            title="Best Deals"
            seeAllHref="/store/category/all"
            endTime={flashDealsEndTime}
          />

          {/* Desktop & Tablet Layout — FIX 1: added gridTemplateRows */}
          <div
            className="hidden sm:grid grid-cols-5 gap-3"
            style={{ gridTemplateRows: 'repeat(2, auto)' }}
          >
            {/* FIX 2: added row-span-2 so promo card stretches full height */}
            <div className="col-span-1 row-span-2">
              <BestDealsPromoCard product={promoProduct} />
            </div>

            {/* FIX 3: added row-span-2 and grid-rows-2 to products container */}
            <div className="col-span-4 row-span-2 grid grid-cols-4 grid-rows-2 gap-3">
              {bestSellers.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
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
      <CategoryGrid />





         {/* ─── 7. FEATURED PRODUCTS ─────────────────────────────────────────────── */}
<div className="py-8">
  <div className="max-w-content mx-auto lg:mx-0 px-2 md:px-4 lg:px-10">
    {/* Renamed the Section Title to Featured Products */}
    {/* <SectionHeader title="Featured Products" seeAllHref="/store/category/all" /> */}

    {/* Desktop & Tablet Layout */}
    <div
      className="hidden sm:grid grid-cols-5 gap-3"
      style={{ gridTemplateRows: 'repeat(2, auto)' }}
    >
      {/* Left Promo Card Column */}
      <div className="col-span-1 row-span-2">
        <NewArrivalsPromoCard />
      </div>

      {/* Right Content Area: Houses the headers and the grid items */}
      <div className="col-span-4 row-span-2 flex flex-col">
        
        {/* NEW ADDITION: Inline Header for Featured Products & Categories */}
        <div className="flex  justify-between pb-2.5  bg-white">
          {/* Subtitle/Text side */}
          <div className="text-[22px] font-bold uppercase tracking-wider text-[#111111]">
            Featured Products
          </div>
          
          {/* Category Tabs side */}
          <div className="flex items-center gap-4 text-xs font-semibold text-[#6B7280]">
            <button
              type="button"
              onClick={() => setActiveCategorySlug("all")}
              className={`transition-colors pb-1 ${
                activeCategorySlug === "all"
                  ? "text-[#F5820A] border-b-2 border-[#F5820A]"
                  : "text-[#6B7280] hover:text-[#F5820A]"
              }`}
            >
              All Product
            </button>
            {featuredCategories.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => setActiveCategorySlug(category.slug)}
                className={`transition-colors pb-1 ${
                  activeCategorySlug === category.slug
                    ? "text-[#F5820A] border-b-2 border-[#F5820A]"
                    : "text-[#6B7280] hover:text-[#F5820A]"
                }`}
              >
                {category.name}
              </button>
            ))}
            <Link
              href="/store/category/all"
              className="text-[#F5820A] hover:text-[#E06B00]"
            >
              Browse All Product →
            </Link>
          </div>
        </div>

        {/* Product Grid Mapping */}
        <div className="grid grid-cols-4 gap-3 flex-1">
          {filteredNewArrivals.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>

    {/* Mobile Layout */}
    <div className="sm:hidden">
     <div className="flex  justify-between pb-2.5  bg-white">
          {/* Subtitle/Text side */}
          <div className="text-[18px] font-bold uppercase tracking-wider text-[#111111]">
            Featured <br/> Products
          </div>
          
          {/* Category Tabs side */}
          <div className="flex items-center gap-4 text-[12px] font-bold text-[#6B7280]">
            
            <Link
              href="/store/category/all"
              className="text-[#F5820A] hover:text-[#E06B00]"
            >
              Browse All Product →
            </Link>
          </div>
        </div>
    <div className="grid grid-cols-2 gap-3 ">
      
      {filteredNewArrivals.map((product) => (
        <div key={`mob-${product.id}`} className="col-span-1">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
    </div>
  </div>
</div>
     
      <StorePromoSection />
      <ComputerAccessoriesSection />
      <LaptopPromoSection />
      <TopHighlightsSection />

      {/* Spacer */}
      <div className="h-8" />
    </>
  );
}
