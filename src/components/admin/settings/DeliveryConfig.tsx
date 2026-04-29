import { Button } from "@/components/ui/Button"
import { useState } from "react";

interface DeliveryRulesData {
  defaultDeliveryFee: string;
  deliveryThreshold: string;
}

const DeliveryConfig = () => {
    const [form, setForm] = useState<DeliveryRulesData>({
    defaultDeliveryFee: "",
    deliveryThreshold: "",
  });

   const set = (key: keyof DeliveryRulesData, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="rounded-md border border-border p-4 flex flex-1 flex-col gap-4">
          <p className=" font-semibold">Delivery Rules</p>

          {/* Orig & Sale Price */}
          <div className="flex gap-2">
            <div className="w-full">
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                Default Delivery Fee (₦)
              </label>
              <input
                type="number"
                value={form.defaultDeliveryFee}
                onChange={(e) => set("defaultDeliveryFee", e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                Delivery Threshold (₦)
              </label>
              <input
                type="number"
                value={form.deliveryThreshold}
                onChange={(e) => set("deliveryThreshold", e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
          </div>

          <p className="text-xs text-text-muted">orders above the threshold get free delivery</p>

          <Button className="w-fit rounded-md">Save Settings</Button>
        </div>
  )
}

export default DeliveryConfig