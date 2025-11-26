import { Fragment, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import MarketingStatusBadge, { type MarketingStatus } from './MarketingStatusBadge'
import PushNotificationsActionMenu, { type PushNotificationActionType } from './PushNotificationsActionMenu'

export interface PushNotification {
  id: string
  name: string
  avatar?: string
  title: string
  audience: string
  category: string
  deliveryTime: string
  priority: 'High' | 'Medium' | 'Low'
  status: MarketingStatus | 'sent' | 'pending'
}

interface PushNotificationsTableProps {
  notifications: PushNotification[]
  emptyState?: ReactNode
  startIndex?: number
  onActionSelect?: (notification: PushNotification, action: PushNotificationActionType) => void
}

export default function PushNotificationsTable({ notifications, emptyState, onActionSelect }: PushNotificationsTableProps) {
  const navigate = useNavigate()

  const handleRowClick = (notification: PushNotification) => {
    if (notification.status === 'sent') {
      navigate(`/marketing/push-notification/send/${notification.id}`)
    } else if (notification.status === 'pending') {
      navigate(`/marketing/push-notification/pending/${notification.id}`)
    } else if (notification.status === 'scheduled') {
      navigate(`/marketing/push-notification/scheduled/${notification.id}`)
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        {emptyState ?? (
          <>
            <p className="text-base font-semibold text-gray-800">No push notifications to show</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Try adjusting your filters or search criteria to see different notifications.
            </p>
          </>
        )}
      </div>
    )
  }

  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Fragment>
      <div className="w-full rounded-xl overflow-hidden">
        <div className="overflow-x-auto md:overflow-x-visible">
          <table className="w-full border-collapse text-sm min-w-[600px] md:min-w-0">
              <thead className="bg-transparent sticky top-0 z-10">
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Title</TableHeader>
                  <TableHeader>Audience</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Delivery Time</TableHeader>
                  <TableHeader>Priority</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader align="center">Action</TableHeader>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification, index) => (
                  <tr 
                    key={notification.id} 
                    onClick={() => handleRowClick(notification)}
                    className={`border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                      index === 4 ? 'bg-gray-50' : ''
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2 sm:gap-3">
                        {notification.avatar ? (
                          <img 
                            src={notification.avatar} 
                            alt={notification.name}
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 flex-shrink-0">
                            {getAvatarInitials(notification.name)}
                          </div>
                        )}
                        <span className="text-gray-700 font-medium text-xs sm:text-sm">{notification.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-700 font-medium text-xs sm:text-sm">{notification.title}</span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
                        {notification.audience}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
                        {notification.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm whitespace-nowrap">{notification.deliveryTime}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${
                        notification.priority === 'High' ? 'text-red-600' : 
                        notification.priority === 'Medium' ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {notification.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      {notification.status === 'sent' ? (
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
                          Send
                        </span>
                      ) : notification.status === 'pending' ? (
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-800">
                          Pending
                        </span>
                      ) : (
                        <MarketingStatusBadge status={notification.status as MarketingStatus} />
                      )}
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <PushNotificationsActionMenu 
                        status={notification.status as 'sent' | 'pending' | 'scheduled' | 'expired'} 
                        onSelect={(action) => onActionSelect?.(notification, action)} 
                      />
                    </TableCell>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  )
}

interface TableHeaderProps {
  children: React.ReactNode
  align?: 'left' | 'right' | 'center'
}

function TableHeader({ children, align = 'left' }: TableHeaderProps) {
  const textAlign = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  
  return (
    <th
      scope="col"
      className={`whitespace-nowrap
         px-2 sm:px-3 md:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold 
          tracking-wide text-gray-700 border-b border-gray-300 bg-white ${textAlign}`}
    >
      {children}
    </th>
  )
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'right' | 'center'
  onClick?: (e: React.MouseEvent) => void
}

function TableCell({ children, className = '', align = 'left', onClick }: TableCellProps) {
  const textAlign = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  
  return (
    <td
      onClick={onClick}
      className={`px-2 sm:px-3 md:px-5 py-2 text-gray-700 ${textAlign} ${className}`}
    >
      {children}
    </td>
  )
}

