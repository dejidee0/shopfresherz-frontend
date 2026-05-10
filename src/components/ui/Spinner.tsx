import { cn } from '@/lib/utils/format'

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type SpinnerVariant = 'primary' | 'white' | 'muted'

interface SpinnerProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  className?: string
  label?: string       // sr-only accessible label
}

const SIZE: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3 border-[1.5px]',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
  xl: 'w-12 h-12 border-4',
}

const TRACK: Record<SpinnerVariant, string> = {
  primary: 'border-[#F5820A]/25',
  white:   'border-white/25',
  muted:   'border-[#6B7280]/20',
}

const FILL: Record<SpinnerVariant, string> = {
  primary: 'border-t-[#F5820A]',
  white:   'border-t-white',
  muted:   'border-t-[#6B7280]',
}

export function Spinner({
  size = 'md',
  variant = 'primary',
  className,
  label = 'Loading…',
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block rounded-full animate-spin',
        SIZE[size],
        TRACK[variant],
        FILL[variant],
        className
      )}
    />
  )
}

// ─── Full-page overlay spinner ────────────────────────────────────────────────

interface PageSpinnerProps {
  label?: string
}

export function PageSpinner({ label = 'Loading…' }: PageSpinnerProps) {
  return (
    <div
      className="fixed inset-0 z-9998 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm"
      role="status"
      aria-label={label}
    >
      <Spinner size="xl" variant="primary" />
      {label && (
        <p className="mt-4 text-sm font-medium text-[#6B7280]">{label}</p>
      )}
    </div>
  )
}

// ─── Inline content-area loader ───────────────────────────────────────────────

export function InlineLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-[#6B7280]">
      <Spinner size="md" variant="muted" />
      <span className="text-sm">{label}</span>
    </div>
  )
}