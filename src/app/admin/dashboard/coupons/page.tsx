"use client"
import { IoCopyOutline, IoEyeOutline, IoWarningOutline } from "react-icons/io5";
import { Button } from "@/components/ui/Button";
import { ColumnDef, DataTable } from "@/components/ui/DataTable";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";
import AddCouponModal from "@/components/admin/AddCouponModal";

interface CouponEntry {
  couponId: string;
  code: string;
  type: string;
  value: string;
  minimumOrder: string;
  used: string;
  max: string;
  expiry: string;
  status: string;
}

const typeAndStatusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-700",
  Fixed: "bg-yellow-100 text-yellow-600",
  Percentage: "bg-blue-100 text-blue-600",
};

const orderColumns: ColumnDef<CouponEntry>[] = [
  {
    key: "code",
    header: "CODE",
    render: (row) => <span className="text-green-600 flex items-center gap-1.5">{row.code}<button className="cursor-pointer"><IoCopyOutline className="text-text-muted"/></button></span>,
  },
  {
    key: "type",
    header: "TYPE",
    render: (row) => (
      <span
        className={`text-xs font-bold px-2 py-1 rounded-md ${typeAndStatusColors[row.type]}`}
      >
        {row.type}
      </span>
    ),
  },
  {
    key: "value",
    header: "VALUE",
  },
  {
    key: "minimumOrder",
    header: "MIN ORDER",
  },
  {
    key: "used || max",
    header: "USED/MAX",
    render: (row) => <span className="">{row.used}/{row.max}</span>,
  },
   {
    key: "expiry",
    header: "EXPIRY",
  },
  {
    key: "status",
    header: "STATUS",
    render: (row) => (
      <span
        className={`text-xs font-bold px-2 py-1 rounded-md ${typeAndStatusColors[row.status]}`}
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
        <FaRegTrashAlt className="text-xl" />
      </button>
    ),
  },
];

const coupons = [
  {
    couponId: "1",
    code: "ExHDT9098",
    type: "Fixed",
    value: "2000",
    minimumOrder: "#24,000",
    used: "420",
    max: "500",
    expiry: "04-05-2026",
    status: "Active",
  },
  {
    couponId: "2",
    code: "ExHDT9099",
    type: "Percentage",
    value: "20",
    minimumOrder: "#25,000",
    used: "420",
    max: "500",
    expiry: "04-05-2026",
    status: "Inactive",
  },
];

const AdminCouponsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-3">
        <p className="font-bold">Coupon Details</p>
        <p className="text-xs text-text-muted">Manage discount codes</p>
      </div>
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
        </div>

        {/* Buttons */}
        <div className="flex gap-3 ">
          <Button onClick={()=> setIsModalOpen(true)} className="rounded-md cursor-pointer">Create Coupons</Button>{" "}
        </div>
      </div>

      {/* Table */}
      <DataTable
        title=""
        columns={orderColumns}
        data={coupons}
        rowKey="couponId"
      />

      {
        isModalOpen &&
        <AddCouponModal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)} />
      }
    </div>
  );
};

export default AdminCouponsPage;
