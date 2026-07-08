"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { productsApi } from "@/lib/api/products";
import type { FlashDeal, Product as ApiProduct } from "@/lib/types/product";

// Types for structural safety
interface Product {
  id: string;
  slug: string;
  title: string;
  price: string;
  imageUrl: string;
}

interface HighlightCategory {
  id: string;
  title: string;
  products: Product[];
}

function toPriceLabel(price?: number | null) {
  return `₦${price?.toLocaleString() ?? "0"}`;
}

function mapFlashDealToItem(value: FlashDeal): Product {
  return {
    id: value.id,
    slug: value.productSlug,
    title: value.productName,
    price: toPriceLabel(value.salePrice),
    imageUrl: value.productImageUrl ?? "",
  };
}

function mapApiProductToItem(value: ApiProduct): Product {
  return {
    id: value.id,
    slug: value.slug,
    title: value.name,
    price: toPriceLabel(value.price),
    imageUrl: value.primaryImageUrl ?? value.imageUrls?.[0] ?? "",
  };
}

// 1. Internal Product Row Component
const ProductRow: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Link
      href={`/store/product/${product.slug}`}
      className="group flex items-center gap-3 cursor-pointer border-b border-black/[0.04] transition-colors duration-150 hover:bg-black/[0.03]"
      style={{ padding: "14px 20px" }}
    >
      {/* Image box */}
      <div
        className="shrink-0 overflow-hidden"
        style={{
          width: "60px",
          height: "60px",
          background: "#F5F5F5",
          borderRadius: "10px",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {product.imageUrl ? (
          <div className="h-full w-full p-1.5">
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={60}
              height={60}
              className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-full w-full bg-black/[0.06]" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="text-[12px] font-medium text-[#111111] line-clamp-2 leading-tight transition-colors duration-150 group-hover:text-[#F97316]">
          {product.title}
        </h3>
        <span className="mt-1 text-[13px] font-bold text-[#F97316]">
          {product.price}
        </span>
      </div>
    </Link>
  );
};

const COLUMN_ICONS: Record<string, string> = {
  "flash-sale": "⚡",
  "best-sellers": "🔥",
  "top-rated": "⭐",
  "new-arrival": "✨",
};

// 2. Main Exported Component
export function TopHighlightsSection() {
  const [highlightsData, setHighlightsData] = useState<HighlightCategory[]>([
    { id: "flash-sale", title: "Flash Sale Today", products: [] },
    { id: "best-sellers", title: "Best Sellers", products: [] },
    { id: "top-rated", title: "Top Rated", products: [] },
    { id: "new-arrival", title: "New Arrival", products: [] },
  ]);

  useEffect(() => {
    let mounted = true;

    async function loadHighlights() {
      const [flashResult, bestResult, topRatedResult, newResult] =
        await Promise.allSettled([
          productsApi.flashDeals(),
          productsApi.bestSellers(3),
          productsApi.list({ sortBy: "best_rated", pageSize: 3 }),
          productsApi.newArrivals(3),
        ]);

      if (!mounted) return;

      const flashProducts =
        flashResult.status === "fulfilled"
          ? flashResult.value.slice(0, 3).map(mapFlashDealToItem)
          : [];

      const bestProducts =
        bestResult.status === "fulfilled"
          ? bestResult.value.slice(0, 3).map(mapApiProductToItem)
          : [];

      const topRatedProducts =
        topRatedResult.status === "fulfilled"
          ? topRatedResult.value.data.slice(0, 3).map(mapApiProductToItem)
          : [];

      const newProducts =
        newResult.status === "fulfilled"
          ? newResult.value.slice(0, 3).map(mapApiProductToItem)
          : [];

      setHighlightsData([
        {
          id: "flash-sale",
          title: "Flash Sale Today",
          products: flashProducts,
        },
        { id: "best-sellers", title: "Best Sellers", products: bestProducts },
        { id: "top-rated", title: "Top Rated", products: topRatedProducts },
        { id: "new-arrival", title: "New Arrival", products: newProducts },
      ]);
    }

    loadHighlights().catch((error) => {
      console.error("Failed to load TopHighlightsSection data", error);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-[#F5F2ED] px-4 md:px-8 py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlightsData.map((category) => (
          <div
            key={category.id}
            className="overflow-hidden transition-all duration-300 hover:border-[rgba(249,115,22,0.2)]"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: "16px",
            }}
          >
            {/* Column header */}
            <div
              className="flex items-center gap-2 border-b border-black/[0.06]"
              style={{ padding: "16px 20px", background: "rgba(249,115,22,0.06)" }}
            >
              <span aria-hidden="true">{COLUMN_ICONS[category.id]}</span>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.8px] text-[#111111]">
                {category.title}
              </h2>
            </div>

            {/* Product rows */}
            <div className="flex flex-col">
              {category.products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
