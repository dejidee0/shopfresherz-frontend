"use client";

import { useState } from "react";
import { HiXMark, HiPrinter, HiChevronDown } from "react-icons/hi2";
import { MdPerson, MdLocalShipping, MdPayment } from "react-icons/md";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderLineItem {
  id: string;
  name: string;
  variant?: string;
  qty: number;
  unitPrice: number;
  image?: string;
}

export interface OrderDetails {
  orderId: string;
  status: OrderStatus;
  lineItems: OrderLineItem[];
  subtotal: number;
  deliveryFee: number;
  vatRate: number; // e.g. 0.075 for 7.5%
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    method: string;
  };
  payment: {
    provider: string;
    status: "PAID" | "UNPAID" | "REFUNDED";
  };
  trackingNumber?: string;
}

interface OrderDetailsModalProps {
  order: OrderDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (orderId: string, status: OrderStatus) => void;
  onTrackingSave?: (orderId: string, tracking: string) => void;
  onCancelOrder?: (orderId: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₦${n.toLocaleString()}`;

const STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  Processing: "bg-blue-50 text-blue-600 border border-blue-200",
  Shipped: "bg-purple-50 text-purple-600 border border-purple-200",
  Delivered: "bg-green-50 text-green-600 border border-green-200",
  Cancelled: "bg-red-50 text-red-500 border border-red-200",
};

const paymentStyles = {
  PAID: "bg-green-50 text-green-600 border border-green-200",
  UNPAID: "bg-red-50 text-red-500 border border-red-200",
  REFUNDED: "bg-gray-100 text-gray-500 border border-gray-200",
};

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

// ─── Info card ────────────────────────────────────────────────────────────────

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      {children}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
  onTrackingSave,
  onCancelOrder,
}: OrderDetailsModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order?.status ?? "Pending"
  );
  const [trackingNumber, setTrackingNumber] = useState(
    order?.trackingNumber ?? ""
  );

  // Sync local state when a new order is passed in
  if (order && order.status !== selectedStatus && !isOpen) {
    setSelectedStatus(order.status);
    setTrackingNumber(order.trackingNumber ?? "");
  }

  if (!isOpen || !order) return null;

  const vat = order.subtotal * order.vatRate;
  const total = order.subtotal + order.deliveryFee + vat;

  const handleStatusUpdate = () => {
    onStatusUpdate?.(order.orderId, selectedStatus);
  };

  const handleTrackingSave = () => {
    onTrackingSave?.(order.orderId, trackingNumber);
  };

  const handleCancel = () => {
    if (confirm(`Cancel order ${order.orderId}? This cannot be undone.`)) {
      onCancelOrder?.(order.orderId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-gray-900">
              Order {order.orderId}
            </h2>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[order.status]}`}
            >
              {order.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <HiXMark size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* ── Top grid: line items + sidebar ── */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
            {/* Left column */}
            <div className="space-y-4">
              {/* Line Items */}
              <InfoCard>
                <SectionLabel>Line Items</SectionLabel>
                <div className="space-y-4 divide-y divide-gray-50">
                  {order.lineItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 pt-4 first:pt-0"
                    >
                      {/* Product image / placeholder */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="3"
                              fill="#F3F4F6"
                            />
                            <circle cx="8.5" cy="8.5" r="2" fill="#D1D5DB" />
                            <path
                              d="M3 15l5-4 4 3 3-2.5 6 5.5"
                              stroke="#D1D5DB"
                              strokeWidth="1.5"
                              fill="none"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {item.name}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.variant}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1.5">
                          Qty: {item.qty}x
                        </p>
                      </div>

                      <p className="font-bold text-gray-800 text-sm shrink-0">
                        {fmt(item.unitPrice * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>
              </InfoCard>

              {/* Financial Summary */}
              <InfoCard>
                <SectionLabel>Financial Summary</SectionLabel>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{fmt(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{fmt(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>VAT ({(order.vatRate * 100).toFixed(1)}%)</span>
                    <span>{fmt(vat)}</span>
                  </div>
                  <div className="h-px bg-gray-100 my-1" />
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-xl font-black text-[#F97316]">
                      {fmt(total)}
                    </span>
                  </div>
                </div>
              </InfoCard>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Customer */}
              <InfoCard>
                <div className="flex items-center gap-2 mb-3">
                  <MdPerson size={16} className="text-[#F97316]" />
                  <SectionLabel>Customer</SectionLabel>
                </div>
                <p className="font-semibold text-gray-900 text-sm">
                  {order.customer.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.customer.email}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {order.customer.phone}
                </p>
              </InfoCard>

              {/* Shipping */}
              <InfoCard>
                <div className="flex items-center gap-2 mb-3">
                  <MdLocalShipping size={16} className="text-[#F97316]" />
                  <SectionLabel>Shipping</SectionLabel>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {order.shipping.address}
                </p>
                <p className="text-xs text-gray-400 italic mt-1">
                  {order.shipping.method}
                </p>
              </InfoCard>

              {/* Payment */}
              <InfoCard>
                <div className="flex items-center gap-2 mb-3">
                  <MdPayment size={16} className="text-[#F97316]" />
                  <SectionLabel>Payment</SectionLabel>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">
                    {order.payment.provider}
                  </p>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${paymentStyles[order.payment.status]}`}
                  >
                    {order.payment.status}
                  </span>
                </div>
              </InfoCard>
            </div>
          </div>

          {/* ── Logistics & Order Management ── */}
          <div className="bg-orange-50/60 rounded-xl border border-orange-100 p-5">
            <SectionLabel>Logistics & Order Management</SectionLabel>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Order status */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Order Status
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={selectedStatus}
                      onChange={(e) =>
                        setSelectedStatus(e.target.value as OrderStatus)
                      }
                      className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                  <button
                    onClick={handleStatusUpdate}
                    className="px-4 py-2.5 bg-[#F97316] text-white text-sm font-bold rounded-lg hover:bg-orange-500 transition-colors shadow-sm shadow-orange-200 whitespace-nowrap"
                  >
                    Update Status
                  </button>
                </div>
              </div>

              {/* Tracking number */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Tracking Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. TRK-9022384755"
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
                  />
                  <button
                    onClick={handleTrackingSave}
                    className="px-4 py-2.5 bg-gray-800 text-white text-sm font-bold rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#F97316] text-white text-sm font-bold rounded-xl hover:bg-orange-500 transition-colors shadow-sm shadow-orange-200">
            <HiPrinter size={16} />
            Print Invoice
          </button>
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-red-500 transition-colors"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}