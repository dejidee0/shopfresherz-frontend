"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/format";
import { productsApi } from "@/lib/api/products";
import type { CategoryItem } from "@/lib/types/product";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCats = await productsApi.getCategories();
        const topCategories = allCats.filter((c) => c.parentId === null);

        const allCategory: CategoryItem = {
          id: -1,
          name: "All Categories",
          slug: "all",
          imageUrl: "",
        };

        setCategories([allCategory, ...topCategories]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // ✅ runs once on mount — no stale deps, no re-fetching

  if (!isOpen || loading) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div
        className="absolute top-full left-0 z-50 bg-white shadow-xl border-t border-[#E5E7EB] flex"
        role="navigation"
        aria-label="Category menu"
      >
        {/* Category links — clicking navigates to the category page */}
        <div className="w-52 border-r border-[#E5E7EB] py-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/store/category/${cat.slug}`}
              onClick={onClose}
              className="flex items-center px-4 py-2.5 text-sm transition-colors hover:bg-orange-50 hover:text-[#F5820A]"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}