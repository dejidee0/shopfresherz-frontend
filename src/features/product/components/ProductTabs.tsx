'use client'

import { useState } from 'react'
import {
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiHeadphones,
  FiLock,
} from 'react-icons/fi'
import { cn } from '@/lib/utils/format'
import type { Product } from '@/lib/types/product'

const TABS = [
  { key: 'description', label: 'Description' },
  { key: 'additional', label: 'Additional Information' },
  { key: 'specification', label: 'Specification' },
  { key: 'reviews', label: 'Review' },
] as const

type TabKey = typeof TABS[number]['key']

const FEATURES = [
  { icon: FiShield, text: 'Free 1 Year Warranty' },
  { icon: FiTruck, text: 'Free Shipping & Fasted Delivery' },
  { icon: FiRefreshCw, text: '100% Money-back guarantee' },
  { icon: FiHeadphones, text: '24/7 Customer support' },
  { icon: FiLock, text: 'Secure payment method' },
]

const SHIPPING_INFO = [
  { label: 'Courier:', value: '2 - 4 days' },
  { label: 'Local Shipping:', value: 'up to one week' },
  // { label: 'UPS Ground Shipping:', value: '4 - 6 days, $29.00' },
  // { label: 'Unishop Global Export:', value: '3 - 4 days, $39.00' },
]

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('description')

  return (
    <div className="mt-10 border border-[#E5E7EB] rounded-card overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-[#E5E7EB] overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'shrink-0 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-150 whitespace-nowrap',
              activeTab === tab.key
                ? 'border-[#F5820A] text-[#F5820A]'
                : 'border-transparent text-[#6B7280] hover:text-[#111111]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <DescriptionTab product={product} />
        )}
        {activeTab === 'additional' && (
          <AdditionalTab product={product} />
        )}
        {activeTab === 'specification' && (
          <SpecificationTab product={product} />
        )}
        {activeTab === 'reviews' && (
          <ReviewsTab product={product} />
        )}
      </div>
    </div>
  )
}

// ─── Description tab — 3-col layout matching Figma ────────────────────────────

function DescriptionTab({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left: main description copy */}
      <div className="md:col-span-1">
        <h4 className="text-sm font-bold text-[#111111] mb-3">Description</h4>
        <div
          className="text-sm text-[#6B7280] leading-relaxed space-y-3 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>

      {/* Middle: features list */}
      <div className="md:col-span-1">
        <h4 className="text-sm font-bold text-[#111111] mb-3">Feature</h4>
        <ul className="space-y-3">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2.5 text-sm text-[#6B7280]">
              <Icon size={15} className="text-[#F5820A] shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Right: shipping info */}
      <div className="md:col-span-1">
        <h4 className="text-sm font-bold text-[#111111] mb-3">Shipping Information</h4>
        <ul className="space-y-2">
          {SHIPPING_INFO.map(({ label, value }) => (
            <li key={label} className="text-sm">
              <span className="font-semibold text-[#111111]">{label}</span>{' '}
              <span className="text-[#6B7280]">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── Additional Information ───────────────────────────────────────────────────

function AdditionalTab({ product }: { product: Product }) {
  return (
    <div className="max-w-xl">
      <table className="w-full text-sm border-collapse">
        <tbody>
          {product.attributes &&
            Object.entries(product.attributes).map(([key, value]) => (
              <tr key={key} className="border-b border-[#F5F5F5]">
                <td className="py-2.5 pr-6 font-semibold text-[#111111] w-40 capitalize">
                  {key.replace(/_/g, ' ')}
                </td>
                <td className="py-2.5 text-[#6B7280]">{value}</td>
              </tr>
            ))}
          {(!product.attributes || Object.keys(product.attributes).length === 0) && (
            <tr>
              <td colSpan={2} className="py-4 text-[#6B7280] text-sm">
                No additional information available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// ─── Specification ────────────────────────────────────────────────────────────

function SpecificationTab({ product }: { product: Product }) {
  return (
    <div className="max-w-xl">
      <table className="w-full text-sm border-collapse">
        <tbody>
          <tr className="border-b border-[#F5F5F5]">
            <td className="py-2.5 pr-6 font-semibold text-[#111111] w-40">Brand</td>
            <td className="py-2.5 text-[#6B7280]">{product.brandName}</td>
          </tr>
          <tr className="border-b border-[#F5F5F5]">
            <td className="py-2.5 pr-6 font-semibold text-[#111111]">SKU</td>
            <td className="py-2.5 text-[#6B7280]">{product.sku}</td>
          </tr>
          <tr className="border-b border-[#F5F5F5]">
            <td className="py-2.5 pr-6 font-semibold text-[#111111]">Category</td>
            <td className="py-2.5 text-[#6B7280]">{product.categoryName}</td>
          </tr>
          {product.tags && product.tags.length > 0 && (
            <tr className="border-b border-[#F5F5F5]">
              <td className="py-2.5 pr-6 font-semibold text-[#111111]">Tags</td>
              <td className="py-2.5 text-[#6B7280]">{product.tags.join(', ')}</td>
            </tr>
          )}
          {product.attributes &&
            Object.entries(product.attributes).map(([key, value]) => (
              <tr key={key} className="border-b border-[#F5F5F5]">
                <td className="py-2.5 pr-6 font-semibold text-[#111111] capitalize">
                  {key.replace(/_/g, ' ')}
                </td>
                <td className="py-2.5 text-[#6B7280]">{value}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

function ReviewsTab({ product }: { product: Product }) {
  return (
    <div className="text-center py-10">
      <p className="text-4xl font-extrabold text-[#111111]">
        {product.averageRating.toFixed(1)}
      </p>
      <p className="text-sm text-[#6B7280] mt-1">
        Based on {product.reviewCount.toLocaleString()} reviews
      </p>
      <p className="mt-6 text-sm text-[#6B7280]">
        Reviews are loaded from the API. Integration coming soon.
      </p>
    </div>
  )
}