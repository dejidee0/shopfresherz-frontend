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
  { className: string; defaultLabel: string }
> = {
  sale: {
    className: 'badge-orange',
    defaultLabel: 'SALE',
  },
  new: {
    className: 'badge-dark',
    defaultLabel: 'NEW',
  },
  hot: {
    className: 'badge-dark',
    defaultLabel: '🔥 HOT',
  },
  out_of_stock: {
    className: 'badge-red',
    defaultLabel: 'OUT OF STOCK',
  },
  low_stock: {
    className: 'badge-orange',
    defaultLabel: 'LOW STOCK',
  },
  custom: {
    className: 'badge-blue',
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
        'badge leading-none uppercase',
        config.className,
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
