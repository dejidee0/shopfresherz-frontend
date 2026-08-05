"use client";

import { useState, useEffect } from "react";
import { HiXMark, HiArrowUpTray } from "react-icons/hi2";
import { useCreatePromo, useUpdatePromo } from "@/lib/hooks/useAdmin";
import {
  PROMO_PLACEMENTS,
  PROMO_PUT_UPDATE_PLACEMENTS,
  type PromoPlacement,
  type PromotionalSectionAdminDto,
} from "@/lib/api/admin";
import { apiFetch } from "@/lib/api/client";
import { Product } from "@/lib/types/product";
import { productsApi } from "@/lib/api/products";
import { useAuthStore } from "@/store/auth";
import type { PromoRow } from "@/app/admin/dashboard/content/page";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlacement: PromoPlacement;
  initialData?: PromoRow;
  /** Raw section id from the row — may be a synthetic slug for singleton placements. */
  sectionId?: string;
  /** All sections from the admin list endpoint — used to resolve real GUIDs for media uploads. */
  allSections?: PromotionalSectionAdminDto[];
}

interface PromoFormData {
  placement: PromoPlacement;
  productId: string;
  ctaText: string;
  tag: string;
  description: string;
  imageUrl: string;
  /** Best Deal placement only — optional looping background video, falls back to imageUrl. */
  videoUrl: string;
}

const emptyForm = (placement: PromoPlacement): PromoFormData => ({
  placement,
  productId: "",
  ctaText: "",
  tag: "",
  description: "",
  imageUrl: "",
  videoUrl: "",
});

interface MediaUploadResponse {
  url?: string;
}

interface ApiErrorResponse {
  message?: string;
  status?: number;
  body?: unknown;
}

const GUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isGuid = (value: string | undefined): value is string =>
  !!value && GUID_PATTERN.test(value);

const toApiError = (error: unknown): ApiErrorResponse | null =>
  typeof error === "object" && error !== null ? (error as ApiErrorResponse) : null;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddPromoModal({
  isOpen,
  onClose,
  defaultPlacement,
  initialData,
  sectionId,
  allSections,
}: AddPromoModalProps) {
  const isEditMode = !!initialData;

  const [form, setForm] = useState<PromoFormData>(emptyForm(defaultPlacement));
  const [errors, setErrors] = useState<Partial<Record<keyof PromoFormData, string>>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [videoLoadFailed, setVideoLoadFailed] = useState(false);

  const createPromo = useCreatePromo();
  const updatePromo = useUpdatePromo();
  const isPending = isEditMode ? updatePromo.isPending : createPromo.isPending;

  /**
   * Singleton promo cards expose a display slug to the public page while the
   * media endpoint only accepts its database GUID. Never fall through to that
   * slug: doing so produces a misleading 404 and makes uploads look broken.
   */
  const resolveSectionId = (rawSectionId: string): string => {
    if (isGuid(rawSectionId)) return rawSectionId;

    const section = allSections?.find(
      (candidate) =>
        candidate.id === rawSectionId ||
        candidate.sectionKey === rawSectionId ||
        candidate.slugId === rawSectionId,
    );

    if (section) return section.id;

    if (!allSections) {
      throw new Error("Promo section details are still loading. Please wait a moment and try again.");
    }

    throw new Error("This promo card has no matching server section. Refresh the page and try again.");
  };

  const canUploadMedia =
    !!sectionId &&
    (isGuid(sectionId) ||
      !!allSections?.some(
        (section) =>
          section.id === sectionId ||
          section.sectionKey === sectionId ||
          section.slugId === sectionId,
      ));

  const mediaUploadHelp = !sectionId
    ? isEditMode
      ? "This promo card has no server section ID yet. Refresh the page and try again."
      : "Save the new promo first, then edit it to add an image or background video."
    : !allSections && !isGuid(sectionId)
      ? "Loading promo section details..."
      : !canUploadMedia
        ? "This promo card could not be matched to a server section. Refresh the page and try again."
        : null;

  // ── Sync form on open ──

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
        videoUrl: initialData.videoUrl ?? "",
      });
      // Pre-populate the search box with the current product name and mark it
      // as selected so the search effect doesn't immediately fire. The admin can
      // still clear the selection and search for a different product.
      setSearchQuery(initialData.productName ?? "");
      setSelectedProduct(
        initialData.productId
          ? ({ id: initialData.productId, name: initialData.productName ?? "" } as Product)
          : null,
      );
    } else {
      setForm(emptyForm(defaultPlacement));
      setSearchQuery("");
      setSelectedProduct(null);
      setSearchResults([]);
    }

    setErrors({});
  }, [isOpen, initialData, defaultPlacement]);

  // Reset the "failed to render" flags whenever the underlying URL changes
  // (new upload, promo swapped, modal reopened) so a stale failure doesn't
  // stick around after the value it applied to is gone.
  useEffect(() => setImageLoadFailed(false), [form.imageUrl]);
  useEffect(() => setVideoLoadFailed(false), [form.videoUrl]);

  // ── Product search ──────────────────────────────────────────────────────────

  useEffect(() => {
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
  }, [searchQuery, selectedProduct]);

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
    if (!sectionId) {
      alert("Cannot upload image: section ID is missing.");
      return;
    }
    setIsUploading(true);
    try {
      const url = await uploadMediaToBackend(sectionId, file);
      set("imageUrl", url);
    } catch (error) {
      console.error("Failed to upload promo image:", error);
      const message = error instanceof Error ? error.message : "Please try again.";
      alert(`Failed to upload image: ${message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!sectionId) {
      alert("Cannot upload video: section ID is missing.");
      return;
    }
    setIsUploadingVideo(true);
    try {
      const url = await uploadMediaToBackend(sectionId, file);
      set("videoUrl", url);
    } catch (error) {
      console.error("Failed to upload promo video:", error);
      const message = error instanceof Error ? error.message : "Please try again.";
      alert(`Failed to upload video: ${message}`);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const uploadMediaToBackend = async (
    sectionId: string,
    file: File,
  ): Promise<string> => {
    const token = useAuthStore.getState().accessToken;
    if (!token) throw new Error("No auth token");

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ??
      "https://fresherz-001-site1.ftempurl.com/api/v1";
    const resolvedSectionId = resolveSectionId(sectionId);
    const url = `${baseUrl}/promotions/admin/${resolvedSectionId}/media`;

    const formData = new FormData();
    formData.append("file", file);

    console.info("[Promo media upload] Starting", {
      sectionId,
      resolvedSectionId,
      url,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    try {
      // apiFetch preserves the multipart boundary and retries once with a
      // refreshed token if the access token expired while the modal was open.
      const data = await apiFetch<MediaUploadResponse>(
        `/promotions/admin/${encodeURIComponent(resolvedSectionId)}/media`,
        { method: "POST", token, body: formData },
      );
      if (!data?.url) {
        throw new Error("Backend returned no URL for uploaded media.");
      }

      console.info("[Promo media upload] Completed", { resolvedSectionId, url: data.url });
      return data.url;
    } catch (error) {
      const apiError = toApiError(error);
      console.error("[Promo media upload] Failed", {
        sectionId,
        resolvedSectionId,
        url,
        status: apiError?.status,
        responseBody: apiError?.body,
        error,
      });
      throw new Error(apiError?.message ?? "Please try again.");
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
      placement: form.placement,
      ctaText: form.ctaText,
      tag: form.tag || undefined,
      imageUrl: form.imageUrl || undefined,
      description: form.description || undefined,
      videoUrl: form.placement === "best-deal" ? form.videoUrl || undefined : undefined,
    };

    try {
      // Most placements are edited via the same upsert-by-productId POST
      // that create uses — see PROMO_PUT_UPDATE_PLACEMENTS for why (PUT is
      // either fundamentally broken (hero) or unavailable (singleton
      // placements never expose a real id to PUT against).
      if (isEditMode && PROMO_PUT_UPDATE_PLACEMENTS.includes(form.placement)) {
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
          </div>

          {/* Product */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product <span className="text-red-500">*</span>
            </label>

            {isEditMode && !selectedProduct && (
              <p className="mb-1.5 text-xs text-amber-600">
                This promo isn&apos;t linked to a product yet — search and select one below to fix it.
              </p>
            )}
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
                  {imageLoadFailed ? (
                    <div className="w-16 h-16 rounded-lg border border-red-200 bg-red-50 flex items-center justify-center px-1 text-center">
                      <span className="text-[9px] leading-tight text-red-500">Preview unavailable</span>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.imageUrl}
                      alt="Promo"
                      className="w-16 h-16 object-cover rounded-lg border"
                      onError={() => setImageLoadFailed(true)}
                    />
                  )}
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
                    disabled={isUploading || !canUploadMedia}
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  />
                  <HiArrowUpTray size={20} className="text-gray-400" />
                </label>
              )}
              {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
              {mediaUploadHelp && <p className="text-xs text-amber-600">{mediaUploadHelp}</p>}
              {imageLoadFailed && (
                <p className="text-xs text-red-500">
                  Couldn&apos;t load this image — the URL may be broken. Remove it and re-upload.
                </p>
              )}
            </div>
          </div>

          {/* Video Upload — Best Deal placement only */}
          {form.placement === "best-deal" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Background Video{" "}
                <span className="text-gray-400 font-normal">
                  (optional — plays as a looping background, falls back to the image above)
                </span>
              </label>
              <div className="flex items-center gap-3">
                {form.videoUrl ? (
                  <div className="relative">
                    {videoLoadFailed ? (
                      <div className="w-16 h-16 rounded-lg border border-red-200 bg-red-50 flex items-center justify-center px-1 text-center">
                        <span className="text-[9px] leading-tight text-red-500">Preview unavailable</span>
                      </div>
                    ) : (
                      <video
                        src={form.videoUrl}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="w-16 h-16 object-cover rounded-lg border"
                        onError={() => setVideoLoadFailed(true)}
                      />
                    )}
                    <button
                      onClick={() => set("videoUrl", "")}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 rounded-lg w-16 h-16 flex items-center justify-center cursor-pointer hover:border-[#F97316] hover:bg-orange-50 transition-all">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      disabled={isUploadingVideo || !canUploadMedia}
                      onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
                    />
                    <HiArrowUpTray size={20} className="text-gray-400" />
                  </label>
                )}
                {isUploadingVideo && <p className="text-sm text-gray-500">Uploading...</p>}
                {mediaUploadHelp && <p className="text-xs text-amber-600">{mediaUploadHelp}</p>}
              </div>
              {videoLoadFailed && (
                <p className="mt-1.5 text-xs text-red-500">
                  Couldn&apos;t load this video — the URL may be broken. Remove it and re-upload.
                </p>
              )}
              <p className="mt-1.5 text-xs text-gray-400">
                Keep under 5MB for fast loading on mobile data.
              </p>
            </div>
          )}
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
