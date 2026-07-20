"use client";

import { useState, useEffect } from "react";
import { HiXMark, HiArrowUpTray } from "react-icons/hi2";
import { useCreatePromo, useUpdatePromo } from "@/lib/hooks/useAdmin";
import { PROMO_PLACEMENTS, type PromoPlacement } from "@/lib/api/admin";
import { Product } from "@/lib/types/product";
import { productsApi } from "@/lib/api/products";
import { uploadToCloudinary } from "@/lib/utils/cloudinary";
import type { PromoRow } from "@/app/admin/dashboard/content/page";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Preselected placement (e.g. opened via a specific section's Add button) — still changeable in add mode. */
  defaultPlacement: PromoPlacement;
  /** Present in edit mode — omit for add mode. */
  initialData?: PromoRow;
}

interface PromoFormData {
  placement: PromoPlacement;
  productId: string;
  ctaText: string;
  tag: string;
  description: string;
  imageUrl: string;
}

const emptyForm = (placement: PromoPlacement): PromoFormData => ({
  placement,
  productId: "",
  ctaText: "",
  tag: "",
  description: "",
  imageUrl: "",
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddPromoModal({
  isOpen,
  onClose,
  defaultPlacement,
  initialData,
}: AddPromoModalProps) {
  const isEditMode = !!initialData;

  const [form, setForm] = useState<PromoFormData>(emptyForm(defaultPlacement));
  const [errors, setErrors] = useState<Partial<Record<keyof PromoFormData, string>>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const createPromo = useCreatePromo();
  const updatePromo = useUpdatePromo();
  const isPending = isEditMode ? updatePromo.isPending : createPromo.isPending;

  // ── Sync form on open ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        placement: initialData.placement,
        productId: initialData.productId ?? "",
        ctaText: initialData.ctaText ?? "",
        tag: initialData.tag ?? "",
        description: initialData.description ?? "",
        imageUrl: initialData.imageUrl ?? "",
      });
      // Show existing product name in search box (locked in edit mode)
      setSearchQuery(initialData.productName ?? "");
      setSelectedProduct(null);
    } else {
      setForm(emptyForm(defaultPlacement));
      setSearchQuery("");
      setSelectedProduct(null);
      setSearchResults([]);
    }

    setErrors({});
  }, [isOpen, initialData, defaultPlacement]);

  // ── Product search (add mode only) ────────────────────────────────────────

  useEffect(() => {
    if (isEditMode) return;

    const query = searchQuery.trim();

    if (selectedProduct && selectedProduct.name.toLowerCase() === query.toLowerCase()) {
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

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      set("imageUrl", url);
    } catch (error) {
      console.error("Failed to upload promo image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.productId) e.productId = "A product is required";
    if (!form.ctaText.trim()) e.ctaText = "CTA text is required";
    if (!form.tag.trim()) e.tag = "Tag is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      productId: form.productId,
      ctaText: form.ctaText,
      tag: form.tag || undefined,
      imageUrl: form.imageUrl || undefined,
      description: form.description || undefined,
    };

    try {
      if (isEditMode) {
        await updatePromo.mutateAsync({
          placement: form.placement,
          id: initialData!.id,
          payload,
        });
      } else {
        await createPromo.mutateAsync({ placement: form.placement, payload });
      }
      onClose();
    } catch {
      // Errors surfaced via mutation onError toast
    }
  };

  if (!isOpen) return null;

  const placementLabel =
    PROMO_PLACEMENTS.find((p) => p.value === form.placement)?.label ?? form.placement;
  const submitLabel = isPending
    ? isEditMode
      ? "Saving..."
      : "Adding..."
    : isEditMode
      ? "Save Changes"
      : "Add Promo";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {isEditMode ? "Edit Promo Card" : "Add Promo Card"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HiXMark size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Placement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Placement <span className="text-red-500">*</span>
            </label>
            {isEditMode ? (
              <div className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-500 select-none">
                {placementLabel}
                <span className="ml-2 text-xs text-gray-400">(cannot change in edit mode)</span>
              </div>
            ) : (
              <select
                value={form.placement}
                onChange={(e) => set("placement", e.target.value as PromoPlacement)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              >
                {PROMO_PLACEMENTS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Product */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product <span className="text-red-500">*</span>
            </label>

            {isEditMode ? (
              <div className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-500 select-none">
                {searchQuery || "—"}
                <span className="ml-2 text-xs text-gray-400">(cannot change in edit mode)</span>
              </div>
            ) : (
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

            {errors.productId && <p className="mt-1 text-xs text-red-500">{errors.productId}</p>}
          </div>

          {/* CTA Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              CTA Text <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.ctaText}
              onChange={(e) => {
                set("ctaText", e.target.value);
                clearError("ctaText");
              }}
              placeholder="Shop Now"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
            {errors.ctaText && <p className="text-xs text-red-500 mt-1">{errors.ctaText}</p>}
          </div>

          {/* Tag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tag <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.tag}
              onChange={(e) => {
                set("tag", e.target.value);
                clearError("tag");
              }}
              placeholder="e.g. New Arrival, Hot Deal"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
            {errors.tag && <p className="text-xs text-red-500 mt-1">{errors.tag}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Shown under the promo title on the storefront"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Image{" "}
              <span className="text-gray-400 font-normal">
                (optional — falls back to the product&apos;s own image)
              </span>
            </label>
            <div className="flex items-center gap-3">
              {form.imageUrl ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.imageUrl}
                    alt="Promo"
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => set("imageUrl", "")}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-200 rounded-lg w-16 h-16 flex items-center justify-center cursor-pointer hover:border-[#F97316] hover:bg-orange-50 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  />
                  <HiArrowUpTray size={20} className="text-gray-400" />
                </label>
              )}
              {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
            </div>
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
            disabled={isPending || isUploading}
            className="px-6 py-2.5 text-sm font-bold bg-[#F97316] text-white rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-orange-200"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
