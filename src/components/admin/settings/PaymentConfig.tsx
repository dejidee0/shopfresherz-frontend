import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { useState } from "react";

interface PaymentConfigData {
  paystack: boolean;
  bankTransfer: boolean;
  cashOnDelivery: boolean;
}

const PaymentConfig = () => {
  const [form, setForm] = useState<PaymentConfigData>({
    paystack: true,
    bankTransfer: true,
    cashOnDelivery: true,
  });

  const set = (key: keyof PaymentConfigData, value: string | boolean) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="rounded-md border border-border p-4 flex flex-1 flex-col gap-6">
      <p className=" font-semibold">Notification Templates</p>

      <div className="flex flex-col gap-5">
        <div className="flex flex-1 justify-between items-center bg-gray-200 rounded-md p-3">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Paystack</p>
            <p className="text-sm text-text-muted">Online card payments</p>
          </div>
           <Toggle checked={form.paystack} onChange={(v) => set("paystack", v)} />
        </div>

        <div className="flex flex-1 justify-between items-center bg-gray-200 rounded-md p-3">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Bank Transfer</p>
            <p className="text-sm text-text-muted">Direct bank transfer</p>
          </div>
           <Toggle checked={form.bankTransfer} onChange={(v) => set("bankTransfer", v)} />
        </div>

        <div className="flex flex-1 justify-between items-center bg-gray-200 rounded-md p-3">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Pay on Delivery</p>
            <p className="text-sm text-text-muted">Cash on delivery</p>
          </div>
           <Toggle checked={form.cashOnDelivery} onChange={(v) => set("cashOnDelivery", v)} />
        </div>
      </div>

      <Button className="w-fit rounded-md">Save Settings</Button>
    </div>
  );
};

export default PaymentConfig;
