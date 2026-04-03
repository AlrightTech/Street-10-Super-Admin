import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ordersApi, type OrderDetails } from '../services/orders.api'
import { refundsApi, type RefundRequestDetail } from '../services/refunds.api'

const REFUND_METHOD_LABELS: Record<string, string> = {
  wallet: 'Wallet Credit',
  card: 'Original Card (Stripe)',
  bank: 'Bank Transfer (Manual)',
}

export default function OrderRefund() {
  const { orderId } = useParams<{ orderId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [refundRequest, setRefundRequest] = useState<RefundRequestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentProofUrl, setPaymentProofUrl] = useState('')

  const searchParams = new URLSearchParams(location.search)
  const refundId = searchParams.get('refundId') || undefined

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!orderId) { navigate('/orders'); return }
        if (!refundId) { navigate(`/orders/${orderId}/detail`); return }

        const [orderData, refundData] = await Promise.all([
          ordersApi.getById(orderId),
          refundsApi.getById(refundId),
        ])
        setOrder(orderData)
        setRefundRequest(refundData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [orderId, refundId, navigate])

  const handleConfirmRefund = async () => {
    if (!orderId || !refundId) {
      alert('Refund request is missing.')
      return
    }
    setProcessing(true)
    try {
      await refundsApi.updateStatus(refundId, {
        status: 'admin_issue',
        ...(paymentProofUrl && { paymentProofUrl }),
      })
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

  if (!refundRequest || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Refund request or order not found.</div>
      </div>
    )
  }

  const orderNumber = order.orderNumber || orderId?.slice(-8) || 'N/A'
  const customerName = (order.user as any)?.name || order.user?.email?.split('@')[0] || 'Customer'
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A'
  const totalAmount = parseFloat(order.totalMinor) / 100
  const refundAmount = refundRequest.amountMinor ? parseFloat(refundRequest.amountMinor) / 100 : totalAmount
  const paymentMethod = order.paymentMethod || 'card'
  const resolvedRefundMethod = paymentMethod === 'wallet' ? 'wallet' : paymentMethod === 'card' ? 'card' : 'bank'
  const needsPaymentProof = resolvedRefundMethod === 'bank'

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Issue Refund</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600">
          <span className="text-gray-600">Dashboard &bull; </span>
          <span className="text-gray-900">Confirm Refund</span>
        </p>
      </div>

      {/* Order Summary */}
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
            <p className="text-xs sm:text-sm text-blue-700 mb-1">Customer</p>
            <p className="text-sm sm:text-base font-semibold text-blue-900">{customerName}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-blue-700 mb-1">Order Date</p>
            <p className="text-sm sm:text-base font-semibold text-blue-900">{orderDate}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200 flex justify-between items-center">
          <p className="text-sm text-blue-700">Total Amount</p>
          <p className="text-lg font-semibold text-blue-900">{order.currency || 'QAR'} {totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Refund Details */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Refund Details</h2>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Refund Type</dt>
            <dd className="mt-1 font-medium text-gray-900 capitalize">{refundRequest.type} Refund</dd>
          </div>
          <div>
            <dt className="text-gray-500">Refund Amount</dt>
            <dd className="mt-1 font-semibold text-green-700">{order.currency || 'QAR'} {refundAmount.toFixed(2)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Reason</dt>
            <dd className="mt-1 font-medium text-gray-900">{refundRequest.reason}</dd>
          </div>
          {refundRequest.notes && (
            <div>
              <dt className="text-gray-500">Notes</dt>
              <dd className="mt-1 text-gray-900 whitespace-pre-wrap">{refundRequest.notes}</dd>
            </div>
          )}
          <div>
            <dt className="text-gray-500">Original Payment Method</dt>
            <dd className="mt-1 font-medium text-gray-900 capitalize">{paymentMethod}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Refund Will Be Sent Via</dt>
            <dd className="mt-1 font-semibold text-indigo-700">{REFUND_METHOD_LABELS[resolvedRefundMethod] || resolvedRefundMethod}</dd>
          </div>
        </dl>

        {/* Bank details */}
        {(refundRequest.bankName || refundRequest.iban || refundRequest.accountNumber) && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Customer Bank Details</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {refundRequest.bankName && (
                <div><dt className="text-gray-500">Bank Name</dt><dd className="font-medium">{refundRequest.bankName}</dd></div>
              )}
              {refundRequest.iban && (
                <div><dt className="text-gray-500">IBAN</dt><dd className="font-medium font-mono">{refundRequest.iban}</dd></div>
              )}
              {refundRequest.accountNumber && (
                <div><dt className="text-gray-500">Account Number</dt><dd className="font-medium font-mono">{refundRequest.accountNumber}</dd></div>
              )}
              {refundRequest.swiftCode && (
                <div><dt className="text-gray-500">Swift Code</dt><dd className="font-medium font-mono">{refundRequest.swiftCode}</dd></div>
              )}
            </dl>
          </div>
        )}

        {/* Payment proof for bank transfers */}
        {needsPaymentProof && (
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Proof URL (required for bank transfer)
            </label>
            <input
              type="text"
              value={paymentProofUrl}
              onChange={(e) => setPaymentProofUrl(e.target.value)}
              placeholder="https://... (upload proof of bank transfer)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#F7941D] focus:outline-none focus:ring-1 focus:ring-[#F7941D]"
            />
          </div>
        )}
      </div>

      {/* Confirmation */}
      <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3">
        <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-green-800">
          Clicking <strong>Confirm Refund</strong> will issue <strong>{order.currency || 'QAR'} {refundAmount.toFixed(2)}</strong> back
          to the customer via <strong>{REFUND_METHOD_LABELS[resolvedRefundMethod]}</strong>. This action cannot be undone.
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
          type="button"
          onClick={handleConfirmRefund}
          disabled={processing || (needsPaymentProof && !paymentProofUrl)}
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
    </div>
  )
}
