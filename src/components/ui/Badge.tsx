import { cn } from '@/lib/utils/format'

type BadgeVariant = 'sale' | 'new' | 'hot' | 'out_of_stock' | 'low_stock' | 'custom'

interface BadgeProps {
  variant: BadgeVariant
  label?: string           // Override default label
  discountPercent?: number // For sale badge: "15% OFF"
  className?: string
}

const variantConfig: Record<
  BadgeVariant,
  { bg: string; text: string; defaultLabel: string }
> = {
  sale: {
    bg: 'bg-[#F5820A]',
    text: 'text-white',
    defaultLabel: 'SALE',
  },
  new: {
    bg: 'bg-[#7B2FBE]',
    text: 'text-white',
    defaultLabel: 'NEW',
  },
  hot: {
    bg: 'bg-[#EF4444]',
    text: 'text-white',
    defaultLabel: '🔥 HOT',
  },
  out_of_stock: {
    bg: 'bg-[#6B7280]',
    text: 'text-white',
    defaultLabel: 'OUT OF STOCK',
  },
  low_stock: {
    bg: 'bg-[#F59E0B]',
    text: 'text-white',
    defaultLabel: 'LOW STOCK',
  },
  custom: {
    bg: 'bg-[#0D0D0D]',
    text: 'text-white',
    defaultLabel: '',
  },
}

export function Badge({ variant, label, discountPercent, className }: BadgeProps) {
  const config = variantConfig[variant]

  let displayLabel = label ?? config.defaultLabel
  if (variant === 'sale' && discountPercent) {
    displayLabel = `${discountPercent}% OFF`
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded-badge text-[9px] md:text-[11px] font-bold leading-none uppercase tracking-wide rounded',
        config.bg,
        config.text,
        className
      )}
    >
      {displayLabel}
    </span>
  )
}

/** Positioned badge overlay for product card images */
export function CardBadge({
  variant,
  discountPercent,
  label,
}: Pick<BadgeProps, 'variant' | 'discountPercent' | 'label'>) {
  return (
    <div className="absolute top-2 left-2 z-10">
      <Badge variant={variant} discountPercent={discountPercent} label={label} />
    </div>
  )
}