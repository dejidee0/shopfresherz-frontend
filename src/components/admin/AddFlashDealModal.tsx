import { useEffect, useMemo, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { productsApi } from "@/lib/api/products";
import type { FlashDealDto } from "@/lib/api/admin";
import type { Product, ProductVariant } from "@/lib/types/product";
import { useCreateFlashDeal, useUpdateFlashDeal } from "@/lib/hooks/useAdmin";

interface AddFlashDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDeal?: FlashDealDto | null;
}

export interface FlashDealFormData {
  productId: string;
  variantId: string;
  productName: string;
  originalPrice: string;
  salePrice: string;
  startsAt: string;
  endsAt: string;
  maxQuantity: string;
}

function toDatetimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function emptyForm(editingDeal?: FlashDealDto | null): FlashDealFormData {
  if (!editingDeal) {
    return {
      productId: "",
      variantId: "",
      productName: "",
      originalPrice: "",
      salePrice: "",
      startsAt: "",
      endsAt: "",
      maxQuantity: "",
    };
  }

  return {
    productId: editingDeal.productId,
    variantId: "",
    productName: editingDeal.productName,
    originalPrice: String(editingDeal.originalPrice),
    salePrice: String(editingDeal.salePrice),
    startsAt: toDatetimeLocal(editingDeal.startsAt),
    endsAt: toDatetimeLocal(editingDeal.endsAt),
    maxQuantity: String(editingDeal.maxQuantity),
  };
}

function productStock(product: Product) {
  return product.availableQty ?? product.stockQty ?? 0;
}

function variantStock(variant: ProductVariant) {
  return variant.availableQty ?? variant.stockQty ?? 0;
}

function variantPrice(product: Product, variant?: ProductVariant) {
  if (!variant) return product.price;
  if (variant.price !== undefined) return variant.price;
  if (variant.priceModifier !== undefined) return product.price + variant.priceModifier;
  return product.price;
}

const AddFlashDealModal = ({ isOpen, onClose, editingDeal }: AddFlashDealModalProps) => {
  const isEditing = !!editingDeal;
  const [form, setForm] = useState<FlashDealFormData>(() => emptyForm(editingDeal));
  const [searchQuery, setSearchQuery] = useState(editingDeal?.productName ?? "");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const createFlashDealMutation = useCreateFlashDeal();
  const updateFlashDealMutation = useUpdateFlashDeal();

  const selectedVariant = useMemo(
    () => selectedProduct?.variants?.find((variant) => variant.id === form.variantId),
    [form.variantId, selectedProduct]
  );
  const availableStock = selectedProduct
    ? selectedVariant
      ? variantStock(selectedVariant)
      : productStock(selectedProduct)
    : undefined;

  useEffect(() => {
    if (isEditing) return;

    const query = searchQuery.trim();
    if (query.length < 2) {
      Promise.resolve().then(() => setSearchResults([]));
      return;
    }

    let isActive = true;
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await productsApi.search({
          q: query,
          page: 1,
          pageSize: 8,
          inStock: true,
        });
        if (isActive) setSearchResults(result.data);
      } catch {
        if (isActive) setSearchResults([]);
      } finally {
        if (isActive) setIsSearching(false);
      }
    }, 250);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [isEditing, searchQuery]);

  const set = (key: keyof FlashDealFormData, value: string) => {
    setError("");
    setForm((prev) => {
      if (key === "maxQuantity" && availableStock !== undefined) {
        const quantity = Number(value);
        if (Number.isFinite(quantity) && quantity > availableStock) {
          return { ...prev, [key]: String(availableStock) };
        }
      }

      return { ...prev, [key]: value };
    });
  };

  function selectProduct(product: Product) {
    const stock = productStock(product);
    setSelectedProduct(product);
    setSearchQuery(product.name);
    setSearchResults([]);
    setForm((prev) => ({
      ...prev,
      productId: product.id,
      variantId: "",
      productName: product.name,
      originalPrice: String(product.price),
      maxQuantity: prev.maxQuantity
        ? String(Math.min(Number(prev.maxQuantity), stock))
        : stock > 0
          ? "1"
          : "",
    }));
  }

  function selectVariant(variantId: string) {
    if (!selectedProduct) return;
    const variant = selectedProduct.variants?.find((item) => item.id === variantId);
    const stock = variant ? variantStock(variant) : productStock(selectedProduct);
    setForm((prev) => ({
      ...prev,
      variantId,
      originalPrice: String(variantPrice(selectedProduct, variant)),
      maxQuantity: prev.maxQuantity
        ? String(Math.min(Number(prev.maxQuantity), stock))
        : stock > 0
          ? "1"
          : "",
    }));
  }

  const handleSubmit = async () => {
    if (!form.productId || !form.salePrice || !form.startsAt || !form.endsAt || !form.maxQuantity) {
      setError("Please fill in product, sale price, dates, and max quantity.");
      return;
    }

    const maxQuantity = Number(form.maxQuantity);
    if (!Number.isInteger(maxQuantity) || maxQuantity < 1) {
      setError("Max quantity must be at least 1.");
      return;
    }

    if (availableStock !== undefined && maxQuantity > availableStock) {
      setError(`Max quantity cannot exceed available stock (${availableStock}).`);
      return;
    }

    try {
      const dealData = {
        productId: form.productId,
        variantId: form.variantId || undefined,
        salePrice: Number(form.salePrice),
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
        maxQuantity,
      };

      if (isEditing && editingDeal) {
        await updateFlashDealMutation.mutateAsync({
          id: editingDeal.id,
          payload: dealData,
        });
      } else {
        await createFlashDealMutation.mutateAsync(dealData);
      }

      onClose();
    } catch (saveError) {
      console.error("Failed to save flash deal:", saveError);
      setError("Failed to save flash deal. Please try again.");
    }
  };

  if (!isOpen) return null;

  const isPending = createFlashDealMutation.isPending || updateFlashDealMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {isEditing ? "Edit Flash Deal" : "Create Flash Deal"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close flash deal modal"
          >
            <HiXMark size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedProduct(null);
                setForm((prev) => ({
                  ...prev,
                  productId: "",
                  variantId: "",
                  productName: e.target.value,
                  originalPrice: "",
                  maxQuantity: "",
                }));
              }}
              placeholder="Search and select a product..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              disabled={isEditing}
            />

            {!isEditing && (searchResults.length > 0 || isSearching) && (
              <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {isSearching ? (
                  <p className="px-3 py-3 text-sm text-gray-500">Searching products...</p>
                ) : (
                  searchResults.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => selectProduct(product)}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-orange-50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-gray-800">
                          {product.name}
                        </span>
                        <span className="block text-xs text-gray-500">
                          Stock: {productStock(product)} | Price: ₦{product.price.toLocaleString()}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {selectedProduct?.variants && selectedProduct.variants.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Variant
              </label>
              <select
                value={form.variantId}
                onChange={(e) => selectVariant(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all bg-white"
              >
                <option value="">Default product</option>
                {selectedProduct.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.label ?? variant.sku} | Stock: {variantStock(variant)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-2">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Original Price (₦)
              </label>
              <input
                type="number"
                value={form.originalPrice}
                readOnly
                placeholder="Select product"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:outline-none transition-all"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Sale Price (₦)
              </label>
              <input
                type="number"
                value={form.salePrice}
                onChange={(e) => set("salePrice", e.target.value)}
                placeholder="0.00"
                min="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full gap-2">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => set("startsAt", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => set("endsAt", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Max Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.maxQuantity}
              onChange={(e) => set("maxQuantity", e.target.value)}
              min="1"
              max={availableStock}
              placeholder={availableStock !== undefined ? `Max ${availableStock}` : ""}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
            {availableStock !== undefined && (
              <p className="mt-1 text-xs text-gray-500">
                Available stock: {availableStock}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="px-6 py-2.5 text-sm font-bold bg-[#F97316] text-white rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-orange-200"
          >
            {isPending ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFlashDealModal;
