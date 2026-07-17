import { cn } from '@/lib/utils/format'

/** Generic shimmer block — cream/white brand tones via the .sf-skeleton CSS class. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('sf-skeleton rounded-md', className)} />
}

/** Matches ProductCard's layout: image block + title lines + price + button. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-[14px] border border-black/[0.07] bg-white overflow-hidden">
      <Skeleton className="h-[190px] sm:h-[200px] rounded-none" />
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between mt-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-9 rounded-[10px]" />
        </div>
      </div>
    </div>
  )
}

/** Matches the PDP layout: image + buy-box on top, tabs below. */
export function PDPSkeleton() {
  return (
    <div className="bg-[#F5F2ED] px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
      <Skeleton className="h-4 w-64 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,45%)_minmax(0,55%)] gap-8 lg:gap-10">
        <Skeleton className="aspect-square rounded-[20px] w-full" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1 rounded-[10px]" />
            <Skeleton className="h-12 w-[140px] rounded-[10px]" />
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-full mt-10 rounded-lg" />
    </div>
  )
}

/** Matches DataTable rows used across admin dashboard list pages. */
export function TableRowsSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="flex flex-col gap-px bg-black/[0.04] rounded-lg overflow-hidden">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 bg-white px-4 py-3.5">
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} className={cn('h-3.5', c === 0 ? 'w-24' : 'flex-1 max-w-32')} />
          ))}
        </div>
      ))}
    </div>
  )
}
