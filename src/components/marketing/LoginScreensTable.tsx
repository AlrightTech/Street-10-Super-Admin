import { Fragment, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import MarketingStatusBadge, { type MarketingStatus } from './MarketingStatusBadge'
import LoginScreensActionMenu, { type LoginScreenActionType } from './LoginScreensActionMenu'

export interface LoginScreen {
  id: string
  thumbnail: string
  title: string
  target: 'Vendor' | 'Admin'
  startDate: string
  endDate: string
  priority: 'High' | 'Medium' | 'Low'
  status: MarketingStatus
}

interface LoginScreensTableProps {
  loginScreens: LoginScreen[]
  emptyState?: ReactNode
  startIndex?: number
  onActionSelect?: (loginScreen: LoginScreen, action: LoginScreenActionType) => void
}

export default function LoginScreensTable({ loginScreens, emptyState, onActionSelect }: LoginScreensTableProps) {
  const navigate = useNavigate()

  if (loginScreens.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        {emptyState ?? (
          <>
            <p className="text-base font-semibold text-gray-800">No login screens to show</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Try adjusting your filters or search criteria to see different login screens.
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
                  <TableHeader>Thumbnail + Title</TableHeader>
                  <TableHeader>Target</TableHeader>
                  <TableHeader>Start Date</TableHeader>
                  <TableHeader>End Date</TableHeader>
                  <TableHeader>Priority</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader align="center">Action</TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loginScreens.map((loginScreen) => (
                  <tr 
                    key={loginScreen.id} 
                    className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => navigate(`/marketing/login-screen/${loginScreen.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2 sm:gap-3">
                        {loginScreen.thumbnail ? (
                          <img 
                            src={loginScreen.thumbnail} 
                            alt={loginScreen.title}
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 flex-shrink-0 bg-gray-100 dark:bg-gray-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              const parent = target.parentElement
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700">
                                    <span class="text-xs text-gray-500 dark:text-gray-400">No</span>
                                  </div>
                                `
                              }
                            }}
                          />
                        ) : (
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700">
                            <span className="text-xs text-gray-500 dark:text-gray-400">No</span>
                          </div>
                        )}
                        <span className="text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{loginScreen.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{loginScreen.target}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-gray-700 dark:text-gray-300">{loginScreen.startDate || 'N/A'}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-gray-700 dark:text-gray-300">{loginScreen.endDate || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${
                        loginScreen.priority === 'High' ? 'text-red-600 dark:text-red-400' : 
                        loginScreen.priority === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-gray-600 dark:text-gray-300'
                      }`}>
                        {loginScreen.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <MarketingStatusBadge status={loginScreen.status} />
                    </TableCell>
                    <TableCell align="center" className="relative z-10">
                      <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <LoginScreensActionMenu onSelect={(action) => onActionSelect?.(loginScreen, action)} />
                      </div>
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
      className={`px-2 sm:px-3 md:px-5 py-2 text-gray-700 dark:text-gray-300 ${textAlign} ${className}`}
      onClick={onClick}
    >
      {children}
    </td>
  )
}
