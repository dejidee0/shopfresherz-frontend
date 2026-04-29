"use client";
import { Button } from "@/components/ui/Button";
import { ColumnDef, DataTable } from "@/components/ui/DataTable";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { RiDeleteBinLine } from "react-icons/ri";
import { LuPencil } from "react-icons/lu";
import { useState } from "react";
import AddProductModal from "@/components/admin/AddProductModal";

// Usage — Logistics Feed
const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  "Out Of Stock": "bg-red-100 text-red-600",
  Draft: "bg-gray-100 text-gray-500",
};

interface ProductEntry {
  productId: string;
  product: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  status: string;
}

const productColumns: ColumnDef<ProductEntry>[] = [
  {
    key: "productId",
    header: "PRODUCT",
    render: (row) => (
      <span className="font-medium text-gray-700">{row.product}</span>
    ),
  },
  {
    key: "sku",
    header: "SKU",
  },
  {
    key: "category",
    header: "CATEGORY",
    render: (row) => <span>{row.category}</span>,
  },
  {
    key: "price",
    header: "PRICE",
    render: (row) => (
      <span className=" px-2 py-1 text-green-600">{row.price}</span>
    ),
  },
  {
    key: "stock",
    header: "STOCK",
    render: (row) => <span className={`px-2 py-1`}>{row.stock}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <span
        className={`text-xs font-bold px-2 py-1 rounded-md ${statusColors[row.status]}`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: "actions",
    header: "ACTIONS",
    render: (row) => (
      <span className="flex gap-3">
        <button>
          <LuPencil />
        </button>

        <button>
          <RiDeleteBinLine className="text-danger" />
        </button>
      </span>
    ),
  },
];

const products = [
  {
    productId: "#TX-990",
    product: "Downtown Hub",
    sku: "IN TRANSIT",
    category: "14:45",
    price: "$200",
    stock: "120",
    status: "Active",
  },
  {
    productId: "#TX-991",
    product: "Uptown Gas",
    sku: "IN TRANSIT bgg",
    category: "eatery",
    price: "$2000",
    stock: "0",
    status: "Out Of Stock",
  },
  {
    productId: "#TX-992",
    product: "Sponge",
    sku: "skuuumeanit",
    category: "eatery",
    price: "$2000",
    stock: "10",
    status: "Draft",
  },
];

const AdminProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <div className="flex gap-3 mb-6">
          {/* Search */}
          <div className="relative">
            <HiMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search name or sku"
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] w-64 transition-all"
            />
          </div>

          {/* Sort */}
          <select
            name=""
            id=""
            className="border border-border rounded-2xl text-xs lg:text-sm text-gray-400 h-10 px-2"
          >
            <option value="">All Statuses</option>
            <option value="">Active</option>
            <option value="">Out of Stock</option>
            <option value="">Draft</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 ">
          <Button variant="ghost" className="rounded-md text-gray-500">
            Import CSV
          </Button>{" "}
          <Button className="rounded-md" onClick={() => setIsModalOpen(true)}>
            ADD PRODUCT
          </Button>
        </div>
      </div>
      <DataTable
        title=""
        columns={productColumns}
        data={products}
        rowKey="productId"
      />

      {isModalOpen && (
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => ""}
        />
      )}
    </div>
  );
};

export default AdminProductsPage;
