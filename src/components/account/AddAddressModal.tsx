import { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { Button } from "../ui/Button";
import { Toggle } from "../ui/Toggle";
import type { Address, CreateAddressRequest } from "@/lib/api/account";

interface AddAddressModalProps {
  isOpen: boolean;
  initialAddress?: Address | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAddressRequest) => void | Promise<void>;
}

export type AddressFormData = CreateAddressRequest;

const emptyForm: AddressFormData = {
  label: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  isDefault: false,
};

function addressToForm(address?: Address | null): AddressFormData {
  if (!address) return emptyForm;

  return {
    label: address.label ?? "",
    line1: address.line1 ?? address.street ?? "",
    line2: address.line2 ?? "",
    city: address.city ?? "",
    state: address.state ?? "",
    postalCode: address.postalCode ?? "",
    isDefault: address.isDefault,
  };
}

const AddAddressModal = ({
  isOpen,
  initialAddress,
  isSubmitting = false,
  onSubmit,
  onClose,
}: AddAddressModalProps) => {
  const [form, setForm] = useState<AddressFormData>(() =>
    addressToForm(initialAddress)
  );
  const [error, setError] = useState("");

  const set = (key: keyof AddressFormData, value: string | boolean) => {
    setError("");
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.label.trim() || !form.line1.trim() || !form.city.trim() || !form.state.trim()) {
      setError("Label, address line 1, city, and state are required.");
      return;
    }

    await onSubmit({
      label: form.label.trim(),
      line1: form.line1.trim(),
      line2: form.line2?.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode?.trim(),
      isDefault: form.isDefault,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {initialAddress ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close address modal"
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

          <Field label="Label" required>
            <input
              type="text"
              value={form.label}
              onChange={(e) => set("label", e.target.value)}
              placeholder="Home, Office, Parents..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </Field>

          <Field label="Address Line 1" required>
            <input
              type="text"
              value={form.line1}
              onChange={(e) => set("line1", e.target.value)}
              placeholder="Street address"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </Field>

          <Field label="Address Line 2">
            <input
              type="text"
              value={form.line2}
              onChange={(e) => set("line2", e.target.value)}
              placeholder="Apartment, suite, building"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="City" required>
              <input
                type="text"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </Field>

            <Field label="State" required>
              <input
                type="text"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </Field>
          </div>

          <Field label="Postal Code">
            <input
              type="text"
              value={form.postalCode}
              onChange={(e) => set("postalCode", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </Field>

          <div className="flex items-center gap-2">
            <Toggle checked={form.isDefault} onChange={(v) => set("isDefault", v)} />
            <span className="text-sm font-medium text-gray-700">Set as default</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} isLoading={isSubmitting}>
            {initialAddress ? "Save Changes" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

export default AddAddressModal;
