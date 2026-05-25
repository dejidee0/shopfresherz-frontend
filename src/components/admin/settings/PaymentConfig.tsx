import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { useEffect, useState } from "react";
import { adminApi, AdminPaymentSettings } from "@/lib/api/admin";
import { toast } from "@/store/toast";

interface Props {
  token: string;
  payment?: AdminPaymentSettings;
}

const PaymentConfig = ({ token, payment }: Props) => {
  const [form, setForm] = useState<AdminPaymentSettings>({
    paystackEnabled: true,
    flutterwaveEnabled: false,
    bankTransferEnabled: true,
    defaultProvider: "paystack",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (payment) setForm(payment);
  }, [payment]);

  const set = (key: keyof AdminPaymentSettings, value: boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettingsSection(token, "payment", { value: form });
      toast.success("Payment settings saved successfully.");
    } catch (error: any) {
      toast.error("Failed to save payment settings.", error.message ?? "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const rows: {
    key: keyof Pick<
      AdminPaymentSettings,
      "paystackEnabled" | "flutterwaveEnabled" | "bankTransferEnabled"
    >;
    label: string;
    description: string;
  }[] = [
    {
      key: "paystackEnabled",
      label: "Paystack",
      description: "Online card payments",
    },
    {
      key: "flutterwaveEnabled",
      label: "Flutterwave",
      description: "Alternative card & mobile money payments",
    },
    {
      key: "bankTransferEnabled",
      label: "Bank Transfer",
      description: "Direct bank transfer",
    },
  ];

  return (
    <div className="rounded-md border border-border p-4 flex flex-1 flex-col gap-6">
      <p className="font-semibold">Payment Methods</p>

      <div className="flex flex-col gap-5">
        {rows.map(({ key, label, description }) => (
          <div
            key={key}
            className="flex flex-1 justify-between items-center bg-gray-200 rounded-md p-3"
          >
            <div className="flex flex-col gap-1">
              <p className="font-semibold">{label}</p>
              <p className="text-sm text-text-muted">{description}</p>
            </div>
            <Toggle checked={form[key]} onChange={(v) => set(key, v)} />
          </div>
        ))}
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

export default PaymentConfig;