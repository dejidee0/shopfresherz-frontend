'use client'

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { cn } from '@/lib/utils/format'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  // Build page number array with ellipsis logic
  function getPages(): (number | 'ellipsis')[] {
    const delta = 1 // pages around current
    const pages: (number | 'ellipsis')[] = []
    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

    pages.push(1)
    if (rangeStart > 2) pages.push('ellipsis')
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)
    if (rangeEnd < totalPages - 1) pages.push('ellipsis')
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  const pages = getPages()

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-2', className)}
    >
      {/* Prev */}
      <PageBtn
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <FiChevronLeft size={15} />
      </PageBtn>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-[#6B7280] text-sm select-none">
            …
          </span>
        ) : (
          <PageBtn
            key={p}
            onClick={() => onPageChange(p)}
            active={p === currentPage}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {String(p).padStart(2, '0')}
          </PageBtn>
        )
      )}

      {/* Next */}
      <PageBtn
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <FiChevronRight size={15} />
      </PageBtn>
    </nav>
  )
}

// ─── Internal button ──────────────────────────────────────────────────────────
interface PageBtnProps {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
  disabled?: boolean
  'aria-label'?: string
  'aria-current'?: 'page' | undefined
}

function PageBtn({ children, onClick, active, disabled, ...rest }: PageBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-150 select-none',
        active
          ? 'bg-[#F97316] text-white shadow-sm shadow-orange-500/20'
          : 'border border-white/[0.1] text-[#A0A0A0] bg-[#141414] hover:border-[#F97316] hover:text-[#F97316]',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
