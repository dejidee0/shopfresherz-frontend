"use client";

import { ColumnDef, DataTable } from "@/components/ui/DataTable";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useUsers } from "@/lib/hooks/useAdmin";
import { useState, useMemo } from "react";
import type { AdminUsersFilters } from "@/lib/api/admin";
import { Spinner } from "@/components/ui/Spinner";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleFilter = "all" | "SuperAdmin" | "Customer";

interface CustomerRow {
  userId: string;
  fullName: string;
  email: string;
  role: string;       // raw API value e.g. "SuperAdmin" | "Customer"
  roleLabel: string;  // display label e.g. "Admin" | "Customer"
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Maps raw API role → display label
const ROLE_LABEL: Record<string, string> = {
  SuperAdmin: "Admin",
  Customer:   "Customer",
};

const ROLE_COLORS: Record<string, string> = {
  Admin:    "bg-green-100 text-green-700",
  Customer: "bg-yellow-100 text-yellow-600",
};

// ─── Table columns ────────────────────────────────────────────────────────────

const COLUMNS: ColumnDef<CustomerRow>[] = [
  {
    key: "userId",
    header: "CUSTOMERS",
    render: (row) => (
      <span className="font-medium text-gray-700">{row.fullName}</span>
    ),
  },
  {
    key: "email",
    header: "EMAIL",
  },
  {
    key: "role",
    header: "ROLE",
    render: (row) => (
      <span
        className={`text-xs font-bold px-2 py-1 rounded-md ${
          ROLE_COLORS[row.roleLabel] ?? "bg-gray-100 text-gray-600"
        }`}
      >
        {row.roleLabel}
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "JOINED",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminCustomersPage = () => {
  // API-level filters (kept minimal — only use for things the API can handle)
  const [filters] = useState<AdminUsersFilters>({});
  const { data: usersData, isLoading } = useUsers(filters);

  // Client-side filter state
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  // ── Normalize API response into display rows ──
  const allCustomers = useMemo<CustomerRow[]>(() => {
    if (!usersData?.items) return [];
    return usersData.items.map((user: any) => {
      const rawRole   = user.role || "Customer";
      const roleLabel = ROLE_LABEL[rawRole] ?? rawRole;
      return {
        userId:    user.id,
        fullName:  `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown",
        email:     user.email ?? "",
        role:      rawRole,
        roleLabel,
        createdAt: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "",
      };
    });
  }, [usersData]);

  // ── Apply client-side search + role filter ──
  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allCustomers.filter((c) => {
      // Role filter — compare against raw API value
      if (roleFilter !== "all" && c.role !== roleFilter) return false;

      // Search filter — name or email
      if (query) {
        return (
          c.fullName.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [allCustomers, search, roleFilter]);

  return (
    <div className="p-2 md:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1">
        <p className="font-bold">ShopFresher&apos;z Customers</p>
        <p className="text-xs text-text-muted">
          {isLoading
            ? "Loading..."
            : `${filteredCustomers.length} of ${allCustomers.length} users`}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        {/* Search — client-side, no API call on every keystroke */}
        <div className="relative">
          <HiMagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] w-64 transition-all"
          />
        </div>

        {/* Role filter — onChange on <select>, not onSelect on <option> */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="border border-border rounded-2xl text-xs lg:text-sm text-gray-600 h-10 px-3 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all bg-white"
        >
          <option value="all">All Roles</option>
          <option value="SuperAdmin">Admin</option>
          <option value="Customer">Customer</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <DataTable
          title=""
          columns={COLUMNS}
          data={filteredCustomers}
          rowKey="userId"
          emptyMessage={
            search || roleFilter !== "all"
              ? "No customers match your filters"
              : "No customers found"
          }
        />
      )}
    </div>
  );
};

export default AdminCustomersPage;