import { Button } from "@/components/ui/Button";
import { ColumnDef, DataTable } from "@/components/ui/DataTable";
import { HiMagnifyingGlass } from "react-icons/hi2";

interface CustomerEntry {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

const roleColors: Record<string, string> = { 
  Admin: "bg-green-100 text-green-700",
  Customer: "bg-yellow-100 text-yellow-600",
};

const customerColumns: ColumnDef<CustomerEntry>[] = [
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
        className={`text-xs font-bold px-2 py-1 rounded-md ${roleColors[row.role]}`}
      >
        {row.role}
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "JOINED",
  },
];

const customers = [
  {
    userId: "1",
    fullName: "Mfoniso Ibokette",
    email: "mfoniso@gmail.com",
    role: "Admin",
    createdAt: "02-02-2026",
  },
];

const AdminCustomersPage = () => {
  return (
    <div className="p-2 md:p-4 lg:p-6">
        <div className="mb-6 flex flex-col gap-3">
            <p className="font-bold">ShopFresher'z Customers</p>
            <p className="text-xs text-text-muted">{customers.length} registered users</p>
        </div>
      <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between mb-6">
          {/* Search */}
          <div className="relative">
            <HiMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search name or email"
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] w-64 transition-all"
            />
          </div>

          {/* Sort */}
          <select
            name=""
            id=""
            className="border border-border rounded-2xl text-xs lg:text-sm text-gray-400 h-10 px-2"
          >
            <option value="">All Roles</option>
            <option value="">Admin</option>
            <option value="">Customer</option>
          </select>
      </div>

      {/* Table */}
      <DataTable
        title=""
        columns={customerColumns}
        data={customers}
        rowKey="userId"
      />
    </div>
  );
};

export default AdminCustomersPage;
