import { useState, useEffect } from 'react'
import type { OrderRecord } from '../../pages/Orders'
import OrderStatusBadge from './OrderStatusBadge'
import OrderSummaryView from './OrderSummaryView'

interface ProductDetailsViewProps {
  order: OrderRecord
  product: {
    id: number
    name: string
    description: string
    category: string
    image: string
    quantity: number
    unitPrice: number
    totalPrice: number
    sku?: string
  }
  onClose: () => void
}

// Dummy order detail data for product details view
const getProductOrderData = (order: OrderRecord) => {
  const orderDate = new Date(order.orderDate)
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const formattedTime = orderDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  // Format order ID to match reference (e.g., #12345)
  const formatOrderId = (id: string) => {
    if (id.startsWith('#')) {
      // Extract numbers from ID like "#001" or "#ORD-2024-001"
      const numMatch = id.match(/\d+/)
      if (numMatch) {
        return `#${numMatch[0]}`
      }
      return id
    }
    // Extract numbers from ID like "001" or "ORD-2024-001"
    const numMatch = id.match(/\d+/)
    if (numMatch) {
      return `#${numMatch[0]}`
    }
    return `#${id}`
  }

  return {
    orderId: formatOrderId(order.id),
    orderDate: formattedDate,
    orderTime: formattedTime,
    totalAmount: order.amount,
    customer: {
      name: order.customerName,
      phone: '+1 (555) 123-4567',
      email: `${order.customerName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      shippingAddress: '123 Main Street, Apt 4B, New York, NY 10001, United States',
    },
    products: [
      {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        sku: 'WBH-001',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
        quantity: 2,
        unitPrice: 89.99,
        subtotal: 179.98,
      },
      {
        id: 2,
        name: 'Protective Phone Case',
        sku: 'PPC-002',
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop',
        quantity: 1,
        unitPrice: 24.99,
        subtotal: 24.99,
      },
      {
        id: 3,
        name: 'Wireless Charging Pad',
        sku: 'WCP-003',
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop',
        quantity: 1,
        unitPrice: 39.99,
        subtotal: 39.99,
      },
    ],
    shipping: 2.54,
    total: 247.50,
    payment: {
      method: 'Credit Card',
      lastFour: '4532',
      transactionId: 'TXN-7895A23',
      status: 'active' as const,
    },
    delivery: {
      method: 'Express Delivery',
      courier: 'FedEx',
      trackingNumber: '#239RWA1234567890',
      estimatedDelivery: 'Dec 18, 2024',
    },
    timeline: [
      { status: 'Order Placed', date: 'Dec 16, 2024', time: '2:00 PM', completed: true },
      { status: 'Payment Confirmed', date: 'Dec 16, 2024', time: '2:02 PM', completed: true },
      { status: 'Processing', date: 'Dec 16, 2024', time: '9:15 AM', completed: false, isProcessing: true },
      { status: 'Shipped', date: '', time: '', completed: false },
      { status: 'Delivered', date: '', time: '', completed: false },
    ],
  }
}

export default function ProductDetailsView({ order }: ProductDetailsViewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [viewingOrderSummary, setViewingOrderSummary] = useState(false)
  const orderData = getProductOrderData(order)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // If viewing order summary, show that view instead
  if (viewingOrderSummary) {
    return (
      <OrderSummaryView
        order={order}
        onClose={() => setViewingOrderSummary(false)}
        onSave={() => {
          setViewingOrderSummary(false)
          // eslint-disable-next-line no-console
          console.log('Order summary saved')
        }}
      />
    )
  }

  const handleUpdateStatus = () => {
    // eslint-disable-next-line no-console
    console.log('Update status for order:', orderData.orderId)
  }

  const handleIssueRefund = () => {
    // eslint-disable-next-line no-console
    console.log('Issue refund for order:', orderData.orderId)
  }

  const handleDownloadInvoice = () => {
    // eslint-disable-next-line no-console
    console.log('Download invoice for order:', orderData.orderId)
  }

  const handlePrintOrder = () => {
    // eslint-disable-next-line no-console
    console.log('Print order:', orderData.orderId)
  }

  return (
    <div
      className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Unified White Container */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {/* Order Details Heading */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
        </div>

        {/* Order Details Header Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-medium text-blue-600">Order ID</p>
            <p className="mt-1 text-lg font-bold text-blue-700">{orderData.orderId}</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-xs font-medium text-green-600">Order Date</p>
            <p className="mt-1 text-sm font-semibold text-green-700">
              {orderData.orderDate}
            </p>
            <p className="text-sm font-semibold text-green-700">{orderData.orderTime}</p>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <p className="text-xs font-medium text-purple-600">Total Amount</p>
            <p className="mt-1 text-lg font-bold text-purple-700">
              ${orderData.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="mb-6 border-b border-gray-200 pb-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Customer Information</h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Side */}
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="mb-2 font-semibold text-gray-900">Name</h4>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="font-medium text-gray-900">{orderData.customer.name}</span>
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-gray-900">Phone</h4>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="font-medium text-gray-900">{orderData.customer.phone}</span>
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-gray-900">Email</h4>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium text-gray-900">{orderData.customer.email}</span>
                </div>
              </div>
            </div>
            {/* Right Side */}
            <div className="text-sm">
              <h4 className="mb-2 font-semibold text-gray-900">Shipping Address</h4>
              <div className="flex items-start gap-2">
                <svg className="h-4 w-4 mt-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium text-gray-900">{orderData.customer.shippingAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="mb-6 border-b border-gray-200 pb-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Product
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderData.products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{prod.name}</p>
                          <p className="mt-1 text-xs text-gray-500">SKU: {prod.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-900">{prod.quantity}</td>
                    <td className="px-4 py-4 text-right text-gray-900">
                      ${prod.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-gray-900">
                      ${prod.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-3 text-left font-semibold text-gray-900">
                    Shipping:
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    ${orderData.shipping.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-3 text-left text-lg font-bold text-gray-900">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                    ${orderData.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payment Information and Delivery Information */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Payment Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Payment Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Payment method:</span>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span className="font-medium text-gray-900">- {orderData.payment.lastFour}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Transaction ID: </span>
                  <span className="font-medium text-gray-900">{orderData.payment.transactionId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Status: </span>
                  <OrderStatusBadge status={orderData.payment.status} />
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Delivery Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Shipping Method: </span>
                  <span className="font-medium text-gray-900">{orderData.delivery.method}</span>
                </div>
                <div>
                  <span className="text-gray-600">Courier: </span>
                  <span className="font-medium text-gray-900">{orderData.delivery.courier}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tracking Number: </span>
                  <button
                    type="button"
                    className="cursor-pointer font-medium text-[#4C50A2] hover:text-[#3a3d7a] transition-colors"
                  >
                    {orderData.delivery.trackingNumber}
                  </button>
                </div>
                <div>
                  <span className="text-gray-600">Est. Delivery: </span>
                  <span className="font-medium text-gray-900">{orderData.delivery.estimatedDelivery}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline Section */}
        <div className="mb-6 border-b border-gray-200 pb-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Timeline</h3>
          <div className="space-y-4">
            {orderData.timeline.map((step, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {step.completed ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                        <svg
                          className="h-2.5 w-2.5 text-white"
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
                    ) : step.isProcessing ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    ) : (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                        <div className="h-1 w-1 rounded-full bg-gray-300" />
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-gray-900">{step.status}</p>
                </div>
                {step.date ? (
                  <p className="text-sm text-gray-500">
                    {step.date} at {step.time}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">Pending</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setViewingOrderSummary(true)}
            className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Order Summary
          </button>
          <button
            type="button"
            onClick={handleUpdateStatus}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E67E22]"
          >
            Update Status
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleIssueRefund}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Issue Refund
          </button>
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
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
            onClick={handlePrintOrder}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Order
          </button>
        </div>
      </div>
    </div>
  )
}

