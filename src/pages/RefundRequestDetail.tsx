import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { refundsApi, type RefundRequestDetail } from '../services/refunds.api'

export default function RefundRequestDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [request, setRequest] = useState<RefundRequestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [restockLines, setRestockLines] = useState<Array<{ orderItemId: string; productId: string; quantityRestocked: number }>>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [paymentProofUrl, setPaymentProofUrl] = useState('')

  useEffect(() => {
    if (!id) return
    const fetchRequest = async () => {
      try {
        setLoading(true)
        const data = await refundsApi.getById(id)
        setRequest(data)
        if (data.order?.items) {
          setRestockLines(
            data.order.items.map((item) => ({
              orderItemId: item.id,
              productId: item.productId,
              quantityRestocked: 0,
            }))
          )
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    fetchRequest()
  }, [id])

  const refresh = async () => {
    if (!id) return
    const data = await refundsApi.getById(id)
    setRequest(data)
  }

  const handleMarkReceived = async () => {
    if (!id) return
    setActionLoading(true)
    try {
      await refundsApi.markProductReceived(id, restockLines)
      setSuccess('Product received and restock saved.')
      await refresh()
    } catch (e: any) {
      setError(e?.message || 'Failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleIssueRefund = async () => {
    if (!id) return
    setActionLoading(true)
    setError(null)
    try {
      // Mark items received first if not already (skip for early cancel)
      if (!request?.productReceived && request?.order?.status !== 'cancelled') {
        await refundsApi.markProductReceived(id, restockLines)
      }
      const data: any = { status: 'admin_issue' }
      if (paymentProofUrl) {
        data.paymentProofUrl = paymentProofUrl
      }
      await refundsApi.updateStatus(id, data)
      setSuccess('Refund issued.')
      await refresh()
    } catch (e: any) {
      setError(e?.message || 'Failed to issue refund')
    } finally {
      setActionLoading(false)
    }
  }

  const formatAmount = (amountMinor: string | null) =>
    amountMinor == null ? '—' : `QAR ${(Number(amountMinor) / 100).toFixed(2)}`
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString()

  if (loading || !request) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
        {loading ? 'Loading...' : 'Refund request not found.'}
      </div>
    )
  }

  const canMarkReceived = !request.productReceived && request.order?.items?.length && request.order?.status !== 'cancelled'

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate('/refund-requests')}
          className="text-[#F7941D] hover:underline text-sm font-medium mb-4"
        >
          ← Back to list
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Request details</h2>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-gray-500">ID</dt><dd className="font-medium">{request.id}</dd></div>
            <div><dt className="text-gray-500">Status</dt><dd><span className="px-2 py-1 rounded bg-gray-100">{request.status}</span></dd></div>
            <div><dt className="text-gray-500">Order</dt><dd><button type="button" onClick={() => navigate(`/orders/${request.orderId}`)} className="text-[#F7941D] hover:underline">{request.order?.orderNumber ?? request.orderId}</button></dd></div>
            <div><dt className="text-gray-500">Amount</dt><dd className="font-medium">{formatAmount(request.amountMinor)}</dd></div>
            <div><dt className="text-gray-500">Reason</dt><dd>{request.reason}</dd></div>
            <div><dt className="text-gray-500">Product received</dt><dd>{request.productReceived ? 'Yes' : 'No'}</dd></div>
          </dl>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
          <ul className="space-y-2 text-sm">
            {(request.auditLogs ?? []).map((log) => (
              <li key={log.id} className="flex gap-2">
                <span className="text-gray-500 shrink-0">{formatDate(log.createdAt)}</span>
                <span>{log.action}</span>
              </li>
            ))}
            {(!request.auditLogs || request.auditLogs.length === 0) && <li className="text-gray-500">No activity yet.</li>}
          </ul>
        </div>
      </div>

      {/* Bank Details */}
      {(request.bankName || request.iban || request.accountNumber) && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Bank Details</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {request.bankName && (
              <div><dt className="text-gray-500">Bank Name</dt><dd className="font-medium">{request.bankName}</dd></div>
            )}
            {request.iban && (
              <div><dt className="text-gray-500">IBAN</dt><dd className="font-medium font-mono">{request.iban}</dd></div>
            )}
            {request.accountNumber && (
              <div><dt className="text-gray-500">Account Number</dt><dd className="font-medium font-mono">{request.accountNumber}</dd></div>
            )}
            {request.swiftCode && (
              <div><dt className="text-gray-500">SWIFT Code</dt><dd className="font-medium font-mono">{request.swiftCode}</dd></div>
            )}
          </dl>
        </div>
      )}

      {/* Payment Proof */}
      {request.paymentProofUrl && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Proof</h2>
          <a href={request.paymentProofUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
            <img
              src={request.paymentProofUrl}
              alt="Payment proof"
              className="max-w-xs rounded-lg border border-gray-200 hover:opacity-90 transition"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <p className="text-sm text-[#F7941D] hover:underline mt-2">View payment proof</p>
          </a>
        </div>
      )}

      {(request.status === 'vendor_approved' || request.status === 'pending') && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Issue refund</h2>

          {/* Inline restock fields (only if not yet received and not early cancel) */}
          {canMarkReceived && request.order?.items && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Items received (restock qty)</label>
              <p className="text-xs text-gray-500 mb-2">Default 0 — max is remaining units for this line after prior refunds.</p>
              {request.order.items.map((item) => {
                const line = restockLines.find((l) => l.orderItemId === item.id)
                if (!line) return null
                const maxRestock = item.maxRestockQty ?? item.quantity
                return (
                  <div key={item.id} className="flex items-center gap-4">
                    <span className="text-sm font-medium flex-1">{item.product?.title ?? item.productId}</span>
                    <span className="text-sm text-gray-500">Ordered: {item.quantity} · max {maxRestock}</span>
                    <input
                      type="number"
                      min={0}
                      max={maxRestock}
                      value={line.quantityRestocked}
                      onChange={(e) => {
                        const v = Math.min(Math.max(parseInt(e.target.value, 10) || 0, 0), maxRestock)
                        setRestockLines((prev) => prev.map((l) => (l.orderItemId === item.id ? { ...l, quantityRestocked: v } : l)))
                      }}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </div>
                )
              })}
              <button
                type="button"
                onClick={handleMarkReceived}
                disabled={actionLoading}
                className="px-4 py-2 bg-[#F7941D] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {actionLoading ? 'Saving…' : 'Mark product received'}
              </button>
            </div>
          )}

          {request.order?.paymentMethod !== 'card' && request.order?.paymentMethod !== 'wallet' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment proof URL (for bank transfer)</label>
              <input
                type="text"
                value={paymentProofUrl}
                onChange={(e) => setPaymentProofUrl(e.target.value)}
                placeholder="https://... (upload proof of bank transfer)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#F7941D] focus:outline-none focus:ring-1 focus:ring-[#F7941D]"
              />
            </div>
          )}
          <button
            type="button"
            onClick={handleIssueRefund}
            disabled={actionLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {actionLoading ? 'Processing…' : 'Issue refund'}
          </button>
        </div>
      )}
    </div>
  )
}
