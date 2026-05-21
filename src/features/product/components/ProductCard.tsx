'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { cn, formatPrice } from '@/lib/utils/format'
import { Badge, CardBadge } from '@/components/ui/Badge'
import { useCartStore } from '@/store/cart'
import { type Product } from '@/lib/types/product'
import { getDiscountPercent, getStockStatus } from '@/lib/utils/productService'

interface ProductCardProps {
  product: Product
  /** 'grid' = standard card | 'list' = horizontal layout (future) */
  layout?: 'grid'
  showQuickView?: boolean
  onWishlistToggle?: (productId: string) => void
  isWishlisted?: boolean
  className?: string
}

export function ProductCard({
  product,
  layout = 'grid',
  showQuickView = true,
  onWishlistToggle,
  isWishlisted = false,
  className,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imgError, setImgError] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const stockStatus = getStockStatus(product)
  const discountPercent = getDiscountPercent(product.price, product.compareAtPrice)
  const isOutOfStock = stockStatus === 'out_of_stock'
  const isLowStock = stockStatus === 'low_stock'
  const isNew =
    product.createdAt ? Date.now() - new Date(product.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000 : false

   const displayImage = imgError
     ? '/images/device-placeholder.jpg'
     : product.imageUrls?.[0] ?? '/images/device-placeholder.jpg'

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (isOutOfStock) return

addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.imageUrls?.[0] ?? '',
        price: product.price,
        quantity: 1,
        stockQty: product.availableQty ?? product.stockQty ?? 0,
      })
    openCart()
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onWishlistToggle?.(product.id)
  }

  return (
    <Link
      href={`/store/product/${product.slug}`}
      className={cn(
        'group relative flex flex-col bg-white border border-[#E5E7EB] rounded-card overflow-hidden',
        'transition-all duration-200 hover:border-[#F5820A] hover:shadow-md',
        isOutOfStock && 'opacity-90',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image area ── */}
      <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden">
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Badge variant="out_of_stock" />
          </div>
        )}

        {/* Badges */}
        {discountPercent && !isOutOfStock && (
          <CardBadge variant="sale" discountPercent={discountPercent} />
        )}
        {isNew && !discountPercent && !isOutOfStock && (
          <CardBadge variant="new" />
        )}

        {/* Product image */}
        <Image
          src={displayImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            'object-contain p-4 transition-transform duration-300',
            isHovered && !isOutOfStock && 'scale-105'
          )}
          onError={() => setImgError(true)}
        />

        {/* Hover action buttons */}
        {showQuickView && (
          <div
            className={cn(
              'absolute top-2 right-2 flex flex-col gap-1.5 transition-all duration-200',
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
            )}
          >
            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors',
                isWishlisted
                  ? 'bg-[#F5820A] text-white'
                  : 'bg-white text-[#6B7280] hover:bg-[#F5820A] hover:text-white'
              )}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart size={14} className={isWishlisted ? 'fill-current' : ''} />
            </button>

            {/* Quick view */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // TODO: open quick view modal
              }}
              className="w-8 h-8 rounded-full bg-white text-[#6B7280] hover:bg-[#F5820A] hover:text-white flex items-center justify-center shadow-sm transition-colors"
              aria-label="Quick view"
            >
              <FiEye size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── Product info ── */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        {/* Brand */}
        <p className="text-[11px] text-[#6B7280] uppercase tracking-wide font-medium">
          {product.brandName}
        </p>

        {/* Name */}
        <h3 className="text-sm text-[#111111] leading-snug line-clamp-2 group-hover:text-[#F5820A] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                size={11}
                className={
                  i < Math.round(product.averageRating)
                    ? 'text-[#F59E0B]'
                    : 'text-[#E5E7EB]'
                }
              />
            ))}
          </div>
          <span className="text-[11px] text-[#6B7280]">({product.reviewCount})</span>
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-[#F5820A]">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-[#6B7280] line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Low stock warning */}
        {isLowStock && (
          <p className="text-[11px] text-[#F59E0B] font-medium">
            Only {(product.availableQty ?? product.stockQty ?? 0) - (product.reservedQty ?? 0)} left!
          </p>
        )}

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            'mt-1 w-full h-9 rounded-sm text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200',
            isOutOfStock
              ? 'bg-[#F5F5F5] text-[#6B7280] cursor-not-allowed'
              : 'bg-linear-to-r from-[#F5820A] to-[#E06B00] text-white hover:shadow-md hover:shadow-orange-200 active:scale-[0.98]'
          )}
          aria-label={isOutOfStock ? 'Out of stock' : `Add ${product.name} to cart`}
        >
          <FiShoppingCart size={14} />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}