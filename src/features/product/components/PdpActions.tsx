'use client'

import { useState } from 'react'
import {
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiCopy,
  FiCheck,
  FiTruck,
  FiRefreshCw,
  FiLock,
} from 'react-icons/fi'
import {
  RiFacebookFill,
  RiTwitterXFill,
  RiPinterestFill,
} from 'react-icons/ri'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { useCartStore } from '@/store/cart'
import { ColorSwatches, VariantDropdown } from './VariantSelector'
import { cn, formatPrice, clampQty } from '@/lib/utils/format'
import type { Product } from '@/lib/types/product'
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
    <div className="flex flex-col gap-4">

      {/* ── Rating ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <StarRating rating={product.averageRating ?? 0} />
        <span className="text-[13px] text-[#888888]">
          ({(product.reviewCount ?? 0).toLocaleString()} reviews)
        </span>
        <span className={cn('badge', isOutOfStock ? 'badge-red' : 'badge-green')}>
          {isOutOfStock ? 'Out of Stock' : 'In Stock'}
        </span>
      </div>

      {/* ── Title ── */}
      <h1 className="text-[32px] font-bold text-[#111111] leading-[1.2] tracking-[-0.8px] mt-1 mb-1">
        {product.name}
      </h1>

      {/* ── Meta row ── */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#888888]">
        <span>SKU: {product.sku || 'N/A'}</span>
        <span className="text-[#D1D5DB]">|</span>
        <span>Brand: {product.brandName ?? product.brand?.name ?? 'ShopFresherz'}</span>
        <span className="text-[#D1D5DB]">|</span>
        <span>Category: {product.categoryName ?? product.category?.name ?? 'Gadgets'}</span>
      </div>

      <div className="h-px bg-black/[0.06]" />

      {/* ── Price ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[36px] font-bold text-[#111111]">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && (
          <span className="text-[18px] text-[#BBBBBB] line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
        {discountPercent && (
          <span className="badge badge-orange">-{discountPercent}% OFF</span>
        )}
      </div>

      <div className="h-px bg-black/[0.06]" />

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

      <div className="h-px bg-black/[0.06]" />

      {/* ── Qty + CTA row ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Qty stepper */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setQty((q) => clampQty(q - 1, availableStock))}
            disabled={qty <= 1}
            className="w-10 h-10 rounded-[8px] border border-black/[0.1] bg-[#F5F5F5] flex items-center justify-center text-[#111111] hover:border-[#F97316] disabled:opacity-40 transition-colors"
            aria-label="Decrease quantity"
          >
            <FiMinus size={18} />
          </button>
          <span className="w-12 h-10 border-y border-black/[0.1] bg-[#F5F5F5] flex items-center justify-center text-sm font-medium text-[#111111]">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => clampQty(q + 1, availableStock))}
            disabled={qty >= Math.min(availableStock, 10)}
            className="w-10 h-10 rounded-[8px] border border-black/[0.1] bg-[#F5F5F5] flex items-center justify-center text-[#111111] hover:border-[#F97316] disabled:opacity-40 transition-colors"
            aria-label="Increase quantity"
          >
            <FiPlus size={18} />
          </button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            'flex-1 min-w-[180px] h-12 flex items-center justify-center gap-2 px-4 rounded-[10px] text-[15px] font-semibold transition-colors',
            isOutOfStock
              ? 'bg-[#F0F0F0] text-[#AAAAAA] cursor-not-allowed'
              : 'sf-btn-primary text-white'
          )}
        >
          <FiShoppingCart size={17} />
          ADD TO CART
        </button>

        {/* Buy Now */}
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="shrink-0 w-[140px] h-12 bg-[#111111] text-white border border-[#111111] font-bold rounded-[10px] text-[15px] hover:bg-[#333333] hover:border-[#333333] transition-all disabled:opacity-40"
        >
          BUY NOW
        </button>
      </div>

      {/* ── Wishlist + Share ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-1">
        <button
          onClick={() => setIsWishlisted((v) => !v)}
          className={cn(
            'flex items-center gap-2 text-[13px] transition-colors',
            isWishlisted ? 'text-[#F97316]' : 'text-[#888888] hover:text-[#F97316]'
          )}
        >
          <FiHeart
            size={16}
            className={isWishlisted ? 'fill-current' : ''}
          />
          {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
        </button>

        {/* Share row */}
        <div className="flex items-center gap-2 text-sm text-[#666666]">
          <span className="shrink-0">Share product:</span>
          <button
            onClick={handleCopyLink}
            title="Copy link"
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center border transition-colors',
              copyDone
                ? 'border-[#22C55E] text-[#22C55E]'
                : 'border-black/[0.1] hover:border-[#F97316] hover:text-[#F97316]'
            )}
          >
            <FiCopy size={12} />
          </button>
          <a
            href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full flex items-center justify-center border border-black/[0.1] hover:border-[#1877F2] hover:text-[#1877F2] transition-colors"
          >
            <RiFacebookFill size={12} />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full flex items-center justify-center border border-black/[0.1] hover:border-black hover:text-black transition-colors"
          >
            <RiTwitterXFill size={12} />
          </a>
          <a
            href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&description=${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full flex items-center justify-center border border-black/[0.1] hover:border-[#E60023] hover:text-[#E60023] transition-colors"
          >
            <RiPinterestFill size={12} />
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {[
          { icon: FiCheck, text: 'Genuine Product' },
          { icon: FiTruck, text: 'Fast Delivery' },
          { icon: FiRefreshCw, text: 'Easy Returns' },
          { icon: FiLock, text: 'Secure Payment' },
        ].map(({ icon: Icon, text }) => (
          <span key={text} className="inline-flex items-center gap-1 text-[11px] text-[#888888]">
            <Icon size={12} className="text-[#F97316]" />
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
