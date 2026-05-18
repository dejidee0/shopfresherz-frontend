"use client";

import { IoEyeOutline, IoWarningOutline } from "react-icons/io5";
import { Button } from "@/components/ui/Button";
import { ColumnDef, DataTable } from "@/components/ui/DataTable";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useOrders, useUpdateOrderStatus } from "@/lib/hooks/useAdmin";
import { useState, useMemo } from "react";
import type { AdminOrdersFilters } from "@/lib/api/admin";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";
import { Spinner } from "@/components/ui/Spinner";

const paymentAndStatusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Delivered: "bg-green-100 text-green-700",
  Unpaid: "bg-yellow-100 text-yellow-600",
  Processing: "bg-blue-100 text-blue-600",
  Refunded: "bg-red-100 text-red-600",
  Cancelled: "bg-red-100 text-red-600",
};


const AdminOrderPage = () => {
  const [filters, setFilters] = useState<AdminOrdersFilters>({});
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: ordersData, isLoading } = useOrders(filters);
  const updateOrderStatusMutation = useUpdateOrderStatus();

  const orders = useMemo(() => {
    if (!ordersData?.items) return [];
    return ordersData.items.map((order: any) => ({
      id: order.id,
      orderId: order.orderNumber || order.id,
      customer: 'Customer', // API doesn't provide customer name directly
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
      items: `${order.items?.length || 0} items`,
      total: `₦${order.total?.toLocaleString() || '0'}`,
      payment: order.paymentStatus || 'Unknown',
      status: order.status || 'Unknown',
      fullOrder: order, // Store the full order data for the modal
    }));
  }, [ordersData]);


  const handleViewOrder = (order: any) => {
    setSelectedOrder(order.fullOrder);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateOrderStatusMutation.mutate({ orderNumber: orderId, payload: { status } });
  };

  const handleTrackingSave = (orderId: string, tracking: string) => {
    // Find the current order to get its status
    const currentOrder = ordersData?.items.find(o => (o.orderNumber || o.id) === orderId);
    const currentStatus = currentOrder?.status || 'Pending';

    updateOrderStatusMutation.mutate({
      orderNumber: orderId,
      payload: { status: currentStatus, trackingNumber: tracking }
    });
  };

  const handleCancelOrder = (orderId: string) => {
    updateOrderStatusMutation.mutate({
      orderNumber: orderId,
      payload: { status: 'Cancelled' }
    });
  };

  const orderColumns: ColumnDef<any>[] = [
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
      <button onClick={()=> handleViewOrder(row)} className="cursor-pointer">
        <IoEyeOutline className="text-xl"/>
      </button>
    ),
  },
];


  return (
    <div className="flex flex-col gap-4 md:gap-2 p-2 md:p-4 lg:p-6">
      <div className="mb-6 flex flex-col gap-3">
        <p className="font-bold">Order Details</p>
        <p className="text-xs text-text-muted">
          {isLoading ? 'Loading...' : `${ordersData?.totalCount || 0} total orders`}
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Search - for now just placeholder since API doesn't have search for orders */}
          <div className="relative">
            <HiMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search orders (not implemented)"
              disabled
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] w-64 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
            className="border border-border rounded-2xl text-xs lg:text-sm text-gray-400 h-10 px-2"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={filters.paymentStatus || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value || undefined }))}
            className="border border-border rounded-2xl text-xs lg:text-sm text-gray-400 h-10 px-2"
          >
            <option value="">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="refunded">Refunded</option>
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
      {isLoading ? (
        <div className="text-center py-8"><Spinner/></div>
      ) : (
        <DataTable
          title=""
          columns={orderColumns}
          data={orders}
          rowKey="orderId"
          emptyMessage="No orders found"
        />
      )}

      {isModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={transformOrderForModal(selectedOrder)}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onStatusUpdate={handleStatusUpdate}
          onTrackingSave={handleTrackingSave}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </div>
  );
};

// Transform API order data to match OrderDetailsModal interface
function transformOrderForModal(order: any): any {
  return {
    orderId: order.orderNumber || order.id,
    status: order.status,
    lineItems: order.items?.map((item: any) => ({
      id: item.id,
      name: item.productSnapshot?.name || 'Unknown Product',
      variant: item.productSnapshot?.sku || '',
      qty: item.quantity,
      unitPrice: item.unitPrice,
      image: item.productSnapshot?.imageUrl,
    })) || [],
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    vatRate: order.vatAmount ? (order.vatAmount / order.subtotal) : 0,
    customer: {
      name: 'Customer', // API doesn't provide customer name
      email: 'customer@example.com', // API doesn't provide customer email
      phone: '', // API doesn't provide customer phone
    },
    shipping: {
      address: order.deliveryAddress ? `${order.deliveryAddress.line1}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state}` : 'No address provided',
      method: order.deliveryMethod || 'Standard',
    },
    payment: {
      provider: order.paymentMethod || 'Unknown',
      status: (order.paymentStatus === 'Paid' ? 'PAID' : order.paymentStatus === 'Unpaid' ? 'UNPAID' : 'REFUNDED') as 'PAID' | 'UNPAID' | 'REFUNDED',
    },
    trackingNumber: order.trackingNumber,
  };
}

export default AdminOrderPage;
