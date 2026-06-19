'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { FiArrowLeft, FiPlus } from 'react-icons/fi'
import { AccountLayout } from '@/features/account/components/AccountLayout'
import { OrderStepper } from '@/features/account/components/OrderStepper'
import { OrderTimeline } from '@/features/account/components/OrderTimeline'
import { DataTable, type ColumnDef } from '@/components/ui/DataTable'
import { useAuthStore } from '@/store/auth'
import { formatPrice, formatDate } from '@/lib/utils/format'
import { accountApi, OrderDetail, OrderLineItem, OrderStep } from '@/lib/api/account'

// ─── Line items table columns ─────────────────────────────────────────────────

const LINE_ITEM_COLUMNS: ColumnDef<OrderLineItem>[] = [
  {
    key: 'productName',
    header: 'Products',
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#F5F5F5] rounded shrink-0 overflow-hidden">
          <Image
            src={row.productImage || '/images/No-Image-Placeholder.svg'}
            alt={row.productName}
            width={48}
            height={48}
            className="w-full h-full object-contain p-1"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase text-[#F5820A] tracking-wide mb-0.5">
            {row.categoryName}
          </p>
          <p className="text-sm text-[#111111] line-clamp-2 leading-snug max-w-xs">
            {row.productName}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: 'price',
    header: 'Price',
    render: (row) => (
      <span className="text-sm text-[#111111]">{formatPrice(row.price)}</span>
    ),
  },
  {
    key: 'quantity',
    header: 'Quantity',
    render: (row) => (
      <span className="text-sm text-[#6B7280]">x{row.quantity}</span>
    ),
  },
  {
    key: 'subtotal',
    header: 'Sub-Total',
    render: (row) => (
      <span className="text-sm font-semibold text-[#111111]">{formatPrice(row.subtotal)}</span>
    ),
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const { accessToken } = useAuthStore()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!accessToken || !orderNumber) return
    accountApi.getOrderDetail(accessToken, orderNumber)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [accessToken, orderNumber])


  function getOrderSteps(orderStatus: string): OrderStep[]{
    if (orderStatus == "pending"){
      return [{label: "pending", status: "pending" }]
    }
    else if (orderStatus == "active"){
      return [{label: "active", status: "active"}]
    }
    else if (orderStatus == "completed"){
      return [{label: "completed", status: "completed"}]
    }
    else return []
  }

  return (
    <AccountLayout
      breadcrumbItems={[
        { label: 'Order History', href: '/account/orders' },
        { label: 'Order Details' },
      ]}
    >
      <div className="bg-white border border-[#E5E7EB] rounded-card overflow-hidden">

        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <Link
              href="/account/orders"
              className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:border-[#F5820A] hover:text-[#F5820A] transition-colors"
              aria-label="Back to orders"
            >
              <FiArrowLeft size={15} />
            </Link>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              Order Details
            </h2>
          </div>
          <button className="flex items-center gap-1.5 text-sm text-[#F5820A] font-medium hover:underline">
            Leave a Rating <FiPlus size={13} />
          </button>
        </div>

        {isLoading && (
          <div className="p-10 text-center text-sm text-[#6B7280]">Loading order…</div>
        )}

        {!isLoading && !order && (
          <div className="p-10 text-center">
            <p className="text-sm text-[#6B7280]">Order not found.</p>
            <Link href="/account/orders" className="text-sm text-[#F5820A] hover:underline mt-2 inline-block">
              Back to Order History
            </Link>
          </div>
        )}

        {order && (
          <>
            {/* Order summary banner */}
            <div className="mx-6 mt-5 bg-orange-50 border border-orange-100 rounded-card px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg text-[#111111]">#{order.orderNumber}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {order.lineItems.length} Products &bull; Order Placed in{' '}
                  {formatDate(order.placedAt)} at{' '}
                  {new Date(order.placedAt).toLocaleTimeString('en-NG', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <p className="text-2xl font-extrabold text-[#F5820A]">
                {formatPrice(order.total)}
              </p>
            </div>

            {/* Expected arrival */}
            {order.expectedArrival && (
              <p className="px-6 pt-4 text-sm text-[#111111]">
                Order expected arrival{' '}
                <span className="font-bold">{formatDate(order.expectedArrival)}</span>
              </p>
            )}

            {/* Progress stepper */}
            <div className="px-6 pb-2">
              {/* <OrderStepper steps={order.steps} /> */}
              <OrderStepper steps={getOrderSteps(order.status)} />
            </div>

            {/* Order activity timeline */}
            <div className="px-6 py-5 border-t border-[#F5F5F5]">
              <h3 className="text-sm font-bold text-[#111111] mb-5">Order Activity</h3>
              <OrderTimeline activities={order.activity} />
            </div>

            {/* Line items table */}
            <div className="border-t border-[#E5E7EB]">
              <div className="px-6 py-4">
                <h3 className="text-sm font-bold text-[#111111]">
                  Product ({String(order.lineItems.length).padStart(2, '0')})
                </h3>
              </div>
              <DataTable
                columns={LINE_ITEM_COLUMNS}
                data={order.lineItems}
                rowKey="id"
                emptyMessage="No products in this order."
              />
            </div>

            {/* Billing / Shipping / Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-6 border-t border-[#E5E7EB]">
              <AddressBlock title="Billing Address" address={order.billingAddress} />
              <AddressBlock title="Shipping Address" address={order.shippingAddress} />
              {order.notes && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">
                    Order Notes
                  </h4>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{order.notes}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  )
}

// ─── Address block ────────────────────────────────────────────────────────────

function AddressBlock({
  title,
  address,
}: {
  title: string
  address: OrderDetail['billingAddress']
}) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">
        {title}
      </h4>
      <div className="text-sm text-[#6B7280] space-y-1 leading-relaxed">
        <p className="font-semibold text-[#111111]">{address.fullName}</p>
        <p>{address.street}</p>
        <p>{address.city}, {address.state}{address.postalCode ? ` - ${address.postalCode}` : ''}</p>
        <p>{address.country}</p>
        <p>
          <span className="font-medium text-[#111111]">Phone Number: </span>
          {address.phone}
        </p>
        {address.email && (
          <p>
            <span className="font-medium text-[#111111]">Email: </span>
            {address.email}
          </p>
        )}
      </div>
    </div>
  )
}