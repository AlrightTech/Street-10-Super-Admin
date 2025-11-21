import ActionDropdown from './ActionDropdown'
import type { UserDetails } from '../../types/userDetails'

/**
 * UserStatsCard component props
 */
export interface UserStatsCardProps {
  user: UserDetails
  onEdit?: () => void
  onBlock?: () => void
  onDelete?: () => void
}

/**
 * User stats card component
 */
export default function UserStatsCard({ user, onEdit, onBlock, onDelete }: UserStatsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
      <div className="overflow-x-auto md:overflow-x-visible md:overflow-hidden">
        <table className="table-auto w-full min-w-[600px] md:min-w-0 md:w-full border-collapse">
          <thead className="hidden sm:table-header-group">
            <tr>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-600">Orders Made</th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-600">Account Status</th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-600">Bidding Wins</th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="">
              <td className="px-0 sm:px-2 pb-4 sm:pb-0">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 sm:hidden">Orders Made</span>
                  <span className="text-2xl font-bold text-gray-900">{user.ordersMade}</span>
                </div>
              </td>
              <td className="px-0 sm:px-2  pb-4 sm:pb-0">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 sm:hidden">Account Status</span>
                  {(() => {
                    const status = user.status || 'pending'
                    let statusText = 'Pending'
                    let statusStyles = 'bg-yellow-100 text-yellow-800'

                    if (status === 'blocked') {
                      statusText = 'Blocked'
                      statusStyles = 'bg-red-100 text-red-800'
                    } else if (status === 'active') {
                      statusText = 'Active'
                      statusStyles = 'bg-green-100 text-green-800'
                    }

                    return (
                      <span className={`inline-flex w-20  flex justify-center    rounded-full px-3 py-1 text-xs font-medium ${statusStyles}`}>
                        {statusText}
                      </span>
                    )
                  })()}
                </div>
              </td>
              <td className="px-0 sm:px-2 pb-4 sm:pb-0">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 sm:hidden">Bidding Wins</span>
                  <span className="text-2xl font-bold text-gray-900">{user.biddingWins}</span>
                </div>
              </td>
              <td className="px-0 sm:px-2">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 sm:hidden">Action</span>
                  <ActionDropdown onEdit={onEdit} onBlock={onBlock} onDelete={onDelete} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

