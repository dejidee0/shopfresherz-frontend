import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { adminApi, AdminTaxSettings } from "@/lib/api/admin";
import { toast } from "@/store/toast";

interface Props {
  token: string;
  tax?: AdminTaxSettings;
}

const TaxConfig = ({ token, tax }: Props) => {
  const [vatRate, setVatRate] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tax?.vatRatePercent !== undefined) {
      setVatRate(String(tax.vatRatePercent));
    }
  }, [tax]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettingsSection(token, "tax", {
        value: {
          vatEnabled: tax?.vatEnabled ?? true,
          vatRatePercent: Number(vatRate),
          pricesIncludeTax: tax?.pricesIncludeTax ?? false,
        },
      });
      toast.success("Tax settings saved successfully.");
    } catch (error: any) {
      toast.error("Failed to save tax settings.", error.message ?? "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-md border border-border p-4 flex flex-1 flex-col gap-4">
      <p className="font-semibold">Tax Settings</p>

      <div className="flex gap-2">
        <div className="w-full">
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            VAT Rate (%)
          </label>
          <input
            type="number"
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
            placeholder="0"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
          />
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="text-xs md:text-sm w-fit rounded-md"
      >
        {saving ? "Saving…" : "Save Settings"}
      </Button>
    </div>
  );
};

export default TaxConfig;