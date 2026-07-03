"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiShoppingBag,
  FiCheckCircle,
  FiStar,
  FiPlus,
} from "react-icons/fi";
import { AccountLayout } from "@/features/account/components/AccountLayout";
import { PaymentCard } from "@/features/account/components/PaymentCard";
import { OrderStatusBadge } from "@/features/account/components/OrderStatusBadge";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable";
import { useAuthStore } from "@/store/auth";
import { formatPrice, formatDate } from "@/lib/utils/format";
import {
  accountApi,
  type AccountOrder,
  type AccountProfile,
  type Address,
  type DashboardStats,
  type PaymentMethod,
} from "@/lib/api/account";

const ORDER_COLUMNS: ColumnDef<AccountOrder>[] = [
  {
    key: "orderNumber",
    header: "Order ID",
    render: (row) => (
      <span className="font-mono font-semibold text-[#111111]">
        #{row.orderNumber}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <OrderStatusBadge status={row.status} />,
  },
  {
    key: "createdAt",
    header: "Date",
    render: (row) => (
      <span className="text-[#6B7280] text-sm hidden sm:block">
        {formatDate(row.createdAt)}
      </span>
    ),
  },
  {
    key: "total",
    header: "Total",
    render: (row) => (
      <span className="text-sm font-medium text-[#111111]">
        {formatPrice(row.total)}
      </span>
    ),
  },
  {
    key: "id",
    header: "Action",
    render: () => (
      <Link
        href="/account/orders"
        className="text-sm text-[#F97316] font-medium hover:underline whitespace-nowrap"
      >
        View
      </Link>
    ),
  },
];

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] p-2 md:p-4 flex flex-col md:flex-row items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
        <Icon size={17} className="text-[#F97316]" />
      </div>
      <div className="flex flex-col gap-2 items-center md:items-start">
        <p className="md:text-xl font-extrabold text-[#111111] leading-none">
          {String(value).padStart(2, "0")}
        </p>
        <p className="text-xs text-[#6B7280] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function AccountDashboardPage() {
  const { user, accessToken, updateUser } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    completedOrders: 0,
    loyaltyPoints: 0,
  });
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [recentOrders, setRecentOrders] = useState<AccountOrder[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    let isMounted = true;
    const token = accessToken;

    async function loadDashboard() {
      await Promise.resolve();
      if (!isMounted) return;

      setIsLoading(true);

      const [
        profileResult,
        ordersResult,
        loyaltyResult,
        addressesResult,
        paymentMethodsResult,
      ] = await Promise.allSettled([
        accountApi.getProfile(token),
        accountApi.getOrders(token, 1, 7),
        accountApi.getLoyalty(token, 1, 1),
        accountApi.getAddresses(token),
        accountApi.getPaymentMethods(token),
      ]);

      if (!isMounted) return;

      const nextProfile =
        profileResult.status === "fulfilled" ? profileResult.value : null;
      const orders =
        ordersResult.status === "fulfilled" ? ordersResult.value : null;
      const loyalty =
        loyaltyResult.status === "fulfilled" ? loyaltyResult.value : null;
      const addresses =
        addressesResult.status === "fulfilled" ? addressesResult.value : [];

      if (nextProfile) {
        setProfile(nextProfile);
        updateUser(nextProfile);
      }

      setRecentOrders(orders?.data ?? []);
      setStats({
        totalOrders: orders?.totalCount ?? 0,
        completedOrders:
          orders?.items.filter((order) => order.status === "Delivered").length ?? 0,
        loyaltyPoints:
          loyalty?.balance ?? nextProfile?.loyaltyPoints ?? user?.loyaltyPoints ?? 0,
      });
      setBillingAddress(
        addresses.find((address) => address.isDefault) ?? addresses[0] ?? null
      );

      if (paymentMethodsResult.status === "fulfilled") {
        setPaymentMethods(paymentMethodsResult.value);
      } else {
        setPaymentMethods([]);
      }

      setIsLoading(false);
    }

    loadDashboard().catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [accessToken, updateUser, user?.loyaltyPoints]);

  function handleDeleteCard(id: string) {
    if (!accessToken) return;
    accountApi
      .deletePaymentMethod(accessToken, id)
      .then(() => setPaymentMethods((prev) => prev.filter((c) => c.id !== id)))
      .catch(() => {});
  }

  const account = profile ?? user;
  const accountName =
    [account?.firstName, account?.lastName].filter(Boolean).join(" ") || "Customer";
  const initials =
    `${account?.firstName?.[0] ?? ""}${account?.lastName?.[0] ?? ""}` || "SF";
  const addressLines = billingAddress
    ? [
        billingAddress.line1 ?? billingAddress.street,
        billingAddress.line2,
        [billingAddress.city, billingAddress.state].filter(Boolean).join(", "),
        billingAddress.postalCode,
      ].filter(Boolean)
    : [];

  return (
    <AccountLayout>
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-[#111111]">
          Hello, {accountName}
        </h1>
        <p className="text-sm text-[#6B7280] mt-1 leading-relaxed">
          From your account dashboard you can check your{" "}
          <Link href="/account/orders" className="text-[#F97316] hover:underline">
            Recent Orders
          </Link>
          , manage your{" "}
          <Link href="/account/addresses" className="text-[#F97316] hover:underline">
            Shipping and Billing Addresses
          </Link>{" "}
          and edit your{" "}
          <Link href="/account/profile" className="text-[#F97316] hover:underline">
            Password
          </Link>{" "}
          and{" "}
          <Link href="/account/profile" className="text-[#F97316] hover:underline">
            Account Details
          </Link>
          .
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6 lg:hidden">
        <StatCard icon={FiShoppingBag} value={stats.totalOrders} label="Total Orders" />
        <StatCard icon={FiCheckCircle} value={stats.completedOrders} label="Completed" />
        <StatCard icon={FiStar} value={stats.loyaltyPoints} label="Loyalty Points" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5 sm:mb-6">
        <div className="bg-white border border-[#E5E7EB] rounded-card p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3 sm:mb-4">
            Account Info
          </p>
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#F5F5F5] overflow-hidden shrink-0">
              {account?.avatarUrl ? (
                <Image
                  src={account.avatarUrl}
                  alt={accountName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#6B7280] font-bold text-base sm:text-lg">
                  {initials}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-[#111111] truncate">
                {accountName}
              </p>
              <p className="text-xs text-[#6B7280]">
                {profile?.isVerified ? "Verified customer" : "Customer account"}
              </p>
            </div>
          </div>
          <div className="space-y-1 text-xs text-[#6B7280]">
            <p className="truncate">
              <span className="font-medium text-[#111111]">Email: </span>
              {account?.email ?? "Not available"}
            </p>
            {account?.phone && (
              <p>
                <span className="font-medium text-[#111111]">Phone: </span>
                {account.phone}
              </p>
            )}
          </div>
          <Link
            href="/account/profile"
            className="inline-flex mt-4 text-xs font-semibold border border-[#E5E7EB] rounded-btn px-4 py-1.5 text-[#111111] hover:border-[#F97316] hover:text-[#F97316] transition-colors"
          >
            EDIT ACCOUNT
          </Link>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-card p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3 sm:mb-4">
            Billing Address
          </p>
          <div className="text-xs text-[#6B7280] space-y-1 leading-relaxed">
            <p className="font-bold text-sm text-[#111111]">
              {billingAddress?.label ?? "No saved address"}
            </p>
            {addressLines.length > 0 ? (
              addressLines.map((line) => <p key={line}>{line}</p>)
            ) : (
              <p>Add a delivery address to speed up checkout.</p>
            )}
            {account?.phone && (
              <p>
                <span className="font-medium text-[#111111]">Phone: </span>
                {account.phone}
              </p>
            )}
            <p className="truncate">
              <span className="font-medium text-[#111111]">Email: </span>
              {account?.email ?? "Not available"}
            </p>
          </div>
          <Link
            href="/account/addresses"
            className="inline-flex mt-4 text-xs font-semibold border border-[#E5E7EB] rounded-btn px-4 py-1.5 text-[#111111] hover:border-[#F97316] hover:text-[#F97316] transition-colors"
          >
            EDIT ADDRESS
          </Link>
        </div>

        <div className="hidden lg:flex flex-col gap-3">
          <StatCard icon={FiShoppingBag} value={stats.totalOrders} label="Total Orders" />
          <StatCard
            icon={FiCheckCircle}
            value={stats.completedOrders}
            label="Completed Orders"
          />
          <StatCard icon={FiStar} value={stats.loyaltyPoints} label="Loyalty Points" />
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-card p-4 sm:p-5 mb-5 sm:mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Payment Option
          </p>
          <Link
            href="/account/payment-methods"
            className="flex items-center gap-1 text-xs text-[#F97316] font-medium hover:underline"
          >
            Manage <FiPlus size={12} />
          </Link>
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-1">
          {paymentMethods.map((card) => (
            <PaymentCard
              key={card.id}
              card={card}
              onDelete={handleDeleteCard}
              onEdit={() => {}}
            />
          ))}
          {paymentMethods.length === 0 && !isLoading && (
            <p className="text-sm text-[#6B7280] py-4">
              No saved payment methods from the API.
            </p>
          )}
        </div>
      </div>

      <DataTable
        title="Recent Order"
        columns={ORDER_COLUMNS}
        data={recentOrders}
        rowKey="id"
        emptyMessage={isLoading ? "Loading recent orders..." : "No recent orders."}
        footer={
          <Link
            href="/account/orders"
            className="text-xs text-[#F97316] font-medium hover:underline"
          >
            View All
          </Link>
        }
        className="mb-5 sm:mb-6"
      />

      <div className="bg-white border border-[#E5E7EB] rounded-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Browsing History
          </p>
        </div>
        <p className="text-sm text-[#6B7280]">
          Browsing history endpoint is not available yet.
        </p>
      </div>
    </AccountLayout>
  );
}
