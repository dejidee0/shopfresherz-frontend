"use client";

import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  Field,
  SelectField,
  StepIndicator,
  OrderSummary,
  CheckoutLayout,
} from "../components/CheckoutShared";
import {
  COUNTRIES,
  REGIONS,
  type BillingForm,
  type CouponState,
} from "../types/checkout";

interface Props {
  form: BillingForm;
  setForm: (f: BillingForm) => void;
  coupon: CouponState;
  onCouponChange: (v: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon?: () => void;
  deliveryFee: number;
  onContinue: () => void;
}

type Errors = Partial<Record<keyof BillingForm, string>>;

export function BillingStep({
  form,
  setForm,
  coupon,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
  deliveryFee,
  onContinue,
}: Props) {
  const [errors, setErrors] = useState<Errors>({});

  const set = (key: keyof BillingForm, value: string | boolean) =>
    setForm({ ...form, [key]: value });

  const clearError = (key: keyof BillingForm) =>
    setErrors((prev) => ({ ...prev, [key]: undefined }));

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.country) e.country = "Required";
    if (!form.region) e.region = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <CheckoutLayout
      sidebar={
        <OrderSummary
          coupon={coupon}
          onCouponChange={onCouponChange}
          onApplyCoupon={onApplyCoupon}
          onRemoveCoupon={onRemoveCoupon}
          deliveryFee={deliveryFee}
        />
      }
    >
      <StepIndicator step={1} />
      <h2 className="text-lg font-bold text-[#111111] mb-5">
        Billing Information
      </h2>

      <div className="flex flex-col gap-4">
        {/* Full name + company */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <p className="text-sm font-medium text-[#666666] mb-1">Full Name</p>
            <div className="grid grid-cols-2 gap-2">
              <Field
                placeholder="First name"
                value={form.firstName}
                onChange={(v) => {
                  set("firstName", v);
                  clearError("firstName");
                }}
                error={errors.firstName}
              />
              <Field
                placeholder="Last name"
                value={form.lastName}
                onChange={(v) => {
                  set("lastName", v);
                  clearError("lastName");
                }}
                error={errors.lastName}
              />
            </div>
          </div>
          <Field
            label="Company Name (Optional)"
            value={form.companyName}
            onChange={(v) => set("companyName", v)}
            className="sm:col-span-2"
          />
        </div>

        {/* Address */}
        <Field
          label="Address"
          value={form.address}
          onChange={(v) => {
            set("address", v);
            clearError("address");
          }}
          error={errors.address}
        />

        {/* Country / Region / City / Zip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SelectField
            label="Country"
            value={form.country}
            onChange={(v) => {
              setForm({ ...form, country: v, region: "", city: "" });
              clearError("country");
              clearError("region");
              clearError("city");
            }}
            options={COUNTRIES}
            error={errors.country}
          />
          <SelectField
            label="Region/State"
            value={form.region}
            onChange={(v) => {
              set("region", v);
              clearError("region");
            }}
            options={REGIONS[form.country] ?? []}
            error={errors.region}
          />
          <Field
            label="City"
            value={form.city}
            onChange={(v) => {
              set("city", v);
              clearError("city");
            }}
            error={errors.city}
          />
          <Field
            label="Zip Code"
            value={form.zipCode}
            onChange={(v) => set("zipCode", v)}
          />
        </div>

        {/* Email / Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => {
              set("email", v);
              clearError("email");
            }}
            error={errors.email}
          />
          <Field
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={(v) => {
              set("phone", v);
              clearError("phone");
            }}
            error={errors.phone}
          />
        </div>

        {/* Save address */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.saveAddress}
            onChange={(e) => set("saveAddress", e.target.checked)}
            className="w-4 h-4 accent-[#F97316]"
          />
          <span className="text-sm text-[#666666]">Save this address</span>
        </label>

        {/* CTA */}
        <button
          onClick={() => {
            if (validate()) onContinue();
          }}
          className="w-full h-12 rounded sf-btn-primary text-white font-semibold flex items-center justify-center gap-2 mt-2"
        >
          CONTINUE TO DELIVERY <FiArrowRight size={16} />
        </button>
      </div>
    </CheckoutLayout>
  );
}
