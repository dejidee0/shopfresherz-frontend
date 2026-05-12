import { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { Button } from "../ui/Button";
import { Toggle } from "../ui/Toggle";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CardFormData) => void;
}

export interface CardFormData {
  cardName: string;
  number: string;
  expiryDate: string;
  cvv: string;
}

const AddCardModal = ({ isOpen, onSubmit, onClose }: AddCardModalProps) => {
  const [form, setForm] = useState<CardFormData>({
    cardName: "",
    number: "",
    expiryDate: "",
    cvv: "",
  });

  const set = (key: keyof CardFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.cardName || !form.number || form.cvv) return;
    onSubmit?.(form);
    onClose();
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
          <h2 className="text-lg font-bold text-gray-900">Add New Card</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <HiXMark size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Name and email */}
          <div className="flex gap-3 w-full items-end justify-between">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name on Card <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.cardName}
                onChange={(e) => set("cardName", e.target.value)}
                placeholder=""
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Card Number
            </label>
            <input
              type="number"
              value={form.number}
              onChange={(e) => set("number", e.target.value)}
              placeholder=""
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </div>

          {/* phone and address */}
          <div className="flex gap-2 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Expiry Date
              </label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => set("expiryDate", e.target.value)}
                placeholder=""
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                CVV
              </label>
              <input
                type="number"
                value={form.cvv}
                onChange={(e) => set("cvv", e.target.value)}
                placeholder=""
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
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
            className="px-6 py-2.5 text-sm font-bold bg-[#F97316] text-white rounded-lg hover:bg-orange-500 transition-colors shadow-sm shadow-orange-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;
