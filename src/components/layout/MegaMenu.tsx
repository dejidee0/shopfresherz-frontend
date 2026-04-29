'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiChevronRight } from 'react-icons/fi'
import { cn, formatPrice } from '@/lib/utils/format'

// Static mega menu data — replace with API data when categories endpoint is ready
const TOP_CATEGORIES = [
  { id: 1, name: 'Computer & Laptop', slug: 'computer-laptop', hasChildren: true },
  { id: 2, name: 'Computer Accessories', slug: 'computer-accessories', hasChildren: false },
  { id: 3, name: 'SmartPhone', slug: 'mobile-phones', hasChildren: true },
  { id: 4, name: 'Headphone', slug: 'accessories/headphones', hasChildren: false },
  { id: 5, name: 'Mobile Accessories', slug: 'accessories/mobile', hasChildren: false },
  { id: 6, name: 'Gaming Console', slug: 'games-consoles', hasChildren: false },
  { id: 7, name: 'Camera & Photo', slug: 'electronics/cameras', hasChildren: false },
  { id: 8, name: 'TV & Homes Appliances', slug: 'electronics/tv', hasChildren: false },
  { id: 9, name: 'Watchs & Accessories', slug: 'smart-watches', hasChildren: false },
  { id: 10, name: 'Romoss', slug: 'romoss', hasChildren: false },
  { id: 11, name: 'Musical Equipment', slug: 'musical-equipment', hasChildren: false },
]

const SMARTPHONE_BRANDS = [
  { label: 'All', slug: '' },
  { label: 'iPhone', slug: 'apple' },
  { label: 'Samsung', slug: 'samsung' },
  { label: 'Realme', slug: 'realme' },
  { label: 'Xiaomi', slug: 'xiaomi' },
  { label: 'Oppo', slug: 'oppo' },
  { label: 'Vivo', slug: 'vivo' },
  { label: 'OnePlus', slug: 'oneplus' },
  { label: 'Huawei', slug: 'huawei' },
  { label: 'Infinix', slug: 'infinix' },
  { label: 'Tecno', slug: 'tecno' },
]

// Featured products shown in the third panel — ideally fetched from API
const FEATURED_PHONES = [
  {
    id: '1',
    name: 'Samsung Electronics Samsung Galaxy S21 5G',
    price: 700_000,
    image: '/images/products/s21.jpg',
    slug: 'samsung-galaxy-s21-5g',
  },
  {
    id: '2',
    name: 'Simple Mobile 5G LTE Galaxy 12 Mini 512GB Gaming Phone',
    price: 700_000,
    image: '/images/products/pixel.jpg',
    slug: 'simple-mobile-5g-galaxy-12-mini',
  },
  {
    id: '3',
    name: 'Sony DSCHX8 High Zoom Point & Shoot Camera',
    price: 100_000,
    image: '/images/products/sony.jpg',
    slug: 'sony-dschx8',
  },
]

interface MegaMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(3) // SmartPhone default
  const [activeBrand, setActiveBrand] = useState('iPhone')

  if (!isOpen) return null

  const showPhonePanel = activeCategoryId === 3

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div
        className="absolute top-full left-0 z-50 bg-white shadow-xl border-t border-[#E5E7EB] flex"
        style={{ minWidth: 820 }}
        role="navigation"
        aria-label="Category menu"
      >
        {/* Column 1 — Top categories */}
        <div className="w-52 border-r border-[#E5E7EB] py-2">
          {TOP_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              onClick={onClose}
              onMouseEnter={() => setActiveCategoryId(cat.id)}
              className={cn(
                'flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-orange-50 hover:text-[#F5820A]',
                activeCategoryId === cat.id && 'bg-orange-50 text-[#F5820A] font-medium'
              )}
            >
              {cat.name}
              {cat.hasChildren && <FiChevronRight size={14} />}
            </Link>
          ))}
        </div>

        {/* Column 2 — Sub-brands (only for SmartPhone) */}
        {showPhonePanel && (
          <div className="w-36 border-r border-[#E5E7EB] py-2">
            {SMARTPHONE_BRANDS.map((brand) => (
              <button
                key={brand.label}
                onClick={() => setActiveBrand(brand.label)}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm transition-colors hover:bg-orange-50 hover:text-[#F5820A]',
                  activeBrand === brand.label && 'bg-orange-50 text-[#F5820A] font-medium'
                )}
              >
                {brand.label}
              </button>
            ))}
          </div>
        )}

        {/* Column 3 — Featured products */}
        {showPhonePanel && (
          <div className="flex-1 p-4">
            <p className="text-xs font-bold uppercase text-[#6B7280] tracking-wider mb-3">
              Featured Phones
            </p>
            <div className="space-y-3">
              {FEATURED_PHONES.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded shrink-0 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#111111] group-hover:text-[#F5820A] transition-colors line-clamp-2 leading-snug">
                      {product.name}
                    </p>
                    <p className="text-sm font-bold text-[#F5820A] mt-0.5">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Promo card — right panel */}
        {showPhonePanel && (
          <div className="w-56 bg-[#F5820A] p-5 flex flex-col justify-center items-center text-center">
            <div className="w-24 h-24 mb-3">
              {/* Replace with actual promo image */}
              <div className="w-full h-full bg-white/20 rounded-lg" />
            </div>
            <p className="text-white font-bold text-lg leading-tight mb-1">21% Discount</p>
            <p className="text-white/80 text-xs mb-3">
              Escape the noise. It&apos;s time to hear the magic with Xiaomi Earbuds.
            </p>
            <p className="text-white/70 text-xs mb-1">Starting price:</p>
            <p className="text-white font-bold text-lg mb-4">₦10,000</p>
            <Link
              href="/category/accessories"
              onClick={onClose}
              className="w-full bg-white text-[#F5820A] font-semibold text-sm py-2 px-4 rounded text-center hover:bg-orange-50 transition-colors"
            >
              SHOP NOW →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}