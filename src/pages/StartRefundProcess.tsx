import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { DocumentIcon, CheckIcon } from '../components/icons/Icons'

interface RefundData {
  orderId: string
  customerName: string
  email: string
  productName: string
  quantity: number
  price: number
  status: string
  reasonOptions: string[]
}

export default function StartRefundProcess() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [refundData, setRefundData] = useState<RefundData | null>(null)
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full')
  const [partialAmount, setPartialAmount] = useState('0.00')
  const [refundReason, setRefundReason] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [refundMethod, setRefundMethod] = useState<'original' | 'wallet' | 'bank'>('original')
  const [notifyCustomer, setNotifyCustomer] = useState(false)
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false)
  const reasonDropdownRef = useRef<HTMLDivElement>(null)

  // Mock refund data - TEMPORARY MOCK, NOT API
  useEffect(() => {
    const mockData: RefundData = {
      orderId: orderId || 'ORD-001',
      customerName: 'Jaffar Hussain',
      email: 'jaffar@example.com',
      productName: 'iPhone 15',
      quantity: 1,
      price: 250000,
      status: 'Pending',
      reasonOptions: [
        'Damaged Product',
        'Incorrect Item Delivered',
        'Product Not As Described',
        'Other',
      ],
    }
    setRefundData(mockData)
  }, [orderId])

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

  if (!refundData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading refund details...</p>
      </div>
    )
  }

  // Format order ID to match reference: #ORD-2024-001
  const formatOrderId = (id: string) => {
    const cleanId = id.replace('#', '').replace('ORD-', '')
    if (cleanId.length <= 3) {
      return `#ORD-2024-${cleanId.padStart(3, '0')}`
    }
    return `#ORD-2024-${cleanId}`
  }

  const formattedOrderId = formatOrderId(refundData.orderId)

  // Format order date
  const orderDate = 'Dec 15, 2024'

  // Calculate total amount (convert price from cents/units to dollars)
  const totalAmount = (refundData.price / 1000).toFixed(2)
  const maxRefundable = parseFloat(totalAmount)
  const partialAmountNum = parseFloat(partialAmount) || 0

  const handleCancel = () => {
    navigate(-1)
  }

  const handleStartRefundProcess = () => {
    const refundAmount = refundType === 'full' ? maxRefundable : partialAmountNum

    console.log('Start Refund Process', {
      orderId: refundData.orderId,
      refundType,
      refundAmount,
      refundReason,
      additionalNotes,
      refundMethod,
      notifyCustomer,
    })

    // Add refund process logic here
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-0">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600">
          <span className="text-gray-600">Dashboard • </span>
          <span className="text-gray-900">Orders</span>
        </p>
      </div>

      {/* Order Summary Card */}
      <div className='bg-white rounded-lg p-3 sm:p-4'>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 sm:p-6">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex-shrink-0 mt-1">
            <DocumentIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Order Summary</h2>
            <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 sm:gap-6 md:gap-8">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 break-all sm:break-normal">{formattedOrderId}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Customer Name</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">{refundData.customerName}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Order Date</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900">{orderDate}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Payment Method</p>
                <div className="flex items-center gap-2">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="16" rx="2" fill="#1A1F71" />
                    <path d="M8 8h8v8H8z" fill="#F79E1B" />
                  </svg>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">--4532</p>
                </div>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-200">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs sm:text-sm text-gray-600">Payment Status</p>
                  <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckIcon className="h-3 w-3" />
                    Paid
                  </span>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">${totalAmount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Options and Refund Details - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-3 sm:mt-4">
        {/* Refund Options Card - Left Side */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex-shrink-0 mt-1">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">Refund Options</h2>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-start gap-2 sm:gap-3 cursor-pointer p-2.5 sm:p-3 border border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
              <input
                type="radio"
                name="refundType"
                value="full"
                checked={refundType === 'full'}
                onChange={(e) => setRefundType(e.target.value as 'full' | 'partial')}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 flex-shrink-0"
                />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900">
                  Full Refund
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                  Refund the complete order amount of ${totalAmount}
                </p>
                <p className="text-xs sm:text-sm text-green-600 font-medium mt-1">
                  ${totalAmount}
                </p>
              </div>
            </label>
            <label className="flex items-start gap-2 sm:gap-3 cursor-pointer p-2.5 sm:p-3 border border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
              <input
                type="radio"
                name="refundType"
                value="partial"
                checked={refundType === 'partial'}
                onChange={(e) => setRefundType(e.target.value as 'full' | 'partial')}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900">
                  Partial Refund
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-2">
                  Enter a custom refund amount
                </p>
              <div className="relative">
                <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-gray-500">$</span>
                <input
                  type="text"
                  value={partialAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '')
                    setPartialAmount(value)
                  }}
                  placeholder="0.00"
                  disabled={refundType !== 'partial'}
                  className="w-full pl-5 sm:pl-6 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum refundable: ${totalAmount}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Refund Details Card - Right Side */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
        <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex-shrink-0 mt-1">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">Refund Details</h2>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {/* Reason for Refund */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
              Reason for Refund <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={reasonDropdownRef}>
              <button
                type="button"
                onClick={() => setIsReasonDropdownOpen(!isReasonDropdownOpen)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-left text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer flex items-center justify-between hover:border-gray-400 transition-colors bg-white"
              >
                <span className={`truncate ${refundReason ? 'text-gray-900' : 'text-gray-400'}`}>
                  {refundReason || 'Select a reason'}
                </span>
                <svg
                  className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${isReasonDropdownOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isReasonDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {refundData.reasonOptions.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => {
                        setRefundReason(reason)
                        setIsReasonDropdownOpen(false)
                      }}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        refundReason === reason ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                      >
                      {reason}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
              Additional Notes
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Enter any additional details about the refund."
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-gray-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Refund Method */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">
              Refund Method
            </label>
            <div className="space-y-2 sm:space-y-3">
              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer p-2.5 sm:p-3 border border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                <input
                  type="radio"
                  name="refundMethod"
                  value="original"
                  checked={refundMethod === 'original'}
                  onChange={(e) => setRefundMethod(e.target.value as 'original' | 'wallet' | 'bank')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 flex-shrink-0"
                />
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="16" rx="2" fill="#1A1F71" />
                    <path d="M8 8h8v8H8z" fill="#F79E1B" />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-900 truncate">Original Payment Method (-- 4532)</span>
                </div>
              </label>
              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer p-2.5 sm:p-3 border border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                <input
                  type="radio"
                  name="refundMethod"
                  value="wallet"
                  checked={refundMethod === 'wallet'}
                  onChange={(e) => setRefundMethod(e.target.value as 'original' | 'wallet' | 'bank')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 flex-shrink-0"
                />
                <div className="flex items-center gap-2">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-900">Wallet Credit</span>
                </div>
              </label>
              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer p-2.5 sm:p-3 border border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                <input
                  type="radio"
                  name="refundMethod"
                  value="bank"
                  checked={refundMethod === 'bank'}
                  onChange={(e) => setRefundMethod(e.target.value as 'original' | 'wallet' | 'bank')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 flex-shrink-0"
                  />
                <div className="flex items-center gap-2">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-900">Bank Transfer</span>
                </div>
              </label>
            </div>
          </div>

          {/* Notify Customer Checkbox */}
          <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex-shrink-0 mt-1">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <label htmlFor="notifyCustomer" className="flex items-start gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="notifyCustomer"
                  checked={notifyCustomer}
                  onChange={(e) => setNotifyCustomer(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">
                    Notify customer about refund
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Customer will receive an email notification about the refund status.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col
      rounded-lg mt-3 sm:mt-4 border border-gray-200 p-3 sm:p-4
       sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-green-600">
          <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="break-words">This refund will be processed securely and cannot be undone</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartRefundProcess}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#F7931E] text-white text-xs sm:text-sm font-medium hover:bg-[#E8840D] transition-colors cursor-pointer"
            >
            <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            Confirm Refund
          </button>
        </div>
      </div>
    </div>
            </div>
  )
}

