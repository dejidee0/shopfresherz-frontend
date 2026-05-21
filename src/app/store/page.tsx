import { Suspense } from "react";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { TrustSignals } from "@/components/layout/TrustSignals";
import { FlashDealsStrip } from "@/features/product/components/FlashDealsStrip";
import { CategoryGrid } from "@/features/product/components/CategoryGrid";
import { ProductGridSection } from "@/features/product/components/ProductGrid";
import { productsApi } from "@/lib/api/products";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";

// ISR — revalidate every 60 seconds
export const revalidate = 60;

async function getHomeData() {
  const [flashDeals, bestSellers, newArrivals] = await Promise.allSettled([
    productsApi.flashDeals(),
    productsApi.bestSellers(6),
    productsApi.newArrivals(6),
  ]);

  return {
    flashDeals: flashDeals.status === "fulfilled" ? flashDeals.value : [],
    bestSellers: bestSellers.status === "fulfilled" ? bestSellers.value : [],
    newArrivals: newArrivals.status === "fulfilled" ? newArrivals.value : [],
  };
}

const PROMO = {
  tag: "Smartwatches",
  name: "Apple and Android Smartwatches",
  headline: "Heavy on Features.",
  subtext: "Light on Price.",
  label: "Starting from:",
  price: "20,000",
  currency: "NGN",
  image: "/images/categories/appleWatch.png",
  slug: "apple-watch-series-7",
};

const PROMO2 = {
  tag: "COMPUTER & ASSESSORIES",
  name: "Up to 32% Discount",
  headline: "For the tech lovers",
  subtext: "Computer and assessories",
  label: "starting from",
  price: "100,000",
  image: "/images/assessories.png",
};

export default async function HomePage() {
  const { flashDeals, bestSellers, newArrivals } = await getHomeData();

  // Flash deal session end time — use the earliest expiry among active deals
  const sessionEndTime =
    flashDeals.length > 0
      ? flashDeals.reduce(
          (earliest, d) => (d.endsAt < earliest ? d.endsAt : earliest),
          flashDeals[0].endsAt,
        )
      : new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(); // fallback: 6h from now

  return (
    <>
      {/* 1. Hero carousel */}
      <HeroBanner />

      {/* 2. Trust signals */}
      <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8">
        <TrustSignals />
      </div>

      {/* 3. Marquee banner */}
      <MarqueeBanner/>

      {/* 4. Flash deals */}
      {flashDeals.length > 0 && (
        <FlashDealsStrip deals={flashDeals} sessionEndTime={sessionEndTime} />
      )}

      {/* 5. Shop by category */}
      <CategoryGrid />

      {/* 6. Best deals / featured products */}
      <div className="bg-[#F5F5F5] py-2">
        <ProductGridSection
          title="Best Deals"
          products={bestSellers}
          // tabs={[
          //   { label: 'All Products', key: 'all' },
          //   { label: 'Smart Phones', key: 'mobile-phones' },
          //   { label: 'Laptops', key: 'laptops-computers' },
          //   { label: 'Headphones', key: 'accessories/headphones' },
          //   { label: 'TVs', key: 'electronics/tv' },
          // ]}
          seeAllHref="/store/category/all"
          promoCard={
            <div className="h-full bg-white border border-[#E5E7EB] rounded-card overflow-hidden hidden sm:flex flex-col justify-center">
              {/* Product image */}
              <div className="bg-[#F5F5F5] aspect-square flex items-center justify-center p-3 sm:p-4">
                <Image
                  src={PROMO.image}
                  alt={PROMO.name}
                  width={160}
                  height={160}
                  className="object-contain w-full h-full"
                />
              </div>

              {/* Text */}
              <div className="p-3 sm:p-4 text-center">
                <p className="text-[10px] sm:text-xs font-bold text-[#111111] uppercase tracking-wide mb-0.5">
                  {PROMO.tag}
                </p>
                <p className="text-xs md:text-base lg:text-xl font-extrabold text-[#111111] leading-tight">
                  {PROMO.name}
                </p>
                <p className="text-[10px] sm:text-sm font-bold text-[#111111] mt-0.5 sm:mt-1">
                  {PROMO.headline}
                </p>
                <p className="text-[10px] sm:text-sm text-[#6B7280]">
                  {PROMO.subtext}
                </p>

                <div className="mt-2 sm:mt-3 flex flex-col items-center justify-center gap-1 text-[10px] sm:text-sm text-[#6B7280]">
                  <span>{PROMO.label}</span>
                  <span className="font-bold text-xs sm:text-base text-[#111111]">
                    ₦{PROMO.price}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                  <Link
                    href={"/store/category/all"}
                    className="rounded-sm flex items-center justify-center gap-1.5 sm:gap-2 h-8 sm:h-9 bg-linear-to-r from-[#F5820A] to-[#E06B00] text-white text-[10px] sm:text-xs font-semibold rounded-btn hover:shadow-md transition-all"
                  >
                    <FiShoppingCart size={11} />
                    EXPLORE
                  </Link>
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* 7. New arrivals */}
      <ProductGridSection
        title="New Arrivals"
        products={newArrivals}
        seeAllHref="/store/category/all"
        promoCard={
          <div className="hidden md:flex flex-col h-full">
            <div className="flex flex-col gap-3 h-[50%] bg-primary text-white items-center p-4">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-0.5">
                {PROMO2.tag}
              </p>
              <p className="text-xs md:text-base lg:text-xl font-extrabold leading-tight text-center">
                {PROMO2.name}
              </p>
              <p className="text-[10px] sm:text-sm font-bold mt-0.5 sm:mt-1">
                {PROMO2.headline}
              </p>
              <p className="text-[10px] sm:text-sm">{PROMO2.subtext}</p>

              <div className="mt-2 sm:mt-3 flex flex-col items-center justify-center gap-1 text-[10px] sm:text-sm">
                <span>{PROMO2.label}</span>
                <span className="font-bold text-xs sm:text-base">
                  ₦{PROMO2.price}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                  <Link
                    href={"/store/category/all"}
                    className="flex items-center p-4 rounded-sm justify-center gap-1.5 sm:gap-2 h-8 sm:h-9 bg-white text-primary text-[10px] sm:text-xs font-semibold rounded-btn hover:shadow-md transition-all"
                  >
                    SHOP NOW
                    <FaArrowRight/>
                  </Link>
                </div>
            </div>
            <div>
              <Image
                src={PROMO2.image}
                alt={PROMO2.subtext}
                width={160}
                height={160}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        }
      />

      {/* Spacer before footer */}
      <div className="h-8" />
    </>
  );
}
