import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getUserDetails } from '../data/mockUserDetails'
import { getKYCData, updateKYCStatus, updateKYCNotes } from '../data/mockKYC'
import type { UserDetails } from '../types/userDetails'
import type { KYCData } from '../types/kyc'
import UserProfileCard from '../components/kyc/UserProfileCard'
import KYCInformationCard from '../components/kyc/KYCInformationCard'
import BankInformationCard from '../components/kyc/BankInformationCard'
import VerificationStatusCard from '../components/kyc/VerificationStatusCard'
import ActivityHistoryCard from '../components/kyc/ActivityHistoryCard'

/**
 * View KYC page component
 */
export default function ViewKYC() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [kycData, setKycData] = useState<KYCData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      if (id) {
        const userId = Number(id)
        const userData = getUserDetails(userId)
        const kyc = getKYCData(userId)
        
        if (userData && kyc) {
          setUser(userData)
          setKycData(kyc)
        }
      }
      setLoading(false)
    }

    loadData()
  }, [id])

  const handleApprove = () => {
    if (!kycData || !id) return
    
    updateKYCStatus(Number(id), 'approved')
    setKycData({
      ...kycData,
      status: 'approved',
      activityHistory: [
        ...kycData.activityHistory.filter(item => !item.isCurrent),
        {
          id: String(Date.now()),
          event: 'Status: Approved',
          description: 'KYC has been approved by admin',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          icon: 'check',
          isCurrent: true,
        },
      ],
    })
  }

  const handleReject = () => {
    if (!kycData || !id) return
    
    updateKYCStatus(Number(id), 'rejected')
    setKycData({
      ...kycData,
      status: 'rejected',
      activityHistory: [
        ...kycData.activityHistory.filter(item => !item.isCurrent),
        {
          id: String(Date.now()),
          event: 'Status: Rejected',
          description: 'KYC has been rejected by admin',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          icon: 'x',
          isCurrent: true,
        },
      ],
    })
  }

  const handleSaveNote = (notes: string) => {
    if (!kycData || !id) return
    
    updateKYCNotes(Number(id), notes)
    setKycData({
      ...kycData,
      adminNotes: notes,
      activityHistory: [
        ...kycData.activityHistory.filter(item => item.event !== 'Admin Note Added' || !item.isCurrent),
        {
          id: String(Date.now()),
          event: 'Admin Note Added',
          description: 'Admin added verification notes for document quality review',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          icon: 'note',
        },
      ],
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading KYC data...</p>
      </div>
    )
  }

  if (!user || !kycData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">KYC data not found</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-hidden space-y-6">
      {/* User Profile Card */}
      <UserProfileCard user={user} kycStatus={kycData.status} />

      {/* KYC Information Card */}
      <KYCInformationCard kycData={kycData} />

      {/* Bank Information Card */}
      <BankInformationCard bankInfo={kycData.bankInfo} kycType={kycData.kycType} kycId={kycData.kycId} />

      {/* Verification Status & Actions Card */}
      <VerificationStatusCard
        status={kycData.status}
        adminNotes={kycData.adminNotes || ''}
        onApprove={handleApprove}
        onReject={handleReject}
        onSaveNote={handleSaveNote}
      />

      {/* Activity History Card */}
      <ActivityHistoryCard activityHistory={kycData.activityHistory} />
    </div>
  )
}

