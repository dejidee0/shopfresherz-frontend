import { IoWarningOutline } from "react-icons/io5";
import { Button } from "@/components/ui/Button";
import { ColumnDef, DataTable } from "@/components/ui/DataTable";
import { HiMagnifyingGlass } from "react-icons/hi2";

interface InventoryEntry {
  id: string;
  productName: string;
  sku: string;
  category: string;
  stock: string;
  threshold: string;
}

const roleColors: Record<string, string> = {
  Admin: "bg-green-100 text-green-700",
  Customer: "bg-yellow-100 text-yellow-600",
};

const customerColumns: ColumnDef<InventoryEntry>[] = [
  {
    key: "productName",
    header: "PRODUCT",
    render: (row) => (
      <div className="font-medium text-gray-700">
        <p>{row.productName}</p>
        {parseInt(row.stock) < parseInt(row.threshold) && (
          <div className="p-0.5 px-2 flex gap-1.5 text-xs text-center w-fit rounded-md items-center text-red-600 bg-red-100 ">
            <IoWarningOutline />
            <p>LOW STOCK</p>
          </div>
        )}
      </div>
    ),
  },
  {
    key: "sku",
    header: "SKU",
  },
  {
    key: "category",
    header: "CATEGORY",
  },
  {
    key: "stock",
    header: "STOCK",
  },
  {
    key: "threshold",
    header: "THRESHOLD",
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

const inventory = [
  {
    id: "1",
    productName: "Dell Inspiron 15",
    sku: "W-13-RD-NUM",
    category: "Computers & Laptop",
    stock: "2",
    threshold: "10",
  },
  {
    id: "2",
    productName: "Dell Inspiron 15",
    sku: "W-13-RD-NUM",
    category: "Computers & Laptop",
    stock: "28",
    threshold: "10",
  },
  {
    id: "3",
    productName: "Dell Inspiron 15",
    sku: "W-13-RD-NUM",
    category: "Computers & Laptop",
    stock: "32",
    threshold: "10",
  },
  {
    id: "4",
    productName: "Dell Inspiron 15",
    sku: "W-13-RD-NUM",
    category: "Computers & Laptop",
    stock: "40",
    threshold: "10",
  },
  {
    id: "5",
    productName: "Dell Inspiron 15",
    sku: "W-13-RD-NUM",
    category: "Computers & Laptop",
    stock: "20",
    threshold: "10",
  },
];

const AdminInventoryPage = () => {
  return (
    <div className="flex flex-col gap-6 md:flex-row p-2 md:p-4 lg:p-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
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
        </div>
      </div>

      {/* Table */}
      <DataTable
        title=""
        columns={customerColumns}
        data={inventory}
        rowKey="id"
      />
    </div>
  );
};

export default AdminInventoryPage;
