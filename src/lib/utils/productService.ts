import { Product } from "../types/product"

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'
 
export function getStockStatus(product: Pick<Product, 'stockQty' | 'reservedQty'>): StockStatus {
  const available = product.stockQty - product.reservedQty
  if (available <= 0) return 'out_of_stock'
  if (available <= 5) return 'low_stock'
  return 'in_stock'
}
 
export function getDiscountPercent(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}