'use client'

import { useState } from 'react'
import {
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiShare2,
  FiCopy,
} from 'react-icons/fi'
import {
  RiFacebookFill,
  RiTwitterXFill,
  RiPinterestFill,
} from 'react-icons/ri'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { useCartStore } from '@/store/cart'
import { ColorSwatches, VariantDropdown } from './VariantSelector'
import { Badge } from '@/components/ui/Badge'
import { cn, formatPrice, clampQty } from '@/lib/utils/format'
import type { Product, ProductVariant } from '@/lib/types/product'
import { getDiscountPercent, getStockStatus } from '@/lib/utils/productService'

interface PDPActionsProps {
  product: Product
}

export function PDPActions({ product }: PDPActionsProps) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  // Group variants by type (from attributesJson if available)
  const colorVariants = product.variants?.filter((v) => 
    v.attributes?.some(a => a.name.toLowerCase() === 'color')
  ) ?? []
  const sizeVariants = product.variants?.filter((v) => 
    v.attributes?.some(a => a.name.toLowerCase() === 'size')
  ) ?? []
  const memoryVariants = product.variants?.filter((v) => 
    v.attributes?.some(a => a.name.toLowerCase() === 'ram' || a.name.toLowerCase() === 'memory')
  ) ?? []
  const storageVariants = product.variants?.filter((v) => 
    v.attributes?.some(a => a.name.toLowerCase() === 'storage')
  ) ?? []

  const [selectedColor, setSelectedColor] = useState<string | null>(
    colorVariants[0]?.id ?? null
  )
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizeVariants[0]?.id ?? null
  )
  const [selectedMemory, setSelectedMemory] = useState<string | null>(
    memoryVariants[0]?.id ?? null
  )
  const [selectedStorage, setSelectedStorage] = useState<string | null>(
    storageVariants[0]?.id ?? null
  )
  const [qty, setQty] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [copyDone, setCopyDone] = useState(false)

  const availableStock = product.availableQty ?? product.stockQty ?? 0
  const stockStatus = getStockStatus(product)
  const discountPercent = getDiscountPercent(product.price, product.compareAtPrice)
  const isOutOfStock = stockStatus === 'out_of_stock'

   function handleAddToCart() {
     addItem({
        productId: product.id,
        variantId: selectedColor ?? selectedStorage ?? undefined,
        name: product.name,
        slug: product.slug,
        image: product.imageUrls?.[0] ?? '',
        price: product.price,
        quantity: qty,
        stockQty: availableStock,
      })
    openCart()
  }

  function handleBuyNow() {
    handleAddToCart()
    // TODO: navigate to checkout
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopyDone(true)
    setTimeout(() => setCopyDone(false), 2000)
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Rating ── */}
      <div className="flex items-center gap-2">
        <StarRating rating={product.averageRating ?? 0} />
        <span className="text-sm text-[#6B7280]">
          {(product.averageRating ?? 0).toFixed(1)} Star Rating
        </span>
        <span className="text-sm text-[#6B7280]">
          ({(product.reviewCount ?? 0).toLocaleString()} User feedback)
        </span>
      </div>

      {/* ── Title ── */}
      <h1 className="text-xl font-bold text-[#111111] leading-snug">
        {product.name}
      </h1>

      {/* ── Meta row ── */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
        <MetaRow label="Sku:" value={product.sku ?? ''} />
        <MetaRow
          label="Availability:"
          value={
            stockStatus === 'in_stock' || stockStatus === 'low_stock'
              ? 'In Stock'
              : 'Out of Stock'
          }
          valueClass={
            isOutOfStock ? 'text-[#EF4444]' : 'text-[#22C55E] font-semibold'
          }
        />
        <MetaRow label="Brand:" value={product.brandName ?? product.brand?.name ?? ''} />
        <MetaRow label="Category:" value={product.categoryName ?? product.category?.name ?? ''} />
      </div>

      {/* ── Price ── */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-2xl font-extrabold text-[#F5820A]">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && (
          <span className="text-base text-[#6B7280] line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
        {discountPercent && (
          <Badge variant="sale" discountPercent={discountPercent} />
        )}
      </div>

      <div className="h-px bg-[#F5F5F5]" />

      {/* ── Variants ── */}

      {/* Color swatches */}
      {colorVariants.length > 0 && (
        <ColorSwatches
          variants={colorVariants}
          selected={selectedColor}
          onSelect={setSelectedColor}
        />
      )}

      {/* Size + Memory / Storage dropdowns — 2-col grid */}
      {(sizeVariants.length > 0 || memoryVariants.length > 0 || storageVariants.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {sizeVariants.length > 0 && (
            <VariantDropdown
              label="Size"
              variants={sizeVariants}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />
          )}
          {memoryVariants.length > 0 && (
            <VariantDropdown
              label="Memory"
              variants={memoryVariants}
              selected={selectedMemory}
              onSelect={setSelectedMemory}
            />
          )}
          {storageVariants.length > 0 && (
            <VariantDropdown
              label="Storage"
              variants={storageVariants}
              selected={selectedStorage}
              onSelect={setSelectedStorage}
            />
          )}
        </div>
      )}

      <div className="h-px bg-[#F5F5F5]" />

      {/* ── Qty + CTA row ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Qty stepper */}
        <div className="flex items-center border border-[#E5E7EB] rounded-sm overflow-hidden shrink-0">
          <button
            onClick={() => setQty((q) => clampQty(q - 1, availableStock))}
            disabled={qty <= 1}
            className="w-6 h-8 md:w-10 md:h-11 flex items-center justify-center text-[#6B7280] hover:bg-[#F5F5F5] disabled:opacity-40 transition-colors"
            aria-label="Decrease quantity"
          >
            <FiMinus size={14} />
          </button>
          <span className="w-6 md:w-10 text-center text-sm font-bold text-[#111111]">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => clampQty(q + 1, availableStock))}
            disabled={qty >= Math.min(availableStock, 10)}
            className="w-6 h-8 md:w-10 md:h-11 flex items-center justify-center text-[#6B7280] hover:bg-[#F5F5F5] disabled:opacity-40 transition-colors"
            aria-label="Increase quantity"
          >
            <FiPlus size={14} />
          </button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            'flex-1 h-11 flex items-center justify-center gap-2 px-2 md:px-0 rounded-sm text-xs md:text-sm font-semibold transition-all',
            isOutOfStock
              ? 'bg-[#F5F5F5] text-[#6B7280] cursor-not-allowed'
              : 'bg-linear-to-r from-[#F5820A] to-[#E06B00] text-white hover:shadow-lg hover:shadow-orange-200 active:scale-[0.98]'
          )}
        >
          <FiShoppingCart size={15} className='hidden md:block' />
          ADD TO CART
        </button>

        {/* Buy Now */}
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="shrink-0 h-11 px-5 border border-[#E5E7EB] text-[#111111] font-semibold rounded-sm text-sm hover:border-[#F5820A] hover:text-[#F5820A] transition-colors disabled:opacity-40"
        >
          BUY NOW
        </button>
      </div>

      {/* ── Wishlist + Share ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => setIsWishlisted((v) => !v)}
          className={cn(
            'flex items-center gap-2 text-sm font-medium transition-colors',
            isWishlisted ? 'text-[#F5820A]' : 'text-[#6B7280] hover:text-[#F5820A]'
          )}
        >
          <FiHeart
            size={16}
            className={isWishlisted ? 'fill-current' : ''}
          />
          {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
        </button>

        {/* Share row */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <span className="shrink-0">Share product:</span>
          <button
            onClick={handleCopyLink}
            title="Copy link"
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center border transition-colors',
              copyDone
                ? 'border-[#22C55E] text-[#22C55E]'
                : 'border-[#E5E7EB] hover:border-[#F5820A] hover:text-[#F5820A]'
            )}
          >
            <FiCopy size={12} />
          </button>
          <a
            href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E5E7EB] hover:border-[#1877F2] hover:text-[#1877F2] transition-colors"
          >
            <RiFacebookFill size={12} />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E5E7EB] hover:border-black hover:text-black transition-colors"
          >
            <RiTwitterXFill size={12} />
          </a>
          <a
            href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&description=${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E5E7EB] hover:border-[#E60023] hover:text-[#E60023] transition-colors"
          >
            <RiPinterestFill size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function MetaRow({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <p className="text-sm">
      <span className="text-[#6B7280]">{label} </span>
      <span className={cn('font-semibold text-[#111111]', valueClass)}>{value}</span>
    </p>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const full = i < Math.floor(rating)
        const half = !full && i < rating
        return full ? (
          <FaStar key={i} size={13} className="text-[#F59E0B]" />
        ) : half ? (
          <FaStarHalfAlt key={i} size={13} className="text-[#F59E0B]" />
        ) : (
          <FaRegStar key={i} size={13} className="text-[#E5E7EB]" />
        )
      })}
    </div>
  )
}