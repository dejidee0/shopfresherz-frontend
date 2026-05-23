import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { useEffect, useState } from "react";
import { adminApi, AdminNotificationSettings } from "@/lib/api/admin";
import { toast } from "@/store/toast";

interface Props {
  token: string;
  notifications?: AdminNotificationSettings;
}

// The API's notification settings are feature toggles, not email templates.
// The static templates shown in the original UI are content managed elsewhere;
// we surface the API-backed toggles here instead.
const NotificationConfig = ({ token, notifications }: Props) => {
  const [form, setForm] = useState<AdminNotificationSettings>({
    emailEnabled: true,
    smsEnabled: false,
    orderUpdatesEnabled: true,
    stockAlertsEnabled: true,
    marketingEnabled: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (notifications) setForm(notifications);
  }, [notifications]);

  const set = (key: keyof AdminNotificationSettings, value: boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettingsSection(token, "notifications", {
        value: form,
      });
      toast.success("Notification settings saved successfully.");
    } catch (error: any) {
      toast.error("Failed to save notification settings.", error.message ?? "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const rows: { key: keyof AdminNotificationSettings; label: string; description: string }[] = [
    { key: "emailEnabled", label: "Email Notifications", description: "Send transactional emails to customers" },
    { key: "smsEnabled", label: "SMS Notifications", description: "Send SMS updates to customers" },
    { key: "orderUpdatesEnabled", label: "Order Updates", description: "Notify customers on order status changes" },
    { key: "stockAlertsEnabled", label: "Stock Alerts", description: "Receive alerts when products run low" },
    { key: "marketingEnabled", label: "Marketing Emails", description: "Allow promotional messages to be sent" },
  ];

  return (
    <div className="rounded-md border border-border p-4 flex flex-1 flex-col gap-4">
      <p className="font-semibold">Notification Settings</p>

      <div className="flex flex-col gap-4 mb-2 md:mb-4">
        {rows.map(({ key, label, description }) => (
          <div
            key={key}
            className="flex flex-1 justify-between items-center bg-gray-200 rounded-md p-3"
          >
            <div className="flex flex-col gap-0.5">
              <p className="text-sm md:text-base font-medium">{label}</p>
              <p className="text-xs text-text-muted">{description}</p>
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

export default NotificationConfig;