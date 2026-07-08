"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiGrid, FiChevronDown, FiFilter, FiX } from "react-icons/fi";
import { Breadcrumb } from "@/components/ui/BreadCrumbs";
import { Pagination } from "@/components/ui/Pagination";
import { ProductCard } from "@/features/product/components/ProductCard";
import { ShopSidebar } from "@/features/product/components/ShopSideBar";
import { ActiveFilters } from "@/features/product/components/ActiveFilters";
import { productsApi } from "@/lib/api/products";
import type { ShopFilters } from "@/features/product/components/ShopSideBar";
import type { Product } from "@/lib/types/product";

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Most Popular", value: "best_selling" },
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Rated", value: "best_rated" },
];

const DEFAULT_FILTERS: ShopFilters = {
  categoryId: null,
  categorySlug: null,
  priceRange: [0, 10_000_000],
  brands: [],
  tags: [],
  rating: null,
  inStock: null,
  sortBy: "",
};

interface ShopClientProps {
  initialProducts: Product[];
  categoryName?: string;
  categorySlug?: string;
  categoryId?: number;
  isSearchPage?: boolean;
  initialQuery?: string;
}

// This is the interactive client shell.
// The parent page.tsx handles the ISR data fetch and passes products down.
export function ShopClient({
  initialProducts,
  categoryName,
  categoryId,
  isSearchPage = false,
  initialQuery = "",
}: ShopClientProps) {
  const [filters, setFilters] = useState<ShopFilters>({
    ...DEFAULT_FILTERS,
    categoryId: categoryId ?? null,
  });
  const [sort, setSort] = useState(isSearchPage ? "relevance" : "best_selling");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [localSearch, setLocalSearch] = useState(initialQuery); // seed with server query
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts); // start with server data
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(initialProducts.length);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [sidebarCategories, setSidebarCategories] = useState<
    {
      label: string;
      slug: string;
      children?: { label: string; slug: string }[];
    }[]
  >([]);

  // const [sidebarBrands, setSidebarBrands] = useState<string[]>([]);

  // // Replace the brands useEffect:
  // useEffect(() => {
  //   const fetchBrands = async () => {
  //     try {
  //       const brands = await productsApi.getBrands();
  //       setSidebarBrands(brands.map((b) => b.name));
  //     } catch (error) {
  //       console.error("Failed to fetch brands:", error);
  //     }
  //   };
  //   fetchBrands();
  // }, []);

  // Fetch categories for sidebar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCats = await productsApi.getCategories();
        const topCats = allCats.filter((c) => c.parentId === null);
        const catsWithChildren = topCats.map((cat) => ({
          label: cat.name,
          slug: cat.slug,
          children: allCats
            .filter((c) => c.parentId === cat.id)
            .map((c) => ({ label: c.name, slug: c.slug })),
        }));
        setSidebarCategories(catsWithChildren);
      } catch (error) {
        console.error("Failed to fetch categories for sidebar:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products from API when search or filters change
  useEffect(() => {
    // ✅ Skip the very first render — use initialProducts from server instead
    // Only fetch when the user actually changes something
    if (!hasInteracted) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let resolvedCategoryId = categoryId ?? undefined;

        if (filters.categorySlug && filters.categorySlug !== "all") {
          const allCats = await productsApi.getCategories();
          const matched = allCats.find((c) => c.slug === filters.categorySlug);
          resolvedCategoryId = matched?.id
            ? Number(matched.id)
            : resolvedCategoryId;
        }

        const isDefaultRange =
          filters.priceRange[0] === 0 && filters.priceRange[1] === 10_000_000;

        const apiCall = isSearchPage ? productsApi.search : productsApi.list;
        const response = await apiCall({
          categoryId: resolvedCategoryId,
          q: localSearch || undefined,
          priceMin: isDefaultRange
            ? undefined
            : filters.priceRange[0] || undefined,
          priceMax: isDefaultRange ? undefined : filters.priceRange[1],
          rating: filters.rating || undefined,
          inStock: filters.inStock || undefined,
          sortBy: sort as any,
          page,
          pageSize: 24,
          brandId:
            filters.brands.length > 0 ? filters.brands.join(",") : undefined,
        });

        let filteredData = response.data;
        if (filters.tags.length > 0) {
          filteredData = filteredData.filter(
            (p) => p.tags && filters.tags.some((tag) => p.tags!.includes(tag)),
          );
        }

        setProducts(filteredData);
        setTotalCount(response.totalCount);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    localSearch,
    filters,
    sort,
    page,
    categoryId,
    isSearchPage,
    hasInteracted,
  ]);

  const breadcrumbs = [
    { label: "Shop", href: "/shop" },
    ...(categoryName ? [{ label: categoryName }] : []),
  ];

  // ── Products from API (already filtered and sorted) ─────────────────────────────────────
  const filteredProducts = products;
  const filteredTotalCount = totalCount;

  const totalPages = Math.ceil(filteredTotalCount / 24);

  // ── Filter helpers ────────────────────────────────────────────────────────

  //handleFilterChange now marks that user has interacted
  function handleFilterChange(next: ShopFilters) {
    setHasInteracted(true);
    setFilters(next);
    setPage(1);
  }

  function handleRemoveFilter(key: keyof ShopFilters, value?: string) {
    setHasInteracted(true);
    if (key === "categoryId") {
      setFilters((f) => ({ ...f, categorySlug: null }));
    } else if (key === "brands" && value) {
      setFilters((f) => ({
        ...f,
        brands: f.brands.filter((b) => b !== value),
      }));
    } else if (key === "tags" && value) {
      setFilters((f) => ({ ...f, tags: f.tags.filter((t) => t !== value) }));
    }
    setPage(1);
  }

  function handleClearAll() {
    setHasInteracted(true);
    setFilters({ ...DEFAULT_FILTERS, categoryId: categoryId ?? null });
    setPage(1);
  }
  // ── Client-side filter/search (placeholder until API filtering is wired) ──
  // In production, these params get sent to productsApi.list() and the server
  // does the heavy lifting. For now, we filter the initial product set locally
  // so the UI is immediately interactive.

  const activeSort = SORT_OPTIONS.find((o) => o.value === sort);

  return (
    <div className="bg-[#F5F2ED] px-4 sm:px-6 md:px-8 py-6 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* Mobile filter button */}
      <div className="flex items-center justify-between mt-2 mb-3 sm:hidden">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center gap-2 h-9 px-4 border border-black/[0.1] rounded-[8px] text-sm text-[#111111] hover:border-[#F97316] transition-colors bg-[#FFFFFF]"
        >
          <FiFilter size={15} />
          Filters
        </button>
      </div>

      <div className="flex gap-4 sm:gap-6 md:gap-8 mt-2">
        {/* ── Sidebar ── */}
        {/* Desktop sidebar */}
        <div className="hidden sm:block">
          <ShopSidebar
            filters={filters}
            onChange={handleFilterChange}
            categories={sidebarCategories}
            // brands={sidebarBrands}
          />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 sm:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-70 max-w-[85vw] bg-[#FFFFFF] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-black/[0.08]">
                <h2 className="text-lg font-bold text-[#111111]">Filters</h2>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-[#666666] hover:text-[#111111]"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-4">
                <ShopSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                  categories={sidebarCategories}
                  // brands={sidebarBrands}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Top bar: inline search + sort */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            {/* Inline search */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setHasInteracted(true);
                  setLocalSearch(e.target.value);
                }}
                placeholder="Search for anything..."
                className="input-light h-9 sm:h-10 pl-3 sm:pl-4 pr-9 sm:pr-10 text-sm"
              />
              <FiSearch
                size={14}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
              />
            </div>

            {/* Sort dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-2 sm:px-3 border border-black/[0.1] rounded-[8px] text-xs sm:text-sm text-[#111111] hover:border-[#F97316] transition-colors bg-[#FFFFFF]"
              >
                <span className="text-[#6B7280] text-[10px] sm:text-xs mr-0.5 sm:mr-1 hidden xs:inline">
                  Sort by:
                </span>
                <span className="max-w-20 sm:max-w-none truncate">
                  {activeSort?.label}
                </span>
                <FiChevronDown
                  size={11}
                  className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>

              {sortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-[#FFFFFF] border border-black/[0.1] rounded-[10px] shadow-lg z-20 py-1 min-w-40 sm:min-w-45">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSort(opt.value);
                          setSortOpen(false);
                          setPage(1);
                        }}
                        className={`w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-colors hover:bg-black/[0.04] hover:text-[#F97316] ${
                          sort === opt.value
                            ? "text-[#F97316] font-medium"
                            : "text-[#666666]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Active filter chips + result count */}
          <ActiveFilters
            filters={filters}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
            resultCount={filteredTotalCount}
            className="mb-3 sm:mb-4"
          />

          {/* Product grid */}
          {filteredProducts?.length === 0 ? (
            <EmptyState onClear={handleClearAll} />
          ) : (
            <div
              className={`grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 transition-opacity duration-300 ${
                isLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              {/* {<button onClick={()=> console.log(filteredProducts)}>show</button>} */}
              {filteredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-8 sm:mt-10"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-24 text-center px-4">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#F5F5F5] border border-black/[0.06] flex items-center justify-center mb-3 sm:mb-4">
        <FiGrid size={20} className="text-[#999999]" />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-[#111111] mb-1.5 sm:mb-2">
        No products found
      </h3>
      <p className="text-xs sm:text-sm text-[#666666] mb-4 sm:mb-6 max-w-xs">
        Try adjusting your filters or search terms.
      </p>
      <button
        onClick={onClear}
        className="sf-btn-primary h-9 sm:h-10 px-4 sm:px-6 text-xs sm:text-sm"
      >
        Clear Filters
      </button>
    </div>
  );
}
