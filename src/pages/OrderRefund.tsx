import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ordersApi, type OrderDetails } from '../services/orders.api'

export default function OrderRefund() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full')
  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    notes: '',
    method: 'original' as 'original' | 'wallet' | 'bank',
    notifyCustomer: true,
  })

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) {
          navigate('/orders')
          return
        }

        const orderData = await ordersApi.getById(orderId)
        setOrder(orderData)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId) return

    setProcessing(true)
    try {
      // Calculate amount in minor units (cents)
      const amountMinor = refundType === 'full' 
        ? undefined 
        : Math.round(parseFloat(formData.amount) * 100)

      // Call refund API
      await ordersApi.processRefund(orderId, {
        type: refundType,
        amountMinor,
        reason: formData.reason,
        notes: formData.notes,
        method: formData.method,
        notifyCustomer: formData.notifyCustomer,
      })

      // Navigate back to order detail
      navigate(`/orders/${orderId}/detail`)
    } catch (error: any) {
      console.error('Error processing refund:', error)
      alert(error?.response?.data?.message || 'Failed to process refund. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const orderNumber = order?.orderNumber || orderId?.slice(-8) || 'N/A'
  const customerName = (order?.user as any)?.name || order?.user?.email?.split('@')[0] || 'Customer'
  const orderDate = order?.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A'
  const totalAmount = order ? parseFloat(order.totalMinor) / 100 : 0
  const maxRefundable = totalAmount

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600">
          <span className="text-gray-600">Dashboard • </span>
          <span className="text-gray-900">Refund Order</span>
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-base sm:text-lg font-semibold text-blue-900">Order Summary</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs sm:text-sm text-blue-700 mb-1">Order ID</p>
            <p className="text-sm sm:text-base font-semibold text-blue-900">#{orderNumber}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-blue-700 mb-1">Customer Name</p>
            <p className="text-sm sm:text-base font-semibold text-blue-900">{customerName}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-blue-700 mb-1">Order Date</p>
            <p className="text-sm sm:text-base font-semibold text-blue-900">{orderDate}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-blue-700">Total Amount</p>
            <p className="text-lg font-semibold text-blue-900">{order?.currency || 'QAR'} {totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Refund Options */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Refund Options</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 border-2 border-green-200 rounded-lg cursor-pointer hover:bg-green-50">
              <input
                type="radio"
                name="refundType"
                value="full"
                checked={refundType === 'full'}
                onChange={() => setRefundType('full')}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Full Refund</p>
                <p className="text-sm text-gray-600 mt-1">
                  Refund the complete order amount of{' '}
                  <span className="font-semibold text-green-600">
                    {order?.currency || 'QAR'} {totalAmount.toFixed(2)}
                  </span>
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="refundType"
                value="partial"
                checked={refundType === 'partial'}
                onChange={() => setRefundType('partial')}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Partial Refund</p>
                <p className="text-sm text-gray-600 mt-1">Enter a custom refund amount</p>
                {refundType === 'partial' && (
                  <div className="mt-3">
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      min="0"
                      max={maxRefundable}
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required={refundType === 'partial'}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum refundable: {order?.currency || 'QAR'} {maxRefundable.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Refund Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Refund Details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Reason for Refund <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Select a reason</option>
                <option value="customer_request">Customer Request</option>
                <option value="defective_product">Defective Product</option>
                <option value="wrong_item">Wrong Item Shipped</option>
                <option value="damaged_during_shipping">Damaged During Shipping</option>
                <option value="not_as_described">Not as Described</option>
                <option value="duplicate_order">Duplicate Order</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter any additional details about the refund..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Refund Method <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="refundMethod"
                    value="original"
                    checked={formData.method === 'original'}
                    onChange={() => setFormData({ ...formData, method: 'original' })}
                  />
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <rect width="24" height="16" rx="2" fill="#1A1F71"/>
                      <path d="M8 8h8v8H8z" fill="#F79E1B"/>
                    </svg>
                    <span className="text-sm">Original Payment Method (... 4532)</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="refundMethod"
                    value="wallet"
                    checked={formData.method === 'wallet'}
                    onChange={() => setFormData({ ...formData, method: 'wallet' })}
                  />
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm">Wallet Credit</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="refundMethod"
                    value="bank"
                    checked={formData.method === 'bank'}
                    onChange={() => setFormData({ ...formData, method: 'bank' })}
                  />
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-sm">Bank Transfer</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={formData.notifyCustomer}
                  onChange={(e) => setFormData({ ...formData, notifyCustomer: e.target.checked })}
                  className="mt-1"
                />
                <p className="text-sm text-blue-900">
                  Notify customer about refund
                </p>
              </div>
              <p className="text-xs text-blue-700 mt-2 ml-6">
                Customer will receive an email notification about the refund status
              </p>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3">
          <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-800">
            This refund will be processed securely and cannot be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate(`/orders/${orderId}/detail`)}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm Refund
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
