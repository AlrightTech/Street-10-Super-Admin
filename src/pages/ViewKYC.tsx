import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { usersApi } from '../services/users.api'
import { kycApi } from '../services/kyc.api'
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
  const navigate = useNavigate()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [kycData, setKycData] = useState<KYCData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      if (id) {
        try {
          // Fetch user details and KYC data from API
          const [apiUserData, apiKycData] = await Promise.all([
            usersApi.getById(id),
            kycApi.getByUserId(id),
          ])
          
          // Transform user to frontend format
          const transformedUser: UserDetails = {
            id: parseInt(apiUserData.user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000,
            name: apiUserData.user.email.split('@')[0],
            email: apiUserData.user.email,
            phone: apiUserData.user.phone || '',
            avatar: '',
            role: apiUserData.user.role,
            accountStatus: apiUserData.user.status === 'active' ? 'verified' : 'unverified',
            status: apiUserData.user.status === 'active' ? 'active' : 'blocked',
            ordersMade: apiUserData.stats?.ordersCount || 0,
            biddingWins: apiUserData.stats?.bidsWon || 0,
            totalSpent: parseFloat(apiUserData.stats?.totalSpent?.toString() || '0') / 100,
            totalRefunds: 0,
            pendingRefunds: 0,
            netSpending: parseFloat(apiUserData.stats?.totalSpent?.toString() || '0') / 100,
            walletBalance: parseFloat(apiUserData.user.wallet?.availableMinor?.toString() || '0') / 100,
            walletLimit: 10000,
            interests: [],
            interestsImage: '',
            biddings: [],
            orders: [],
          }
          
          // Transform KYC data
          const docsUrls = Array.isArray(apiKycData.kyc.docsUrls) ? apiKycData.kyc.docsUrls : 
                          typeof apiKycData.kyc.docsUrls === 'object' && apiKycData.kyc.docsUrls !== null ? Object.values(apiKycData.kyc.docsUrls) : []
          
          const transformedKyc: KYCData = {
            userId: parseInt(apiUserData.user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000,
            kycId: apiKycData.kyc.id,
            kycType: 'individual',
            status: apiKycData.kyc.status === 'approved' ? 'approved' : apiKycData.kyc.status === 'rejected' ? 'rejected' : 'pending',
            submissionDate: new Date(apiKycData.kyc.createdAt).toLocaleDateString(),
            submissionTime: new Date(apiKycData.kyc.createdAt).toLocaleTimeString(),
            referenceNumber: apiKycData.kyc.id.substring(0, 8).toUpperCase(),
            documents: docsUrls.map((url: string, index: number) => ({
              id: String(index),
              name: `Document ${index + 1}`,
              title: `Document ${index + 1}`,
              type: 'kyc-document' as const,
              fileUrl: url,
              uploadedDate: new Date(apiKycData.kyc.createdAt).toLocaleDateString(),
            })),
            bankInfo: {
              iban: '',
              swiftCode: '',
              bankName: '',
              accountNumber: '',
              nameOnCard: '',
              bankCountry: '',
            },
            adminNotes: apiKycData.kyc.reason || '',
            activityHistory: (apiKycData.auditLogs || []).map((log: any, index: number) => ({
              id: log.id || String(index),
              event: log.action,
              description: log.details?.reason || log.action,
              date: new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              time: new Date(log.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              icon: (log.action?.toLowerCase().includes('approve') ? 'check' : log.action?.toLowerCase().includes('reject') ? 'x' : 'note') as any,
              isCurrent: index === 0,
            })),
          }
          
          setUser(transformedUser)
          setKycData(transformedKyc)
        } catch (error) {
          console.error('Error loading KYC data:', error)
          navigate('/users')
        }
      }
      setLoading(false)
    }

    loadData()
  }, [id, navigate])

  const handleApprove = async () => {
    if (!kycData || !id) return
    
    try {
      await kycApi.approve(id)
      // Reload KYC data
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
    } catch (error) {
      console.error('Error approving KYC:', error)
      alert('Failed to approve KYC. Please try again.')
    }
  }

  const handleReject = async () => {
    if (!kycData || !id) return
    
    const reason = prompt('Please enter rejection reason:')
    if (!reason) return
    
    try {
      await kycApi.reject(id, reason)
      // Reload KYC data
      setKycData({
        ...kycData,
        status: 'rejected',
        adminNotes: reason,
        activityHistory: [
          ...kycData.activityHistory.filter(item => !item.isCurrent),
          {
            id: String(Date.now()),
            event: 'Status: Rejected',
            description: `KYC has been rejected by admin: ${reason}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            icon: 'x',
            isCurrent: true,
          },
        ],
      })
    } catch (error) {
      console.error('Error rejecting KYC:', error)
      alert('Failed to reject KYC. Please try again.')
    }
  }

  const handleSaveNote = async (notes: string) => {
    if (!kycData || !id) return
    
    // Note: API doesn't have a separate endpoint for notes, they're saved with reject
    // For now, we'll just update local state
    setKycData({
      ...kycData,
      adminNotes: notes,
      activityHistory: [
        ...kycData.activityHistory.filter(item => item.event !== 'Admin Note Added' || !item.isCurrent),
        {
          id: String(Date.now()),
          event: 'Admin Note Added',
          description: 'Admin added verification notes',
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

