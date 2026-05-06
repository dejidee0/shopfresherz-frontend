import {
  FiShoppingBag,
  FiPackage,
  FiTruck,
  FiCheckCircle,
} from 'react-icons/fi'
import { cn } from '@/lib/utils/format'
import type { OrderStep } from '@/lib/api/account'

const STEP_ICONS = [FiShoppingBag, FiPackage, FiTruck, FiCheckCircle]

interface OrderStepperProps {
  steps: OrderStep[]
}

export function OrderStepper({ steps }: OrderStepperProps) {
  return (
    <div className="relative flex items-start justify-between px-4 py-6">
      {/* Connecting line */}
      <div className="absolute top-9.5 left-[10%] right-[10%] h-0.5 bg-[#E5E7EB]">
        {/* Completed fill */}
        {(() => {
          const lastCompleted = steps.filter((s) => s.status === 'completed').length
          const pct = steps.length > 1 ? (lastCompleted / (steps.length - 1)) * 100 : 0
          return (
            <div
              className="h-full bg-[#F5820A] transition-all duration-500"
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
                  ? 'bg-[#F5820A] border-[#F5820A] text-white'
                  : isActive
                  ? 'bg-white border-[#F5820A] text-[#F5820A]'
                  : 'bg-white border-[#E5E7EB] text-[#D1D5DB]'
              )}
            >
              <Icon size={16} />
            </div>

            {/* Step icon below the circle (as per Figma) */}
            <div
              className={cn(
                'w-8 h-8 rounded flex items-center justify-center',
                isCompleted ? 'text-[#F5820A]' : 'text-[#D1D5DB]'
              )}
            >
              <Icon size={20} />
            </div>

            {/* Label */}
            <p
              className={cn(
                'text-xs font-semibold text-center',
                isCompleted || isActive ? 'text-[#111111]' : 'text-[#D1D5DB]'
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