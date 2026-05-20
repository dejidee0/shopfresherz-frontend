import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/format'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  // primary:
  //   'bg-gradient-to-r from-[#F5820A] to-[#E06B00] text-white hover:shadow-lg hover:shadow-orange-200 active:scale-[0.98]',
  primary: 'bg-primary text-white hover:bg-primary-dark active:scale-[0.98]',
  secondary:
    'border border-[#F5820A] text-[#F5820A] bg-transparent hover:bg-orange-50 active:scale-[0.98]',
  ghost:
    'border border-[#E5E7EB] text-[#111111] bg-transparent hover:bg-gray-50 active:scale-[0.98]',
  danger:
    'bg-[#EF4444] text-white hover:bg-red-600 active:scale-[0.98]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base
          'inline-flex items-center justify-center font-semibold rounded-btn transition-all duration-200 select-none',
          // Variant
          variantClasses[variant],
          // Size
          sizeClasses[size],
          // Width
          fullWidth && 'w-full',
          // Disabled
          isDisabled && 'opacity-60 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

function Spinner() {
  return (
    <svg
      className="animate-spin w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}