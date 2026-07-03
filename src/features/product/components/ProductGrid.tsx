// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { cn } from '@/lib/utils/format'
// import { ProductCard } from './ProductCard'
// import type { Product } from '@/lib/types/product'

// interface Tab {
//   label: string
//   key: string
// }

// interface ProductGridSectionProps {
//   title: string
//   products: Product[]
//   tabs?: Tab[]
//   seeAllHref?: string
//   /** Number of columns on desktop: 4 (default) or 5 */
//   cols?: 4 | 5
//   onTabChange?: (key: string) => void
//   isLoading?: boolean
// }

// function SkeletonCard() {
//   return (
//     <div className="bg-white border border-[#E5E7EB] rounded-card overflow-hidden animate-pulse">
//       <div className="aspect-square bg-[#F5F5F5]" />
//       <div className="p-3 space-y-2">
//         <div className="h-3 bg-[#F5F5F5] rounded w-1/3" />
//         <div className="h-4 bg-[#F5F5F5] rounded w-full" />
//         <div className="h-4 bg-[#F5F5F5] rounded w-4/5" />
//         <div className="h-5 bg-[#F5F5F5] rounded w-1/2" />
//         <div className="h-9 bg-[#F5F5F5] rounded w-full" />
//       </div>
//     </div>
//   )
// }

// export function ProductGridSection({
//   title,
//   products,
//   tabs,
//   seeAllHref,
//   cols = 4,
//   onTabChange,
//   isLoading = false,
// }: ProductGridSectionProps) {
//   const [activeTab, setActiveTab] = useState(tabs?.[0]?.key ?? '')

//   function handleTabClick(key: string) {
//     setActiveTab(key)
//     onTabChange?.(key)
//   }

//   const gridCols =
//     cols === 5
//       ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
//       : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[300px]'

//   return (
//     <section className="py-8" aria-label={title}>
//       <div className="max-w-content mx-auto lg:mx-40 px-2 md:px-4 lg:px-10 ">

//         {/* Header row */}
//         <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
//           <div className="flex items-center gap-4 flex-wrap">
//             {/* Title with orange accent */}
//             <div className="flex items-center gap-2">
//               <div className="w-1 h-7 bg-[#F97316] rounded-full shrink-0" />
//               <h2 className="text-xl font-bold text-[#111111]">{title}</h2>
//             </div>

//             {/* Tabs */}
//             {tabs && tabs.length > 0 && (
//               <div className="flex flex-wrap items-center gap-1 bg-[#F5F5F5] rounded-btn p-1">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab.key}
//                     onClick={() => handleTabClick(tab.key)}
//                     className={cn(
//                       'px-3 py-1 text-xs font-semibold rounded transition-all duration-200',
//                       activeTab === tab.key
//                         ? 'bg-[#F97316] text-white shadow-sm'
//                         : 'text-[#6B7280] hover:text-[#111111]'
//                     )}
//                   >
//                     {tab.label}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* See all link */}
//           {seeAllHref && (
//             <Link
//               href={seeAllHref}
//               className="text-sm text-[#F97316] font-medium hover:underline flex items-center gap-1 shrink-0"
//             >
//               Browse All Product →
//             </Link>
//           )}
//         </div>

//         {/* Grid */}

//         <div className={cn('grid', gridCols)}>
//           {isLoading
//             ? Array.from({ length: cols === 5 ? 10 : 8 }).map((_, i) => (
//                 <SkeletonCard key={i} />
//               ))
//             : products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//         </div>
//       </div>
//     </section>
//   )
// }


'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/format'
import { ProductCard } from './ProductCard'
import type { Product } from '@/lib/types/product'

interface Tab {
  label: string
  key: string
}

interface ProductGridSectionProps {
  title: string
  products: Product[]
  tabs?: Tab[]
  seeAllHref?: string
  cols?: 4 | 5
  onTabChange?: (key: string) => void
  isLoading?: boolean
  /** Optional promo card — occupies col 1, rows 1–2. Only used when cols === 4. */
  promoCard?: React.ReactNode
}

function SkeletonCard() {
  return (
    <div className="bg-[#141414] border border-white/[0.08] rounded-card overflow-hidden animate-pulse">
      <div className="aspect-square bg-[#1F1F1F]" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-white/[0.08] rounded w-1/3" />
        <div className="h-4 bg-white/[0.08] rounded w-full" />
        <div className="h-4 bg-white/[0.08] rounded w-4/5" />
        <div className="h-5 bg-white/[0.08] rounded w-1/2" />
        <div className="h-9 bg-white/[0.08] rounded w-full" />
      </div>
    </div>
  )
}

export function ProductGridSection({
  title,
  products,
  tabs,
  seeAllHref,
  cols = 4,
  onTabChange,
  isLoading = false,
  promoCard,
}: ProductGridSectionProps) {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.key ?? '')

  function handleTabClick(key: string) {
    setActiveTab(key)
    onTabChange?.(key)
  }

  // When a promoCard is present we need explicit auto rows so both row slots
  // are the same height and the spanning card fills them exactly.
  const gridCols =
    cols === 5
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
      : 'grid-cols-2 gap-2 sm:gap-0 sm:grid-cols-3 md:grid-cols-4 auto-rows-[300px]'

  const showPromo = !!promoCard && cols === 4

  return (
    <section className="py-8" aria-label={title}>
      <div className="max-w-content mx-auto lg:mx-40 px-2 md:px-4 lg:px-10">

        {/* Header row */}
        <div className="flex items-cen\ter justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-1 h-7 bg-[#F97316] rounded-full shrink-0" />
              <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            {tabs && tabs.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 bg-white/[0.06] border border-white/[0.08] rounded-btn p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={cn(
                      'px-3 py-1 text-xs font-semibold rounded transition-all duration-200',
                      activeTab === tab.key
                        ? 'bg-[#F97316] text-white shadow-sm shadow-orange-500/20'
                        : 'text-[#A0A0A0] hover:text-white'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="text-sm text-[#F97316] font-medium hover:underline flex items-center gap-1 shrink-0"
            >
              Browse All Product →
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className={cn('grid', gridCols)}>

          {/* Promo card — col 1, spans 2 rows. Hidden below sm to avoid
              breaking the 2-col mobile layout. */}
          {showPromo && (
            <div className="hidden sm:block col-start-1 row-span-2">
              {promoCard}
            </div>
          )}

          {isLoading
            ? Array.from({ length: cols === 5 ? 10 : 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
            : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </section>
  )
}
