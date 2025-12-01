import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { mockOrders } from '../data/mockOrders'
import type { OrderRecord } from './Orders'
import OrderStatusBadge from '../components/orders/OrderStatusBadge'
import { UserIcon, DownloadIcon, CheckIcon } from '../components/icons/Icons'

interface OrderProduct {
  id: string
  name: string
  category: string
  image: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface OrderTimelineItem {
  status: string
  date: string
  time: string
  completed: boolean
}

export default function OrderDetailView() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderRecord | null>(null)
  const [products, setProducts] = useState<OrderProduct[]>([])
  const [timeline, setTimeline] = useState<OrderTimelineItem[]>([])

  useEffect(() => {
    // Find the order by ID
    const foundOrder = mockOrders.find(
      (o) => o.id.replace('#', '') === orderId || o.id === orderId || o.id === `#${orderId}`
    )

    if (foundOrder) {
      setOrder(foundOrder)
      
      // Generate mock products for this order
      const mockProducts: OrderProduct[] = [
        {
          id: '1',
          name: 'Apple AirPods Pro (2nd Generation)',
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop',
          quantity: 2,
          unitPrice: 199.99,
          totalPrice: 399.98,
        },
        {
          id: '2',
          name: 'iPhone 15 Pro Max Case',
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop',
          quantity: 1,
          unitPrice: 49.99,
          totalPrice: 49.99,
        },
      ]
      setProducts(mockProducts)

      // Generate mock timeline
      const mockTimeline: OrderTimelineItem[] = [
        { status: 'Placed', date: '2024-03-15', time: '14:30:00', completed: true },
        { status: 'Payment Confirmed', date: '2024-03-15', time: '14:35:00', completed: true },
        { status: 'Processing', date: '2024-03-16', time: '16:20:00', completed: true },
        { status: 'Shipped', date: '2024-03-16', time: '16:20:00', completed: true },
        { status: 'Delivered', date: '2024-03-16', time: '16:20:00', completed: true },
      ]
      setTimeline(mockTimeline)
    } else {
      navigate('/orders')
    }
  }, [orderId, navigate])

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    )
  }

  // Format order ID
  const formattedOrderId = order.id.startsWith('#') ? order.id : `#${order.id}`
  
  // Mock customer data
  const customerName = order.customerName
  const customerEmail = `${order.customerName.toLowerCase().replace(/\s+/g, '.')}@email.com`
  const customerPhone = '+1 (555) 123-4567'
  const customerAvatar = `https://i.pravatar.cc/100?img=${order.customerName.length % 70}`

  // Calculate totals
  const subtotal = products.reduce((sum, p) => sum + p.totalPrice, 0)
  const discount = 45.0
  const tax = 36.0
  const shipping = 12.99
  const total = subtotal - discount + tax + shipping

  // Format order date
  const orderDate = order.orderDate || '2024-03-15'
  const orderTime = '14:30:00'

  const handleViewProfile = () => {
    console.log('View profile clicked')
    // Navigate to customer profile page
  }

  const handleDownloadInvoice = () => {
    console.log('Download invoice clicked')
    // Add download invoice functionality
  }

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      console.log('Cancel order clicked')
      // Add cancel order functionality
    }
  }

  const handleProcessRefund = () => {
    if (orderId) {
      navigate(`/orders/${orderId}/start-refund-process`)
    }
  }

  const handleSendInvoice = () => {
    console.log('Send invoice clicked')
    // Add send invoice functionality
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
        {/* Order Header */}
        <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order {formattedOrderId}</h1>
            <p className="mt-1 text-sm text-gray-600">
              {orderDate} at {orderTime}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleViewProfile}
              className="inline-flex items-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
            >
              <UserIcon className="h-4 w-4" />
              <span>{customerName}</span>
              <span className="text-xs opacity-90">Order Manager</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="inline-flex items-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
            >
              <DownloadIcon className="h-4 w-4" />
              Download Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
        <div className="flex items-start gap-4 relative">
          <img
            src={customerAvatar}
            alt={customerName}
            className="h-16 w-16 rounded-full object-cover border-2 border-[#F7931E]"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">{customerName}</h3>
              <button
                type="button"
                onClick={handleViewProfile}
                className="rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
              >
                View Profile
              </button>
            </div>
            <div className="mt-2 space-y-1.5">
              <p className="text-sm text-gray-600">{customerEmail}</p>
              <p className="text-sm text-gray-600">{customerPhone}</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-100">
              <div className="h-20 w-20 rounded-lg bg-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{product.category}</p>
                <p className="mt-1 text-sm text-gray-600">
                  Quantity: {product.quantity} x ${product.unitPrice.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-gray-900">
                  ${product.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="pr-6 border-r border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-medium text-gray-900 mt-1">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-600">Card Details</p>
                <p className="font-medium text-gray-900 mt-1">Visa ending in 4321</p>
              </div>
              <div>
                <p className="text-gray-600">Transaction ID</p>
                <p className="font-medium text-gray-900 mt-1">TXN-2024-001</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Status</p>
                <p className="text-green-600 font-medium mt-1">Completed</p>
              </div>
            </div>
          </div>
          <div className="pl-6 flex flex-col h-full">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm flex-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium text-gray-900">${shipping.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between pt-3 mt-auto border-t border-gray-200">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="pr-6 border-r border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Delivery Address</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>123 Main Street, Apt 4B</p>
              <p>New York, NY 10001</p>
              <p>United States</p>
            </div>
          </div>
          <div className="pl-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Shipping Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Shipping Method</p>
                <p className="font-medium text-gray-900 mt-1">Standard Shipping</p>
              </div>
              <div>
                <p className="text-gray-600">Tracking Number</p>
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer mt-1"
                >
                  TRK123456789
                </button>
              </div>
              <div>
                <p className="text-gray-600">Estimated Delivery</p>
                <p className="font-medium text-gray-900 mt-1">2024-03-18</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {item.completed ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                      <CheckIcon className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    </div>
                  )}
                </div>
                <p className="font-medium text-gray-900">{item.status}</p>
              </div>
              <p className="text-sm text-gray-500">
                {item.date} at {item.time}
              </p>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <button
          type="button"
          onClick={handleCancelOrder}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
        >
          Cancel Order
        </button>
        <button
          type="button"
          onClick={handleProcessRefund}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
        >
          Process Refund/Cancel Order
        </button>
        <button
          type="button"
          onClick={handleSendInvoice}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
        >
          <DownloadIcon className="h-4 w-4" />
          Send Invoice
        </button>
      </div>
    </div>
  )
}

