import { Fragment, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import MarketingStatusBadge, { type MarketingStatus } from './MarketingStatusBadge'
import PopupsActionMenu, { type PopupActionType } from './PopupsActionMenu'

export interface Popup {
  id: string
  imageUrl: string
  title: string
  redirectType: 'Product' | 'Category' | 'External'
  startDate: string
  endDate: string
  priority: 'High' | 'Medium' | 'Low'
  status: MarketingStatus
  deviceTarget: 'Desktop' | 'Mobile' | 'Both'
}

interface PopupsTableProps {
  popups: Popup[]
  emptyState?: ReactNode
  startIndex?: number
  onActionSelect?: (popup: Popup, action: PopupActionType) => void
}

export default function PopupsTable({ popups, emptyState, onActionSelect }: PopupsTableProps) {
  const navigate = useNavigate()

  if (popups.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-12 text-center transition-colors">
        {emptyState ?? (
          <>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200">No popups to show</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search criteria to see different popups.
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <Fragment>
      <div className="w-full rounded-xl overflow-x-auto">
        <div className="overflow-x-auto md:overflow-x-visible">
          <table className="w-full border-collapse text-sm min-w-[600px] md:min-w-0">
              <thead className="bg-white dark:bg-gray-800 sticky top-0 z-10 transition-colors">
                <tr>
                  <TableHeader>Image + Title</TableHeader>
                  <TableHeader>Redirect Type</TableHeader>
                  <TableHeader>Start Date</TableHeader>
                  <TableHeader>End Date</TableHeader>
                  <TableHeader>Device</TableHeader>
                  <TableHeader>Priority</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader align="center">Action</TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {popups.map((popup) => (
                  <tr 
                    key={popup.id} 
                    className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => navigate(`/marketing/popup/${popup.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2 sm:gap-3">
                        {popup.imageUrl ? (
                          <img 
                            src={popup.imageUrl} 
                            alt={popup.title}
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-gray-700 flex-shrink-0 bg-gray-100 dark:bg-gray-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              const parent = target.parentElement
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700">
                                    <span class="text-xs text-gray-500 dark:text-gray-400">No</span>
                                  </div>
                                `
                              }
                            }}
                          />
                        ) : (
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700">
                            <span className="text-xs text-gray-500 dark:text-gray-400">No</span>
                          </div>
                        )}
                        <span className="text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{popup.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{popup.redirectType}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-gray-700 dark:text-gray-300">{popup.startDate}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-gray-700 dark:text-gray-300">{popup.endDate}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{popup.deviceTarget}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${
                        popup.priority === 'High' ? 'text-red-600 dark:text-red-400' : 
                        popup.priority === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-gray-600 dark:text-gray-300'
                      }`}>
                        {popup.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <MarketingStatusBadge status={popup.status} />
                    </TableCell>
                    <TableCell align="center" className="relative z-10" onClick={(e) => e.stopPropagation()}>
                      <PopupsActionMenu onSelect={(action) => onActionSelect?.(popup, action)} />
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
      className={`whitespace-nowrap px-2 sm:px-3 md:px-5 py-2 sm:py-3 
        text-xs sm:text-sm font-semibold 
         tracking-wide text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 ${textAlign} transition-colors`}
    >
      {children}
    </th>
  )
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'right' | 'center'
  onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void
}

function TableCell({ children, className = '', align = 'left', onClick }: TableCellProps) {
  const textAlign = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  
  return (
    <td
      className={`px-2 sm:px-3 md:px-5 py-2 sm:py-3 text-xs sm:text-sm ${textAlign} ${className}`}
      onClick={onClick}
    >
      {children}
    </td>
  )
}
