export interface CartItem {
  id: string            // line item id
  productId: string
  variantId?: string
  name: string
  slug: string
  image: string         // thumb
  price: number
  quantity: number
  stockQty: number      // for cap enforcement
}
 
export interface Cart {
  items: CartItem[]
  couponCode?: string
  discountAmount: number
}