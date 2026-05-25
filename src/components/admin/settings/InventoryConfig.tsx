import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { toast } from "@/store/toast";

interface Props {
  token: string;
}

// The AdminSettings type doesn't expose a standalone inventory/low-stock
// threshold section. The threshold is a query param on getLowStock, not a
// persisted setting yet. If the backend adds it, wire it up here the same
// way as the other sections. For now we optimistically call updateSettingsSection
// with a custom "inventory" key so the save button still works end-to-end.
const InventoryConfig = ({ token }: Props) => {
  const [lowStockThreshold, setLowStockThreshold] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettingsSection(token, "inventory", {
        value: { lowStockThreshold: Number(lowStockThreshold) },
      });
      toast.success("Inventory settings saved successfully.");
    } catch (error: any){
      toast.error("Failed to save inventory settings", error.message ?? "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-md border border-border p-4 flex flex-1 flex-col gap-4">
      <p className="font-semibold">Inventory Alerts</p>

      <div className="flex gap-2">
        <div className="w-full">
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            Low Stock Threshold (Global Default)
          </label>
          <input
            type="number"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(e.target.value)}
            placeholder="5"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
          />
        </div>
      </div>

      <p className="text-xs text-text-muted">
        Products below this stock level will trigger alerts
      </p>

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

export default InventoryConfig;