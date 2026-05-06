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
import type { Order } from "@/lib/types/order";
import { accountApi, DashboardStats, PaymentMethod } from "@/lib/api/account";

// ─── Recent orders columns ────────────────────────────────────────────────────

const ORDER_COLUMNS: ColumnDef<Order>[] = [
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
    // Hidden on mobile — date is secondary info
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
    render: (row) => (
      <Link
        href={`/account/orders/${row.id}`}
        className="text-sm text-[#F5820A] font-medium hover:underline whitespace-nowrap"
      >
        View →
      </Link>
    ),
  },
];

// ─── Stat card ────────────────────────────────────────────────────────────────

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
        <Icon size={17} className="text-[#F5820A]" />
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountDashboardPage() {
  const { user, accessToken } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    completedOrders: 0,
    loyaltyPoints: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    accountApi
      .getDashboard(accessToken)
      .then((data) => {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
        setPaymentMethods(data.paymentMethods);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  function handleDeleteCard(id: string) {
    if (!accessToken) return;
    accountApi
      .deletePaymentMethod(accessToken, id)
      .then(() => setPaymentMethods((prev) => prev.filter((c) => c.id !== id)))
      .catch(() => {});
  }

  return (
    <AccountLayout>
      {/* ── Greeting ── */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-[#111111]">
          Hello, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-sm text-[#6B7280] mt-1 leading-relaxed">
          From your account dashboard you can check your{" "}
          <Link href="/account/orders" className="text-[#F5820A] hover:underline">
            Recent Orders
          </Link>
          , manage your{" "}
          <Link href="/account/addresses" className="text-[#F5820A] hover:underline">
            Shipping and Billing Addresses
          </Link>{" "}
          and edit your{" "}
          <Link href="/account/profile" className="text-[#F5820A] hover:underline">
            Password
          </Link>{" "}
          and{" "}
          <Link href="/account/profile" className="text-[#F5820A] hover:underline">
            Account Details
          </Link>
          .
        </p>
      </div>

      {/* ── Stats row — 3 cols on all sizes, stacks inside naturally ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6 lg:hidden">
        <StatCard icon={FiShoppingBag} value={stats.totalOrders}    label="Total Orders"     />
        <StatCard icon={FiCheckCircle} value={stats.completedOrders} label="Completed"        />
        <StatCard icon={FiStar}        value={stats.loyaltyPoints}   label="Loyalty Points"   />
      </div>

      {/* ── Account Info + Billing + Stats (desktop 3-col grid) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5 sm:mb-6">

        {/* Account Info */}
        <div className="bg-white border border-[#E5E7EB] rounded-card p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3 sm:mb-4">
            Account Info
          </p>
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#F5F5F5] overflow-hidden shrink-0">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.firstName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#6B7280] font-bold text-base sm:text-lg">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-[#111111] truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-[#6B7280]">Uyo, Akwaibom</p>
            </div>
          </div>
          <div className="space-y-1 text-xs text-[#6B7280]">
            <p className="truncate">
              <span className="font-medium text-[#111111]">Email: </span>
              {user?.email}
            </p>
            {user?.phone && (
              <p>
                <span className="font-medium text-[#111111]">Phone: </span>
                {user.phone}
              </p>
            )}
          </div>
          <Link
            href="/account/profile"
            className="inline-flex mt-4 text-xs font-semibold border border-[#E5E7EB] rounded-btn px-4 py-1.5 text-[#111111] hover:border-[#F5820A] hover:text-[#F5820A] transition-colors"
          >
            EDIT ACCOUNT
          </Link>
        </div>

        {/* Billing Address */}
        <div className="bg-white border border-[#E5E7EB] rounded-card p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3 sm:mb-4">
            Billing Address
          </p>
          <div className="text-xs text-[#6B7280] space-y-1 leading-relaxed">
            <p className="font-bold text-sm text-[#111111]">
              {user?.firstName} {user?.lastName}
            </p>
            <p>
              East Tejturi Bazar, Word No. 04, Road No. 13/x,
              House no. 1320/C, Flat No. 5D, Dhaka - 1200, Bangladesh
            </p>
            <p>
              <span className="font-medium text-[#111111]">Phone: </span>
              +1-202-555-0118
            </p>
            <p className="truncate">
              <span className="font-medium text-[#111111]">Email: </span>
              {user?.email}
            </p>
          </div>
          <Link
            href="/account/addresses"
            className="inline-flex mt-4 text-xs font-semibold border border-[#E5E7EB] rounded-btn px-4 py-1.5 text-[#111111] hover:border-[#F5820A] hover:text-[#F5820A] transition-colors"
          >
            EDIT ADDRESS
          </Link>
        </div>

        {/* Stats column — desktop only (mobile stats are above) */}
        <div className="hidden lg:flex flex-col gap-3">
          <StatCard icon={FiShoppingBag} value={stats.totalOrders}    label="Total Orders"    />
          <StatCard icon={FiCheckCircle} value={stats.completedOrders} label="Completed Orders" />
          <StatCard icon={FiStar}        value={stats.loyaltyPoints}   label="Loyalty Points"  />
        </div>
      </div>

      {/* ── Payment Options ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-card p-4 sm:p-5 mb-5 sm:mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Payment Option
          </p>
          <Link
            href="/account/payment-methods/add"
            className="flex items-center gap-1 text-xs text-[#F5820A] font-medium hover:underline"
          >
            Add Card <FiPlus size={12} />
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
              No saved payment methods.
            </p>
          )}
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <DataTable
        title="Recent Order"
        columns={ORDER_COLUMNS}
        data={recentOrders.slice(0, 7)}
        rowKey="id"
        emptyMessage="No recent orders."
        footer={
          <Link
            href="/account/orders"
            className="text-xs text-[#F5820A] font-medium hover:underline"
          >
            View All →
          </Link>
        }
        className="mb-5 sm:mb-6"
      />

      {/* ── Browsing History ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Browsing History
          </p>
          <Link
            href="/account/browsing-history"
            className="text-xs text-[#F5820A] font-medium hover:underline"
          >
            View All →
          </Link>
        </div>
        <p className="text-sm text-[#6B7280]">
          Browsing history is populated from the API when available.
        </p>
      </div>
    </AccountLayout>
  );
}