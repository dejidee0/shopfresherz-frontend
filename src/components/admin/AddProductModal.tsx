"use client";

import { useState, useEffect } from "react";
import { HiXMark, HiArrowUpTray, HiChevronDown } from "react-icons/hi2";
import { useCreateProduct, useUpdateProduct } from "@/lib/hooks/useAdmin";
import { uploadToCloudinary } from "@/lib/utils/cloudinary";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct?: any;
  categories?: { id: number; name: string }[];
  brands?: { id: number; name: string }[];
}

export interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  price: string;
  compareAtPrice: string;
  stockQty: string;
  sku: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  imageUrls: string[];
}

// Categories will be passed as props

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
      checked ? "bg-[#F97316]" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
        checked ? "translate-x-0" : "-translate-x-4"
      }`}
    />
  </button>
);

export default function AddProductModal({
  isOpen,
  onClose,
  editingProduct,
  brands,
  categories,
}: AddProductModalProps) {
  const isEditing = !!editingProduct;
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
    price: "",
    compareAtPrice: "",
    stockQty: "",
    sku: "",
    metaTitle: "",
    metaDescription: "",
    slug: "",
    isActive: true,
    isFeatured: false,
    imageUrls: [],
  });

  const [isUploading, setIsUploading] = useState(false);
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  // Initialize form with editing product data
  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        categoryId: editingProduct.categoryId?.toString() || "",
        brandId: editingProduct.brandId?.toString() || "",
        price: editingProduct.price?.toString() || "",
        compareAtPrice: editingProduct.compareAtPrice?.toString() || "",
        stockQty: editingProduct.stockQty?.toString() || "",
        sku: editingProduct.sku || "",
        metaTitle: editingProduct.metaTitle || "",
        metaDescription: editingProduct.metaDescription || "",
        slug: editingProduct.slug || "",
        isActive: editingProduct.isActive ?? true,
        isFeatured: editingProduct.isFeatured ?? false,
        imageUrls:
          editingProduct.images?.map(
            (img: any) => img.original || img.display,
          ) || [],
      });
    } else {
      // Reset form for new product
      setForm({
        name: "",
        description: "",
        categoryId: "",
        brandId: "",
        price: "",
        compareAtPrice: "",
        stockQty: "",
        sku: "",
        metaTitle: "",
        metaDescription: "",
        slug: "",
        isActive: true,
        isFeatured: false,
        imageUrls: [],
      });
    }
  }, [editingProduct]);

  const set = (key: keyof ProductFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `SKU-${random}${timestamp}`;
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleImageUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadToCloudinary(file),
      );
      const urls = await Promise.all(uploadPromises);
      setForm((prev) => ({
        ...prev,
        // images: [...prev.images, ...Array.from(files)],
        imageUrls: [...prev.imageUrls, ...urls],
      }));
    } catch (error) {
      console.error("Failed to upload images:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Auto-generate SKU and slug if not provided
      const sku = form.sku || generateSKU();
      const slug = form.slug || generateSlug(form.name);

      const productData = {
        sku,
        name: form.name,
        slug,
        brandId: form.brandId,
        categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
        description: form.description,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice
          ? parseFloat(form.compareAtPrice)
          : undefined,
        stockQty: parseInt(form.stockQty) || 0,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        imageUrls: form.imageUrls,
      };

      console.log('Submitting product payload:', JSON.stringify(productData, null, 2))

      if (isEditing && editingProduct) {
        await updateProductMutation.mutateAsync({
          id: editingProduct.id,
          payload: productData as any,
        });
      } else {
        await createProductMutation.mutateAsync(productData);
      }

      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HiXMark size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Product name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe your product..."
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <div className="relative">
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all bg-white"
              >
                <option value="">Select category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id.toString()}>
                    {c.name}
                  </option>
                ))}
              </select>
              <HiChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Brand
            </label>
            <div className="relative">
              <select
                value={form.brandId}
                onChange={(e) => set("brandId", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all bg-white"
              >
                <option value="">Select Brand</option>
                {brands?.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <HiChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Price + Compare */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Compare at Price
              </label>
              <input
                type="number"
                value={form.compareAtPrice}
                onChange={(e) => set("compareAtPrice", e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
          </div>

          {/* Stock + SKU */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Stock Quantity
              </label>
              <input
                type="number"
                value={form.stockQty}
                onChange={(e) => set("stockQty", e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                SKU
              </label>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => set("sku", e.target.value)}
                  placeholder="SKU-001"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
                />
                <button
                  type="button"
                  onClick={() => set("sku", generateSKU())}
                  className="px-3 py-2.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Images
            </label>
            <div className="space-y-3">
              {/* Image upload area */}
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleImageUpload(e.target.files)
                  }
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="image-upload"
                  className="border-2 border-dashed border-gray-200 rounded-lg w-16 h-16 flex items-center justify-center cursor-pointer hover:border-[#F97316] hover:bg-orange-50 transition-all group"
                >
                  <HiArrowUpTray
                    size={20}
                    className="text-gray-400 group-hover:text-[#F97316]"
                  />
                </label>
                {isUploading && (
                  <p className="text-sm text-gray-500 mt-1">Uploading...</p>
                )}
              </div>

              {/* Display uploaded images */}
              {form.imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            // images: prev.images.filter((_, i) => i !== index),
                            imageUrls: prev.imageUrls.filter(
                              (_, i) => i !== index,
                            ),
                          }));
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">SEO</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => set("metaTitle", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Meta Description
                </label>
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => set("metaDescription", e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Slug
                </label>
                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => set("slug", e.target.value)}
                    placeholder="auto-generated"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => set("slug", generateSlug(form.name))}
                    className="px-3 py-2.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={!form.name}
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Toggle
                checked={form.isActive}
                onChange={(v) => set("isActive", v)}
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Toggle
                checked={form.isFeatured}
                onChange={(v) => set("isFeatured", v)}
              />
              <span className="text-sm font-medium text-gray-700">
                Featured
              </span>
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
            disabled={
              createProductMutation.isPending || updateProductMutation.isPending
            }
            className="px-6 py-2.5 text-sm font-bold bg-[#F97316] text-white rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-orange-200"
          >
            {createProductMutation.isPending || updateProductMutation.isPending
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update"
                : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
