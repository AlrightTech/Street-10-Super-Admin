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
 *
 * This is a frontend projection of the unified timeline returned from the
 * backend `getOrderById` response (`order.timeline`), which may contain both
 * core order events and refund-related events.
 */
export interface TimelineEvent {
  id: string
  /**
   * Human-readable label, e.g. "Order created", "Refund requested".
   */
  status: string
  /**
   * ISO string for the event timestamp.
   */
  createdAt: string
  /**
   * Optional high-level type of the event: core order lifecycle vs refund.
   */
  type?: 'order' | 'refund'
  /**
   * Machine-readable status/action code from the backend (e.g. 'created',
   * 'refund_requested', 'vendor_approved', 'admin_issue').
   */
  statusCode?: string
  /**
   * Arbitrary metadata passed from backend (refundRequestId, amounts, actors, etc.).
   */
  meta?: Record<string, any>
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

