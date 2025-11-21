import type { OrderDetails } from '../types/orderDetails'
import { mockUserDetails, getUserDetails } from './mockUserDetails'

/**
 * Mock order details data matching the image
 */
export const mockOrderDetails: Record<string, OrderDetails> = {
  'ORD-2024-001': {
    id: '1',
    orderId: 'ORD-2024-001',
    date: '2024-03-15',
    time: '14:30:00',
    status: 'completed',
    customer: {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@gmail.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    products: [
      {
        id: '1',
        name: 'Apple AirPods Pro (3rd Generation)',
        image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop',
        category: 'Electronics',
        quantity: 2,
        price: 199.99,
        total: 399.98,
      },
      {
        id: '2',
        name: 'iPhone 15 Pro Max Case',
        image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop',
        category: 'Accessories',
        quantity: 1,
        price: 49.99,
        total: 49.99,
      },
    ],
    payment: {
      method: 'credit-card',
      cardDetails: 'Visa ending in 4321',
      transactionId: 'TXN-2024-001',
      status: 'completed',
      subtotal: 449.97,
      discount: 4.0,
      tax: 5.0,
      shipping: 12.99,
      total: 463.96,
    },
    shipping: {
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      method: 'Standard Shipping',
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2024-03-18',
    },
    timeline: [
      {
        id: '1',
        status: 'Placed',
        date: '2024-03-15',
        time: '14:30:00',
      },
      {
        id: '2',
        status: 'Payment Confirmed',
        date: '2024-03-15',
        time: '14:30:00',
      },
      {
        id: '3',
        status: 'Processing',
        date: '2024-03-15',
        time: '16:20:00',
      },
      {
        id: '4',
        status: 'Shipped',
        date: '2024-03-15',
        time: '16:20:00',
      },
      {
        id: '5',
        status: 'Delivered',
        date: '2024-03-15',
        time: '16:20:00',
      },
    ],
  },
}

/**
 * Generate order details from order item
 */
function generateOrderDetails(orderId: string): OrderDetails | null {
  // Search through all user details to find the order
  let foundOrder: { order: any; user: any } | null = null
  
  // Check mockUserDetails first
  for (const userId in mockUserDetails) {
    const user = mockUserDetails[userId]
    const order = user.orders.find((o) => o.orderId === orderId)
    if (order) {
      foundOrder = { order, user }
      break
    }
  }
  
  // If not found, search through generated user details
  if (!foundOrder) {
    for (let userId = 1; userId <= 20; userId++) {
      const user = getUserDetails(userId)
      if (user) {
        const order = user.orders.find((o) => o.orderId === orderId)
        if (order) {
          foundOrder = { order, user }
          break
        }
      }
    }
  }
  
  if (!foundOrder) {
    return null
  }
  
  const { order, user } = foundOrder
  
  // Parse date from order.date (format: "15/01/2024")
  const dateParts = order.date.split('/')
  const formattedDate = dateParts.length === 3 
    ? `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`
    : order.date
  
  // Map order status to OrderDetails status type
  const orderStatusMap: Record<string, 'pending' | 'processing' | 'completed' | 'cancelled' | 'shipped' | 'delivered'> = {
    'completed': 'completed',
    'processing': 'processing',
    'pending': 'pending',
    'cancelled': 'cancelled',
    'shipped': 'shipped',
    'delivered': 'delivered',
  }
  
  const mappedStatus = orderStatusMap[order.status.toLowerCase()] || 'pending'
  
  // Generate timeline based on order status
  const timeline = [
    { id: '1', status: 'Placed', date: formattedDate, time: '14:30:00' },
    { id: '2', status: 'Payment Confirmed', date: formattedDate, time: '14:30:00' },
  ]
  
  if (mappedStatus === 'completed' || mappedStatus === 'delivered') {
    timeline.push(
      { id: '3', status: 'Processing', date: formattedDate, time: '16:20:00' },
      { id: '4', status: 'Shipped', date: formattedDate, time: '16:20:00' },
      { id: '5', status: 'Delivered', date: formattedDate, time: '16:20:00' }
    )
  } else if (mappedStatus === 'shipped') {
    timeline.push(
      { id: '3', status: 'Processing', date: formattedDate, time: '16:20:00' },
      { id: '4', status: 'Shipped', date: formattedDate, time: '16:20:00' }
    )
  } else if (mappedStatus === 'processing') {
    timeline.push({ id: '3', status: 'Processing', date: formattedDate, time: '16:20:00' })
  } else if (mappedStatus === 'cancelled') {
    timeline.push({ id: '3', status: 'Cancelled', date: formattedDate, time: '16:20:00' })
  }
  
  return {
    id: order.id,
    orderId: order.orderId,
    date: formattedDate,
    time: '14:30:00',
    status: mappedStatus,
    customer: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    },
    products: [
      {
        id: order.id,
        name: order.productName,
        image: order.productImage,
        category: 'Electronics',
        quantity: 1,
        price: order.amount,
        total: order.amount,
      },
    ],
    payment: {
      method: 'credit-card',
      cardDetails: 'Visa ending in 4321',
      transactionId: `TXN-${order.orderId}`,
      status: mappedStatus === 'completed' || mappedStatus === 'delivered' ? 'completed' : mappedStatus === 'cancelled' ? 'refunded' : 'pending',
      subtotal: order.amount * 0.9,
      discount: order.amount * 0.1,
      tax: order.amount * 0.08,
      shipping: 12.99,
      total: order.amount,
    },
    shipping: {
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      method: 'Standard Shipping',
      trackingNumber: `TRK${order.orderId.replace('ORD-', '')}`,
      estimatedDelivery: formattedDate,
    },
    timeline,
  }
}

/**
 * Get order details by ID
 */
export function getOrderDetails(orderId: string): OrderDetails | null {
  // First try to get from mockOrderDetails
  if (mockOrderDetails[orderId]) {
    return mockOrderDetails[orderId]
  }
  
  // If not found, generate from order item in user details
  return generateOrderDetails(orderId)
}

