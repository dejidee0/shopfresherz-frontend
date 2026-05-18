import { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import { Button } from "../ui/Button";
import { Toggle } from "../ui/Toggle";
import { useCreateCoupon, useUpdateCoupon } from "@/lib/hooks/useAdmin";

interface AddCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCoupon?: any;
}

export interface CouponFormData {
  code: string;
  type: string;
  value: string;
  minimumOrder: string;
  perUserLimit: number;
  maxUses: string;
  expiryDate: string;
  active: boolean;
}

const AddCouponModal = ({ isOpen, onClose, editingCoupon }: AddCouponModalProps) => {
  const isEditing = !!editingCoupon;

  const [form, setForm] = useState<CouponFormData>({
    code: "",
    type: "percentage",
    value: "",
    minimumOrder: "",
    perUserLimit: 1,
    maxUses: "",
    expiryDate: "",
    active: true,
  });

  const createCouponMutation = useCreateCoupon();
  const updateCouponMutation = useUpdateCoupon();

  // Populate form when editing
  useEffect(() => {
    if (editingCoupon) {
      setForm({
        code: editingCoupon.code || "",
        type: editingCoupon.type?.toLowerCase() || "percentage",
        value: editingCoupon.value?.toString() || "",
        minimumOrder: editingCoupon.minimumOrderAmount?.toString() || "",
        perUserLimit: editingCoupon.perUserLimit || 1,
        maxUses: editingCoupon.maxUses?.toString() || "",
        expiryDate: editingCoupon.expiresAt ? new Date(editingCoupon.expiresAt).toISOString().split('T')[0] : "",
        active: editingCoupon.isActive ?? true,
      });
    } else {
      // Reset form for new coupon
      setForm({
        code: "",
        type: "percentage",
        value: "",
        minimumOrder: "",
        perUserLimit: 1,
        maxUses: "",
        expiryDate: "",
        active: true,
      });
    }
  }, [editingCoupon]);

  const set = (key: keyof CouponFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const generateCode = () => {
    const prefix = "COUPON";
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${prefix}${random}${timestamp}`;
  };

  const handleSubmit = async () => {
    if (!form.code || !form.value || !form.expiryDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const couponData = {
        code: form.code,
        type: form.type === 'fixed' ? 'Fixed' as const : 'Percentage' as const,
        value: parseFloat(form.value),
        minimumOrderAmount: parseFloat(form.minimumOrder) || 0,
        maxUses: parseInt(form.maxUses) || 0,
        perUserLimit: form.perUserLimit,
        expiresAt: new Date(form.expiryDate).toISOString(),
        isActive: form.active,
      };

      if (isEditing && editingCoupon) {
        await updateCouponMutation.mutateAsync({
          id: editingCoupon.id,
          payload: couponData
        });
      } else {
        await createCouponMutation.mutateAsync(couponData);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save coupon:', error);
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
            {isEditing ? 'Edit Coupon' : 'Create Coupon'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <HiXMark size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Code */}
          <div className="flex gap-3 w-full items-end justify-between">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => set("code", e.target.value)}
                placeholder=""
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
            <Button
              variant="ghost"
              className=" text-text-muted rounded-md cursor-pointer"
              onClick={() => set("code", generateCode())}
              disabled={isEditing} // Can't change code when editing
            >
              Generate
            </Button>
          </div>

          {/* Coupon Type */}
          <div className="flex justify-between gap-3 items-center px-3">
            <button
              onClick={() => setForm({ ...form, type: "fixed" })}
              className={`flex flex-1 p-2 items-center justify-center cursor-pointer w-full text-sm rounded-md ${form.type === "fixed" && "bg-primary text-white"}`}
            >
              Fixed (₦)
            </button>
            <button
              onClick={() => setForm({ ...form, type: "percentage" })}
              className={`flex flex-1 p-2 items-center justify-center cursor-pointer w-full text-sm rounded-md ${form.type === "percentage" && "bg-primary text-white"}`}
            >
              Percentage (%)
            </button>
          </div>

          {/* Discount and Min Order */}
          <div className="flex gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Discount value
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => set("value", e.target.value)}
                placeholder=""
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Min Order (₦)
              </label>
              <input
                type="number"
                value={form.minimumOrder}
                onChange={(e) => set("minimumOrder", e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
          </div>

          {/* Max Uses and User Limit */}
          <div className="flex gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Max Uses
              </label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => set("maxUses", e.target.value)}
                placeholder=""
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Per User Limit
              </label>
              <input
                type="number"
                value={form.perUserLimit}
                onChange={(e) => set("perUserLimit", e.target.value)}
                placeholder=""
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => set("expiryDate", e.target.value)}
              placeholder="Buy Now"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-2">
            <Toggle checked={form.active} onChange={(v) => set("active", v)} />
            <span className="text-sm font-medium text-gray-700">Active</span>
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
            disabled={createCouponMutation.isPending || updateCouponMutation.isPending}
            className="px-6 py-2.5 text-sm font-bold bg-[#F97316] text-white rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-orange-200"
          >
            {createCouponMutation.isPending || updateCouponMutation.isPending
              ? (isEditing ? 'Updating...' : 'Creating...')
              : (isEditing ? 'Update' : 'Create')
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCouponModal;
