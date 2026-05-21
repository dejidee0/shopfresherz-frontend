'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiChevronRight, FiX } from 'react-icons/fi'
import { FiShoppingCart } from 'react-icons/fi'
import { PriceRangeSlider } from '@/components/ui/PriceRangeSlider'
import { cn, formatPrice } from '@/lib/utils/format'
import { productsApi } from '@/lib/api/products'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShopFilters {
  categoryId: number | null
  categorySlug: string | null,
  priceRange: [number, number]
  brands: string[]
  tags: string[],
  rating: number | null,
  inStock: boolean | null
  sortBy: string
}

interface ShopSidebarProps {
  filters: ShopFilters
  onChange: (filters: ShopFilters) => void
  categories?: { label: string;  slug: string; children?: { label: string; slug: string }[] }[]
  brands?: string[]
}

// ─── Static data (swap with API when ready) ───────────────────────────────────

const PRICE_PRESETS: { label: string; range: [number, number] }[] = [
  { label: 'All Price', range: [0, 10_000_000] },
  { label: 'Under ₦20,000', range: [0, 20_000] },
  { label: '₦20,000 to ₦50,000', range: [20_000, 50_000] },
  { label: '₦50,000 to ₦100,000', range: [50_000, 100_000] },
  { label: '₦100,000 to ₦500,000', range: [100_000, 500_000] },
  { label: '₦500,000 to ₦1,000,000', range: [500_000, 1_000_000] },
  { label: '₦2,000,000 to ₦5,000,000', range: [2_000_000, 5_000_000] },
  { label: '₦5,000,000 to ₦10,000,000', range: [5_000_000, 10_000_000] },
]

const POPULAR_TAGS = [
  'Game', 'iPhone', 'TV', 'Asus Laptops',
  'Macbook', 'SSD', 'Graphics Card',
  'Power Bank', 'Smart TV', 'Speaker',
  'Tablet', 'Microwave', 'Samsung',
]


// ─── Featured promo product (bottom of sidebar) ───────────────────────────────
// const PROMO = {
//   tag: 'Apple',
//   name: 'WATCH SERIES 7',
//   headline: 'Heavy on Features.',
//   subtext: 'Light on Price.',
//   label: 'Only for:',
//   price: 299,
//   currency: 'USD',
//   image: '/images/categories/appleWatch.png',
//   slug: 'apple-watch-series-7',
// }

const PROMO = {
  tag: 'Smartwatches',
  name: 'Apple and Android Smartwatches',
  headline: 'Heav  y on Features.',
  subtext: 'Light on Price.',
  label: 'Starting from:',
  price: 20000,
  currency: 'NGN',
  image: '/images/categories/appleWatch.png',
  slug: 'apple-watch-series-7',
}

// ─── Section shell ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[#F5F5F5] pb-5 mb-5 last:border-none last:mb-0">
      <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wide mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

// ─── Main sidebar ─────────────────────────────────────────────────────────────

export function ShopSidebar({ filters, onChange, categories, }: ShopSidebarProps) {
   function set<K extends keyof ShopFilters>(key: K, value: ShopFilters[K]) {
     onChange({ ...filters, [key]: value })
   }

   function toggleBrand(brand: string) {
     const next = filters.brands.includes(brand)
       ? filters.brands.filter((b) => b !== brand)
       : [...filters.brands, brand]
     set('brands', next)
   }

   function toggleTag(tag: string) {
     const next = filters.tags.includes(tag)
       ? filters.tags.filter((t) => t !== tag)
       : [...filters.tags, tag]
     set('tags', next)
   }

  const [loadedBrands, setLoadedBrands] = useState<string[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await productsApi.getBrands();
        const data = response;
        setLoadedBrands(data.map((banner: any) => banner.title));
      } catch (error) {
        console.error(error);
      }
    };

    fetchBrands();
  }, []);

   return (
     <aside className="w-52 sm:w-56 md:w-60 shrink-0 space-y-0 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">

        {/* ── Category ── */}
        <Section title="Category">
          <ul className="space-y-0.5 max-h-64 overflow-y-auto scrollbar-hide flex flex-col">
            {categories?.map((cat, index) => (
              <li key={`${cat.slug}-${index}`}>
                {/* Parent */}
                <button
                  onClick={() => set('categorySlug', cat.slug)}
                  className={cn(
                    'flex items-center gap-2 w-full text-left text-xs sm:text-sm py-1 sm:py-1.5 px-1 rounded transition-colors',
                    filters.categorySlug === cat.slug
                      ? 'text-[#F5820A] font-semibold'
                      : 'text-[#111111] hover:text-[#F5820A]'
                  )}
                >
                  <span
                    className={cn(
                      'w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 shrink-0 transition-colors',
                      filters.categorySlug === cat.slug
                        ? 'border-[#F5820A] bg-[#F5820A]'
                        : 'border-[#D1D5DB]'
                    )}
                  />
                  <span className="truncate">{cat.label}</span>
                </button>

                {/* Children */}
                <ul className="ml-4 sm:ml-5 space-y-0.5">
                  {cat.children?.map((child, childIndex) => (
                    <li key={`${child.slug}-${childIndex}`}>
                      <button
                        onClick={() => set('categorySlug', child.slug)}
                        className={cn(
                          'flex items-center gap-2 w-full text-left text-xs py-0.5 sm:py-1 px-1 rounded transition-colors',
                          filters.categorySlug === child.slug
                            ? 'text-[#F5820A] font-semibold'
                            : 'text-[#6B7280] hover:text-[#F5820A]'
                        )}
                      >
                        <span
                          className={cn(
                            'w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 shrink-0 transition-colors',
                            filters.categorySlug === child.slug
                              ? 'border-[#F5820A] bg-[#F5820A]'
                              : 'border-[#D1D5DB]'
                          )}
                        />
                        <span className="truncate">{child.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Section>

{/* ── Price Range ── */}
       <Section title="Price Range">
         <PriceRangeSlider
           min={0}
           max={10_000_000}
           value={filters.priceRange}
           onChange={(range) => set('priceRange', range)}
         />

         <ul className="space-y-1 mt-2 sm:mt-3">
           {PRICE_PRESETS.map(({ label, range }) => {
             const isActive =
               filters.priceRange[0] === range[0] && filters.priceRange[1] === range[1]
             return (
               <li key={label}>
                 <button
                   onClick={() => set('priceRange', range)}
                   className={cn(
                     'flex items-center gap-2 w-full text-left text-xs sm:text-sm py-0.5 transition-colors',
                     isActive ? 'text-[#F5820A] font-medium' : 'text-[#6B7280] hover:text-[#F5820A]'
                   )}
                 >
                   <span
                     className={cn(
                       'w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 shrink-0',
                       isActive ? 'border-[#F5820A] bg-[#F5820A]' : 'border-[#D1D5DB]'
                     )}
                   />
                   <span className="truncate">{label}</span>
                 </button>
               </li>
             )
           })}
         </ul>
       </Section>

{/* ── Popular Brands ── */}
       <Section title="Popular Brands">
          <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-1.5">
            {loadedBrands.map((brand, index) => {
             const checked = filters.brands.includes(brand)
             return (
               <label
                 key={`${brand}-${index}`}
                 className="flex items-center gap-1 sm:gap-2 cursor-pointer group"
               > 
                 <span
                   onClick={() => toggleBrand(brand)}
                   className={cn(
                     'w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors',
                     checked
                       ? 'bg-[#F5820A] border-[#F5820A]'
                       : 'border-[#D1D5DB] group-hover:border-[#F5820A]'
                   )}
                 >
                   {checked && (
                     <svg width="8" height="6" viewBox="0 0 9 7" fill="none">
                       <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                   )}
                 </span>
                 <span
                   onClick={() => toggleBrand(brand)}
                   className={cn(
                     'text-[10px] sm:text-xs transition-colors truncate',
                     checked ? 'text-[#F5820A] font-medium' : 'text-[#6B7280] group-hover:text-[#111111]'
                   )}
                 >
                   {brand}
                 </span>
               </label>
             )
           })}
         </div>
       </Section>

{/* ── Popular Tags ── */}
       <Section title="Popular Tag">
         <div className="flex flex-wrap gap-1.5 sm:gap-2">
           {POPULAR_TAGS.map((tag) => {
             const active = filters.tags.includes(tag)
             return (
               <button
                 key={tag}
                 onClick={() => toggleTag(tag)}
                 className={cn(
                   'px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs rounded border transition-all duration-150',
                   active
                     ? 'bg-[#F5820A] border-[#F5820A] text-white'
                     : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#F5820A] hover:text-[#F5820A]'
                 )}
               >
                 {tag}
               </button>
             )
           })}
         </div>
       </Section>

      {/* ── Promo card ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-card overflow-hidden hidden sm:block">
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
          <p className="text-xs sm:text-base font-extrabold text-[#111111] leading-tight">{PROMO.name}</p>
          <p className="text-[10px] sm:text-sm font-bold text-[#111111] mt-0.5 sm:mt-1">{PROMO.headline}</p>
          <p className="text-[10px] sm:text-sm text-[#6B7280]">{PROMO.subtext}</p>

          <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1 text-[10px] sm:text-sm text-[#6B7280]">
            <span>{PROMO.label}</span>
            <span className="font-bold text-xs sm:text-base text-[#111111]">₦{PROMO.price.toLocaleString()} {PROMO.currency}</span>
          </div>

          <div className="flex flex-col gap-1.5 sm:gap-2 mt-3 sm:mt-4">
             <Link
              href={"/store/category/all"}
              className="flex items-center justify-center gap-1.5 sm:gap-2 h-8 sm:h-9 bg-linear-to-r from-[#F5820A] to-[#E06B00] text-white text-[10px] sm:text-xs font-semibold rounded-btn hover:shadow-md transition-all"
            >
              <FiShoppingCart size={11} />
              EXPLORE
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}