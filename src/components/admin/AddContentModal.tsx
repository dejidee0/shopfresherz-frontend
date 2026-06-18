import { useState, useEffect } from "react";
import { HiXMark, HiArrowUpTray } from "react-icons/hi2";
import { useCreateBanner, useUpdateBanner } from "@/lib/hooks/useAdmin";
import { uploadToCloudinary } from "@/lib/utils/cloudinary";

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** When provided the modal runs in edit mode — fields prefilled, calls updateBanner */
  initialData?: {
    id: string;
    tag: string;
    title: string;
    subtitle?: string;
    cta: string;
    imgUrl?: string;
    linkUrl?: string;
  };
}

export interface ContentFormData {
  title: string;
  tag: string;
  subtitle: string;
  cta: string;
  imageFile: File | null;
  imagePreview: string;
  imgUrl: string;
  linkUrl: string;
}

const EMPTY_FORM: ContentFormData = {
  title: "",
  tag: "",
  subtitle: "",
  cta: "",
  imageFile: null,
  imagePreview: "",
  imgUrl: "",
  linkUrl: "",
};

const AddContentModal = ({ isOpen, onClose, initialData }: AddContentModalProps) => {
  const isEditMode = !!initialData;

  const [form, setForm] = useState<ContentFormData>(EMPTY_FORM);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContentFormData, string>>>({});

  const createBannerMutation = useCreateBanner();
  const updateBannerMutation = useUpdateBanner();

  const isPending = createBannerMutation.isPending || updateBannerMutation.isPending;

  // Prefill form when editing
  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        title:        initialData.title    ?? "",
        tag:          initialData.tag      ?? "",
        subtitle:     initialData.subtitle ?? "",
        cta:          initialData.cta      ?? "",
        imgUrl:       initialData.imgUrl   ?? "",
        linkUrl:      initialData.linkUrl  ?? "",
        imageFile:    null,
        imagePreview: initialData.imgUrl   ?? "",
      });
    } else if (isOpen && !initialData) {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [isOpen, initialData]);

  // Revoke blob URLs on unmount
  useEffect(() => {
    return () => {
      if (form.imagePreview && form.imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(form.imagePreview);
      }
    };
  }, [form.imagePreview]);

  const set = <K extends keyof ContentFormData>(key: K, value: ContentFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const clearError = (key: keyof ContentFormData) =>
    setErrors((prev) => ({ ...prev, [key]: undefined }));

  // ── Image handling ──────────────────────────────────────────────────────────

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, imageFile: "Please select a valid image file" }));
      return;
    }
    if (form.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imageFile: file, imagePreview: previewUrl, imgUrl: "" }));
    clearError("imageFile");
  };

  const handleRemoveImage = () => {
    if (form.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
    setForm((prev) => ({ ...prev, imageFile: null, imagePreview: "", imgUrl: "" }));
  };

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.title.trim())              e.title     = "Title is required";
    if (!form.cta.trim())                e.cta       = "CTA text is required";
    if (!form.linkUrl.trim())            e.linkUrl   = "Link URL is required";
    if (!form.imageFile && !form.imgUrl) e.imageFile = "An image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      let imageUrl = form.imgUrl;

      if (form.imageFile) {
        setIsUploading(true);
        try {
          imageUrl = await uploadToCloudinary(form.imageFile);
        } catch {
          setErrors((prev) => ({ ...prev, imageFile: "Failed to upload image. Please try again." }));
          return;
        } finally {
          setIsUploading(false);
        }
      }

      const payload = {
        title:    form.title,
        tag:      form.tag || undefined,   // ← added
        subtitle: form.subtitle || undefined,
        imageUrl,
        linkUrl:  form.linkUrl,
        ctaText:  form.cta,
        isActive: true,
      };

      if (isEditMode) {
        await updateBannerMutation.mutateAsync({ id: initialData!.id, payload });
      } else {
        await createBannerMutation.mutateAsync(payload);
      }

      if (form.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
      onClose();
    } catch {
      // Errors handled by mutation onError toast
    }
  };

  if (!isOpen) return null;

  const submitLabel = isUploading
    ? "Uploading..."
    : isPending
    ? isEditMode ? "Saving..." : "Creating..."
    : isEditMode ? "Save Changes" : "Create Banner";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {isEditMode ? "Edit Banner" : "Add Banner"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HiXMark size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => { set("title", e.target.value); clearError("title"); }}
              placeholder="Banner Title"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="Banner Subtitle"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </div>

          {/* Tag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tag</label>
            <input
              type="text"
              value={form.tag}
              onChange={(e) => set("tag", e.target.value)}
              placeholder="e.g. New Arrival, Hot Deal"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Image <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {!form.imagePreview && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="banner-image-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="banner-image-upload"
                    className="border-2 border-dashed border-gray-200 rounded-lg w-24 h-24 flex items-center justify-center cursor-pointer hover:border-[#F97316] hover:bg-orange-50 transition-all group"
                  >
                    <HiArrowUpTray size={24} className="text-gray-400 group-hover:text-[#F97316]" />
                  </label>
                </>
              )}

              {form.imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={form.imagePreview}
                    alt="Banner preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <HiXMark size={12} />
                  </button>
                </div>
              )}

              {errors.imageFile && <p className="text-xs text-red-500">{errors.imageFile}</p>}

              {/* URL fallback */}
              <div className="text-sm text-gray-500">
                Or enter image URL directly:
                <input
                  type="text"
                  value={form.imgUrl}
                  onChange={(e) => {
                    set("imgUrl", e.target.value);
                    if (e.target.value && form.imageFile) {
                      if (form.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
                      setForm((prev) => ({ ...prev, imageFile: null, imagePreview: e.target.value }));
                    }
                    clearError("imageFile");
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Link URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.linkUrl}
              onChange={(e) => { set("linkUrl", e.target.value); clearError("linkUrl"); }}
              placeholder="/category/phones"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
            {errors.linkUrl && <p className="text-xs text-red-500 mt-1">{errors.linkUrl}</p>}
          </div>

          {/* CTA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              CTA Text <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.cta}
              onChange={(e) => { set("cta", e.target.value); clearError("cta"); }}
              placeholder="Shop Now"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
            {errors.cta && <p className="text-xs text-red-500 mt-1">{errors.cta}</p>}
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
};

export default AddContentModal;