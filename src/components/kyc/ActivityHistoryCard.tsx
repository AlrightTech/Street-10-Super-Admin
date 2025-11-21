import type { ActivityHistoryItem } from '../../types/kyc'

interface ActivityHistoryCardProps {
  activityHistory: ActivityHistoryItem[]
}

export default function ActivityHistoryCard({ activityHistory }: ActivityHistoryCardProps) {
  const getIcon = (iconType: string) => {
    const iconClass = 'h-5 w-5'
    
    switch (iconType) {
      case 'user':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'document':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'eye':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )
      case 'note':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      case 'clock':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'check':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'x':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      default:
        return null
    }
  }

  const getIconColor = (iconType: string, isCurrent?: boolean) => {
    // Match reference colors per event type; highlight current if provided
    if (isCurrent) return 'text-yellow-600 bg-yellow-50'

    switch (iconType) {
      case 'user':
        return 'text-blue-600 bg-blue-50'
      case 'document':
        return 'text-purple-600 bg-purple-50'
      case 'eye':
        return 'text-yellow-600 bg-yellow-50'
      case 'note':
        return 'text-violet-600 bg-violet-50'
      case 'clock':
        return 'text-gray-600 bg-gray-50'
      case 'check':
        return 'text-green-600 bg-green-50'
      case 'x':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Activity History</h2>
      
      <div className="space-y-3">
        {activityHistory.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 gap-3 sm:gap-4"
          >
            <div className="flex gap-4 min-w-0 flex-1 w-full sm:w-auto">
              <div
                className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full ${getIconColor(
                  item.icon,
                  item.isCurrent
                )}`}
              >
                {getIcon(item.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <p className="text-sm font-semibold text-gray-900 break-words">{item.event}</p>
                  <div className="flex-shrink-0 sm:hidden">
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      {item.date} {item.time && `${item.time}`}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1 break-words">{item.description}</p>
              </div>
            </div>
            <div className="hidden sm:flex flex-shrink-0 sm:ml-4">
              <p className="text-xs text-gray-500 whitespace-nowrap">
                {item.date} {item.time && `${item.time}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

