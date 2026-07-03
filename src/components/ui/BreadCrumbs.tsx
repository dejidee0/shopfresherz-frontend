import Link from 'next/link'
import { FiHome, FiMoreHorizontal } from 'react-icons/fi'
import { cn } from '@/lib/utils/format'

// Collapse threshold — if there are more than this many items (excluding home),
// the middle ones are hidden on mobile behind a "…" button.
const MOBILE_COLLAPSE_AFTER = 1

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

function Separator() {
  return <span className="text-[#CFCFCF] shrink-0">/</span>
}

function Crumb({
  item,
  isLast,
}: {
  item: BreadcrumbItem
  isLast: boolean
}) {
  const label = isLast && item.label.length > 20
    ? `${item.label.slice(0, 20)}...`
    : item.label

  if (isLast || !item.href) {
    return (
      <span
        className={cn(
          'truncate max-w-35 sm:max-w-50',
          isLast ? 'text-[#F97316] font-medium' : 'text-[#888888]'
        )}
        aria-current={isLast ? 'page' : undefined}
      >
        {label}
      </span>
    )
  }
  return (
    <Link
      href={item.href}
      className="text-[#888888] hover:text-[#F97316] transition-colors truncate max-w-35 sm:max-w-50"
    >
      {label}
    </Link>
  )
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const needsCollapse = items.length > MOBILE_COLLAPSE_AFTER + 1
  const middleItems = items.slice(0, items.length - 1) // everything except last
  const lastItem = items[items.length - 1]

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1.5 text-[12px] py-3 min-w-0', className)}
    >
      {/* Home icon — always visible */}
      <Link
        href="/"
        className="text-[#888888] hover:text-[#F97316] transition-colors shrink-0"
        aria-label="Home"
      >
        <FiHome size={14} />
      </Link>

      {/* ── Mobile view: collapse middle crumbs ── */}
      {needsCollapse ? (
        <>
          {/* Collapsed: home → … → last  (no JS, pure CSS) */}
          <span className="flex items-center gap-1.5 sm:hidden min-w-0">
            <Separator />
            {/* The peer checkbox trick — toggles the hidden middle items */}
            <label
              htmlFor="breadcrumb-expand"
              className="flex items-center justify-center w-5 h-5 rounded text-[#888888] hover:text-[#F97316] hover:bg-orange-50 cursor-pointer transition-colors shrink-0"
              aria-label="Show full path"
            >
              <FiMoreHorizontal size={14} />
            </label>
            <input
              id="breadcrumb-expand"
              type="checkbox"
              className="sr-only peer"
            />

            {/* Middle crumbs — hidden until checkbox is checked */}
            <span className="hidden peer-checked:flex items-center gap-1.5 min-w-0">
              {middleItems.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 min-w-0">
                  <Crumb item={item} isLast={false} />
                  <Separator />
                </span>
              ))}
            </span>

            <Separator />
            <Crumb item={lastItem} isLast={true} />
          </span>

          {/* ── Desktop view: show all crumbs ── */}
          <span className="hidden sm:flex items-center gap-1.5 min-w-0">
            {items.map((item, i) => {
              const isLast = i === items.length - 1
              return (
                <span key={i} className="flex items-center gap-1.5 min-w-0">
                  <Separator />
                  <Crumb item={item} isLast={isLast} />
                </span>
              )
            })}
          </span>
        </>
      ) : (
        /* ── Short path: render all crumbs at every size ── */
        items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <span key={i} className="flex items-center gap-1.5 min-w-0">
              <Separator />
              <Crumb item={item} isLast={isLast} />
            </span>
          )
        })
      )}
    </nav>
  )
}
