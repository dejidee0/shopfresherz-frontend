import { cn } from '@/lib/utils/format'
import type { OrderStatus } from '@/lib/types/user'

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  Pending:          { label: 'PENDING',     className: 'text-[#F59E0B]' },
  AwaitingPayment:  { label: 'AWAITING',    className: 'text-[#6B7280]' },
  Paid:             { label: 'PAID',        className: 'text-[#22C55E]' },
  Processing:       { label: 'IN PROGRESS', className: 'text-[#F97316]' },
  Shipped:          { label: 'SHIPPED',     className: 'text-[#3B82F6]' },
  Delivered:        { label: 'COMPLETED',   className: 'text-[#22C55E]' },
  Cancelled:        { label: 'CANCELED',    className: 'text-[#EF4444]' },
  RefundRequested:  { label: 'REFUND REQ',  className: 'text-[#EF4444]' },
  Refunded:         { label: 'REFUNDED',    className: 'text-[#6B7280]' },
}

interface OrderStatusBadgeProps {
  status: OrderStatus | string
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'text-[#6B7280]' }

  return (
    <span className={cn('text-xs font-bold uppercase tracking-wide', config.className, className)}>
      {config.label}
    </span>
  )
}