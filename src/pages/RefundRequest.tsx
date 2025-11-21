import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getUserDetails } from '../data/mockUserDetails'
import { getRefundRequest, updateRefundStatus, updateRefundNotes, updateTransactionSlip } from '../data/mockRefundRequest'
import type { UserDetails } from '../types/userDetails'
import type { RefundRequest } from '../types/refundRequest'
import UserDetailsCard from '../components/refund/UserDetailsCard'
import BankDetailsCard from '../components/refund/BankDetailsCard'
import RequestInfoCard from '../components/refund/RequestInfoCard'
import AdminActionsCard from '../components/refund/AdminActionsCard'

/**
 * Refund Request page component
 */
export default function RefundRequest() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [refundRequest, setRefundRequest] = useState<RefundRequest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      if (id) {
        const userId = Number(id)
        const userData = getUserDetails(userId)
        const refund = getRefundRequest(userId)
        
        if (userData && refund) {
          setUser(userData)
          setRefundRequest(refund)
        }
      }
      setLoading(false)
    }

    loadData()
  }, [id])

  const handleMarkAsPaid = () => {
    if (!refundRequest || !id) return
    
    updateRefundStatus(Number(id), 'paid')
    setRefundRequest({
      ...refundRequest,
      requestInfo: {
        ...refundRequest.requestInfo,
        status: 'paid',
      },
    })
  }

  const handleReject = () => {
    if (!refundRequest || !id) return
    
    updateRefundStatus(Number(id), 'rejected')
    setRefundRequest({
      ...refundRequest,
      requestInfo: {
        ...refundRequest.requestInfo,
        status: 'rejected',
      },
    })
  }

  const handleSaveNotes = (notes: string) => {
    if (!refundRequest || !id) return
    
    updateRefundNotes(Number(id), notes)
    setRefundRequest({
      ...refundRequest,
      adminNotes: notes,
    })
  }

  const handleFileUpload = (file: File) => {
    if (!refundRequest || !id) return
    
    // In a real app, upload file and get URL
    const fileUrl = URL.createObjectURL(file)
    updateTransactionSlip(Number(id), fileUrl)
    setRefundRequest({
      ...refundRequest,
      transactionSlipUrl: fileUrl,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading refund request...</p>
      </div>
    )
  }

  if (!user || !refundRequest) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Refund request not found</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-hidden space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-600">Dashboard • Users</p>
      </div>

      {/* User Details Card */}
      <UserDetailsCard user={user} />

      {/* Withdrawal Request Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg font-bold text-gray-900">Withdrawal Request</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Details Card */}
          <BankDetailsCard bankDetails={refundRequest.bankDetails} />
          
          {/* Request Information Card */}
          <RequestInfoCard requestInfo={refundRequest.requestInfo} />
        </div>
      </div>

      {/* Admin Actions Card */}
      <AdminActionsCard
        refundRequest={refundRequest}
        onMarkAsPaid={handleMarkAsPaid}
        onReject={handleReject}
        onSaveNotes={handleSaveNotes}
        onFileUpload={handleFileUpload}
      />
    </div>
  )
}

