import { useState } from 'react'
import type { OrderRecord } from '../../pages/Orders'
import RefundView from './RefundView'
import InvoiceView from './InvoiceView'

interface OrderSummaryViewProps {
  order: OrderRecord
  onClose: () => void
  onSave: () => void
}

// Format order data for summary view
const getOrderSummaryData = (order: OrderRecord) => {
  const orderDate = new Date(order.orderDate)
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Format order ID to match reference (e.g., #ORD-2024-00234)
  const formatOrderId = (id: string) => {
    if (id.startsWith('#')) {
      const numMatch = id.match(/\d+/)
      if (numMatch) {
        return `#ORD-2024-${numMatch[0].padStart(5, '0')}`
      }
      return id
    }
    const numMatch = id.match(/\d+/)
    if (numMatch) {
      return `#ORD-2024-${numMatch[0].padStart(5, '0')}`
    }
    return `#ORD-2024-${id}`
  }

  return {
    orderId: formatOrderId(order.id),
    customerName: order.customerName,
    orderDate: formattedDate,
  }
}

export default function OrderSummaryView({ order, onClose, onSave }: OrderSummaryViewProps) {
  const orderData = getOrderSummaryData(order)
  const [deliveryCompany, setDeliveryCompany] = useState('')
  const [orderNo, setOrderNo] = useState('')
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('')
  const [shippingNotes, setShippingNotes] = useState('')
  const [autoTracking, setAutoTracking] = useState(true)
  const [viewingRefund, setViewingRefund] = useState(false)
  const [viewingInvoice, setViewingInvoice] = useState(false)

  // If viewing invoice, show that view instead
  if (viewingInvoice) {
    return <InvoiceView order={order} />
  }

  // If viewing refund, show that view instead
  if (viewingRefund) {
    return (
      <RefundView
        order={order}
        onClose={() => setViewingRefund(false)}
        onConfirm={() => {
          setViewingRefund(false)
          // eslint-disable-next-line no-console
          console.log('Refund confirmed')
        }}
      />
    )
  }

  const handleSave = () => {
    // eslint-disable-next-line no-console
    console.log('Saving order summary:', {
      deliveryCompany,
      orderNo,
      estimatedDeliveryDate,
      shippingNotes,
      autoTracking,
    })
    onSave()
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Unified White Container */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {/* Order Summary Section */}
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          {/* Order Summary Heading */}
          <div className="mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-blue-900">Order Summary</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-blue-600">Order ID</p>
              <p className="mt-1 text-sm font-semibold text-blue-900">{orderData.orderId}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600">Customer Name</p>
              <p className="mt-1 text-sm font-semibold text-blue-900">{orderData.customerName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600">Order Date</p>
              <p className="mt-1 text-sm font-semibold text-blue-900">{orderData.orderDate}</p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Select Delivery Company */}
          <div>
            <label htmlFor="delivery-company" className="mb-2 block text-sm font-medium text-gray-700">
              Select Delivery Company
            </label>
            <div className="relative">
              <select
                id="delivery-company"
                value={deliveryCompany}
                onChange={(e) => setDeliveryCompany(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#4C50A2] focus:outline-none focus:ring-1 focus:ring-[#4C50A2]"
              >
                <option value="">e.g. DHL, Leopard</option>
                <option value="dhl">DHL</option>
                <option value="leopard">Leopard</option>
                <option value="fedex">FedEx</option>
                <option value="ups">UPS</option>
                <option value="usps">USPS</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Enter Order No */}
          <div>
            <label htmlFor="order-no" className="mb-2 block text-sm font-medium text-gray-700">
              Enter Order No
            </label>
            <input
              type="text"
              id="order-no"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              placeholder="Enter order number"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#4C50A2] focus:outline-none focus:ring-1 focus:ring-[#4C50A2]"
            />
          </div>

          {/* Estimated Delivery Date */}
          <div>
            <label htmlFor="estimated-delivery" className="mb-2 block text-sm font-medium text-gray-700">
              Estimated Delivery Date
            </label>
            <input
              type="date"
              id="estimated-delivery"
              value={estimatedDeliveryDate}
              onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
              placeholder="mm/dd/yyyy"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#4C50A2] focus:outline-none focus:ring-1 focus:ring-[#4C50A2]"
            />
          </div>

          {/* Shipping Notes */}
          <div>
            <label htmlFor="shipping-notes" className="mb-2 block text-sm font-medium text-gray-700">
              Shipping Notes <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              id="shipping-notes"
              value={shippingNotes}
              onChange={(e) => setShippingNotes(e.target.value)}
              placeholder="Add any special delivery instructions or notes for the customer"
              rows={4}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#4C50A2] focus:outline-none focus:ring-1 focus:ring-[#4C50A2]"
            />
          </div>

          {/* Automated Tracking Toggle */}
          <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex-shrink-0 pt-0.5">
              <svg className="h-5 w-5 text-[#6B46C1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Send tracking details to customer automatically After Patch. Customer will receive an
                email and SMS with tracking information.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={() => setAutoTracking(!autoTracking)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4C50A2] focus:ring-offset-2 ${
                  autoTracking ? 'bg-[#6B46C1]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoTracking ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setViewingRefund(true)}
              className="cursor-pointer rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Refund
            </button>
            <button
              type="button"
              onClick={() => setViewingInvoice(true)}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Invoice
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E67E22]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Save & Notify Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

