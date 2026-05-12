import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format NGN price — e.g. ₦45,000 */
export function formatPrice(amount: number): string {
  return `₦${amount?.toLocaleString('en-NG')}`
}

/** Format date to readable string */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Truncate text to n chars */
export function truncate(text: string, n: number): string {
  return text.length > n ? `${text.slice(0, n)}…` : text
}

/** Build image srcSet for responsive loading */
export function buildSrcSet(thumb: string, display: string): string {
  return `${thumb} 80w, ${display} 540w`
}

/** Clamp quantity between 1 and available stock (max 10 per PRD) */
export function clampQty(qty: number, availableStock: number): number {
  return Math.min(Math.max(1, qty), Math.min(availableStock, 10))
}

/** Check if a flash deal is still active */
export function isDealActive(endTime: string): boolean {
  return new Date(endTime) > new Date()
}

/** Get time remaining for countdown */
export function getTimeRemaining(endTime: string): { h: number; m: number; s: number } {
  const diff = Math.max(0, new Date(endTime).getTime() - Date.now())
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1_000)
  return { h, m, s }
}

/** Pad number to 2 digits */
export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

/** Generate order number display label */
export function formatOrderNumber(orderNumber: string): string {
  return orderNumber.startsWith('SFZ-') ? orderNumber : `SFZ-${orderNumber}`
}