import { useState } from 'react'
import type { OrderRecord } from '../../pages/Orders'
import OrderStatusBadge from './OrderStatusBadge'

interface RefundViewProps {
  order: OrderRecord
  onClose: () => void
  onConfirm: () => void
}

// Format order data for refund view
const getRefundOrderData = (order: OrderRecord) => {
  const orderDate = new Date(order.orderDate)
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  // Format order ID to match reference (e.g., PORD-2024-008)
  const formatOrderId = (id: string) => {
    if (id.startsWith('#')) {
      const numMatch = id.match(/\d+/)
      if (numMatch) {
        return `PORD-2024-${numMatch[0].padStart(3, '0')}`
      }
      return id.replace('#', 'PORD-2024-')
    }
    const numMatch = id.match(/\d+/)
    if (numMatch) {
      return `PORD-2024-${numMatch[0].padStart(3, '0')}`
    }
    return `PORD-2024-${id}`
  }

  // Extract last 4 digits from payment method
  const getLastFour = (paymentMethod: string) => {
    const match = paymentMethod.match(/\d{4}/)
    return match ? match[0] : '4532'
  }

  return {
    orderId: formatOrderId(order.id),
    customerName: order.customerName,
    orderDate: formattedDate,
    paymentMethod: `****-${getLastFour(order.paymentMethod)}`,
    paymentStatus: order.status === 'active' ? 'Paid' : 'Pending',
    totalAmount: order.amount,
  }
}

export default function RefundView({ order, onClose, onConfirm }: RefundViewProps) {
  const orderData = getRefundOrderData(order)
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full')
  const [partialAmount, setPartialAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [refundMethod, setRefundMethod] = useState<'original' | 'store-credit' | 'bank-transfer'>(
    'original'
  )
  const [notifyCustomer, setNotifyCustomer] = useState(false)

  const handleConfirm = () => {
    // eslint-disable-next-line no-console
    console.log('Confirming refund:', {
      refundType,
      partialAmount: refundType === 'partial' ? partialAmount : orderData.totalAmount,
      refundReason,
      additionalNotes,
      refundMethod,
      notifyCustomer,
    })
    onConfirm()
  }

  const partialAmountNum = parseFloat(partialAmount) || 0
  const isValidPartialAmount =
    partialAmountNum > 0 && partialAmountNum <= orderData.totalAmount

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
          
          {/* First Section - Order Details */}
          <div className="grid grid-cols-2 gap-4 border-b border-blue-200 pb-4 sm:grid-cols-4">
            <div>
              <p className="text-xs font-medium text-gray-600">Order ID</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{orderData.orderId}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Customer Name</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{orderData.customerName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Order Date</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{orderData.orderDate}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Payment Method</p>
              <div className="mt-1 flex items-center gap-2">
                <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 8.314l-8.86-5.22a2.5 2.5 0 0 0-2.28 0l-8.86 5.22L12 13.545l11.16-5.23zM12 0L1.605 5.39v12.99L12 24l10.395-5.61V5.39L12 0z" />
                </svg>
                <p className="text-sm font-semibold text-gray-900">{orderData.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Second Section - Payment Details */}
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-gray-600">Payment Status</p>
              <div className="mt-1">
                <OrderStatusBadge status="active" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Total Amount</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                ${orderData.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Refund Options Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Refund Options</h3>
            <div className="space-y-4">
              {/* Full Refund */}
              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="refund-type"
                    value="full"
                    checked={refundType === 'full'}
                    onChange={() => setRefundType('full')}
                    className="mt-1 h-4 w-4 border-gray-300 text-[#4C50A2] focus:ring-[#4C50A2]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Full Refund</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Refund the complete order amount of ${orderData.totalAmount.toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-green-600">
                      ${orderData.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </label>
              </div>

              {/* Partial Refund */}
              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="refund-type"
                    value="partial"
                    checked={refundType === 'partial'}
                    onChange={() => setRefundType('partial')}
                    className="mt-1 h-4 w-4 border-gray-300 text-[#4C50A2] focus:ring-[#4C50A2]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Partial Refund</p>
                    <p className="mt-1 text-sm text-gray-600">Enter a custom refund amount</p>
                    <div className="mt-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max={orderData.totalAmount}
                          value={partialAmount}
                          onChange={(e) => setPartialAmount(e.target.value)}
                          disabled={refundType !== 'partial'}
                          placeholder="0.00"
                          className={`w-full rounded-lg border px-4 py-2 pl-8 text-sm ${
                            refundType === 'partial'
                              ? 'border-gray-300 bg-white text-gray-900 focus:border-[#4C50A2] focus:ring-1 focus:ring-[#4C50A2]'
                              : 'border-gray-200 bg-gray-50 text-gray-400'
                          }`}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Please enter a value from $0.01 to ${orderData.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Refund Details Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Refund Details</h3>
            <div className="space-y-4">
              {/* Reason for refund */}
              <div>
                <label htmlFor="refund-reason" className="mb-2 block text-sm font-medium text-gray-700">
                  Reason for refund <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="refund-reason"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#4C50A2] focus:outline-none focus:ring-1 focus:ring-[#4C50A2]"
                  >
                    <option value="">Select reason</option>
                    <option value="defective">Defective Product</option>
                    <option value="wrong-item">Wrong Item Received</option>
                    <option value="damaged">Damaged During Shipping</option>
                    <option value="not-as-described">Not as Described</option>
                    <option value="customer-request">Customer Request</option>
                    <option value="duplicate">Duplicate Order</option>
                    <option value="other">Other</option>
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

              {/* Additional Notes */}
              <div>
                <label htmlFor="additional-notes" className="mb-2 block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  id="additional-notes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Enter any additional details about the refund"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#4C50A2] focus:outline-none focus:ring-1 focus:ring-[#4C50A2]"
                />
              </div>

              {/* Refund Method */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Refund Method
                </label>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="refund-method"
                      value="original"
                      checked={refundMethod === 'original'}
                      onChange={() => setRefundMethod('original')}
                      className="h-4 w-4 border-gray-300 text-[#4C50A2] focus:ring-[#4C50A2]"
                    />
                    <span className="text-sm text-gray-900">
                      Original Payment Method - {orderData.paymentMethod}
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="refund-method"
                      value="store-credit"
                      checked={refundMethod === 'store-credit'}
                      onChange={() => setRefundMethod('store-credit')}
                      className="h-4 w-4 border-gray-300 text-[#4C50A2] focus:ring-[#4C50A2]"
                    />
                    <span className="text-sm text-gray-900">Store Credit</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="refund-method"
                      value="bank-transfer"
                      checked={refundMethod === 'bank-transfer'}
                      onChange={() => setRefundMethod('bank-transfer')}
                      className="h-4 w-4 border-gray-300 text-[#4C50A2] focus:ring-[#4C50A2]"
                    />
                    <span className="text-sm text-gray-900">Bank Transfer</span>
                  </label>
                </div>
              </div>

              {/* Notify Customer Toggle */}
              <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Notify customer about refund: Customer will receive a confirmation email about
                    the refund once processed.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setNotifyCustomer(!notifyCustomer)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4C50A2] focus:ring-offset-2 ${
                      notifyCustomer ? 'bg-[#6B46C1]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifyCustomer ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {/* Antivirus/Shield icon */}
            <svg className="h-5 w-5 text-[#10B981]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
            <p className="text-sm font-medium text-[#6B7280]">
              This refund will be processed instantly and cannot be undone.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={refundType === 'partial' && !isValidPartialAmount}
              className="cursor-pointer rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E67E22] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm Refund
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

