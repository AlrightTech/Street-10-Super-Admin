import type { Notification } from '../types/notifications'

/**
 * Mock notification data
 * In production, this would come from an API
 */
export const mockNotifications: Notification[] = [
  // Orders notifications
  {
    id: '1',
    module: 'orders',
    title: 'New Order Received',
    message: 'Order #ORD-001 has been placed',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    type: 'info',
  },
  {
    id: '2',
    module: 'orders',
    title: 'Order Status Updated',
    message: 'Order #ORD-002 status changed to Shipped',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    type: 'success',
  },
  {
    id: '3',
    module: 'orders',
    title: 'Payment Pending',
    message: 'Order #ORD-003 payment is pending',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    type: 'warning',
  },
  {
    id: '4',
    module: 'orders',
    title: 'Refund Requested',
    message: 'Order #ORD-004 refund has been requested',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    type: 'warning',
  },
  {
    id: '5',
    module: 'orders',
    title: 'Order Completed',
    message: 'Order #ORD-005 has been completed',
    isRead: true, // Already read
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    type: 'success',
  },
  // Finance notifications
  {
    id: '6',
    module: 'finance',
    title: 'Payment Received',
    message: 'Payment of $1,250.00 has been received',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    type: 'success',
  },
  {
    id: '7',
    module: 'finance',
    title: 'Refund Processed',
    message: 'Refund of $500.00 has been processed',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
    type: 'info',
  },
  {
    id: '8',
    module: 'finance',
    title: 'Transaction Failed',
    message: 'Transaction #TXN-001 failed to process',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    type: 'error',
  },
  {
    id: '9',
    module: 'finance',
    title: 'Commission Payment',
    message: 'Commission payment of $150.00 has been processed',
    isRead: true, // Already read
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    type: 'info',
  },
]

/**
 * Get initial notification counts
 */
export function getInitialNotificationCounts() {
  const orders = mockNotifications.filter(
    (n) => n.module === 'orders' && !n.isRead
  ).length
  const finance = mockNotifications.filter(
    (n) => n.module === 'finance' && !n.isRead
  ).length

  return { orders, finance }
}

