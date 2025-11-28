/**
 * Notification types for different modules
 */
export type NotificationModule = 'orders' | 'finance'

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
 * Notification counts by module
 */
export interface NotificationCounts {
  orders: number
  finance: number
}

