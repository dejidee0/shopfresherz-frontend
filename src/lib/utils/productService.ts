import { Product } from "../types/product"

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'
  
export function getStockStatus(product: Pick<Product, 'stockQty' | 'reservedQty' | 'availableQty'>): StockStatus {
  const available = product.availableQty ?? (product.stockQty ?? 0) - (product.reservedQty ?? 0)
  if (available <= 0) return 'out_of_stock'
  if (available <= 5) return 'low_stock'
  return 'in_stock'
}
  
export function getDiscountPercent(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}