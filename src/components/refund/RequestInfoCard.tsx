import type { RefundRequestInfo } from '../../types/refundRequest'

interface RequestInfoCardProps {
  requestInfo: RefundRequestInfo
}

export default function RequestInfoCard({ requestInfo }: RequestInfoCardProps) {
  const getStatusBadge = () => {
    if (requestInfo.status === 'paid') {
      return <span className="inline-flex rounded-lg px-3 py-1 text-xs font-medium bg-green-100 text-green-800">Paid</span>
    }
    if (requestInfo.status === 'rejected') {
      return <span className="inline-flex rounded-lg px-3 py-1 text-xs font-medium bg-red-100 text-red-800">Rejected</span>
    }
    return <span className="inline-flex rounded-lg px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
      {/* Header with Icon */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-5 w-5 rounded border-2 border-green-500 bg-green-50"></div>
        <h2 className="text-lg font-bold text-gray-900">Request Information</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Requested Amount</p>
          <p className="text-2xl font-semibold text-gray-900">${requestInfo.requestedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Request Date</p>
          <p className="text-sm font-semibold text-gray-900 break-words">{requestInfo.requestDate}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
          {getStatusBadge()}
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Reference ID</p>
          <p className="text-sm font-semibold text-gray-900 break-words">{requestInfo.referenceId}</p>
        </div>
      </div>
    </div>
  )
}

