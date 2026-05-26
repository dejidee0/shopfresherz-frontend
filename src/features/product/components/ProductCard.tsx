"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";
import { cn, formatPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cart";
import { useAddToFavorites } from "@/lib/hooks/useAddToFavorites";
import { type Product } from "@/lib/types/product";
import { getDiscountPercent, getStockStatus } from "@/lib/utils/productService";
import { toast } from "@/store/toast";

interface ProductCardProps {
  product: Product;
  onWishlistToggle?: (productId: string) => void;
  isWishlisted?: boolean;
  className?: string;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({
  product,
  onWishlistToggle,
  isWishlisted = false,
  className,
  onQuickView,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const {
    handleAddToFavorites,
    isLoading: isFavLoading,
    isFavorited,
  } = useAddToFavorites();

  const stockStatus = getStockStatus(product);
  const discountPercent = getDiscountPercent(
    product.price,
    product.compareAtPrice,
  );

  const isOutOfStock = stockStatus === "out_of_stock";

  const isNew = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      30 * 24 * 60 * 60 * 1000
    : false;

  const imageSrc = imgError
    ? "/images/device-placeholder.jpg"
    : (product.imageUrls?.[0] ?? "/images/device-placeholder.jpg");

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.imageUrls?.[0] ?? "",
      price: product.price,
      quantity: 1,
      stockQty: product.availableQty ?? product.stockQty ?? 0,
    });
    toast.success("Product added to cart");
    openCart();
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    // Call the real favorites API; also fire the optional parent callback
    handleAddToFavorites(product.id);
    toast.success("Product added to wishlist");
    onWishlistToggle?.(product.id);
  }

  function handleQuickView(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    onQuickView?.(product);
  }

  return (
    <Link
      href={`/store/product/${product.slug}`}
      className={cn(
        "bg-white border border-[#E5E7EB]  overflow-hidden flex flex-col group relative transition-all duration-200 hover:border-[#F5820A]",
        isOutOfStock && "opacity-80",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badge */}
      {(discountPercent || isNew) && !isOutOfStock && (
        <div className="absolute top-2 left-2 z-10">
          {discountPercent ? (
            <Badge label={`-${discountPercent}%`} variant="sale" />
          ) : (
            <Badge label="NEW" variant="new" />
          )}
        </div>
      )}

      {/* Out of stock badge */}
      {isOutOfStock && (
        <div className="absolute top-2 left-2 z-10">
          <Badge label="Out of Stock" variant="out_of_stock" />
        </div>
      )}

      {/* Action icons */}
      <div
        className={cn(
          "absolute top-2 right-2 z-10 flex flex-col gap-1.5 transition-all duration-200",
          // Always visible on mobile
          "opacity-100 translate-x-0 lg:opacity-0 lg:translate-x-2",
          // Hover effect only on desktop
          hovered && "lg:opacity-100 lg:translate-x-0",
        )}
      >
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={cn(
            "w-7 h-7 bg-white rounded-full shadow flex items-center justify-center transition-colors",
            isWishlisted
              ? "text-[#F5820A]"
              : "text-[#6B7280] hover:text-[#F5820A]",
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart size={13} className={isWishlisted ? "fill-current" : ""} />
        </button>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-7 h-7 bg-white rounded-full shadow flex items-center justify-center transition-colors",
            isOutOfStock
              ? "text-[#D1D5DB] cursor-not-allowed"
              : "text-[#6B7280] hover:text-[#F5820A]",
          )}
          aria-label="Add to cart"
        >
          <FiShoppingCart size={13} />
        </button>

        {/* Quick view */}
        <button
          onClick={handleQuickView}
          className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-[#6B7280] hover:text-[#F5820A] transition-colors"
          aria-label="Quick view"
        >
          <FiEye size={13} />
        </button>
      </div>

      {/* Image */}
      <div className="overflow-hidden bg-white" style={{ height: "160px" }}>
        <Image
          src={imageSrc}
          alt={product.name}
          width={200}
          height={200}
          style={{ mixBlendMode: "multiply" }}
          className={cn(
            "w-full h-full object-contain transition-transform duration-300 p-3",
            !isOutOfStock && "group-hover:scale-105",
          )}
          onError={() => setImgError(true)}
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        {/* Product name */}
        <p className="text-[11px] text-[#111111] font-medium leading-snug line-clamp-2 min-h-8">
          {product.name}
        </p>

        {/* Price */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-sm text-[#F5820A] font-semibold">
            {formatPrice(product.price)}
          </span>

          {product.compareAtPrice && (
            <span className="text-[10px] text-[#9CA3AF] line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
