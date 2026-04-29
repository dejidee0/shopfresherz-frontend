import { Button } from "@/components/ui/Button"
import { useState } from "react";

interface TaxData {
  vatRate: string | number;
}

const TaxConfig = () => {
    const [form, setForm] = useState<TaxData>({
    vatRate: "",
  });

   const set = (key: keyof TaxData, value: string | number) =>
    setForm({ [key]: value });

  return (
    <div className="rounded-md border border-border p-4 flex flex-1 flex-col gap-4">
          <p className=" font-semibold">Tax Settings</p>

          <div className="flex gap-2">
            <div className="w-full">
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                VAT Rate (%)
              </label>
              <input
                type="number"
                value={form.vatRate}
                onChange={(e) => set("vatRate", e.target.value)}
                placeholder=""
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>
          </div>

          <Button className="w-fit rounded-md">Save Settings</Button>
        </div>
  )
}

export default TaxConfig