import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { usersApi } from '../services/users.api'
import { kycApi } from '../services/kyc.api'
import type { UserDetails } from '../types/userDetails'
import type { KYCData, KYCStatus } from '../types/kyc'
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
  const [userUuid, setUserUuid] = useState<string | null>(null) // State to store the UUID

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      let userIdToFetch: string | null = null

      if (id) {
        try {
          // Check if id is a numeric ID (not a UUID)
          // UUIDs contain hyphens, numeric IDs don't
          userIdToFetch = id

          // Check if it's numeric (no hyphens and all digits)
          const isNumericId = !id.includes("-") && /^\d+$/.test(id)

          console.log("Processing KYC user ID:", { id, isNumericId })

          if (isNumericId) {
            // This is a numeric ID, we need to convert it to UUID
            // Fetch users list to build the mapping
            console.log(
              "Numeric ID detected, fetching users list to find UUID...",
              id
            )

            try {
              const usersResult = await usersApi.getAll({
                page: 1,
                limit: 1000,
              })
              console.log(
                "Fetched users for mapping:",
                usersResult.data?.length || 0
              )

              if (!usersResult.data || usersResult.data.length === 0) {
                throw new Error("No users found in the system")
              }

              const userIdMap = new Map<number, string>()
              usersResult.data.forEach((user: any) => {
                try {
                  if (user.id && typeof user.id === "string") {
                    const numericId =
                      parseInt(user.id.replace(/-/g, "").substring(0, 10), 16) %
                      1000000
                    userIdMap.set(numericId, user.id)
                  }
                } catch (e) {
                  console.error("Error converting user ID for mapping:", user.id, e)
                }
              })

              console.log("User ID map built with", userIdMap.size, "entries")

              const numericId = parseInt(id)
              const uuid = userIdMap.get(numericId)

              if (!uuid) {
                console.error(
                  `User with numeric ID ${id} not found in mapping.`
                )
                throw new Error(
                  `User with ID ${id} not found. The user may not exist or the ID mapping failed.`
                )
              }

              userIdToFetch = uuid
              console.log(
                `Successfully converted numeric ID ${id} to UUID: ${uuid}`
              )
            } catch (error: any) {
              console.error("Error converting numeric ID to UUID:", error)
              throw new Error(
                `Failed to convert user ID: ${
                  error?.message || "Unknown error"
                }`
              )
            }
          } else {
            // It's already a UUID, use it directly
            console.log("Using UUID directly:", userIdToFetch)
          }

          // Store the UUID for later use (for approve, reject, etc.)
          setUserUuid(userIdToFetch)

          // Fetch user details first
          const apiUserData = await usersApi.getById(userIdToFetch)
          
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
          
          // Try to fetch KYC data - it might not exist
          let apiKycData
          try {
            apiKycData = await kycApi.getByUserId(userIdToFetch)
          } catch (kycError: any) {
            // If KYC not found (404), create a default KYC data object
            if (kycError?.response?.status === 404) {
              console.log('KYC data not found for user, showing "No KYC submission" state')
              // Create default KYC data for users without KYC submission
              const defaultKyc: KYCData = {
                userId: parseInt(apiUserData.user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000,
                kycId: '',
                kycType: 'individual',
                status: 'pending' as KYCStatus,
                submissionDate: '',
                submissionTime: '',
                referenceNumber: '',
                documents: [],
                bankInfo: {
                  iban: '',
                  swiftCode: '',
                  bankName: '',
                  accountNumber: '',
                  nameOnCard: '',
                  bankCountry: '',
                },
                adminNotes: '',
                activityHistory: [],
              }
              setUser(transformedUser)
              setKycData(defaultKyc)
              setLoading(false)
              return
            } else {
              // For other errors, throw to be caught by outer catch
              throw kycError
            }
          }
          
          // Transform KYC data - KYC exists
          if (!apiKycData || !apiKycData.kyc) {
            // Fallback - should not happen if API returned success
            const defaultKyc: KYCData = {
              userId: parseInt(apiUserData.user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000,
              kycId: '',
              kycType: 'individual',
              status: 'pending' as KYCStatus,
              submissionDate: '',
              submissionTime: '',
              referenceNumber: '',
              documents: [],
              bankInfo: {
                iban: '',
                swiftCode: '',
                bankName: '',
                accountNumber: '',
                nameOnCard: '',
                bankCountry: '',
              },
              adminNotes: '',
              activityHistory: [],
            }
            setUser(transformedUser)
            setKycData(defaultKyc)
            setLoading(false)
            return
          }
          
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
        } catch (error: any) {
          console.error('Error loading KYC data:', error)
          console.error('Error details:', {
            message: error?.message,
            response: error?.response?.data,
            status: error?.response?.status,
            id,
            userIdToFetch,
          })

          // Show user-friendly error message
          if (error?.response?.status === 404) {
            alert(`KYC data for user ID ${id} not found. Please check if the user exists.`)
          } else {
            alert(`Failed to load KYC data: ${error?.message || "Unknown error"}`)
          }

          navigate('/users')
        }
      }
      setLoading(false)
    }

    loadData()
  }, [id, navigate])

  const handleApprove = async () => {
    if (!kycData || !userUuid) return
    
    try {
      await kycApi.approve(userUuid)
      
      // Reload KYC data to get updated status
      try {
        const updatedKycData = await kycApi.getByUserId(userUuid)
        
        const updatedKyc: KYCData = {
          ...kycData,
          status: updatedKycData.kyc.status === 'approved' ? 'approved' : 
                  updatedKycData.kyc.status === 'rejected' ? 'rejected' : 'pending',
          activityHistory: (updatedKycData.auditLogs || []).map((log: any, index: number) => ({
            id: log.id || String(index),
            event: log.action,
            description: log.details?.reason || log.action,
            date: new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date(log.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            icon: (log.action?.toLowerCase().includes('approve') ? 'check' : log.action?.toLowerCase().includes('reject') ? 'x' : 'note') as any,
            isCurrent: index === 0,
          })),
        }
        setKycData(updatedKyc)
        alert('KYC approved successfully!')
      } catch (reloadError) {
        console.error('Error reloading KYC data:', reloadError)
        // Still update local state even if reload fails
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
        alert('KYC approved successfully!')
      }
    } catch (error: any) {
      console.error('Error approving KYC:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to approve KYC. Please try again.'
      alert(`Error: ${errorMessage}`)
    }
  }

  const handleReject = async () => {
    if (!kycData || !userUuid) return
    
    const reason = prompt('Please enter rejection reason:')
    if (!reason || reason.trim() === '') {
      alert('Rejection reason is required')
      return
    }
    
    try {
      await kycApi.reject(userUuid, reason)
      
      // Reload KYC data to get updated status
      try {
        const updatedKycData = await kycApi.getByUserId(userUuid)
        
        const updatedKyc: KYCData = {
          ...kycData,
          status: updatedKycData.kyc.status === 'approved' ? 'approved' : 
                  updatedKycData.kyc.status === 'rejected' ? 'rejected' : 'pending',
          adminNotes: updatedKycData.kyc.reason || reason,
          activityHistory: (updatedKycData.auditLogs || []).map((log: any, index: number) => ({
            id: log.id || String(index),
            event: log.action,
            description: log.details?.reason || log.action,
            date: new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date(log.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            icon: (log.action?.toLowerCase().includes('approve') ? 'check' : log.action?.toLowerCase().includes('reject') ? 'x' : 'note') as any,
            isCurrent: index === 0,
          })),
        }
        setKycData(updatedKyc)
        alert('KYC rejected successfully!')
      } catch (reloadError) {
        console.error('Error reloading KYC data:', reloadError)
        // Still update local state even if reload fails
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
        alert('KYC rejected successfully!')
      }
    } catch (error: any) {
      console.error('Error rejecting KYC:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to reject KYC. Please try again.'
      alert(`Error: ${errorMessage}`)
    }
  }

  const handleSaveNote = async (notes: string) => {
    if (!kycData || !userUuid) return
    
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

