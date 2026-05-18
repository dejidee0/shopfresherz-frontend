"use client"
import { IoCopyOutline, IoEyeOutline, IoWarningOutline } from "react-icons/io5";
import { Button } from "@/components/ui/Button";
import { ColumnDef, DataTable } from "@/components/ui/DataTable";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { FaRegTrashAlt, FaPen } from "react-icons/fa";
import { useState } from "react";
import AddCouponModal from "@/components/admin/AddCouponModal";
import { useCoupons, useDeleteCoupon } from "@/lib/hooks/useAdmin";
import { Spinner } from "@/components/ui/Spinner";

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

// Coupons data is now fetched from API

const AdminCouponsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const { data: coupons, isLoading } = useCoupons();
  const deleteCouponMutation = useDeleteCoupon();

  const handleEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleDeleteCoupon = (couponId: number) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      deleteCouponMutation.mutate(couponId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const couponRows = coupons?.map((coupon) => ({
    couponId: coupon.id.toString(),
    code: coupon.code,
    type: coupon.type,
    value: coupon.type === 'Percentage' ? `${coupon.value}%` : `₦${coupon.value.toLocaleString()}`,
    minimumOrder: `₦${coupon.minimumOrderAmount.toLocaleString()}`,
    used: coupon.usedCount.toString(),
    max: coupon.maxUses.toString(),
    expiry: new Date(coupon.expiresAt).toLocaleDateString(),
    status: coupon.isActive ? 'Active' : 'Inactive',
  })) || [];

  const orderColumns: ColumnDef<any>[] = [
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
        <div className="flex gap-2">
          <button
            className="cursor-pointer"
            onClick={() => handleEditCoupon(coupons?.find(c => c.id.toString() === row.couponId))}
          >
            <FaPen className="text-lg" />
          </button>
          <button
            className="cursor-pointer"
            onClick={() => handleDeleteCoupon(parseInt(row.couponId))}
          >
            <FaRegTrashAlt className="text-xl" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-2 md:p-4 lg:p-6">
      <div className="mb-6 flex flex-col gap-3">
        <p className="font-bold">Coupon Details</p>
        <p className="text-xs text-text-muted">
          {isLoading ? 'Loading coupons...' : `${coupons?.length || 0} coupons • Manage discount codes`}
        </p>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-0 justify-between">
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
        <div className="flex text-xs md:text-sm gap-3 ">
          <Button onClick={()=> setIsModalOpen(true)} className="rounded-md cursor-pointer">Create Coupons</Button>{" "}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-8"><Spinner/></div>
      ) : (
        <DataTable
          title=""
          columns={orderColumns}
          data={couponRows}
          rowKey="couponId"
          emptyMessage="No coupons found"
        />
      )}

      {isModalOpen && (
        <AddCouponModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingCoupon={editingCoupon}
        />
      )}
    </div>
  );
};

export default AdminCouponsPage;
