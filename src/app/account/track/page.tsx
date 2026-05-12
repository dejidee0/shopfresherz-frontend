"use client";
import { Button } from "@/components/ui/Button";
import { AccountLayout } from "@/features/account/components/AccountLayout";
import Link from "next/link";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

interface TrackOrderData {
  orderId: string;
  billingEmail: string;
}

export default function OrderTrackingPage() {
  const [form, setForm] = useState<TrackOrderData>({
    orderId: "",
    billingEmail: "",
  });

  const set = (key: keyof TrackOrderData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <AccountLayout
      breadcrumbItems={[{ label: "Track Order", href: "/account/track" }]}
    >
      <div className="flex flex-col gap-6 ">
        <p className="text-2xl font-semibold">Track Order</p>
        <p className="text-gray-500 text-sm lg:w-[60%]">
          To track your order please enter your order ID in the input field
          below and press the “Track Order” button. this was given to you on
          your receipt and in the confirmation email you should have received.
        </p>

        <div className="flex flex-col md:flex-row gap-2 lg:w-[60%]">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Order ID:
            </label>
            <input
              type="text"
              value={form.orderId}
              onChange={(e) => set("orderId", e.target.value)}
              placeholder="ID..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Billing Email:
            </label>
            <input
              type="email"
              value={form.billingEmail}
              onChange={(e) => set("billingEmail", e.target.value)}
              placeholder="Email Address"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </div>
        </div>
        <Link href={`/account/order-detail/${form.orderId}`}>
          <Button className="text-sm w-fit">
            Track Order <FaArrowRight />
          </Button>
        </Link>
      </div>
    </AccountLayout>
  );
}
