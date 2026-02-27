/**
 * Notification types for different modules (sidebar tabs)
 */
export type NotificationModule = 'users' | 'vendors' | 'orders' | 'finance' | 'wallet'

/**
 * Notification interface
 */
export interface Notification {
  id: string
  module: NotificationModule
  title: string
  message: string
  isRead: boolean
  createdAt: string
  type?: 'info' | 'warning' | 'error' | 'success'
}

/**
 * Notification counts by module (for sidebar badges)
 * users = verification/KYC requested, vendors = pending vendors, orders = uncompleted, finance = pending refunds, wallet = pending withdrawals
 */
export interface NotificationCounts {
  users: number
  vendors: number
  orders: number
  finance: number
  wallet: number
}

