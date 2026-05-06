"use client";
import { ColumnDef, DataTable } from "@/components/ui/DataTable";
import { Toggle } from "@/components/ui/Toggle";
import { AccountLayout } from "@/features/account/components/AccountLayout";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotificationChannel = "enableEmail" | "enableSMS" | "enablePush";

interface NotificationSetting {
  id: string;
  eventType: string;
  description: string;
  isCritical?: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
  enablePush: boolean;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_NOTIFICATIONS: NotificationSetting[] = [
  { id: "order-updates",      eventType: "Order Updates",      description: "Status changes and delivery updates.",    enableEmail: true,  enableSMS: true,  enablePush: true  },
  { id: "promotions",         eventType: "Promotions & Offers", description: "Sales, discounts, and special deals.",   enableEmail: true,  enableSMS: false, enablePush: true  },
  { id: "price-drops",        eventType: "Price Drop Alerts",   description: "When wishlist items go on sale.",        enableEmail: true,  enableSMS: false, enablePush: true  },
  { id: "back-in-stock",      eventType: "Back in Stock",       description: "When out-of-stock items return.",        enableEmail: true,  enableSMS: false, enablePush: true  },
  { id: "review-reminders",   eventType: "Review Reminders",    description: "Prompts to review purchased items.",     enableEmail: true,  enableSMS: false, enablePush: false },
  { id: "loyalty-points",     eventType: "Loyalty Points",      description: "Points earned and redeemed.",            enableEmail: true,  enableSMS: false, enablePush: true  },
  { id: "account-security",   eventType: "Account & Security",  description: "Login alerts and password changes.",     enableEmail: true,  enableSMS: true,  enablePush: true,  isCritical: true },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountNotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>(DEFAULT_NOTIFICATIONS);

  // Toggle a single channel for a single row — ready for an API call
  const toggle = (id: string, channel: NotificationChannel, value: boolean) => {
    setSettings((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [channel]: value } : row))
    );
    // 👇 API call goes here
    // await updateNotificationSetting({ id, channel, value });
  };

  // Serialize for submission / API
  const getPayload = () =>
    settings.map(({ id, enableEmail, enableSMS, enablePush }) => ({
      id,
      enableEmail,
      enableSMS,
      enablePush,
    }));

  const columns: ColumnDef<NotificationSetting>[] = [
    {
      key: "eventType",
      header: "EVENT TYPE",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-gray-700">{row.eventType}</p>
            {row.isCritical && (
              <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-500">
                Critical
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted">{row.description}</p>
        </div>
      ),
    },
    {
      key: "enableEmail",
      header: "EMAIL",
      render: (row) => (
        <Toggle
          checked={row.enableEmail}
          onChange={(v) => toggle(row.id, "enableEmail", v)}
        />
      ),
    },
    {
      key: "enableSMS",
      header: "SMS",
      render: (row) => (
        <Toggle
          checked={row.enableSMS}
          onChange={(v) => toggle(row.id, "enableSMS", v)}
        />
      ),
    },
    {
      key: "enablePush",
      header: "PUSH",
      render: (row) => (
        <Toggle
          checked={row.enablePush}
          onChange={(v) => toggle(row.id, "enablePush", v)}
        />
      ),
    },
  ];

  return (
    <AccountLayout
      breadcrumbItems={[{ label: "Notifications", href: "/account/notifications" }]}
    >
      <div className="flex flex-col gap-6 lg:w-[70%]">
        <div>
          <p className="text-2xl font-semibold">Notifications</p>
          <p className="text-xs text-gray-500">Choose how you'd like to be notified</p>
        </div>

        <DataTable
          columns={columns}
          data={settings}
          rowKey="id"
          emptyMessage="No available notifications"
        />

        {/* Optional: Save all at once */}
        <button
          onClick={() => console.log("Payload →", getPayload())}
          className="self-start rounded bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Save Preferences
        </button>
      </div>
    </AccountLayout>
  );
}