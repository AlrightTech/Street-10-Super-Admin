import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { refundsApi, type RefundRequestDetail } from '../../services/refunds.api'

interface RefundDetailModalProps {
  isOpen: boolean
  onClose: () => void
  refundRequestId: string
  onActionComplete?: () => void
}

const EARLY_CANCEL_STATUSES = ['created', 'paid', 'fulfillment_pending']

export default function RefundDetailModal({
  isOpen,
  onClose,
  refundRequestId,
  onActionComplete,
}: RefundDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detail, setDetail] = useState<RefundRequestDetail | null>(null)
  const [restockLines, setRestockLines] = useState<Array<{ orderItemId: string; productId: string; quantityRestocked: number }>>([])
  const [approvedAmount, setApprovedAmount] = useState('')
  const [disputeReason, setDisputeReason] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) {
      setApprovedAmount('')
      setDisputeReason('')
      return
    }
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        setApprovedAmount('')
        setDisputeReason('')
        const data = await refundsApi.getById(refundRequestId)
        setDetail(data)
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
        setError(e?.message || 'Failed to load refund details')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isOpen, refundRequestId])

  const formatAmount = (amountMinor: string | null | undefined) =>
    amountMinor == null ? '—' : `QAR ${(Number(amountMinor) / 100).toFixed(2)}`

  const isEarlyCancelFlow =
    !!detail &&
    detail.order?.status === 'cancelled' &&
    EARLY_CANCEL_STATUSES.includes(detail.order?.previousStatus || '')

  const isAdminEcommerce = detail?.order?.orderType === 'admin-ecommerce'

  const handleIssueRefund = async () => {
    if (!detail?.order?.id) return
    setActionLoading(true)
    setError(null)
    try {
      if (!detail.productReceived && !isEarlyCancelFlow) {
        await refundsApi.markProductReceived(detail.id, restockLines)
      }
      navigate(`/orders/${detail.order.id}/refund?refundId=${detail.id}`)
      onClose()
    } catch (e: any) {
      setError(e?.message || 'Failed to mark items as received')
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!detail) return
    setActionLoading(true)
    setError(null)
    try {
      await refundsApi.updateStatus(detail.id, {
        status: 'rejected',
        disputeReason: disputeReason.trim() || undefined,
      })
      if (onActionComplete) await onActionComplete()
      onClose()
    } catch (e: any) {
      setError(e?.message || 'Failed to reject')
    } finally {
      setActionLoading(false)
    }
  }

  /** Admin ecommerce: record restock, lock approved amount (optional partial), then open issue-refund flow. */
  const handleAdminEcommerceIssueRefund = async () => {
    if (!detail?.order?.id) return
    setActionLoading(true)
    setError(null)
    try {
      if (!detail.productReceived && !isEarlyCancelFlow) {
        await refundsApi.markProductReceived(detail.id, restockLines)
      }
      const payload: Parameters<typeof refundsApi.updateStatus>[1] = {
        status: 'vendor_approved',
      }
      if (approvedAmount.trim() && !isEarlyCancelFlow) {
        const n = parseFloat(approvedAmount)
        if (Number.isFinite(n) && n > 0) {
          payload.amountMinor = Math.round(n * 100)
        }
      }
      await refundsApi.updateStatus(detail.id, payload)
      if (onActionComplete) await onActionComplete()
      navigate(`/orders/${detail.order.id}/refund?refundId=${detail.id}`)
      onClose()
    } catch (e: any) {
      setError(e?.message || 'Failed to proceed with refund')
      setActionLoading(false)
    }
  }

  if (!isOpen) return null

  const items = detail?.order?.items || []

  const showRestockBlock =
    !!detail &&
    (detail.status === 'vendor_approved' || detail.status === 'pending') &&
    !detail.productReceived &&
    !isEarlyCancelFlow &&
    items.length > 0

  const adminEcommerceEarlyPending =
    isAdminEcommerce && isEarlyCancelFlow && detail?.status === 'pending'

  const adminEcommerceScenario2Pending =
    isAdminEcommerce && !isEarlyCancelFlow && detail?.status === 'pending'

  const simpleSuperAdminPending =
    !!detail && detail.status === 'pending' && !isAdminEcommerce

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Refund request</h3>

        {loading ? (
          <p className="text-sm text-gray-600">Loading…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : detail ? (
          <div className="space-y-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Request ID</span>
                <span className="font-mono text-gray-900">{detail.id.slice(0, 8)}…</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {detail.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Requested amount</span>
                <span className="font-medium text-gray-900">{formatAmount(detail.amountMinor)}</span>
              </div>
              {detail.order && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Order total</span>
                  <span className="font-medium text-gray-900">{formatAmount(detail.order.totalMinor)}</span>
                </div>
              )}
            </div>

            <div className="space-y-1 text-sm">
              <div>
                <p className="text-gray-500">Reason</p>
                <p className="mt-0.5 text-gray-900">{detail.reason}</p>
              </div>
              {detail.notes && (
                <div>
                  <p className="text-gray-500">Notes</p>
                  <p className="mt-0.5 text-gray-900 whitespace-pre-wrap">{detail.notes}</p>
                </div>
              )}
            </div>

            {detail.documents && detail.documents.length > 0 && (
              <div className="space-y-2 text-sm">
                <p className="text-gray-500">Evidence</p>
                <div className="flex flex-wrap gap-2">
                  {detail.documents.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded border border-gray-200 px-2 py-1 text-xs text-primary-600 hover:bg-gray-50"
                    >
                      View
                    </a>
                  ))}
                </div>
              </div>
            )}

            {adminEcommerceEarlyPending && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
                <p className="font-medium">Early cancellation — full refund only</p>
                <p className="mt-1 text-blue-600">
                  This order was cancelled before shipping. Stock has been automatically restored. Use Issue refund to
                  continue processing.
                </p>
              </div>
            )}

            {showRestockBlock && (
              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-medium">Items received (restock qty)</label>
                <p className="text-xs text-gray-500">Default 0 — max = remaining per line after prior refunds.</p>
                <div className="space-y-1.5">
                  {items.map((item) => {
                    const line = restockLines.find((l) => l.orderItemId === item.id)
                    const maxRestock = item.maxRestockQty ?? item.quantity
                    return (
                      <div key={item.id} className="flex items-center gap-2">
                        <span className="text-sm flex-1 truncate">{item.product?.title ?? item.productId}</span>
                        <span className="text-xs text-gray-400">ordered {item.quantity} · max {maxRestock}</span>
                        <input
                          type="number"
                          min={0}
                          max={maxRestock}
                          value={line?.quantityRestocked ?? 0}
                          onChange={(e) => {
                            const v = Math.min(Math.max(parseInt(e.target.value, 10) || 0, 0), maxRestock)
                            setRestockLines((prev) =>
                              prev.map((l) => (l.orderItemId === item.id ? { ...l, quantityRestocked: v } : l))
                            )
                          }}
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {adminEcommerceScenario2Pending && (
              <>
                <div className="space-y-2 text-sm">
                  <label className="block text-gray-700 text-sm font-medium">
                    Approved refund amount (QAR) — leave blank for full
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder={detail.amountMinor ? (Number(detail.amountMinor) / 100).toFixed(2) : '0.00'}
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <label className="block text-gray-700 text-sm font-medium">
                    Reason for rejection (optional)
                  </label>
                  <input
                    type="text"
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Enter reason"
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>

              {(adminEcommerceEarlyPending || adminEcommerceScenario2Pending) && (
                <>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleReject}
                    className="w-full sm:w-auto rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleAdminEcommerceIssueRefund}
                    className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing…' : 'Issue refund'}
                  </button>
                </>
              )}

              {simpleSuperAdminPending && (
                <>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleReject}
                    className="w-full sm:w-auto rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleIssueRefund}
                    className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing…' : 'Issue refund'}
                  </button>
                </>
              )}

              {detail.status === 'vendor_approved' && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleIssueRefund}
                  className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Processing…' : 'Issue refund'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Refund request not found.</p>
        )}
      </div>
    </div>
  )
}
