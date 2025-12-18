import type { UserDetails } from '../../types/userDetails'
import type { KYCStatus } from '../../types/kyc'

interface UserProfileCardProps {
  user: UserDetails
  kycStatus: KYCStatus
}

export default function UserProfileCard({ user, kycStatus }: UserProfileCardProps) {
  const getStatusBadge = () => {
    if (kycStatus === 'approved') {
      return <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800">Active Account</span>
    }
    if (kycStatus === 'rejected') {
      return <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-800">Rejected Account</span>
    }
    return <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">Pending Account</span>
  }

  // Format join date & location from real user data
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '-'

  const location = user.location || '-'

  // Display-friendly user id
  const userId = `#USR-${String(user.id).padStart(6, '0')}`

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 sm:gap-0">
        <h2 className="text-lg font-bold text-gray-900">User Profile</h2>
        {getStatusBadge()}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Left: Profile Picture */}
        <div className="flex-shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-lg font-semibold">
                {(user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        {/* Right: User Information - Three Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 w-full sm:w-auto">
          {/* Column 1: Full Name, Join Date */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
              <p className="text-base font-bold text-gray-900 break-words">{user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Join Date</p>
              <p className="text-sm text-gray-900 break-words">{joinDate}</p>
            </div>
          </div>
          
          {/* Column 2: Email Address, User ID */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
              <p className="text-sm text-gray-900 break-words">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">User ID</p>
              <p className="text-sm text-gray-900 break-words">{userId}</p>
            </div>
          </div>
          
          {/* Column 3: Phone Number, Location */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
              <p className="text-sm text-gray-900 break-words">{user.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
              <p className="text-sm text-gray-900 break-words">{location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

