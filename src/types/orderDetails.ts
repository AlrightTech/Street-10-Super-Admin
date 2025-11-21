/**
 * Order details type definitions
 */

/**
 * Order status type
 */
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'shipped' | 'delivered'

/**
 * Payment status type
 */
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

/**
 * Payment method type
 */
export type PaymentMethod = 'credit-card' | 'debit-card' | 'paypal' | 'bank-transfer' | 'cash-on-delivery'

/**
 * Product item in order
 */
export interface OrderProduct {
  id: string
  name: string
  image: string
  category: string
  quantity: number
  price: number
  total: number
}

/**
 * Order timeline event
 */
export interface TimelineEvent {
  id: string
  status: string
  date: string
  time: string
}

/**
 * Customer information
 */
export interface CustomerInfo {
  id: number
  name: string
  email: string
  phone: string
  avatar: string
}

/**
 * Payment information
 */
export interface PaymentInfo {
  method: PaymentMethod
  cardDetails?: string
  transactionId: string
  status: PaymentStatus
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
}

/**
 * Shipping information
 */
export interface ShippingInfo {
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  method: string
  trackingNumber: string
  estimatedDelivery: string
}

/**
 * Order details interface
 */
export interface OrderDetails {
  id: string
  orderId: string
  date: string
  time: string
  status: OrderStatus
  customer: CustomerInfo
  products: OrderProduct[]
  payment: PaymentInfo
  shipping: ShippingInfo
  timeline: TimelineEvent[]
}

