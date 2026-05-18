import { useState, useEffect } from "react";
import { HiXMark, HiArrowUpTray } from "react-icons/hi2";
import { useCreateBanner } from "@/lib/hooks/useAdmin";
import { uploadToCloudinary } from "@/lib/utils/cloudinary";

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ContentFormData) => void;
}

export interface ContentFormData {
  title: string;
  subtitle: string;
  cta: string;
  imageFile: File | null;
  imagePreview: string;
  imgUrl: string;
  linkUrl: string;
}

const AddContentModal = ({
  isOpen,
  onClose,
}: AddContentModalProps) => {
  const [form, setForm] = useState<ContentFormData>({
    title: "",
    subtitle: "",
    cta: "",
    imageFile: null,
    imagePreview: "",
    imgUrl: "",
    linkUrl: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const createBannerMutation = useCreateBanner();

  // Cleanup object URLs when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (form.imagePreview) {
        URL.revokeObjectURL(form.imagePreview);
      }
    };
  }, [form.imagePreview]);

  const set = (key: keyof ContentFormData, value: string | boolean | File | null) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setForm(prev => ({
      ...prev,
      imageFile: file,
      imagePreview: previewUrl,
    }));
  };

  const handleRemoveImage = () => {
    if (form.imagePreview) {
      URL.revokeObjectURL(form.imagePreview);
    }
    setForm(prev => ({
      ...prev,
      imageFile: null,
      imagePreview: "",
      imgUrl: "",
    }));
  };

  const handleSubmit = async () => {
    if (!form.title) {
      alert('Please fill in the title');
      return;
    }

    if (!form.imageFile && !form.imgUrl) {
      alert('Please select an image');
      return;
    }

    try {
      let imageUrl = form.imgUrl;

      // Upload image to Cloudinary if a file is selected
      if (form.imageFile) {
        setIsUploading(true);
        try {
          imageUrl = await uploadToCloudinary(form.imageFile);
        } catch (uploadError) {
          console.error('Failed to upload image:', uploadError);
          alert('Failed to upload image. Please try again.');
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const bannerData = {
        title: form.title,
        subtitle: form.subtitle,
        imageUrl,
        linkUrl: form.linkUrl,
        ctaText: form.cta,
        isActive: true,
      };

      await createBannerMutation.mutateAsync(bannerData);

      // Clean up object URL
      if (form.imagePreview) {
        URL.revokeObjectURL(form.imagePreview);
      }

      onClose();
      // Reset form
      setForm({
        title: "",
        subtitle: "",
        cta: "",
        imageFile: null,
        imagePreview: "",
        imgUrl: "",
        linkUrl: "",
      });
    } catch (error) {
      console.error('Failed to create banner:', error);
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
          <h2 className="text-lg font-bold text-gray-900">Add Banner</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
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
              onChange={(e) => set("title", e.target.value)}
              placeholder="Banner Title"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Subtitle
            </label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="Banner Subtitle"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Image <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {/* Image upload area */}
              <div>
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
                {isUploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
              </div>

              {/* Display uploaded image */}
              {form.imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={form.imagePreview}
                    alt="Banner preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    <HiXMark size={12} />
                  </button>
                </div>
              )}

              {/* Alternative: Manual URL input */}
              <div className="text-sm text-gray-500">
                Or enter image URL directly:
                <input
                  type="text"
                  value={form.imgUrl}
                  onChange={(e) => set("imgUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Link URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.linkUrl}
              onChange={(e) => set("linkUrl", e.target.value)}
              placeholder="Link URL"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </div>

          {/* CTA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              CTA Text <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.cta}
              onChange={(e) => set("cta", e.target.value)}
              placeholder="Buy Now"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
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
            disabled={createBannerMutation.isPending || isUploading}
            className="px-6 py-2.5 text-sm font-bold bg-[#F97316] text-white rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-orange-200"
          >
            {isUploading
              ? 'Uploading...'
              : createBannerMutation.isPending
                ? 'Creating...'
                : 'Create Banner'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddContentModal;
