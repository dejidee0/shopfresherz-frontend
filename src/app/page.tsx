// import { Suspense } from 'react'
// import { HeroBanner } from '@/components/ui/HeroBanner'
// import { TrustSignals } from '@/components/layout/TrustSignals'
// import { FlashDealsStrip } from '@/features/product/components/FlashDealsStrip'
// import { CategoryGrid } from '@/features/product/components/CategoryGrid'
// import { ProductGridSection } from '@/features/product/components/ProductGrid'
// import { productsApi } from '@/lib/api/products'

// // ISR — revalidate every 60 seconds
// export const revalidate = 60

// async function getHomeData() {
//   const [flashDeals, bestSellers, newArrivals] = await Promise.allSettled([
//     productsApi.flashDeals(),
//     productsApi.bestSellers(8),
//     productsApi.newArrivals(8),
//   ])

//   return {
//     flashDeals: flashDeals.status === 'fulfilled' ? flashDeals.value : [],
//     bestSellers: bestSellers.status === 'fulfilled' ? bestSellers.value : [],
//     newArrivals: newArrivals.status === 'fulfilled' ? newArrivals.value : [],
//   }
// }

// export default async function HomePage() {
//   const { flashDeals, bestSellers, newArrivals } = await getHomeData()

//   // Flash deal session end time — use the earliest expiry among active deals
//   const sessionEndTime =
//     flashDeals.length > 0
//       ? flashDeals.reduce((earliest, d) =>
//           d.endTime < earliest ? d.endTime : earliest, flashDeals[0].endTime)
//       : new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // fallback: 6h from now

//   return (
//     <>
//       {/* 1. Hero carousel */}
//       <HeroBanner />

//       {/* 2. Trust signals */}
//       <div className="max-w-content mx-auto px-10 py-8">
//         <TrustSignals />
//       </div>

//       {/* 3. Flash deals */}
//       {flashDeals.length > 0 && (
//         <FlashDealsStrip deals={flashDeals} sessionEndTime={sessionEndTime} />
//       )}

//       {/* 4. Shop by category */}
//       <CategoryGrid />

//       {/* 5. Best deals / featured products */}
//       <div className="bg-[#F5F5F5] py-2">
//         <ProductGridSection
//           title="Best Deals"
//           products={bestSellers}
//           tabs={[
//             { label: 'All Product', key: 'all' },
//             { label: 'Smart Phone', key: 'mobile-phones' },
//             { label: 'Laptop', key: 'laptops-computers' },
//             { label: 'Headphone', key: 'accessories/headphones' },
//             { label: 'TV', key: 'electronics/tv' },
//           ]}
//           seeAllHref="/category/best-sellers"
//         />
//       </div>

//       {/* 6. New arrivals */}
//       <ProductGridSection
//         title="New Arrivals"
//         products={newArrivals}
//         seeAllHref="/category/new-arrivals"
//       />

//       {/* Spacer before footer */}
//       <div className="h-8" />
//     </>
//   )
// }


const Homepage = () => {
  return (
    <div>page</div>
  )
}

export default Homepage