"use client";

import { IoWarningOutline } from "react-icons/io5";
import { Button } from "@/components/ui/Button";
import { ColumnDef, DataTable } from "@/components/ui/DataTable";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useLowStock } from "@/lib/hooks/useAdmin";
import { useMemo } from "react";

// Using low stock data from API
interface InventoryEntry {
  id: string;
  productName: string;
  sku: string;
  availableQty: number;
  threshold: number;
}

const roleColors: Record<string, string> = {
  Admin: "bg-green-100 text-green-700",
  Customer: "bg-yellow-100 text-yellow-600",
};

const customerColumns: ColumnDef<any>[] = [
  {
    key: "productName",
    header: "PRODUCT",
    render: (row) => (
      <div className="font-medium text-gray-700">
        <p>{row.productName}</p>
        <div className="p-0.5 px-2 flex gap-1.5 text-xs text-center w-fit rounded-md items-center text-red-600 bg-red-100 ">
          <IoWarningOutline />
          <p>LOW STOCK</p>
        </div>
      </div>
    ),
  },
  {
    key: "sku",
    header: "SKU",
  },
  {
    key: "availableQty",
    header: "AVAILABLE STOCK",
    render: (row) => <span>{row.availableQty}</span>,
  },
  {
    key: "threshold",
    header: "THRESHOLD",
    render: (row) => <span>{row.threshold}</span>,
  },
  {
    key: "adjust",
    header: "ADJUST",
    render: (row) => (
      <span className="flex gap-2">
        <button className="rounded-md bg-primary text-xs px-2.5 py-1 text-white cursor-pointer">
          -
        </button>
        <button className="rounded-md bg-primary text-white px-2.5 py-1 text-xs cursor-pointer">
          +
        </button>
      </span>
    ),
  },
];

const AdminInventoryPage = () => {
  const { data: lowStockData, isLoading } = useLowStock();

  const inventory = useMemo(() => {
    if (!lowStockData) return [];
    return lowStockData.map(item => ({
      id: item.productId,
      productName: item.productName,
      sku: item.sku || 'N/A',
      availableQty: item.availableQty,
      threshold: item.threshold || 5,
    }));
  }, [lowStockData]);

  return (
    <div className="flex flex-col gap-6 p-2 md:p-4 lg:p-6">
      <div className="flex flex-col gap-3">
        <p className="font-bold">Low Stock Inventory</p>
        <p className="text-xs text-text-muted">
          {isLoading ? 'Loading...' : `${inventory.length} low stock items`}
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Search - placeholder since API doesn't support search */}
          <div className="relative">
            <HiMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search (not implemented)"
              disabled
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] w-64 transition-all"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 ">
          <Button variant="ghost" className="rounded-md text-gray-500">
            Import CSV
          </Button>{" "}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-8">Loading low stock items...</div>
      ) : (
        <DataTable
          title=""
          columns={customerColumns}
          data={inventory}
          rowKey="id"
          emptyMessage="No low stock items"
        />
      )}
    </div>
  );
};

export default AdminInventoryPage;
