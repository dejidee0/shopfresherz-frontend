'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { cn } from '@/lib/utils/format'
import type { Category } from '@/lib/types/product'

// Fallback static categories — replace with API data from /categories
const DEFAULT_CATEGORIES: (Category & { imageUrl: string })[] = [
  { id: 4, name: 'Computer & Laptop', slug: 'computer-laptop', imageUrl: '/images/categories/laptop.png' },
  { id: 3, name: 'Electronic', slug: 'electronics', imageUrl: '/images/categories/electronic.png' },
  { id: 10, name: 'Home', slug: 'home-kitchen-tech', imageUrl: '/images/categories/home.png' },
  { id: 6, name: 'Accessories', slug: 'accessories', imageUrl: '/images/categories/accessories.png' },
  { id: 7, name: 'Camera & Photo', slug: 'electronics/cameras', imageUrl: '/images/categories/camera.png' },
  { id: 8, name: 'TV & Homes', slug: 'electronics/tv', imageUrl: '/images/categories/tv.png' },
  { id: 2, name: 'Mobile Phones', slug: 'mobile-phones', imageUrl: '/images/categories/phone.png' },
  { id: 1, name: 'Games & Consoles', slug: 'games-consoles', imageUrl: '/images/categories/gaming.png' },
]

interface CategoryGridProps {
  categories?: (Category & { imageUrl: string })[]
}

export function CategoryGrid({ categories = DEFAULT_CATEGORIES }: CategoryGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 260 : -260, behavior: 'smooth' })
  }

  return (
    <section className="py-10" aria-label="Shop by category">
      <div className="max-w-content mx-auto px-10">

        {/* Section header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-7 bg-[#F5820A] rounded-full shrink-0" />
          <h2 className="text-xl font-bold text-[#111111]">Shop with Categories</h2>
        </div>

        {/* Scrollable row */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center text-[#111111] hover:border-[#F5820A] hover:text-[#F5820A] transition-colors"
            aria-label="Scroll categories left"
          >
            <FiChevronLeft size={16} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {categories.map((cat) => (
              <CategoryItem key={cat.id} category={cat} />
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center text-[#111111] hover:border-[#F5820A] hover:text-[#F5820A] transition-colors"
            aria-label="Scroll categories right"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

function CategoryItem({ category }: { category: Category & { imageUrl: string } }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        'group shrink-0 flex flex-col items-center gap-3',
        'w-30 md:w-35'
      )}
    >
      {/* Icon circle */}
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#F5F5F5] border-2 border-transparent group-hover:border-[#F5820A] transition-all duration-200 overflow-hidden flex items-center justify-center">
        <Image
          src={category.imageUrl}
          alt={category.name}
          width={72}
          height={72}
          className="w-[70%] h-[70%] object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Label */}
      <span className="text-xs font-medium text-[#111111] text-center leading-tight group-hover:text-[#F5820A] transition-colors">
        {category.name}
      </span>
    </Link>
  )
}