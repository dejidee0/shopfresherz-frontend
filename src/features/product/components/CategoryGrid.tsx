"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/format";
import type { CategoryWithImage } from "@/lib/types/product";
import { productsApi } from "@/lib/api/products";

// Fallback static categories — replace with API data from /categories
const DEFAULT_CATEGORIES: CategoryWithImage[] = [
  {
    id: 4,
    name: "Computer & Laptop",
    slug: "computer-laptop",
    imageUrl: "/images/categories/pc.png",
  },
  {
    id: 3,
    name: "Electronic",
    slug: "electronics",
    imageUrl: "/images/categories/tv.png",
  },
  {
    id: 10,
    name: "Home",
    slug: "home-kitchen-tech",
    imageUrl: "/images/categories/home-theater.png",
  },
  {
    id: 6,
    name: "Accessories",
    slug: "accessories",
    imageUrl: "/images/categories/keyboard.png",
  },
  {
    id: 7,
    name: "Camera & Photo",
    slug: "electronics/cameras",
    imageUrl: "/images/categories/camera.png",
  },
  {
    id: 8,
    name: "TV & Homes",
    slug: "electronics/tv",
    imageUrl: "/images/categories/tv.png",
  },
  {
    id: 2,
    name: "Mobile Phones",
    slug: "mobile-phones",
    imageUrl: "/images/categories/phone.png",
  },
  {
    id: 1,
    name: "Games & Consoles",
    slug: "games-consoles",
    imageUrl: "/images/categories/xbox.png",
  },
];

interface CategoryGridProps {
  categories?: CategoryWithImage[];
}

const DEFAULT_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&auto=format&fit=crop";

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'cables': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&auto=format&fit=crop',
  'earbuds': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop',
  'audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop',
  'gaming-accessories': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&auto=format&fit=crop',
  'gaming': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&auto=format&fit=crop',
  'laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&auto=format&fit=crop',
  'laptops-sub': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&auto=format&fit=crop',
  'laptops-computers': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&auto=format&fit=crop',
  'computer-laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&auto=format&fit=crop',
  'smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop',
  'phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop',
  'mobile-phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop',
  'accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop',
  'smartwatches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop',
  'smart-watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop',
  'chargers': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&auto=format&fit=crop',
  'power-banks': 'https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=200&auto=format&fit=crop',
  'tablets': 'https://images.unsplash.com/photo-1544244015-0df4592c8cce?w=200&auto=format&fit=crop',
  'peripherals': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop',
  'computing-accessories': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop',
  'new-arrivals': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&auto=format&fit=crop',
  'games-consoles': 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=200&auto=format&fit=crop',
  'electronics': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&auto=format&fit=crop',
};

export function CategoryGrid({
  categories = DEFAULT_CATEGORIES,
}: CategoryGridProps) {
  const [loadedCategories, setLoadedCategories] = useState<CategoryWithImage[]>(
    [],
  );

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await productsApi.getCategories();
        setLoadedCategories(
          response.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            imageUrl: c.imageUrl ?? c.image ?? null,
          })),
        );
      } catch (error) {
        console.error(error);
      }
    }
    fetchCategories();
  }, []);

  const displayCategories = (loadedCategories.length ? loadedCategories : categories).slice(0, 7);

  return (
    <section className="py-8" aria-label="Shop by category">
      <div className="max-w-content mx-auto px-3 sm:px-6 lg:px-10">
        <div className="sf-card-3d rounded-[16px] p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="text-xl font-bold text-white">
              Shop by Category
            </h2>
            <Link
              href="/store/category/all"
              className="text-[13px] font-medium text-[#F97316] hover:text-[#EA580C]"
            >
              See all →
            </Link>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {displayCategories.map((cat, index) => (
              <CategoryItem key={cat.id} category={cat} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const TILE_COLORS = [
  "bg-[#F97316]/15 border-[#F97316]/25",
  "bg-[#1F2937]/70 border-white/[0.08]",
  "bg-[#10B981]/10 border-[#10B981]/20",
  "bg-[#27272A] border-white/[0.08]",
  "bg-[#F59E0B]/10 border-[#F59E0B]/20",
  "bg-[#F97316]/15 border-[#F97316]/25",
  "bg-[#10B981]/10 border-[#10B981]/20",
];

function CategoryItem({ category, index }: { category: CategoryWithImage; index: number }) {
  const fallbackSrc = CATEGORY_FALLBACK_IMAGES[category.slug] ?? DEFAULT_CATEGORY_IMAGE;
  const imgSrc =
    category.imageUrl && !category.imageUrl.includes("undefined")
      ? category.imageUrl
      : fallbackSrc;

  return (
    <Link
      href={`/store/category/${category.slug}`}
      className={cn(
        "group flex flex-col items-center gap-2 cursor-pointer",
      )}
    >
      <div className={cn(
        "w-14 h-14 rounded-[14px] overflow-hidden flex items-center justify-center border transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:shadow-[0_10px_24px_rgba(249,115,22,0.18)]",
        TILE_COLORS[index % TILE_COLORS.length],
      )}>
        <Image
          src={imgSrc}
          alt={category.name}
          width={56}
          height={56}
          className={
            imgSrc.startsWith("/")
              ? "w-full h-full object-contain p-2"
              : "w-full h-full object-cover"
          }
          onError={(e) => {
            e.currentTarget.src = fallbackSrc;
          }}
        />

      </div>

      <span className="text-[11px] font-medium text-[#CFCFCF] text-center leading-tight group-hover:text-[#F97316] transition-colors">
        {category.name}
      </span>
    </Link>
  );
}
