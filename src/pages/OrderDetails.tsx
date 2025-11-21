import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CustomerInformationCard from '../components/orders/CustomerInformationCard'
import ProductDetailsCard from '../components/orders/ProductDetailsCard'
import PaymentInformationCard from '../components/orders/PaymentInformationCard'
import ShippingInformationCard from '../components/orders/ShippingInformationCard'
import OrderTimelineCard from '../components/orders/OrderTimelineCard'
import { getOrderDetails } from '../data/mockOrderDetails'
import type { OrderDetails as OrderDetailsType } from '../types/orderDetails'
import { ChevronDownIcon } from '../components/icons/Icons'

/**
 * Order Details page component
 */
export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetailsType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true)
      if (orderId) {
        const orderData = getOrderDetails(orderId)
        if (orderData) {
          setOrder(orderData)
        } else {
          // Fallback: redirect to orders list if not found
          navigate('/orders')
        }
      }
      setLoading(false)
    }

    loadOrder()
  }, [orderId, navigate])

  const handleUpdateStatus = () => {
    // Handle update status logic
    console.log('Update status for order:', order?.orderId)
  }

  const handleVendorInformation = () => {
    // Handle vendor information logic
    console.log('View vendor information for order:', order?.orderId)
  }

  const handleDownloadInvoice = () => {
    // Handle download invoice logic
    console.log('Download invoice for order:', order?.orderId)
  }

  const handleCancelOrder = () => {
    // Handle cancel order logic
    console.log('Cancel order:', order?.orderId)
  }

  const handleProcessRefund = () => {
    // Handle process refund logic
    console.log('Process refund for order:', order?.orderId)
  }

  const handleSendInvoice = () => {
    // Handle send invoice logic
    console.log('Send invoice for order:', order?.orderId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Order not found</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mb-4 text-xs sm:text-sm text-gray-600">Dashboard • Orders</p>
      </div>

      {/* Order Details Container */}
      <div className="rounded-lg bg-white p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words">Order #{order.orderId}</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{order.date} at {order.time}</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleVendorInformation}
              className="flex items-center gap-2 sm:gap-3 rounded-lg bg-[#F39C12] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#E67E22] transition-colors whitespace-nowrap"
            >
              <img
                src={order.customer.avatar}
                alt={order.customer.name}
                className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex flex-col items-start">
                <span className="text-xs sm:text-sm font-semibold leading-tight">{order.customer.name}</span>
                <span className="text-xs font-normal leading-tight opacity-90">Vendor Information</span>
              </div>
            </button>
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="flex items-center gap-1 sm:gap-2 rounded-lg bg-[#F39C12] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#E67E22] transition-colors whitespace-nowrap"
            >
              <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="hidden sm:inline">Download Invoice</span>
              <span className="sm:hidden">Invoice</span>
            </button>
          </div>
        </div>

        {/* Customer Information Card */}
        <CustomerInformationCard customer={order.customer} status={order.status} />

        {/* Product Details Card */}
        <ProductDetailsCard products={order.products} />

        {/* Payment Information Card */}
        <PaymentInformationCard payment={order.payment} />

        {/* Shipping Information Card */}
        <ShippingInformationCard shipping={order.shipping} />

        {/* Order Timeline Card */}
        <OrderTimelineCard timeline={order.timeline} />

        {/* Bottom Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancelOrder}
            className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Cancel Order
          </button>
          <button
            type="button"
            onClick={handleUpdateStatus}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Update Status
            <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button
            type="button"
            onClick={handleProcessRefund}
            className="w-full sm:w-auto rounded-lg bg-[#F39C12] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#E67E22] transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">Process Refund/Cancel Order</span>
            <span className="sm:hidden">Refund/Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleSendInvoice}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-[#F39C12] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#E67E22] transition-colors whitespace-nowrap"
          >
            <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Send Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

