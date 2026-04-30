import { IoEyeOutline, IoWarningOutline } from "react-icons/io5";
import { Button } from "@/components/ui/Button";
import { ColumnDef, DataTable } from "@/components/ui/DataTable";
import { HiMagnifyingGlass } from "react-icons/hi2";

interface OrderEntry {
  orderId: string;
  customer: string;
  date: string;
  items: string;
  total: string;
  payment: string;
  status: string;
}

const paymentAndStatusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Delivered: "bg-green-100 text-green-700",
  Unpaid: "bg-yellow-100 text-yellow-600",
  Processing: "bg-blue-100 text-blue-600",
  Refunded: "bg-red-100 text-red-600",
  Cancelled: "bg-red-100 text-red-600",
};

const orderColumns: ColumnDef<OrderEntry>[] = [
  {
    key: "orderId",
    header: "ORDER ID",
    render: (row) => <span className="text-green-600">{row.orderId}</span>,
  },
  {
    key: "customer",
    header: "CUSTOMER",
    render: (row) => (
      <div className="flex items-center gap-2">
        <div className="hidden lg:flex items-center justify-center h-6 w-6 bg-border text-muted rounded-full">
          {row.customer?.split("").at(0)}
        </div>
        {row.customer}
      </div>
    ),
  },
  {
    key: "date",
    header: "DATE",
  },
  {
    key: "items",
    header: "ITEMS",
  },
  {
    key: "total",
    header: "TOTAL",
    render: (row) => <span className="text-green-600">{row.total}</span>,
  },
  {
    key: "payment",
    header: "PAYMENT",
    render: (row) => (
      <span
        className={`text-xs font-bold px-2 py-1 rounded-md ${paymentAndStatusColors[row.payment]}`}
      >
        {row.payment}
      </span>
    ),
  },
  {
    key: "status",
    header: "STATUS",
    render: (row) => (
      <span
        className={`text-xs font-bold px-2 py-1 rounded-md ${paymentAndStatusColors[row.status]}`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: "action",
    header: "ACTION",
    render: (row) => (
      <button className="cursor-pointer">
        <IoEyeOutline className="text-xl"/>
      </button>
    ),
  },
];

const orders = [
  {
    orderId: "1",
    customer: "Emeka Nwosu",
    date: "4-07-1999",
    items: "Samsung s24",
    total: "#824,000",
    payment: "Paid",
    status: "Processing",
  },
];

const AdminOrderPage = () => {
  return (
    <div className="flex flex-col gap-4 md:gap-2 p-2 md:p-4 lg:p-6">
      <div className="mb-6 flex flex-col gap-3">
        <p className="font-bold">Order Details</p>
        <p className="text-xs text-text-muted">{orders.length} total orders</p>
      </div>
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
        columns={orderColumns}
        data={orders}
        rowKey="orderId"
      />
    </div>
  );
};

export default AdminOrderPage;
