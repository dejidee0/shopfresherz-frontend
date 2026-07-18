"use client";

import { useState, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FiHeart, FiShoppingCart, FiCheck } from "react-icons/fi";
import { cn, formatPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cart";
import { useAddToFavorites } from "@/lib/hooks/useAddToFavorites";
import { useCardTilt3D } from "@/lib/hooks/useCardTilt3D";
import { useMagnetic } from "@/lib/hooks/useMagnetic";
import { spawnRipple } from "@/lib/utils/ripple";
import { type Product } from "@/lib/types/product";
import { getDiscountPercent, getStockStatus } from "@/lib/utils/productService";
import { toast } from "@/store/toast";

interface ProductCardProps {
  product: Product;
  onWishlistToggle?: (productId: string) => void;
  isWishlisted?: boolean;
  className?: string;
  onQuickView?: (product: Product) => void;
  /** Stagger delay (seconds) for the scroll-into-view entrance. */
  revealDelay?: number;
}

// Bouncy "pop into place" entrance — deliberately more energetic than the
// site's generic Reveal component, since this card is meant to read as an
// obviously interactive, dramatic element, not a subtle content reveal.
const ENTER_TRANSITION = { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] as const };

export function ProductCard({
  product,
  onWishlistToggle,
  isWishlisted = false,
  className,
  onQuickView,
  revealDelay = 0,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { outerRef, innerRef } = useCardTilt3D<HTMLAnchorElement>();
  const magnetic = useMagnetic(0.3);
  const shouldReduceMotion = useReducedMotion();

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

  function handleAddToCart(e: ReactMouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    spawnRipple(e);

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

    setAdded(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1000);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleWishlist(e: ReactMouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    // Call the real favorites API; also fire the optional parent callback
    handleAddToFavorites(product.id);
    toast.success("Product added to wishlist");
    onWishlistToggle?.(product.id);
  }

  function handleQuickView(e: ReactMouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    onQuickView?.(product);
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, rotateX: 15 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={shouldReduceMotion ? { duration: 0.3, delay: revealDelay } : { ...ENTER_TRANSITION, delay: revealDelay }}
      style={{ transformPerspective: 1000 }}
    >
      <Link
        ref={outerRef}
        href={`/store/product/${product.slug}`}
        className={cn(
          "sf-product-card sf-tilt-card sf-tilt-glow flex flex-col group relative",
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
            "absolute top-3 right-3 z-20 w-8 h-8 bg-white/95 rounded-full border border-black/[0.08] flex items-center justify-center transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
            favorited ? "text-[#F97316]" : "text-[#666666] hover:text-[#111111]",
            isFavLoading(product.id) && "opacity-50 cursor-wait",
          )}
          aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart size={14} className={favorited ? "fill-current" : ""} />
        </button>

        {/* Image + info — tilts together as one 3D plane */}
        <div ref={innerRef} className="sf-tilt-card-inner flex flex-col flex-1">
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
                  <span key={i}>{i < Math.round(product.averageRating ?? 0) ? "★" : "☆"}</span>
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

              <motion.button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  "relative overflow-hidden w-9 h-9 rounded-[10px] bg-linear-to-br from-[#F97316] to-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(249,115,22,0.3)]",
                  isOutOfStock ? "opacity-50 cursor-not-allowed" : "hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)]",
                )}
                aria-label="Add to cart"
                {...(!isOutOfStock
                  ? { style: magnetic.style, onMouseMove: magnetic.onMouseMove, onMouseLeave: magnetic.onMouseLeave }
                  : {})}
                whileTap={!isOutOfStock ? { scale: 0.9 } : undefined}
              >
                {added ? <FiCheck size={16} /> : <FiShoppingCart size={16} />}
              </motion.button>
            </div>
          </div>
        </div>

        {showSuccess && (
          <div
            aria-hidden="true"
            className="sf-add-success absolute top-1/2 left-1/2 w-14 h-14 rounded-full bg-[#F97316] flex items-center justify-center text-white z-30 shadow-[0_8px_24px_rgba(249,115,22,0.4)]"
          >
            <FiCheck size={28} />
          </div>
        )}
      </Link>
    </motion.div>
  );
}
