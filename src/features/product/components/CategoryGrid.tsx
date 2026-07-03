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
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            width={56}
            height={56}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <span className="text-2xl">📱</span>
        )}
      </div>

      <span className="text-[11px] font-medium text-[#CFCFCF] text-center leading-tight group-hover:text-[#F97316] transition-colors">
        {category.name}
      </span>
    </Link>
  );
}
