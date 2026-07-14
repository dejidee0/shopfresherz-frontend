"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
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
  const [imgError, setImgError] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const cartItems = useCartStore((s) => s.items);
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
  const favorited = isWishlisted || isFavorited(product.id);
  const inCart = cartItems.some((item) => item.productId === product.id);

  const isNew = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      30 * 24 * 60 * 60 * 1000
    : false;

  const imageSrc = imgError
    ? "/images/device-placeholder.jpg"
    : (product.imageUrls?.[0] ?? "/images/No-Image-Placeholder.svg");

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
        "sf-product-card flex flex-col group relative",
        (favorited || inCart) && "border-2 border-[#F97316]",
        isOutOfStock && "opacity-80",
        className,
      )}
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

      <button
        onClick={handleWishlist}
        disabled={isFavLoading(product.id)}
        className={cn(
          "absolute top-3 right-3 z-10 w-8 h-8 bg-white/95 rounded-full border border-black/[0.08] flex items-center justify-center transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
          favorited ? "text-[#F97316]" : "text-[#666666] hover:text-[#111111]",
          isFavLoading(product.id) && "opacity-50 cursor-wait",
        )}
        aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
      >
        <FiHeart size={14} className={favorited ? "fill-current" : ""} />
      </button>

      {/* Image */}
      <div className="relative overflow-hidden bg-[#F8F8F8] h-[190px] sm:h-[200px] rounded-t-[10px] transition-shadow group-hover:shadow-[inset_0_0_30px_rgba(249,115,22,0.05)]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            className={cn(
              "transition-transform duration-300",
              !isOutOfStock && "group-hover:scale-110",
            )}
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-[#F5F5F5] flex items-center justify-center text-[#999999] text-[11px]">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-[10px] text-[#999999] uppercase tracking-[0.8px] leading-none">
          {product.brandName ?? product.brand?.name ?? product.categoryName ?? "ShopFresherz"}
        </p>

        <p className="text-[13px] text-[#111111] font-medium leading-[1.45] line-clamp-2 min-h-[38px] group-hover:text-[#F97316] transition-colors">
          {product.name}
        </p>

        <button
          onClick={handleQuickView}
          className="sr-only"
          aria-label="Quick view"
          tabIndex={-1}
        />

        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="flex text-[#F97316]" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < Math.round(product.averageRating ?? 0) ? "\u2605" : "\u2606"}</span>
            ))}
          </span>
          <span className="text-[#999999]">({product.reviewCount ?? 0})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-[#F97316] leading-tight">
              {formatPrice(product.price)}
            </span>

            {product.compareAtPrice && (
              <span className="text-[11px] text-[#BBBBBB] line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={cn(
              "w-9 h-9 rounded-[10px] bg-linear-to-br from-[#F97316] to-[#EA580C] text-white flex items-center justify-center shrink-0 transition-all shadow-[0_4px_12px_rgba(249,115,22,0.3)]",
              isOutOfStock ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)]",
            )}
            aria-label="Add to cart"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
