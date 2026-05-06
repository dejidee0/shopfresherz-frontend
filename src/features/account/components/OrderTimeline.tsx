import {
  FiCheckCircle,
  FiTruck,
  FiMapPin,
  FiPackage,
  FiShield,
  FiClipboard,
} from 'react-icons/fi'
import { cn } from '@/lib/utils/format'
import type { OrderActivity } from '@/lib/api/account'

const ICON_MAP = {
  check:    FiCheckCircle,
  truck:    FiTruck,
  location: FiMapPin,
  package:  FiPackage,
  shield:   FiShield,
  confirm:  FiClipboard,
}

interface OrderTimelineProps {
  activities: OrderActivity[]
}

export function OrderTimeline({ activities }: OrderTimelineProps) {
  return (
    <div className="space-y-0">
      {activities.map((activity, i) => {
        const Icon = ICON_MAP[activity.icon] ?? FiCheckCircle
        const isFirst = i === 0
        const isLast = i === activities.length - 1

        return (
          <div key={activity.id} className="flex gap-4">
            {/* Icon + vertical line */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0',
                  isFirst
                    ? 'border-[#F5820A] bg-orange-50 text-[#F5820A]'
                    : 'border-[#E5E7EB] bg-white text-[#6B7280]'
                )}
              >
                <Icon size={14} />
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-[#E5E7EB] my-1 min-h-6" />
              )}
            </div>

            {/* Content */}
            <div className="pb-5 min-w-0">
              <p
                className={cn(
                  'text-sm leading-snug',
                  isFirst ? 'font-semibold text-[#111111]' : 'text-[#6B7280]'
                )}
              >
                {activity.message}
              </p>
              <p className="text-xs text-[#6B7280] mt-0.5">{activity.timestamp}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}