import { Button } from "@/components/ui/Button"
import { useState } from "react";

interface InventoryData {
  lowStockThreshold: string | number;
}

const InventoryConfig = () => {
    const [form, setForm] = useState<InventoryData>({
    lowStockThreshold: "",
  });

   const set = (key: keyof InventoryData, value: string | number) =>
    setForm({ [key]: value });

  return (
    <div className="rounded-md border border-border p-4 flex flex-1 flex-col gap-4">
          <p className=" font-semibold">Inventory Alerts</p>

          <div className="flex gap-2">
            <div className="w-full">
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                Low Stock Threshold (Global Default)
              </label>
              <input
                type="number"
                value={form.lowStockThreshold}
                onChange={(e) => set("lowStockThreshold", e.target.value)}
                placeholder=""
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
          </div>

          <p className="text-xs text-text-muted">Products below this stock level will trigger alerts</p>

          <Button className="text-xs md:text-sm w-fit rounded-md">Save Settings</Button>
        </div>
  )
}

export default InventoryConfig