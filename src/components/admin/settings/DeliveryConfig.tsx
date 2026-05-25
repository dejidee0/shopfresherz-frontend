import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

import { adminApi, AdminShippingSettings } from "@/lib/api/admin";
import { toast } from "@/store/toast";

interface Props {
  token: string;
  shipping?: AdminShippingSettings;
}

interface DeliveryRulesData {
  defaultDeliveryFee: string;
  deliveryThreshold: string;
}

const DeliveryConfig = ({ token, shipping }: Props) => {
  const [form, setForm] = useState<DeliveryRulesData>({
    defaultDeliveryFee: "",
    deliveryThreshold: "",
  });
  const [saving, setSaving] = useState(false);

  // Pre-populate from fetched settings
  useEffect(() => {
    if (!shipping) return;
    setForm({
      defaultDeliveryFee: String(shipping.defaultDeliveryFee ?? ""),
      deliveryThreshold: String(shipping.freeShippingThreshold ?? ""),
    });
  }, [shipping]);

  const set = (key: keyof DeliveryRulesData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettingsSection(token, "shipping", {
        value: {
          defaultDeliveryFee: Number(form.defaultDeliveryFee),
          freeShippingThreshold: Number(form.deliveryThreshold),
          // Preserve existing values that aren't managed by this form
          estimatedDeliveryDaysMin: shipping?.estimatedDeliveryDaysMin ?? 1,
          estimatedDeliveryDaysMax: shipping?.estimatedDeliveryDaysMax ?? 7,
          supportedStates: shipping?.supportedStates ?? [],
        },
      });
      toast.success("Delivery settings saved successfully.");
    } catch (error: any) {
      toast.error("Failed to save delivery settings.", error.message ?? "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-md border border-border p-4 flex flex-1 flex-col gap-4">
      <p className="font-semibold">Delivery Rules</p>

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

      <p className="text-xs text-text-muted">
        Orders above the threshold get free delivery
      </p>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-fit text-xs md:text-sm rounded-md"
      >
        {saving ? "Saving…" : "Save Settings"}
      </Button>
    </div>
  );
};

export default DeliveryConfig;