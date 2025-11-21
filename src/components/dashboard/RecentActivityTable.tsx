import Button from '../ui/Button'
import type { ActivityItem } from '../../types/dashboard'

/**
 * RecentActivityTable component props
 */
export interface RecentActivityTableProps {
  activities: ActivityItem[]
}

/**
 * Recent activity feed table component
 */
export default function RecentActivityTable({ activities }: RecentActivityTableProps) {
  return (
    <div>
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-start 
      sm:items-center justify-between gap-3 sm:gap-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Recent Activity Feed</h3>
        <Button variant="primary" className="text-xs cursor-pointer sm:text-sm w-full sm:w-auto">
          View
        </Button>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="max-h-[360px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
            <table className="w-full min-w-[800px]">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-gray-200">
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal bg-white">Activity</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal bg-white">User</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal bg-white">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3  text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal sm:break-words">{activity.activity}</td>
                    <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3  text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal sm:break-words">{activity.user}</td>
                    <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3  text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal">{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

