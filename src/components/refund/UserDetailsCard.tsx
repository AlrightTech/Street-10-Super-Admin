import type { UserDetails } from '../../types/userDetails'

interface UserDetailsCardProps {
  user: UserDetails
}

export default function UserDetailsCard({ user }: UserDetailsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-56 items-center">
        {/* Left Section - Profile Picture + User Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-2 flex-shrink-0 w-full sm:w-auto">
          {/* Profile Picture with Orange Border */}
          <div className="flex-shrink-0 sm:px-4">
            <div className="h-24 w-24 sm:h-28 sm:w-28 lg:h-[140px] lg:w-[140px] rounded-full border-2 border-[#F39C12] p-0.5">
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

        {/* Middle and Right Sections - Interests, Wallet, Image */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 items-start lg:items-center w-full lg:w-auto">
          {/* Middle Section - Interests & Wallet */}
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Interests</h3>
              <p className="text-sm font-normal text-gray-600 break-words">{user.interests.join(', ')}</p>
            </div>
            
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Wallet</h3>
              <p className="text-sm font-normal text-gray-600 mb-3">${user.walletBalance.toLocaleString()}</p>
              <p className="text-sm font-normal text-gray-600">${user.walletLimit.toLocaleString()}</p>
            </div>
          </div>

          {/* Right Section - Interests Image */}
          <div className="flex items-center gap-4 flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start">
            <div className="flex-shrink-0">
              <img
                src={user.interestsImage}
                alt="Interests"
                className="w-32 h-32 sm:w-36 sm:h-36 lg:w-[152px] lg:h-[152px] rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

