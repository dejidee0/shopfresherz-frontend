


'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { productsApi } from '@/lib/api/products';
import type { FlashDeal, Product as ApiProduct } from '@/lib/types/product';

// Types for structural safety
interface Product {
  id: string;
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
  return `₦${price?.toLocaleString() ?? '0'}`;
}

function mapFlashDealToItem(value: FlashDeal): Product {
  return {
    id: value.id,
    title: value.productName,
    price: toPriceLabel(value.salePrice),
    imageUrl: value.productImageUrl ?? '',
  };
}

function mapApiProductToItem(value: ApiProduct): Product {
  return {
    id: value.id,
    title: value.name,
    price: toPriceLabel(value.price),
    imageUrl: value.primaryImageUrl ?? value.imageUrls?.[0] ?? '',
  };
}

// 1. Internal Product Card Component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-sm bg-white hover:shadow-sm transition-shadow duration-200 h-[75px]">
      {/* Aspect-ratio safe image container */}
      <div className="relative w-16 h-16   rounded bg-[]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            width={64}
            height={64}
            className=" h-full w-full"
          />
        ) : (
          <div className="h-10 w-10 rounded bg-[#E5E7EB]" />
        )}
      </div>

      {/* Content details side */}
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="text-xs font-normal text-gray-800 line-clamp-2 leading-tight mb-1.5">
          {product.title}
        </h3>
        <span className="text-sm font-semibold text-orange-500">
          {product.price}
        </span>
      </div>
    </div>
  );
};

// 2. Main Exported Component
export function TopHighlightsSection() {
  const [highlightsData, setHighlightsData] = useState<HighlightCategory[]>([
    { id: 'flash-sale', title: 'Flash Sale Today', products: [] },
    { id: 'best-sellers', title: 'Best Sellers', products: [] },
    { id: 'top-rated', title: 'Top Rated', products: [] },
    { id: 'new-arrival', title: 'New Arrival', products: [] },
  ]);

  useEffect(() => {
    let mounted = true;

    async function loadHighlights() {
      const [flashResult, bestResult, topRatedResult, newResult] = await Promise.allSettled([
        productsApi.flashDeals(),
        productsApi.bestSellers(3),
        productsApi.list({ sortBy: 'best_rated', pageSize: 3 }),
        productsApi.newArrivals(3),
      ]);

      if (!mounted) return;

      const flashProducts =
        flashResult.status === 'fulfilled'
          ? flashResult.value.slice(0, 3).map(mapFlashDealToItem)
          : [];

      const bestProducts =
        bestResult.status === 'fulfilled'
          ? bestResult.value.slice(0, 3).map(mapApiProductToItem)
          : [];

      const topRatedProducts =
        topRatedResult.status === 'fulfilled'
          ? topRatedResult.value.data.slice(0, 3).map(mapApiProductToItem)
          : [];

      const newProducts =
        newResult.status === 'fulfilled'
          ? newResult.value.slice(0, 3).map(mapApiProductToItem)
          : [];

      setHighlightsData([
        { id: 'flash-sale', title: 'Flash Sale Today', products: flashProducts },
        { id: 'best-sellers', title: 'Best Sellers', products: bestProducts },
        { id: 'top-rated', title: 'Top Rated', products: topRatedProducts },
        { id: 'new-arrival', title: 'New Arrival', products: newProducts },
      ]);
    }

    loadHighlights().catch((error) => {
      console.error('Failed to load TopHighlightsSection data', error);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 bg-white">
      {/* Clean responsive grid boundaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
        {highlightsData.map((category) => (
          <div key={category.id} className="flex flex-col gap-4">
            {/* Structural Category Header */}
            <h2 className="text-xs font-bold tracking-wider text-gray-900 uppercase">
              {category.title}
            </h2>
            
            {/* Inner Vertical Item List */}
            <div className="flex flex-col gap-3">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}