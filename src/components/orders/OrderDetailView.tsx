import { useState, useEffect } from 'react'
import type { OrderRecord } from '../../pages/Orders'
import OrderStatusBadge from './OrderStatusBadge'
import ProductDetailsView from './ProductDetailsView'

interface OrderDetailViewProps {
  order: OrderRecord
}

// Dummy order detail data - replace with real API data later
const getOrderDetailData = (order: OrderRecord) => {
  // Parse order date - handle different date formats
  let orderDate: Date
  try {
    // Try parsing as a date string first
    orderDate = new Date(order.orderDate)
    // If invalid, use current date as fallback
    if (isNaN(orderDate.getTime())) {
      orderDate = new Date()
    }
  } catch {
    orderDate = new Date()
  }

  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const formattedTime = orderDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  // Format order ID to match reference (e.g., #ORD-2024-001)
  const formatOrderId = (id: string) => {
    if (id.startsWith('#ORD-')) return id
    // Extract number from ID if it's like "#001" or "001"
    const numMatch = id.match(/\d+/)
    if (numMatch) {
      const num = numMatch[0].padStart(3, '0')
      return `#ORD-2024-${num}`
    }
    return `#ORD-2024-${id}`
  }

  return {
    orderId: formatOrderId(order.id),
    orderDate: formattedDate,
    orderTime: formattedTime,
    customer: {
      name: order.customerName,
      email: `${order.customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: '+1 (555) 123-4567',
      avatar: `https://i.pravatar.cc/100?img=${order.customerName.length % 70}`,
      isVerified: true,
    },
    products: [
      {
        id: 1,
        name: 'Apple AirPods Pro (2nd Generation)',
        description: 'Wireless earbuds with active noise cancellation',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop',
        quantity: 1,
        unitPrice: 249.99,
        totalPrice: 249.99,
      },
      {
        id: 2,
        name: 'iPhone 13 Pro Max Case',
        description: 'Protective case with MagSafe compatibility',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop',
        quantity: 1,
        unitPrice: 49.99,
        totalPrice: 49.99,
      },
    ],
    payment: {
      method: order.paymentMethod,
      cardDetails: 'Visa ending in -1234',
      promotionId: 'FREE-SHIPPING-2024',
      status: order.status,
    },
    pricing: {
      subtotal: 299.98,
      discount: 20.0,
      tax: 15.0,
      shipping: 10.0,
      total: 304.98,
    },
    shipping: {
      address: {
        street: '123 Main Street, Apt 1B',
        city: 'New York, NY 10022',
        country: 'United States',
      },
      method: 'Standard Shipping',
      trackingNumber: '#TRK-123456789',
      estimatedDelivery: '2024-02-18',
    },
    timeline: [
      { status: 'Placed', date: '2024-02-15', time: '8:30 AM', completed: true },
      { status: 'Payment Confirmed', date: '2024-02-15', time: '8:35 AM', completed: true },
      { status: 'Processing', date: '2024-02-15', time: '9:00 AM', completed: true },
      { status: 'Shipped', date: '2024-02-16', time: '10:00 AM', completed: true },
      { status: 'Delivered', date: '2024-02-17', time: '12:00 PM', completed: true },
    ],
  }
}

export default function OrderDetailView({ order }: OrderDetailViewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [viewingProductDetails, setViewingProductDetails] = useState<{
    product: {
      id: number
      name: string
      description: string
      category: string
      image: string
      quantity: number
      unitPrice: number
      totalPrice: number
    }
  } | null>(null)
  const orderData = getOrderDetailData(order)

  useEffect(() => {
    // Trigger fade-in animation
    setIsVisible(true)
  }, [])

  // If viewing product details, show that view instead
  if (viewingProductDetails) {
    return (
      <ProductDetailsView
        order={order}
        product={viewingProductDetails.product}
        onClose={() => setViewingProductDetails(null)}
      />
    )
  }

  const handleDownloadInvoice = () => {
    // eslint-disable-next-line no-console
    console.log('Download invoice for order:', orderData.orderId)
  }

  const handleTrackOrder = () => {
    // eslint-disable-next-line no-console
    console.log('Track order:', orderData.orderId)
  }


  return (
    <div
      className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Unified White Container */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {/* Order Header */}
        <div className="mb-6 border-b border-gray-200 pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Order {orderData.orderId}</h2>
              <p className="text-sm text-gray-500">
                Order Date: {orderData.orderDate} at {orderData.orderTime}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E67E22]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Invoice
              </button>
              <button
                type="button"
                onClick={handleTrackOrder}
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E67E22]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Send Reminder
              </button>
            </div>
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
            <button
              type="button"
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E67E22]"
            >
              View Profile
            </button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={orderData.customer.avatar}
                alt={orderData.customer.name}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-200"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{orderData.customer.name}</h4>
                <div className="mt-1 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{orderData.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{orderData.customer.phone}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Product Details</h3>
          <div className="space-y-4">
            {orderData.products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-start"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <p className="mt-1 text-sm text-gray-600">{product.description}</p>
                  <p className="mt-1 text-xs text-gray-500">Category: {product.category}</p>
                </div>
                <div className="flex flex-col items-end justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setViewingProductDetails({
                        product: {
                          id: product.id,
                          name: product.name,
                          description: product.description,
                          category: product.category,
                          image: product.image,
                          quantity: product.quantity,
                          unitPrice: product.unitPrice,
                          totalPrice: product.totalPrice,
                        },
                      })
                    }
                    className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Details
                  </button>
                  <p className="text-lg font-semibold text-gray-900">
                    ${product.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Information Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Payment Information</h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-700">Payment Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Payment Method: </span>
                  <span className="font-medium text-gray-900">{orderData.payment.method}</span>
                </div>
                <div>
                  <span className="text-gray-600">Card Details: </span>
                  <span className="font-medium text-gray-900">{orderData.payment.cardDetails}</span>
                </div>
                <div>
                  <span className="text-gray-600">PROMOTION ID: </span>
                  <span className="font-medium text-gray-900">{orderData.payment.promotionId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Payment Status: </span>
                  <OrderStatusBadge status={orderData.payment.status} />
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-700">Order Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">
                    ${orderData.pricing.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">
                    -${orderData.pricing.discount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium text-gray-900">
                    ${orderData.pricing.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium text-gray-900">
                    ${orderData.pricing.shipping.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${orderData.pricing.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Shipping Information</h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-700">Delivery Address</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{orderData.shipping.address.street}</p>
                <p>{orderData.shipping.address.city}</p>
                <p>{orderData.shipping.address.country}</p>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-700">Shipping Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Shipping Method: </span>
                  <span className="font-medium text-gray-900">{orderData.shipping.method}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tracking Number: </span>
                  <button
                    type="button"
                    className="cursor-pointer font-medium text-[#4C50A2] hover:text-[#3a3d7a] transition-colors"
                  >
                    {orderData.shipping.trackingNumber}
                  </button>
                </div>
                <div>
                  <span className="text-gray-600">Estimated Delivery: </span>
                  <span className="font-medium text-gray-900">
                    {orderData.shipping.estimatedDelivery}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Timeline</h3>
          <div className="space-y-4">
            {orderData.timeline.map((step, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {step.completed ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-gray-900">{step.status}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {step.date} at {step.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel Order
          </button>
          <button
            type="button"
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E67E22]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Process Refund
          </button>
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E67E22]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Send Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

