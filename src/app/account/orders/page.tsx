"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AccountLayout } from "@/features/account/components/AccountLayout";
import { OrderStatusBadge } from "@/features/account/components/OrderStatusBadge";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { useAuthStore } from "@/store/auth";
import { accountApi } from "@/lib/api/account";
import { formatPrice, formatDate } from "@/lib/utils/format";
import type { Order } from "@/lib/types/order";

const COLUMNS: ColumnDef<Order>[] = [
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
      <span className="text-[#6B7280] text-sm">
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
        href={`/account/order-detail/${row.orderNumber}`}
        className="text-sm text-[#F97316] font-medium hover:underline whitespace-nowrap"
      >
        View Details →
      </Link>
    ),
  },
];

const LIMIT = 12;

export default function OrderHistoryPage() {
  const { accessToken } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    setIsLoading(true);
    accountApi
      .getOrders(accessToken, page, LIMIT)
      .then((res) => {
        setOrders(res.data);
        setTotalPages(res.totalPages);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [accessToken, page]);

  return (
    <AccountLayout breadcrumbItems={[{ label: "Order History" }]}>
      <DataTable
        title="Order History"
        columns={COLUMNS}
        data={orders}
        rowKey="id"
        emptyMessage={isLoading ? "Loading orders…" : "No orders found."}
        footer={
          totalPages > 1 ? (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          ) : undefined
        }
      />
    </AccountLayout>
  );
}
