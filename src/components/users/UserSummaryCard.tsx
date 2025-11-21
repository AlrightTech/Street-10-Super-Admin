import { useNavigate } from 'react-router-dom'
import type { UserDetails } from '../../types/userDetails'

/**
 * UserSummaryCard component props
 */
export interface UserSummaryCardProps {
  user: UserDetails
}

/**
 * User summary card component
 */
export default function UserSummaryCard({ user }: UserSummaryCardProps) {
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(`/users/${user.id}/edit`)
  }

  const handleViewKYC = () => {
    navigate(`/view-kyc/${user.id}`)
  }

  const handleRefundRequest = () => {
    navigate(`/refund-request/${user.id}`)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12 items-center">
        {/* Left Section - Profile Picture + User Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-shrink-0 w-full sm:w-auto">
          {/* Profile Picture with Orange Border */}
          <div className="flex-shrink-0">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-[#F39C12] p-0.5">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
          
          {/* User Details */}
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{user.name}</h2>
            <p className="text-sm font-normal text-gray-600 break-words">{user.role}</p>
            <p className="text-sm font-normal text-gray-600 break-words">{user.email}</p>
            <p className="text-sm font-normal text-gray-600 break-words">{user.phone}</p>
          </div>
        </div>

        {/* Middle and Right Sections - Interests, Wallet, Image & Buttons */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center w-full lg:w-auto">
          {/* Middle Section - Interests & Wallet */}
          <div className="flex flex-col gap-6 w-full lg:w-auto">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Interests</h3>
              <p className="text-sm font-normal text-gray-600 break-words">{user.interests.join(', ')}</p>
            </div>
            
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Wallet</h3>
              <p className="text-sm font-normal text-gray-600 mb-3">${user.walletBalance.toLocaleString()}</p>
              <button
                type="button"
                onClick={handleRefundRequest}
                className="w-full sm:w-auto rounded-lg bg-[#E74C3C] px-4 py-2 text-sm font-medium text-white hover:bg-[#C0392B] transition-colors mb-3"
              >
                Refund Request
              </button>
              <p className="text-sm font-normal text-gray-600">${user.walletLimit.toLocaleString()}</p>
            </div>
          </div>

          {/* Right Section - Image + Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0 w-full sm:w-auto">
            {/* Interests Image */}
            <div className="flex-shrink-0">
              <img
                src={user.interestsImage}
                alt="Interests"
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-lg object-cover"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleViewKYC}
                className="w-full sm:w-auto rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E22] transition-colors whitespace-nowrap"
              >
                View KYC
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E22] transition-colors whitespace-nowrap"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

