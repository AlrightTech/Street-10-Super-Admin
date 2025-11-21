import type { UserDetails } from '../../types/userDetails'

/**
 * SpendingSummary component props
 */
export interface SpendingSummaryProps {
  user: UserDetails
}

/**
 * Spending & refund summary component
 */
export default function SpendingSummary({ user }: SpendingSummaryProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Spent */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900">${user.totalSpent.toFixed(2)}</p>
        </div>

        {/* Total Refunds */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Total Refunds</p>
          <p className="text-2xl font-bold text-green-600">${user.totalRefunds.toFixed(2)}</p>
        </div>

        {/* Pending Refunds */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Pending Refunds</p>
          <p className="text-2xl font-bold text-orange-600">${user.pendingRefunds.toFixed(2)}</p>
        </div>

        {/* Net Spending */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Net Spending</p>
          <p className="text-2xl font-bold text-gray-900">${user.netSpending.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

