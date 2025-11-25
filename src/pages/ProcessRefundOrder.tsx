import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { mockOrders } from '../data/mockOrders'
import type { OrderRecord } from './Orders'

export default function ProcessRefundOrder() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderRecord | null>(null)
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full')
  const [partialAmount, setPartialAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [refundTo, setRefundTo] = useState<'original' | 'wallet' | 'bank'>('original')
  const [notifyCustomer, setNotifyCustomer] = useState(true)
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false)
  const reasonDropdownRef = useRef<HTMLDivElement>(null)

  const refundReasons = [
    { value: 'defective', label: 'Defective Product' },
    { value: 'wrong-item', label: 'Wrong Item Received' },
    { value: 'damaged', label: 'Damaged During Shipping' },
    { value: 'not-as-described', label: 'Not as Described' },
    { value: 'customer-request', label: 'Customer Request' },
    { value: 'other', label: 'Other' },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reasonDropdownRef.current && !reasonDropdownRef.current.contains(event.target as Node)) {
        setIsReasonDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Find the order by ID
    const foundOrder = mockOrders.find(
      (o) => o.id.replace('#', '') === orderId || o.id === orderId || o.id === `#${orderId}`
    )

    if (foundOrder) {
      setOrder(foundOrder)
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
  const formattedOrderId = order.id.replace('#', '').replace('ORD-', 'ORD-2024-')
  const orderDate = order.orderDate || 'Dec 15, 2024'
  const customerName = order.customerName || 'Sarah Johnson'
  const totalAmount = order.amount || 149.99
  const paymentStatus = order.status === 'completed' ? 'Paid' : order.status

  const handleCancel = () => {
    navigate(-1)
  }

  const handleConfirmRefund = () => {
    const refundAmount = refundType === 'full' ? totalAmount : parseFloat(partialAmount) || 0
    
    if (refundType === 'partial' && (refundAmount <= 0 || refundAmount > totalAmount)) {
      alert('Please enter a valid refund amount')
      return
    }

    if (!refundReason) {
      alert('Please select a reason for refund')
      return
    }

    console.log('Confirm Refund', {
      refundType,
      refundAmount,
      refundReason,
      additionalNotes,
      refundTo,
      notifyCustomer,
    })
    // Add refund processing logic here
    navigate(-1)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard - Orders</p>
      </div>

      {/* Order Summary Card */}
      <div className="rounded-lg border border-gray-200 bg-[#F5F8FF] p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-3 w-3 bg-[#4C50A2] rounded"></div>
          <h2 className="text-base font-semibold text-[#4C50A2]">Order Summary</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-600 mb-1.5">Order ID</p>
            <p className="text-sm font-bold text-gray-900">{formattedOrderId}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1.5">Customer Name</p>
            <p className="text-sm font-bold text-gray-900">{customerName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1.5">Order Date</p>
            <p className="text-sm font-bold text-gray-900">{orderDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1.5">Payment Method</p>
            <div className="flex items-center gap-2">
              <img src="https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo.png" alt="Visa" className="h-4" />
              <p className="text-sm font-bold text-gray-900">... 4532</p>
            </div>
          </div>
        </div>
        <div className="border-t mt-4 pt-4" style={{ borderColor: 'rgba(29, 78, 216, 0.3)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="sm:col-start-2">
              <div className="flex items-center justify-between w-full">
                <p className="text-xs text-gray-600">Payment Status</p>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {paymentStatus}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between w-full">
                <p className="text-xs text-gray-600">Total Amount</p>
                <p className="text-sm font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Options and Refund Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Refund Options */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-base font-semibold text-gray-900">Refund Options</h2>
          </div>
          
          <div className="space-y-4">
            {/* Full Refund */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  id="fullRefund"
                  name="refundType"
                  checked={refundType === 'full'}
                  onChange={() => setRefundType('full')}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
                <div className="flex-1">
                  <label htmlFor="fullRefund" className="block text-sm font-bold text-gray-900 mb-1 cursor-pointer">
                    Full Refund
                  </label>
                  <p className="text-sm text-gray-600">
                    Refund the complete order amount of ${totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold text-green-600 mt-1">${totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Partial Refund */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  id="partialRefund"
                  name="refundType"
                  checked={refundType === 'partial'}
                  onChange={() => setRefundType('partial')}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
                <div className="flex-1">
                  <label htmlFor="partialRefund" className="block text-sm font-bold text-gray-900 mb-2 cursor-pointer">
                    Partial Refund
                  </label>
                  <p className="text-sm text-gray-600 mb-2">Enter a custom refund amount</p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm">$</span>
                    <input
                      type="number"
                      value={partialAmount}
                      onChange={(e) => setPartialAmount(e.target.value)}
                      placeholder="0.00"
                      disabled={refundType !== 'partial'}
                      min="0"
                      max={totalAmount}
                      step="0.01"
                      className="w-full pl-6 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C50A2] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">Maximum refundable: ${totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Refund Details */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-base font-semibold text-gray-900">Refund Details</h2>
          </div>

          <div className="space-y-5">
            {/* Reason for Refund */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Reason for Refund <span className="text-red-500">*</span>
              </label>
              <div className="relative" ref={reasonDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsReasonDropdownOpen(!isReasonDropdownOpen)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#4C50A2] focus:border-transparent cursor-pointer flex items-center justify-between hover:border-gray-400 transition-colors"
                >
                  <span className={refundReason ? 'text-gray-900' : 'text-gray-400'}>
                    {refundReason ? refundReasons.find(r => r.value === refundReason)?.label : 'Select a reason'}
                  </span>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform ${isReasonDropdownOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isReasonDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {refundReasons.map((reason) => (
                      <button
                        key={reason.value}
                        type="button"
                        onClick={() => {
                          setRefundReason(reason.value)
                          setIsReasonDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                          refundReason === reason.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                        }`}
                      >
                        {reason.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-900 mb-2">
                Additional Notes
              </label>
              <textarea
                id="additionalNotes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Enter any additional details about the refund..."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C50A2] focus:border-transparent resize-none"
              />
            </div>

            {/* Refund Method */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Refund Method</label>
              <div className="space-y-3">
                {/* Original Payment Method */}
                <div className={`rounded-lg border p-3 ${refundTo === 'original' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="originalPayment"
                      name="refundTo"
                      checked={refundTo === 'original'}
                      onChange={() => setRefundTo('original')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-600 cursor-pointer"
                    />
                    <label htmlFor="originalPayment" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="h-6 w-10 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">VISA</span>
                      </div>
                      <span className="text-sm text-gray-900">Original Payment Method (-- 4532)</span>
                    </label>
                  </div>
                </div>

                {/* Wallet Credit */}
                <div className={`rounded-lg border p-3 ${refundTo === 'wallet' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="walletCredit"
                      name="refundTo"
                      checked={refundTo === 'wallet'}
                      onChange={() => setRefundTo('wallet')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-600 cursor-pointer"
                    />
                    <label htmlFor="walletCredit" className="flex items-center gap-2 cursor-pointer flex-1">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-sm text-gray-900">Wallet Credit</span>
                    </label>
                  </div>
                </div>

                {/* Bank Transfer */}
                <div className={`rounded-lg border p-3 ${refundTo === 'bank' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="bankTransfer"
                      name="refundTo"
                      checked={refundTo === 'bank'}
                      onChange={() => setRefundTo('bank')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-600 cursor-pointer"
                    />
                    <label htmlFor="bankTransfer" className="flex items-center gap-2 cursor-pointer flex-1">
                      <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                      <span className="text-sm text-gray-900">Bank Transfer</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Notify customer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="notifyCustomer"
                  checked={notifyCustomer}
                  onChange={(e) => setNotifyCustomer(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-600 rounded cursor-pointer"
                />
                <div>
                  <label htmlFor="notifyCustomer" className="block text-sm font-medium text-gray-900 cursor-pointer">
                    Notify customer about refund
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Customer will receive an email notification about the refund status.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Security Message and Action Buttons */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-sm text-gray-500">
            This refund will be processed securely and cannot be undone.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmRefund}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#F7931E] text-white text-sm font-medium hover:bg-[#E8840D] transition-colors cursor-pointer shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirm Refund
          </button>
        </div>
      </div>
    </div>
  )
}

