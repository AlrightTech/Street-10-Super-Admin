import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { refundsApi, type RefundRequestSummary } from '../services/refunds.api'

function statusBadge(status: string) {
  const s = status.toLowerCase()
  if (s === 'admin_approved') return <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Approved</span>
  if (s === 'rejected') return <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Rejected</span>
  if (s === 'pending' || s === 'processing') return <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
  if (s === 'vendor_approved') return <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">Vendor approved</span>
  if (s === 'disputed') return <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">Disputed</span>
  return <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
}

export default function RefundRequestsList() {
  const navigate = useNavigate()
  const [list, setList] = useState<RefundRequestSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true)
        const data = await refundsApi.getList()
        setList(data)
      } catch (e) {
        console.error(e)
        setList([])
      } finally {
        setLoading(false)
      }
    }
    fetchList()
  }, [])

  const formatAmount = (amountMinor: string | null) =>
    amountMinor == null ? '—' : `QAR ${(Number(amountMinor) / 100).toFixed(2)}`
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString()

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Refund Requests</h1>
      </div>
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Request ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">No refund requests</td>
                </tr>
              ) : (
                list.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{r.id.slice(0, 8)}…</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{r.order?.orderNumber ?? r.orderId}</td>
                    <td className="py-3 px-4 text-sm font-medium">{formatAmount(r.amountMinor)}</td>
                    <td className="py-3 px-4">{statusBadge(r.status)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(r.createdAt)}</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/refund-requests/${r.id}`)}
                        className="text-[#F7941D] hover:underline text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
