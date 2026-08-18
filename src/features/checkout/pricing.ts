/**
 * Calculates the amount the customer sees and the checkout API receives.
 * VAT is not charged; the backend is the final authority for the amount.
 */
export function getCheckoutTotal(
  subtotal: number,
  discountAmount: number,
  deliveryFee: number,
) {
  return Math.max(0, subtotal - discountAmount) + deliveryFee
}
