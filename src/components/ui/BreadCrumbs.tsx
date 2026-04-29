import Link from 'next/link'
import { FiChevronRight, FiHome } from 'react-icons/fi'
import { cn } from '@/lib/utils/format'

export interface BreadcrumbItem {
  label: string
  href?: string // omit for the current (last) crumb
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1.5 text-sm py-3', className)}
    >
      {/* Home icon */}
      <Link
        href="/"
        className="text-[#6B7280] hover:text-[#F5820A] transition-colors shrink-0"
        aria-label="Home"
      >
        <FiHome size={14} />
      </Link>

      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            <FiChevronRight size={13} className="text-[#D1D5DB] shrink-0" />
            {isLast || !item.href ? (
              <span
                className={cn(
                  'truncate max-w-50',
                  isLast
                    ? 'text-[#F5820A] font-medium'
                    : 'text-[#6B7280]'
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-[#6B7280] hover:text-[#F5820A] transition-colors truncate max-w-50"
              >
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}