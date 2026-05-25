// import { Suspense } from "react";
// import { HeroBanner } from "@/components/ui/HeroBanner";
// import { TrustSignals } from "@/components/layout/TrustSignals";
// import { FlashDealsStrip } from "@/features/product/components/FlashDealsStrip";
// import { CategoryGrid } from "@/features/product/components/CategoryGrid";
// import { ProductGridSection } from "@/features/product/components/ProductGrid";
// import { productsApi } from "@/lib/api/products";
// import Link from "next/link";
// import { FiShoppingCart } from "react-icons/fi";
// import Image from "next/image";
// import { FaArrowRight } from "react-icons/fa";
// import { MarqueeBanner } from "@/components/layout/MarqueeBanner";

// // ISR — revalidate every 60 seconds
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

// const PROMO = {
//   tag: "Smartwatches",
//   name: "Apple and Android Smartwatches",
//   headline: "Heavy on Features.",
//   subtext: "Light on Price.",
//   label: "Starting from:",
//   price: "20,000",
//   currency: "NGN",
//   image: "/images/categories/appleWatch.png",
//   slug: "apple-watch-series-7",
// };

// const PROMO2 = {
//   tag: "COMPUTER & ASSESSORIES",
//   name: "Up to 32% Discount",
//   headline: "For the tech lovers",
//   subtext: "Computer and assessories",
//   label: "starting from",
//   price: "100,000",
//   image: "/images/assessories.png",
// };

// export default async function HomePage() {
//   const { flashDeals, bestSellers, newArrivals } = await getHomeData();

//   // Flash deal session end time — use the earliest expiry among active deals
//   const sessionEndTime =
//     flashDeals.length > 0
//       ? flashDeals.reduce(
//         (earliest, d) => (d.endsAt < earliest ? d.endsAt : earliest),
//         flashDeals[0].endsAt,
//       )
//       : new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(); // fallback: 6h from now

//   return (
//     <>
//       {/* 1. Hero carousel */}
//       <HeroBanner />

//       {/* 2. Trust signals */}
//       <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8">
//         <TrustSignals />
//       </div>

//       {/* 3. Marquee banner */}
//       <MarqueeBanner />

//       {/* 4. Flash deals */}
//       {flashDeals.length > 0 && (
//         <FlashDealsStrip deals={flashDeals} sessionEndTime={sessionEndTime} />
//       )}

//       {/* 5. Shop by category */}
//       <CategoryGrid />

//       {/* 6. Best deals / featured products */}
//       <div className="bg-[#F5F5F5] py-2">
//         <ProductGridSection
//           title="Best Deals"
//           products={bestSellers}
//           // tabs={[
//           //   { label: 'All Products', key: 'all' },
//           //   { label: 'Smart Phones', key: 'mobile-phones' },
//           //   { label: 'Laptops', key: 'laptops-computers' },
//           //   { label: 'Headphones', key: 'accessories/headphones' },
//           //   { label: 'TVs', key: 'electronics/tv' },
//           // ]}
//           seeAllHref="/store/category/all"
//           promoCard={
//             <div className="h-full bg-white border border-[#E5E7EB] rounded-card overflow-hidden hidden sm:flex flex-col justify-center">
//               {/* Product image */}
//               <div className="bg-[#F5F5F5] aspect-square flex items-center justify-center p-3 sm:p-4">
//                 <Image
//                   src={PROMO.image}
//                   alt={PROMO.name}
//                   width={160}
//                   height={160}
//                   className="object-contain w-full h-full"
//                 />
//               </div>

//               {/* Text */}
//               <div className="p-3 sm:p-4 text-center">
//                 <p className="text-[10px] sm:text-xs font-bold text-[#111111] uppercase tracking-wide mb-0.5">
//                   {PROMO.tag}
//                 </p>
//                 <p className="text-xs md:text-base lg:text-xl font-extrabold text-[#111111] leading-tight">
//                   {PROMO.name}
//                 </p>
//                 <p className="text-[10px] sm:text-sm font-bold text-[#111111] mt-0.5 sm:mt-1">
//                   {PROMO.headline}
//                 </p>
//                 <p className="text-[10px] sm:text-sm text-[#6B7280]">
//                   {PROMO.subtext}
//                 </p>

//                 <div className="mt-2 sm:mt-3 flex flex-col items-center justify-center gap-1 text-[10px] sm:text-sm text-[#6B7280]">
//                   <span>{PROMO.label}</span>
//                   <span className="font-bold text-xs sm:text-base text-[#111111]">
//                     ₦{PROMO.price}
//                   </span>
//                 </div>

//                 <div className="flex flex-col gap-1.5 sm:gap-2 mt-3 sm:mt-4">
//                   <Link
//                     href={"/store/category/all"}
//                     className="rounded-sm flex items-center justify-center gap-1.5 sm:gap-2 h-8 sm:h-9 bg-linear-to-r from-[#F5820A] to-[#E06B00] text-white text-[10px] sm:text-xs font-semibold rounded-btn hover:shadow-md transition-all"
//                   >
//                     <FiShoppingCart size={11} />
//                     EXPLORE
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           }
//         />
//       </div>

//       {/* 7. New arrivals */}
//       <ProductGridSection
//         title="New Arrivals"
//         products={newArrivals}
//         seeAllHref="/store/category/all"
//         promoCard={
//           <div className="hidden md:flex flex-col h-full">
//             <div className="flex flex-col gap-3 h-[50%] bg-primary text-white items-center p-4">
//               <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-0.5">
//                 {PROMO2.tag}
//               </p>
//               <p className="text-xs md:text-base lg:text-xl font-extrabold leading-tight text-center">
//                 {PROMO2.name}
//               </p>
//               <p className="text-[10px] sm:text-sm font-bold mt-0.5 sm:mt-1">
//                 {PROMO2.headline}
//               </p>
//               <p className="text-[10px] sm:text-sm">{PROMO2.subtext}</p>

//               <div className="mt-2 sm:mt-3 flex flex-col items-center justify-center gap-1 text-[10px] sm:text-sm">
//                 <span>{PROMO2.label}</span>
//                 <span className="font-bold text-xs sm:text-base">
//                   ₦{PROMO2.price}
//                 </span>
//               </div>

//               <div className="flex flex-col gap-1.5 sm:gap-2 mt-3 sm:mt-4">
//                 <Link
//                   href={"/store/category/all"}
//                   className="flex items-center p-4 rounded-sm justify-center gap-1.5 sm:gap-2 h-8 sm:h-9 bg-white text-primary text-[10px] sm:text-xs font-semibold rounded-btn hover:shadow-md transition-all"
//                 >
//                   SHOP NOW
//                   <FaArrowRight />
//                 </Link>
//               </div>
//             </div>
//             <div>
//               <Image
//                 src={PROMO2.image}
//                 alt={PROMO2.subtext}
//                 width={160}
//                 height={160}
//                 className="object-contain w-full h-full"
//               />
//             </div>
//           </div>
//         }
//       />

//       {/* Spacer before footer */}
//       <div className="h-8" />
//     </>
//   );
// }

// 'use client'

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { HeroBanner } from "@/components/ui/HeroBanner";
// import { TrustSignals } from "@/components/layout/TrustSignals";
// import { FlashDealsStrip } from "@/features/product/components/FlashDealsStrip";
// import { CategoryGrid } from "@/features/product/components/CategoryGrid";
// import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
// import { FaArrowRight, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";

// // ─── MOCK IMAGES (using picsum as placeholder) ────────────────────────────────
// // Replace these src values with your real image paths when ready

// // ─── MOCK PRODUCTS ────────────────────────────────────────────────────────────
// const BEST_SELLERS = [
//   {
//     id: "1",
//     name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...",
//     price: 5000,
//     originalPrice: null,
//     image: "https://picsum.photos/seed/drone1/300/300",
//     badge: "SOLD OUT",
//     badgeType: "soldout",
//     rating: 4,
//     slug: "bose-sport-earbuds-1",
//   },
//   {
//     id: "2",
//     name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...",
//     price: 5000,
//     originalPrice: null,
//     image: "https://picsum.photos/seed/phone1/300/300",
//     badge: null,
//     badgeType: null,
//     rating: 4,
//     slug: "bose-sport-earbuds-2",
//   },
//   {
//     id: "3",
//     name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...",
//     price: 5000,
//     originalPrice: null,
//     image: "https://picsum.photos/seed/gamepad1/300/300",
//     badge: "19% OFF",
//     badgeType: "discount",
//     rating: 4,
//     slug: "bose-sport-earbuds-3",
//   },
//   {
//     id: "4",
//     name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...",
//     price: 5000,
//     originalPrice: null,
//     image: "https://picsum.photos/seed/headphones1/300/300",
//     badge: null,
//     badgeType: null,
//     rating: 4,
//     slug: "bose-sport-earbuds-4",
//   },
//   {
//     id: "5",
//     name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...",
//     price: 5000,
//     originalPrice: null,
//     image: "https://picsum.photos/seed/phone2/300/300",
//     badge: null,
//     badgeType: null,
//     rating: 4,
//     slug: "bose-sport-earbuds-5",
//   },
//   {
//     id: "6",
//     name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...",
//     price: 5000,
//     originalPrice: null,
//     image: "https://picsum.photos/seed/drone2/300/300",
//     badge: null,
//     badgeType: null,
//     rating: 4,
//     slug: "bose-sport-earbuds-6",
//   },
//   {
//     id: "7",
//     name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...",
//     price: 5000,
//     originalPrice: null,
//     image: "https://picsum.photos/seed/monitor1/300/300",
//     badge: "HOT",
//     badgeType: "hot",
//     rating: 4,
//     slug: "bose-sport-earbuds-7",
//   },
//   {
//     id: "8",
//     name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...",
//     price: 5000,
//     originalPrice: null,
//     image: "https://picsum.photos/seed/camera1/300/300",
//     badge: "55% OFF",
//     badgeType: "discount",
//     rating: 4,
//     slug: "bose-sport-earbuds-8",
//   },
// ];

// const NEW_ARRIVALS = [
//   {
//     id: "9",
//     name: "Samsung Galaxy Tab S9 - 11 inch Display, 128GB Storage...",
//     price: 120000,
//     originalPrice: 150000,
//     image: "https://picsum.photos/seed/tablet1/300/300",
//     badge: "20% OFF",
//     badgeType: "discount",
//     rating: 5,
//     slug: "samsung-tab-s9",
//   },
//   {
//     id: "10",
//     name: "Apple AirPods Pro (2nd Gen) - Active Noise Cancellation...",
//     price: 85000,
//     originalPrice: null,
//     image: "https://picsum.photos/seed/airpods1/300/300",
//     badge: "NEW",
//     badgeType: "new",
//     rating: 5,
//     slug: "airpods-pro-2",
//   },
//   {
//     id: "11",
//     name: "JBL Charge 5 - Portable Waterproof Bluetooth Speaker...",
//     price: 45000,
//     originalPrice: 55000,
//     image: "https://picsum.photos/seed/speaker1/300/300",
//     badge: null,
//     badgeType: null,
//     rating: 4,
//     slug: "jbl-charge-5",
//   },
//   {
//     id: "12",
//     name: "Logitech MX Master 3S - Wireless Performance Mouse...",
//     price: 32000,
//     originalPrice: null,
//     image: "https://picsum.photos/seed/mouse1/300/300",
//     badge: "HOT",
//     badgeType: "hot",
//     rating: 4,
//     slug: "logitech-mx-master-3s",
//   },
//   {
//     id: "13",
//     name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones...",
//     price: 95000,
//     originalPrice: 110000,
//     image: "https://picsum.photos/seed/sony1/300/300",
//     badge: "13% OFF",
//     badgeType: "discount",
//     rating: 5,
//     slug: "sony-wh1000xm5",
//   },
//   {
//     id: "14",
//     name: "Anker 735 Charger - 65W GaNPrime 3-Port USB Charger...",
//     price: 18000,
//     originalPrice: null,
//     image: "https://picsum.photos/seed/charger1/300/300",
//     badge: null,
//     badgeType: null,
//     rating: 4,
//     slug: "anker-735-charger",
//   },
// ];

// // ─── PROMO CARD DATA ──────────────────────────────────────────────────────────
// const BEST_DEALS_PROMO = {
//   image: "https://picsum.photos/seed/ps5console/400/400",
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

// const NEW_ARRIVALS_PROMO = {
//   tag: "COMPUTER & ACCESSORIES",
//   name: "Up to 32% Discount",
//   headline: "For the tech lovers",
//   subtext: "Computer and accessories",
//   label: "starting from",
//   price: "100,000",
//   image: "https://picsum.photos/seed/laptops/400/400",
// };

// // ─── COUNTDOWN HOOK ───────────────────────────────────────────────────────────
// function useCountdown(endTime: string) {
//   const calc = () => {
//     const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
//     return {
//       days: String(Math.floor(diff / 86400000)).padStart(2, "0"),
//       hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
//       minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
//       seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
//     };
//   };
//   const [t, setT] = useState(calc);
//   useEffect(() => {
//     const id = setInterval(() => setT(calc()), 1000);
//     return () => clearInterval(id);
//   }, [endTime]);
//   return t;
// }

// // ─── STAR RATING ──────────────────────────────────────────────────────────────
// function StarRating({ rating }: { rating: number }) {
//   return (
//     <div className="flex items-center gap-0.5">
//       {[1, 2, 3, 4, 5].map((i) => (
//         <span key={i} className="text-[#F5820A]">
//           {rating >= i ? (
//             <FaStar size={11} />
//           ) : rating >= i - 0.5 ? (
//             <FaStarHalfAlt size={11} />
//           ) : (
//             <FaRegStar size={11} />
//           )}
//         </span>
//       ))}
//     </div>
//   );
// }

// // ─── BADGE ────────────────────────────────────────────────────────────────────
// function Badge({ text, type }: { text: string; type: string | null }) {
//   const colors: Record<string, string> = {
//     soldout: "bg-[#6B7280] text-white",
//     discount: "bg-[#F5820A] text-white",
//     hot: "bg-[#EF4444] text-white",
//     new: "bg-[#10B981] text-white",
//   };
//   return (
//     <span
//       className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${colors[type ?? "discount"] ?? colors.discount}`}
//     >
//       {text}
//     </span>
//   );
// }

// // ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
// function ProductCard({ product }: { product: (typeof BEST_SELLERS)[0] }) {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <div
//       className="bg-white border border-[#E5E7EB]  overflow-hidden flex flex-col group relative"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* Badge */}
//       {product.badge && (
//         <div className="absolute top-2 left-2 z-10">
//           <Badge text={product.badge} type={product.badgeType} />
//         </div>
//       )}

//       {/* Wishlist + action icons — top right, appear on hover */}
//       <div
//         className={`absolute top-2 right-2 z-10 flex flex-col gap-1.5 transition-all duration-200 ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}`}
//       >
//         <button className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-[#6B7280] hover:text-[#F5820A] transition-colors">
//           <FiHeart size={13} />
//         </button>
//         <button className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-[#6B7280] hover:text-[#F5820A] transition-colors">
//           <FiShoppingCart size={13} />
//         </button>
//         <button className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-[#6B7280] hover:text-[#F5820A] transition-colors">
//           <FiEye size={13} />
//         </button>
//       </div>

//       {/* Image */}
//       <div className="bg-[#F9F9F9] aspect-square flex items-center justify-center p-4 overflow-hidden">
//         <Image
//           src={product.image}
//           alt={product.name}
//           width={160}
//           height={160}
//           className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
//           unoptimized
//         />
//       </div>

//       {/* Info */}
//       <div className="p-3 flex flex-col gap-1 flex-1">
//         <p className="text-[11px] text-[#111111] font-medium leading-snug line-clamp-2">
//           {product.name}
//         </p>

//         <div className="flex items-center gap-1.5 mt-0.5">
//           <span className="text-sm font-extrabold text-[#F5820A]">
//             ₦{product.price.toLocaleString()}
//           </span>
//           {product.originalPrice && (
//             <span className="text-[10px] text-[#9CA3AF] line-through">
//               ₦{product.originalPrice.toLocaleString()}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── BEST DEALS PROMO CARD ────────────────────────────────────────────────────
// function BestDealsPromoCard() {
//   return (
//     <div className="relative bg-white border border-[#E5E7EB]  overflow-hidden flex flex-col h-full">
//       {/* Badges */}
//       <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
//         <Badge text={BEST_DEALS_PROMO.badge} type="discount" />
//         {BEST_DEALS_PROMO.hotBadge && <Badge text="HOT" type="hot" />}
//       </div>

//       {/* Image — top half */}
//       <div className="flex-1 bg-[#F9F9F9] flex items-center justify-center p-6 min-h-0">
//         <Image
//           src={BEST_DEALS_PROMO.image}
//           alt={BEST_DEALS_PROMO.name}
//           width={220}
//           height={220}
//           className="object-contain w-full h-full"
//           unoptimized
//         />
//       </div>

//       {/* Info — bottom half */}
//       <div className="p-4 flex flex-col gap-2 border-t border-[#F0F0F0]">
//         {/* Stars + review count */}
//         <div className="flex items-center gap-1.5">
//           <StarRating rating={BEST_DEALS_PROMO.rating} />
//           <span className="text-[10px] text-[#6B7280]">
//             ({BEST_DEALS_PROMO.reviewCount.toLocaleString()})
//           </span>
//         </div>

//         {/* Title */}
//         <p className="text-[12px] font-bold text-[#111111] leading-snug line-clamp-2">
//           {BEST_DEALS_PROMO.name}
//         </p>

//         {/* Description */}
//         <p className="text-[10px] text-[#6B7280] leading-relaxed line-clamp-3">
//           {BEST_DEALS_PROMO.description}
//         </p>

//         {/* Price */}
//         <div className="flex items-center gap-2">
//           <span className="text-[11px] text-[#9CA3AF] line-through">
//             ₦{BEST_DEALS_PROMO.originalPrice}
//           </span>
//           <span className="text-base font-extrabold text-[#F5820A]">
//             ₦{BEST_DEALS_PROMO.salePrice}
//           </span>
//         </div>

//         {/* Buttons */}
//         <div className="flex items-center gap-2 mt-1">
//           <Link
//             href={`/store/product/${BEST_DEALS_PROMO.slug}`}
//             className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-[#F5820A] hover:bg-[#E06B00] text-white text-[11px] font-bold rounded transition-colors"
//           >
//             <FiShoppingCart size={13} />
//             ADD TO CARD
//           </Link>
//           <button className="w-9 h-9 flex items-center justify-center border border-[#E5E7EB] rounded hover:border-[#F5820A] hover:text-[#F5820A] text-[#6B7280] transition-colors">
//             <FiEye size={14} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── NEW ARRIVALS PROMO CARD ──────────────────────────────────────────────────
// function NewArrivalsPromoCard() {
//   return (
//     <div className="flex flex-col h-full rounded-lg overflow-hidden border border-[#E5E7EB]">
//       {/* Top — orange branded area */}
//       <div className="flex flex-col items-center justify-center gap-2 p-5 bg-[#F5820A] text-white flex-1">
//         <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">
//           {NEW_ARRIVALS_PROMO.tag}
//         </p>
//         <p className="text-base font-extrabold text-center leading-tight">
//           {NEW_ARRIVALS_PROMO.name}
//         </p>
//         <p className="text-xs font-semibold">{NEW_ARRIVALS_PROMO.headline}</p>
//         <p className="text-[11px] opacity-80">{NEW_ARRIVALS_PROMO.subtext}</p>
//         <div className="flex flex-col items-center gap-0.5 mt-1 text-[11px]">
//           <span className="opacity-80">{NEW_ARRIVALS_PROMO.label}</span>
//           <span className="font-extrabold text-sm">₦{NEW_ARRIVALS_PROMO.price}</span>
//         </div>
//         <Link
//           href="/store/category/all"
//           className="mt-2 flex items-center gap-1.5 px-5 py-2 bg-white text-[#F5820A] text-[11px] font-bold rounded hover:shadow-md transition-all"
//         >
//           SHOP NOW <FaArrowRight size={10} />
//         </Link>
//       </div>

//       {/* Bottom — product image */}
//       <div className="bg-[#F9F9F9] flex items-center justify-center p-4">
//         <Image
//           src={NEW_ARRIVALS_PROMO.image}
//           alt={NEW_ARRIVALS_PROMO.subtext}
//           width={180}
//           height={160}
//           className="object-contain"
//           unoptimized
//         />
//       </div>
//     </div>
//   );
// }

// // ─── SECTION HEADER ───────────────────────────────────────────────────────────
// function SectionHeader({
//   title,
//   seeAllHref,
//   endTime,
// }: {
//   title: string;
//   seeAllHref: string;
//   endTime?: string;
// }) {
//   const t = useCountdown(endTime ?? new Date(Date.now() + 6 * 3600000).toISOString());

//   return (
//     <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
//       <div className="flex items-center gap-3 flex-wrap">
//         {/* Orange accent bar + title */}
//         <div className="flex items-center gap-2">
//           <div className="w-1 h-7 bg-[#F5820A] rounded-full" />
//           <h2 className="text-xl font-bold text-[#111111]">{title}</h2>
//         </div>

//         {/* Countdown pill */}
//         {endTime && (
//           <div className="flex items-center gap-1.5">
//             <span className="text-xs text-[#6B7280] font-medium">Deals ends in</span>
//             <div className="flex items-center bg-[#F5820A] text-white text-[11px] font-bold rounded px-2.5 py-1 gap-0.5 tracking-wide">
//               <span>{t.days}d</span>
//               <span className="opacity-60 mx-0.5">:</span>
//               <span>{t.hours}h</span>
//               <span className="opacity-60 mx-0.5">:</span>
//               <span>{t.minutes}m</span>
//               <span className="opacity-60 mx-0.5">:</span>
//               <span>{t.seconds}s</span>
//             </div>
//           </div>
//         )}
//       </div>

//       <Link
//         href={seeAllHref}
//         className="text-sm text-[#F5820A] font-medium hover:underline flex items-center gap-1 shrink-0"
//       >
//         Browse All Product →
//       </Link>
//     </div>
//   );
// }

// // ─── PAGE ─────────────────────────────────────────────────────────────────────
// // NOTE: API fetching is commented out — using mock data below instead.
// // When ready, uncomment productsApi calls in getHomeData() and remove mock arrays above.

// // export const revalidate = 60;
// // async function getHomeData() {
// //   const [flashDeals, bestSellers, newArrivals] = await Promise.allSettled([
// //     productsApi.flashDeals(),
// //     productsApi.bestSellers(6),
// //     productsApi.newArrivals(6),
// //   ]);
// //   return {
// //     flashDeals: flashDeals.status === "fulfilled" ? flashDeals.value : [],
// //     bestSellers: bestSellers.status === "fulfilled" ? bestSellers.value : [],
// //     newArrivals: newArrivals.status === "fulfilled" ? newArrivals.value : [],
// //   };
// // }

// const DEALS_END_TIME = new Date(Date.now() + 16 * 86400000 + 21 * 3600000 + 57 * 60000 + 33000).toISOString();

// export default function HomePage() {
//   // TODO: replace with real data — const { flashDeals, bestSellers, newArrivals } = await getHomeData();
//   const bestSellers = BEST_SELLERS;
//   const newArrivals = NEW_ARRIVALS;

//   return (
//     <>
//       {/* 1. Hero carousel */}
//       <HeroBanner />

//       {/* 2. Trust signals */}
//       <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8">
//         <TrustSignals />
//       </div>

//       {/* 3. Marquee banner */}
//       <MarqueeBanner />

//       {/* 4. Flash deals — commented out until API is ready */}
//       {/* <FlashDealsStrip deals={flashDeals} sessionEndTime={sessionEndTime} /> */}

//       {/* 5. Shop by category */}
//       <CategoryGrid />

//       {/* ─── 6. BEST DEALS ──────────────────────────────────────────────── */}
//     <div className="bg-[#F5F5F5] py-8">
//         <div className="max-w-content mx-auto lg:mx-0 px-2 md:px-4 lg:px-10">
//           <SectionHeader
//             title="Best Deals"
//             seeAllHref="/store/category/all"
//             endTime={DEALS_END_TIME}
//           />

//           {/* Desktop & Tablet Layout (Shared structural outer border) */}
//           <div className="hidden sm:grid grid-cols-5 border border-[#E5E7EB] bg-white  overflow-hidden">

//             {/* GRID 1 DIV: Large promo banner (Spans 1 col, 2 rows) */}
//             <div className="col-span-1 border-r border-[#E5E7EB]">
//               <BestDealsPromoCard />
//             </div>

//             {/* GRID 2 DIV: Clean container for the 8 products (Spans 4 cols) */}
//             <div className="col-span-4 grid grid-cols-4">
//               {bestSellers.slice(0, 8).map((product, i) => {
//                 // Determine layout rows dynamically to handle clean bottom borders
//                 const isTopRow = i < 4;
//                 const isLastInRow = (i + 1) % 4 === 0;

//                 return (
//                   <div
//                     key={product.id}
//                     className={`bg-white transition-colors duration-200
//                       ${isTopRow ? "border-b border-[#E5E7EB]" : ""} 
//                       ${!isLastInRow ? "border-r border-[#E5E7EB]" : ""}
//                     `}
//                   >
//                     <ProductCard product={product} />
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Mobile Layout: fallback unchanged 2-column view */}
//           <div className="grid grid-cols-2 gap-2 sm:hidden">
//             {bestSellers.map((product) => (
//               <div key={`mob-${product.id}`} className="col-span-1">
//                 <ProductCard product={product} />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ─── 7. NEW ARRIVALS ─────────────────────────────────────────────── */}
//       <div className="py-8">
//         <div className="max-w-content mx-auto lg:mx-40 px-2 md:px-4 lg:px-10">
//           <SectionHeader title="New Arrivals" seeAllHref="/store/category/all" />

//           <div
//             className="grid gap-2 sm:gap-3"
//             style={{
//               gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
//               gridAutoRows: "280px",
//             }}
//           >
//             {/* Promo card */}
//             <div className="hidden md:block col-start-1 row-start-1 row-span-2">
//               <NewArrivalsPromoCard />
//             </div>

//             {/* Product cards */}
//             {newArrivals.map((product, i) => {
//               const row = Math.floor(i / 4) + 1;
//               const col = (i % 4) + 2;
//               return (
//                 <div
//                   key={product.id}
//                   style={{ gridColumn: col, gridRow: row }}
//                   className="hidden sm:block"
//                 >
//                   <ProductCard product={product} />
//                 </div>
//               );
//             })}

//             {/* Mobile */}
//             {newArrivals.map((product) => (
//               <div key={`mob-${product.id}`} className="sm:hidden col-span-1">
//                 <ProductCard product={product} />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Spacer */}
//       <div className="h-8" />
//     </>
//   );
// }


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
const BEST_DEALS_PROMO = {
  image: "/images/categories/image2.png",
  name: "Xbox Series S - 512GB SSD Console with Wireless Controller - EU Versio...",
  rating: 4.5,
  reviewCount: 52677,
  originalPrice: "10,000",
  salePrice: "5,000",
  description:
    "Games built using the Xbox Series X|S development kit showcase unparalleled load times, visuals.",
  slug: "xbox-series-s-512gb",
  badge: "32% OFF",
  hotBadge: true,
};

const NEW_ARRIVALS_PROMO = {
  tag: "COMPUTER & ACCESSORIES",
  name: "Up to 32% Discount",
  headline: "For the tech lovers",
  subtext: "Computer and accessories",
  label: "starting from",
  price: "100,000",
  slug: "macbook-pro-14-m2-max",
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
  const imageSrc =
    product.image ??
    product.primaryImageUrl ??
    product.imageUrls?.[0];
  const originalPrice = product.originalPrice ?? product.compareAtPrice;

  return (
    <div
      className="bg-white overflow-hidden flex flex-col group relative h-full"
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
        className={`absolute top-2 right-2 z-20 flex flex-col gap-1.5 transition-all duration-200 ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}`}
      >
        <button className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-[#6B7280] hover:text-[#F5820A] transition-colors">
          <FiHeart size={13} />
        </button>
        <button className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-[#6B7280] hover:text-[#F5820A] transition-colors">
          <FiShoppingCart size={13} />
        </button>
        <button className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-[#6B7280] hover:text-[#F5820A] transition-colors">
          <FiEye size={13} />
        </button>
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
function BestDealsPromoCard() {
  return (
    <div className="relative bg-white overflow-hidden flex flex-col h-full group">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        <Badge text={BEST_DEALS_PROMO.badge} type="discount" />
        {BEST_DEALS_PROMO.hotBadge && <Badge text="HOT" type="hot" />}
      </div>

      <Link href={`/store/product/${BEST_DEALS_PROMO.slug}`} className="flex-1 flex flex-col">
        {/* Image — top half */}
        <div className="flex-1  flex items-center justify-center p-6 min-h-0">
          <Image
            src={BEST_DEALS_PROMO.image}
            alt={BEST_DEALS_PROMO.name}
            width={220}
            height={220}
            className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
            style={{ mixBlendMode: 'multiply' }}
            unoptimized
          />
        </div>

        {/* Info — bottom half */}
        <div className="p-4 flex flex-col gap-2 border-t border-[#F0F0F0] flex-1">
          {/* Stars + review count */}
          <div className="flex items-center gap-1.5">
            <StarRating rating={BEST_DEALS_PROMO.rating} />
            <span className="text-[10px] text-[#6B7280]">
              ({BEST_DEALS_PROMO.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Title */}
          <p className="text-[12px] font-bold text-[#111111] leading-snug line-clamp-2 group-hover:text-[#F5820A] transition-colors">
            {BEST_DEALS_PROMO.name}
          </p>

          {/* Description */}
          <p className="text-[10px] text-[#6B7280] leading-relaxed line-clamp-3">
            {BEST_DEALS_PROMO.description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#9CA3AF] line-through">
              ₦{BEST_DEALS_PROMO.originalPrice}
            </span>
            <span className="text-base  text-[#F5820A]">
              ₦{BEST_DEALS_PROMO.salePrice}
            </span>
          </div>
        </div>
      </Link>

      {/* Buttons — Kept outside the main Link to maintain their own functionality */}
      <div className="p-4 pt-0 flex items-center gap-2 mt-auto z-10">
        <Link
          href={`/store/product/${BEST_DEALS_PROMO.slug}`}
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
  );
}

function NewArrivalsPromoCard() {
  return (
    <Link href={`/store/product/${NEW_ARRIVALS_PROMO.slug}`} className="flex flex-col h-full overflow-hidden group">
      {/* Top — Orange branded area styled to match image exactly */}
      <div className="flex flex-col bg-[#F5820A] items-center text-center px-5 pt-[50px] pb-5 text-white flex-1 select-none">
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
        <div className="w-full max-w-[180px] h-10 flex items-center justify-center gap-2 bg-white text-[#F5820A] text-xs font-bold rounded shadow-sm group-hover:bg-[#F0F0F0] transition-all active:scale-[0.98]">
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
      <div className="flex items-center gap-3 flex-wrap">
        {/* Orange accent bar + title */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-7 bg-[#F5820A] rounded-full" />
          <h2 className="text-xl font-bold text-[#111111]">{title}</h2>
        </div>

        {/* Countdown pill */}
        {endTime && (
          <div className="flex items-center gap-1.5">
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
    ])
      .then(([flashDealsResult, bestSellersResult, newArrivalsResult, categoriesResult]) => {
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

      <div className="bg-[#F5F5F5] py-8">
        <div className="max-w-content mx-auto lg:mx-0 px-2 md:px-4 lg:px-10">
          <SectionHeader
            title="Best Deals"
            seeAllHref="/store/category/all"
            endTime={flashDealsEndTime}
          />

          {/* Desktop & Tablet Layout — FIX 1: added gridTemplateRows */}
          <div
            className="hidden sm:grid grid-cols-5 border border-[#E5E7EB] bg-white overflow-hidden"
            style={{ gridTemplateRows: 'repeat(2, auto)' }}
          >
            {/* FIX 2: added row-span-2 so promo card stretches full height */}
            <div className="col-span-1 row-span-2 border-r border-[#E5E7EB]">
              <BestDealsPromoCard />
            </div>

            {/* FIX 3: added row-span-2 and grid-rows-2 to products container */}
            <div className="col-span-4 row-span-2 grid grid-cols-4 grid-rows-2 gap-0">
              {bestSellers.slice(0, 8).map((product, i) => {
                const isTopRow = i < 4;
                const isLastInRow = (i + 1) % 4 === 0;

                return (
                  <div
                    key={product.id}
                    className={`bg-white transition-colors gap-0 duration-200
                      ${isTopRow ? "border-b border-[#E5E7EB]" : ""} 
                      ${!isLastInRow ? "border-r border-[#E5E7EB]" : ""}
                    `}
                  >
                    <ProductCard product={product} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Layout: fallback unchanged 2-column view */}
          <div className="grid grid-cols-2  sm:hidden">
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
      className="hidden sm:grid grid-cols-5 gap-[20px]  bg-white overflow-hidden"
      style={{ gridTemplateRows: 'repeat(2, auto)' }}
    >
      {/* Left Promo Card Column */}
      <div className="col-span-1 row-span-2 border-r border-[#E5E7EB]">
        <NewArrivalsPromoCard />
      </div>

      {/* Right Content Area: Houses the headers and the grid items */}
      <div className="col-span-4 row-span-2 flex flex-col">
        
        {/* NEW ADDITION: Inline Header for Featured Products & Categories */}
        <div className="flex  justify-between pb-[10px]  bg-white">
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
        <div className="grid grid-cols-4 gap-0 flex-1">
          {filteredNewArrivals.slice(0, 8).map((product, i) => {
            const isTopRow = i < 4;
            const isLastInRow = (i + 1) % 4 === 0;

            return (
              <div
                key={product.id}
                className={`bg-white transition-colors gap-0 duration-200
                  ${isTopRow ? "border-b border-[#E5E7EB]" : ""} 
                  ${!isLastInRow ? "border-r border-[#E5E7EB]" : ""}
                `}
              >
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* Mobile Layout */}
    <div className="grid grid-cols-2 sm:hidden">
      {filteredNewArrivals.map((product) => (
        <div key={`mob-${product.id}`} className="col-span-1">
          <ProductCard product={product} />
        </div>
      ))}
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