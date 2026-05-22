"use client";

import { ColumnDef, DataTable } from "@/components/ui/DataTable";
import { Toggle } from "@/components/ui/Toggle";
import { AccountLayout } from "@/features/account/components/AccountLayout";
import {
  accountApi,
  type NotificationPreferences,
} from "@/lib/api/account";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/toast";
import { useEffect, useMemo, useState } from "react";

type NotificationKey = keyof NotificationPreferences;

interface NotificationSetting {
  id: NotificationKey;
  eventType: string;
  description: string;
  enabled: boolean;
}

const NOTIFICATION_META: Array<Omit<NotificationSetting, "enabled">> = [
  {
    id: "orderUpdates",
    eventType: "Order Updates",
    description: "Status changes and delivery updates.",
  },
  {
    id: "promotions",
    eventType: "Promotions & Offers",
    description: "Sales, discounts, and special deals.",
  },
  {
    id: "backInStock",
    eventType: "Back in Stock",
    description: "When out-of-stock items return.",
  },
  {
    id: "wishlistReminders",
    eventType: "Wishlist Reminders",
    description: "Reminders about items saved to your wishlist.",
  },
  {
    id: "reviewReminders",
    eventType: "Review Reminders",
    description: "Prompts to review purchased items.",
  },
];

const DEFAULT_PREFERENCES: NotificationPreferences = {
  orderUpdates: false,
  promotions: false,
  backInStock: false,
  wishlistReminders: false,
  reviewReminders: false,
};

export default function AccountNotificationsPage() {
  const { accessToken } = useAuthStore();
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    let isMounted = true;
    const token = accessToken;

    async function loadNotifications() {
      await Promise.resolve();
      if (!isMounted) return;

      setIsLoading(true);
      setError("");

      try {
        const data = await accountApi.getNotifications(token);
        if (isMounted) setPreferences(data);
      } catch {
        if (isMounted) setError("Failed to load notification preferences.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const settings = useMemo<NotificationSetting[]>(
    () =>
      NOTIFICATION_META.map((item) => ({
        ...item,
        enabled: preferences[item.id],
      })),
    [preferences]
  );

  const toggle = (id: NotificationKey, enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, [id]: enabled }));
  };

  async function handleSave() {
    if (!accessToken) return;

    setIsSaving(true);
    setError("");

    try {
      await accountApi.updateNotifications(accessToken, preferences);
      toast.success("Notification preferences saved");
    } catch {
      setError("Failed to save notification preferences.");
      toast.error("Failed to save notifications", "Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const columns: ColumnDef<NotificationSetting>[] = [
    {
      key: "eventType",
      header: "EVENT TYPE",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-bold text-gray-700">{row.eventType}</p>
          <p className="text-sm text-text-muted">{row.description}</p>
        </div>
      ),
    },
    {
      key: "enabled",
      header: "ENABLED",
      render: (row) => (
        <Toggle
          checked={row.enabled}
          onChange={(value) => toggle(row.id, value)}
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
          <p className="text-xs text-gray-500">
            Choose which account notifications you want to receive
          </p>
        </div>

        {error && (
          <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <DataTable
          columns={columns}
          data={settings}
          rowKey="id"
          emptyMessage={
            isLoading ? "Loading notification preferences..." : "No available notifications"
          }
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="self-start rounded bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </AccountLayout>
  );
}
