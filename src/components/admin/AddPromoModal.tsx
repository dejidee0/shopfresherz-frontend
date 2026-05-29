import { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import {
  useUpdateHeroPromo,
  useUpdateBestDealPromo,
  useUpdateAccessoriesPromo,
  useUpdateLaptopPromo,
  useCreateHeroPromo,
  useCreateBestDealPromo,
  useCreateLaptopPromo,
  useCreateAccessoriesPromo,
} from "@/lib/hooks/useAdmin";
import { Product } from "@/lib/types/product";
import { productsApi } from "@/lib/api/products";
import { PromoRow } from "@/app/admin/dashboard/content/page";

// ─── Types ────────────────────────────────────────────────────────────────────

type PromoSection = "hero" | "bestDeal" | "accessories" | "laptop";

interface AddPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: PromoSection;
  /** Present in edit mode — omit for add mode */
  initialData?: PromoRow;
}

interface PromoFormData {
  productId: string;
  ctaText: string;
  tag: string;
}

const EMPTY_FORM: PromoFormData = {
  productId: "",
  ctaText: "",
  tag: "",
};

const SECTION_LABELS: Record<PromoSection, string> = {
  hero: "Hero Promo",
  bestDeal: "Best Deals Promo",
  accessories: "Accessories Promo",
  laptop: "Laptop Promo",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddPromoModal({
  isOpen,
  onClose,
  section,
  initialData,
}: AddPromoModalProps) {
  const isEditMode = !!initialData;

  const [form, setForm] = useState<PromoFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof PromoFormData, string>>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // ── Mutations ──────────────────────────────────────────────────────────────

  const createHero        = useCreateHeroPromo();
  const createBestDeal    = useCreateBestDealPromo();
  const createAccessories = useCreateAccessoriesPromo();
  const createLaptop      = useCreateLaptopPromo();

  const updateHero        = useUpdateHeroPromo();
  const updateBestDeal    = useUpdateBestDealPromo();
  const updateAccessories = useUpdateAccessoriesPromo();
  const updateLaptop      = useUpdateLaptopPromo();

  const createMutationMap: Record<PromoSection, typeof createHero> = {
    hero:        createHero,
    bestDeal:    createBestDeal,
    accessories: createAccessories,
    laptop:      createLaptop,
  };

  const updateMutationMap: Record<PromoSection, typeof updateHero> = {
    hero:        updateHero,
    bestDeal:    updateBestDeal,
    accessories: updateAccessories,
    laptop:      updateLaptop,
  };

  const isPending = isEditMode
    ? updateMutationMap[section].isPending
    : createMutationMap[section].isPending;

  // ── Sync form on open ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        productId: initialData.productId ?? "",
        ctaText:   initialData.ctaText   ?? "",
        tag:       initialData.tag       ?? "",
      });
      // Show existing product name in search box (locked in edit mode)
      setSearchQuery(initialData.productName ?? "");
      setSelectedProduct(null);
    } else {
      setForm(EMPTY_FORM);
      setSearchQuery("");
      setSelectedProduct(null);
      setSearchResults([]);
    }

    setErrors({});
  }, [isOpen, initialData]);

  // ── Product search (add mode only) ────────────────────────────────────────

  useEffect(() => {
    if (isEditMode) return;

    const query = searchQuery.trim();

    if (
      selectedProduct &&
      selectedProduct.name.toLowerCase() === query.toLowerCase()
    ) {
      return;
    }

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await productsApi.search({
          q: query,
          page: 1,
          pageSize: 8,
          inStock: true,
        });
        if (active) setSearchResults(result.data ?? []);
      } catch {
        if (active) setSearchResults([]);
      } finally {
        if (active) setIsSearching(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedProduct, isEditMode]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const set = <K extends keyof PromoFormData>(key: K, value: PromoFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const clearError = (key: keyof PromoFormData) =>
    setErrors((prev) => ({ ...prev, [key]: undefined }));

  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    setForm((prev) => ({ ...prev, productId: product.id }));
    setSearchQuery(product.name);
    setSearchResults([]);
    clearError("productId");
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.productId)      e.productId = "A product is required";
    if (!form.ctaText.trim()) e.ctaText   = "CTA text is required";
    if (!form.tag.trim())     e.tag       = "Tag is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      productId: form.productId,
      ctaText:   form.ctaText,
      tag:       form.tag || undefined,
    };

    try {
      if (isEditMode) {
        await updateMutationMap[section].mutateAsync({
          id: initialData!.id,
          payload,
        });
      } else {
        await createMutationMap[section].mutateAsync(payload);
      }
      onClose();
    } catch {
      // Errors surfaced via mutation onError toast
    }
  };

  if (!isOpen) return null;

  const label       = SECTION_LABELS[section];
  const submitLabel = isPending
    ? isEditMode ? "Saving..." : "Adding..."
    : isEditMode ? "Save Changes" : "Add Promo";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {isEditMode ? `Edit ${label}` : `Add ${label}`}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HiXMark size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Product */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product <span className="text-red-500">*</span>
            </label>

            {isEditMode ? (
              // Edit — locked, product cannot be changed
              <div className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-500 select-none">
                {searchQuery || "—"}
                <span className="ml-2 text-xs text-gray-400">(cannot change in edit mode)</span>
              </div>
            ) : (
              // Add — live search
              <>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedProduct(null);
                    setForm((prev) => ({ ...prev, productId: "" }));
                    clearError("productId");
                  }}
                  placeholder="Search and select a product..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
                />

                {/* Dropdown */}
                {(searchResults.length > 0 || isSearching) && (
                  <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {isSearching ? (
                      <p className="px-3 py-3 text-sm text-gray-500">Searching products...</p>
                    ) : (
                      searchResults.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => selectProduct(product)}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-orange-50 transition-colors"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-gray-800">
                              {product.name}
                            </span>
                            <span className="block text-xs text-gray-400 mt-0.5">
                              Stock: {product.stockQty ?? 0} · ₦{product.price.toLocaleString()}
                            </span>
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}

                {/* Selected product chip */}
                {selectedProduct && (
                  <div className="mt-2 flex items-center justify-between bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                    <span className="text-xs font-medium text-orange-700 truncate">
                      ✓ {selectedProduct.name}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setSearchQuery("");
                        setForm((prev) => ({ ...prev, productId: "" }));
                      }}
                      className="ml-2 text-orange-400 hover:text-orange-600 transition-colors shrink-0"
                    >
                      <HiXMark size={14} />
                    </button>
                  </div>
                )}
              </>
            )}

            {errors.productId && (
              <p className="mt-1 text-xs text-red-500">{errors.productId}</p>
            )}
          </div>

          {/* CTA Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              CTA Text <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.ctaText}
              onChange={(e) => { set("ctaText", e.target.value); clearError("ctaText"); }}
              placeholder="Shop Now"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
            {errors.ctaText && (
              <p className="text-xs text-red-500 mt-1">{errors.ctaText}</p>
            )}
          </div>

          {/* Tag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tag <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.tag}
              onChange={(e) => { set("tag", e.target.value); clearError("tag"); }}
              placeholder="e.g. New Arrival, Hot Deal"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
            {errors.tag && (
              <p className="text-xs text-red-500 mt-1">{errors.tag}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-6 py-2.5 text-sm font-bold bg-[#F97316] text-white rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-orange-200"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}