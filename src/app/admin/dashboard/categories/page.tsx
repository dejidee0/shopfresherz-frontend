"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";
import { Toggle } from "@/components/ui/Toggle";
import { Spinner } from "@/components/ui/Spinner";
import { FaRegTrashAlt } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { HiXMark, HiArrowUpTray } from "react-icons/hi2";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/lib/hooks/useAdmin";
import { uploadToCloudinary } from "@/lib/utils/cloudinary";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoryFormData {
  name: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  active: boolean;
  featured: boolean;
  // image
  imageFile: File | null;
  imagePreview: string;   // blob: URL (new upload) or remote URL (existing)
  imageUrl: string       // committed remote URL sent to API
}

type FormErrors = Partial<Record<keyof CategoryFormData, string>>;

const EMPTY_FORM: CategoryFormData = {
  name: "",
  slug: "",
  metaTitle: "",
  metaDescription: "",
  active: true,
  featured: false,
  imageFile: null,
  imagePreview: "",
  imageUrl: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

// ─── Image upload section (reusable within the page) ─────────────────────────

function ImageUploadField({
  imagePreview,
  error,
  isUploading,
  onFileChange,
  onUrlChange,
  onRemove,
  imageUrl,
}: {
  imagePreview: string;
  error?: string;
  isUploading: boolean;
  onFileChange: (files: FileList | null) => void;
  onUrlChange: (url: string) => void;
  onRemove: () => void;
  imageUrl: string;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Image
      </label>

      {/* Upload trigger — hidden once preview exists */}
      {!imagePreview && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e.target.files)}
            className="hidden"
            id="category-image-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="category-image-upload"
            className="border-2 border-dashed border-gray-200 rounded-lg w-24 h-24 flex flex-col items-center justify-center cursor-pointer hover:border-[#F97316] hover:bg-orange-50 transition-all group gap-1"
          >
            <HiArrowUpTray size={22} className="text-gray-400 group-hover:text-[#F97316]" />
            <span className="text-[10px] text-gray-400 group-hover:text-[#F97316]">Upload</span>
          </label>
        </>
      )}

      {/* Preview with remove button */}
      {imagePreview && (
        <div className="relative inline-block">
          <img
            src={imagePreview}
            alt="Category preview"
            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <HiXMark size={12} />
          </button>
        </div>
      )}

      {isUploading && (
        <p className="text-xs text-[#F97316] flex items-center gap-1.5">
          <Spinner /> Uploading to Cloudinary...
        </p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* URL fallback */}
      <div>
        <p className="text-xs text-gray-400 mb-1">Or paste an image URL:</p>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
        />
      </div>
    </div>
  );
}

// ─── Delete confirmation ──────────────────────────────────────────────────────

function DeleteConfirmDialog({
  name,
  onConfirm,
  onCancel,
  isPending,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
        <p className="font-bold text-gray-900">Delete Category</p>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700">"{name}"</span>? This
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-5 py-2 text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminCategoriesPage = () => {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // null = panel hidden | "" = add mode | "<id>" = edit mode
  const [editingId, setEditingId] = useState<number | null>(null);
  const isPanelOpen = editingId !== null;
  const isEditMode  = isPanelOpen && editingId > 0;

  const [form, setForm]         = useState<CategoryFormData>(EMPTY_FORM);
  const [errors, setErrors]     = useState<FormErrors>({});
  const [slugEdited, setSlugEdited] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  // ── Field setter ──────────────────────────────────────────────────────────

  const set = useCallback(
    <K extends keyof CategoryFormData>(key: K, value: CategoryFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    []
  );

  // ── Auto-slug ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!slugEdited) {
      setForm((prev) => ({ ...prev, slug: toSlug(prev.name) }));
    }
  }, [form.name, slugEdited]);

  // ── Cleanup blob URLs ─────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (form.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(form.imagePreview);
      }
    };
  }, [form.imagePreview]);

  // ── Image handlers (same pattern as AddContentModal) ─────────────────────

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, imageFile: "Please select a valid image file" }));
      return;
    }
    if (form.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: previewUrl,
      imageUrl: "",           // clear any manual URL
    }));
    setErrors((prev) => ({ ...prev, imageFile: undefined }));
  };

  const handleUrlChange = (url: string) => {
    // If typing a URL manually, clear any selected file first
    if (form.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
    setForm((prev) => ({
      ...prev,
      imageUrl: url,
      imageFile: null,
      imagePreview: url,      // show the remote URL as preview immediately
    }));
  };

  const handleRemoveImage = () => {
    if (form.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
    setForm((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: "",
      imageUrl: "",
    }));
  };

  // ── Panel open/close ──────────────────────────────────────────────────────

  const handleOpenAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSlugEdited(false);
    setEditingId(null);
  };

  const handleOpenEdit = (cat: any) => {
    setForm({
      name:            cat.name            ?? "",
      slug:            cat.slug            ?? "",
      metaTitle:       cat.metaTitle       ?? "",
      metaDescription: cat.metaDescription ?? "",
      active:          cat.isActive        ?? true,
      featured:        cat.isFeatured      ?? false,
      imageFile:    null,
      imagePreview: cat.imageUrl ?? "",   // show existing image
      imageUrl:     cat.imageUrl ?? "",
    });
    setErrors({});
    setSlugEdited(true);
    setEditingId(cat.id);
  };

  const handleClosePanel = () => {
    if (form.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
    setEditingId(null);
    setErrors({});
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Save — upload image first (if file selected), then send URL in payload ──

  const handleSave = async () => {
    if (!validate()) return;

    try {
      // Step 1: upload to Cloudinary if a new file was picked
      let resolvedImageUrl = form.imageUrl;

      if (form.imageFile) {
        setIsUploading(true);
        try {
          resolvedImageUrl = await uploadToCloudinary(form.imageFile);
        } catch {
          setErrors((prev) => ({
            ...prev,
            imageFile: "Failed to upload image. Please try again.",
          }));
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // Step 2: build payload with resolved URL
      const payload = {
        name:            form.name,
        slug:            form.slug,
        metaTitle:       form.metaTitle       || undefined,
        metaDescription: form.metaDescription || undefined,
        isActive:        form.active,
        isFeatured:      form.featured,
        imageUrl:        resolvedImageUrl ,
      };

      // Step 3: create or update
      if (isEditMode) {
        await updateCategory.mutateAsync({ id: editingId!, payload });
      } else {
        await createCategory.mutateAsync(payload);
      }

      // Cleanup
      if (form.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
      handleClosePanel();
    } catch {
      // Errors surfaced via toast in the hooks
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory.mutateAsync(deleteTarget.id);
    } finally {
      setDeleteTarget(null);
    }
  };

  const isSaving = createCategory.isPending || updateCategory.isPending || isUploading;

  const saveLabel = isUploading
    ? "Uploading image..."
    : createCategory.isPending || updateCategory.isPending
    ? isEditMode ? "Saving..." : "Creating..."
    : isEditMode ? "Save Changes" : "Create Category";

  return (
    <div className="p-2 md:p-4 lg:p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <p className="font-bold">Categories</p>
          <p className="text-xs text-text-muted">
            {isLoading
              ? "Loading categories..."
              : `${categories?.length ?? 0} categories · organise your product catalogue`}
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="text-xs md:text-sm rounded-md shrink-0">
          Add Category
        </Button>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-3">
        {/* ── Category list ── */}
        <SectionCard className="flex flex-1 flex-col gap-1 p-1 md:p-4">
          {isLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : categories && categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="flex w-full px-3 py-2.5 justify-between items-center rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Thumbnail or initial avatar */}
                  {(cat as any).imageUrl ? (
                    <img
                      src={(cat as any).imageUrl}
                      alt={cat.name}
                      className="h-8 w-8 rounded-full object-cover border border-gray-200 shrink-0"
                    />
                  ) : (
                    <span className="h-8 w-8 flex items-center justify-center rounded-full bg-border text-xs font-bold shrink-0">
                      {cat.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{cat.name}</p>
                    {cat.slug && (
                      <p className="text-[11px] text-text-muted truncate">{cat.slug}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  {/* {cat.isActive !== undefined && (
                    <span className={`hidden sm:block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cat.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  )} */}
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded hover:bg-orange-50 hover:text-[#F97316] text-gray-500 transition-colors"
                    title="Edit category"
                  >
                    <LuPencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                    disabled={deleteCategory.isPending}
                    className="p-1.5 rounded hover:bg-red-50 hover:text-red-500 text-gray-500 transition-colors disabled:opacity-40"
                    title="Delete category"
                  >
                    <FaRegTrashAlt size={13} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-text-muted">
              No categories yet. Add one to get started.
            </div>
          )}
        </SectionCard>

        {/* ── Add / Edit panel ── */}
        {isPanelOpen && (
          <SectionCard className="flex flex-1 flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <p className="font-semibold text-gray-900">
                {isEditMode ? "Edit Category" : "New Category"}
              </p>
              <button
                onClick={handleClosePanel}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
              >
                <HiXMark size={16} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Smartphones"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  placeholder="e.g. smartphones"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all font-mono"
                />
                {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                {!slugEdited && form.slug && (
                  <p className="text-[11px] text-text-muted mt-1">Auto-generated from name</p>
                )}
              </div>

              {/* Image upload */}
              <ImageUploadField
                imagePreview={form.imagePreview}
                imageUrl={form.imageUrl}
                error={errors.imageFile}
                isUploading={isUploading}
                onFileChange={handleFileChange}
                onUrlChange={handleUrlChange}
                onRemove={handleRemoveImage}
              />

              {/* Meta Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => set("metaTitle", e.target.value)}
                  placeholder="SEO title"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
                />
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Meta Description
                </label>
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => set("metaDescription", e.target.value)}
                  placeholder="SEO description"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Toggle checked={form.active} onChange={(v) => set("active", v)} />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Toggle checked={form.featured} onChange={(v) => set("featured", v)} />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button variant="ghost" onClick={handleClosePanel} className="text-xs md:text-sm rounded-md">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-xs md:text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLabel}
                </Button>
              </div>
            </div>
          </SectionCard>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteConfirmDialog
          name={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleteCategory.isPending}
        />
      )}
    </div>
  );
};

export default AdminCategoriesPage;