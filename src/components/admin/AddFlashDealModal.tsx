import { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import { useCreateFlashDeal, useUpdateFlashDeal } from "@/lib/hooks/useAdmin";

interface AddFlashDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDeal?: any;
}

export interface FlashDealFormData {
  productId: string;
  productName: string;
  originalPrice: string;
  salePrice: string;
  startDate: string;
  endDate: string;
  maxQuantity: string;
}

const AddFlashDealModal = ({ isOpen, onClose, editingDeal }: AddFlashDealModalProps) => {
  const isEditing = !!editingDeal;
  const [form, setForm] = useState<FlashDealFormData>({
    productId: "",
    productName: "",
    originalPrice: "",
    salePrice: "",
    startDate: "",
    endDate: "",
    maxQuantity: "",
  });

  const createFlashDealMutation = useCreateFlashDeal();
  const updateFlashDealMutation = useUpdateFlashDeal();

  // Populate form when editing
  useEffect(() => {
    if (editingDeal) {
      setForm({
        productId: editingDeal.productId,
        productName: editingDeal.productName,
        originalPrice: editingDeal.originalPrice.toString(),
        salePrice: editingDeal.salePrice.toString(),
        startDate: new Date(editingDeal.startsAt).toISOString().split('T')[0],
        endDate: new Date(editingDeal.endsAt).toISOString().split('T')[0],
        maxQuantity: editingDeal.maxQuantity.toString(),
      });
    } else {
      // Reset form for new deal
      setForm({
        productId: "",
        productName: "",
        originalPrice: "",
        salePrice: "",
        startDate: "",
        endDate: "",
        maxQuantity: "",
      });
    }
  }, [editingDeal]);

  const set = (key: keyof FlashDealFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.productName || !form.salePrice || !form.startDate || !form.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const dealData = {
        productId: form.productId,
        salePrice: parseFloat(form.salePrice),
        originalPrice: parseFloat(form.originalPrice),
        startsAt: new Date(form.startDate).toISOString(),
        endsAt: new Date(form.endDate).toISOString(),
        maxQuantity: parseInt(form.maxQuantity),
      };

      if (isEditing && editingDeal) {
        await updateFlashDealMutation.mutateAsync({
          id: editingDeal.id,
          payload: dealData
        });
      } else {
        await createFlashDealMutation.mutateAsync(dealData);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save flash deal:', error);
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
            {isEditing ? 'Edit Flash Deal' : 'Create Flash Deal'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <HiXMark size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.productName}
              onChange={(e) => set("productName", e.target.value)}
              placeholder="Search and select a product..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              disabled={isEditing} // Can't change product when editing
            />
            <input
              type="hidden"
              value={form.productId}
              onChange={(e) => set("productId", e.target.value)}
            />
          </div>

          {/* Orig & Sale Price */}
          <div className="flex gap-2">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Original Price (₦)
              </label>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => set("originalPrice", e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
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
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
          </div>

          {/* Start & End dates */}
          <div className="flex w-full gap-2">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                placeholder=""
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                placeholder=""
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
          </div>

          {/* Max Qty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Max Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.maxQuantity}
              onChange={(e) => set("maxQuantity", e.target.value)}
              placeholder=""
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
            disabled={createFlashDealMutation.isPending || updateFlashDealMutation.isPending}
            className="px-6 py-2.5 text-sm font-bold bg-[#F97316] text-white rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-orange-200"
          >
            {createFlashDealMutation.isPending || updateFlashDealMutation.isPending
              ? (isEditing ? 'Updating...' : 'Creating...')
              : (isEditing ? 'Update' : 'Create')
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFlashDealModal;
