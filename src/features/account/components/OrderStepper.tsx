import {
  FiShoppingBag,
  FiPackage,
  FiTruck,
  FiCheckCircle,
} from 'react-icons/fi'
import { cn } from '@/lib/utils/format'
import type { OrderStep } from '@/lib/api/account'
import type { OrderStatus } from '@/lib/types/user'

const STEP_ICONS = [FiShoppingBag, FiPackage, FiTruck, FiCheckCircle]
const STEP_LABELS = ['Order Placed', 'Processing', 'Shipped', 'Delivered']

// Which of the 4 stepper stages each backend OrderStatus has reached.
const STAGE_INDEX: Partial<Record<OrderStatus, number>> = {
  Pending: 0,
  AwaitingPayment: 0,
  Paid: 1,
  Processing: 1,
  Shipped: 2,
  Delivered: 3,
}

const TERMINAL_STATUSES: OrderStatus[] = ['Cancelled', 'RefundRequested', 'Refunded']

/** Maps a real order status (e.g. "Processing", "Shipped") to the 4-stage stepper. */
export function getOrderSteps(status: OrderStatus): OrderStep[] {
  // Cancelled/refunded orders stop progressing — only "Order Placed" holds,
  // since we don't know which stage it reached before it was cancelled.
  if (TERMINAL_STATUSES.includes(status)) {
    return STEP_LABELS.map((label, i) => ({
      label,
      status: i === 0 ? 'completed' : 'pending',
    }))
  }

  const current = STAGE_INDEX[status] ?? 0

  return STEP_LABELS.map((label, i) => ({
    label,
    status: i < current ? 'completed' : i === current ? 'active' : 'pending',
  }))
}

interface OrderStepperProps {
  steps: OrderStep[]
}

export function OrderStepper({ steps }: OrderStepperProps) {
  return (
    <div className="relative flex items-start justify-between px-4 py-6">
      {/* Connecting line */}
      <div className="absolute top-9.5 left-[10%] right-[10%] h-0.5 bg-[#E5E5E5]">
        {/* Completed fill */}
        {(() => {
          const lastCompleted = steps.filter((s) => s.status === 'completed').length
          const pct = steps.length > 1 ? (lastCompleted / (steps.length - 1)) * 100 : 0
          return (
            <div
              className="h-full bg-[#F97316] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          )
        })()}
      </div>

      {steps.map((step, i) => {
        const Icon = STEP_ICONS[i] ?? FiCheckCircle
        const isCompleted = step.status === 'completed'
        const isActive = step.status === 'active'

        return (
          <div key={step.label} className="flex flex-col items-center gap-2 z-10 flex-1">
            {/* Circle */}
            <div
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all',
                isCompleted
                  ? 'bg-[#F97316] border-[#F97316] text-white'
                  : isActive
                  ? 'bg-[#FFFFFF] border-[#F97316] text-[#F97316]'
                  : 'bg-[#FFFFFF] border-[#E5E5E5] text-[#888888]'
              )}
            >
              <Icon size={16} />
            </div>

            {/* Step icon below the circle (as per Figma) */}
            <div
              className={cn(
                'w-8 h-8 rounded flex items-center justify-center',
                isCompleted ? 'text-[#F97316]' : 'text-[#888888]'
              )}
            >
              <Icon size={20} />
            </div>

            {/* Label */}
            <p
              className={cn(
                'text-xs font-semibold text-center',
                isCompleted || isActive ? 'text-[#111111]' : 'text-[#888888]'
              )}
            >
              {step.label}
            </p>
          </div>
        )
      })}
    </div>
  )
}