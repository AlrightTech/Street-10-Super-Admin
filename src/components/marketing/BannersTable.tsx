import { Fragment, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import MarketingStatusBadge, { type MarketingStatus } from './MarketingStatusBadge'
import BannersActionMenu, { type BannerActionType } from './BannersActionMenu'

export interface Banner {
  id: string
  thumbnail: string
  title: string
  type: 'Image' | 'Video'
  startDate: string
  endDate: string
  audience: string
  priority: 'High' | 'Medium' | 'Low'
  status: MarketingStatus
}

interface BannersTableProps {
  banners: Banner[]
  emptyState?: ReactNode
  startIndex?: number
  onActionSelect?: (banner: Banner, action: BannerActionType) => void
}

export default function BannersTable({ banners, emptyState, onActionSelect }: BannersTableProps) {
  const navigate = useNavigate()

  if (banners.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        {emptyState ?? (
          <>
            <p className="text-base font-semibold text-gray-800">No banners to show</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Try adjusting your filters or search criteria to see different banners.
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <Fragment>
      <div className="w-full rounded-xl overflow-hidden">
        <div className="overflow-x-auto md:overflow-x-visible">
          <table className="w-full border-collapse text-sm min-w-[600px] md:min-w-0">
              <thead className="bg-transparent sticky top-0 z-10">
                <tr>
                  <TableHeader>Thumbnail + Title</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Start Date</TableHeader>
                  <TableHeader>End Date</TableHeader>
                  <TableHeader>Audience</TableHeader>
                  <TableHeader>Priority</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader align="center">Action</TableHeader>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr 
                    key={banner.id} 
                    className="border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => navigate(`/marketing/banner/${banner.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <img 
                          src={banner.thumbnail} 
                          alt={banner.title}
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0"
                        />
                        <span className="text-gray-700 font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{banner.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{banner.type}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{banner.startDate}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{banner.endDate}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{banner.audience}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${
                        banner.priority === 'High' ? 'text-red-600' : 
                        banner.priority === 'Medium' ? 'text-yellow-600' : 
                        'text-gray-600'
                      }`}>
                        {banner.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <MarketingStatusBadge status={banner.status} />
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <BannersActionMenu onSelect={(action) => onActionSelect?.(banner, action)} />
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
  onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void
}

function TableCell({ children, className = '', align = 'left', onClick }: TableCellProps) {
  const textAlign = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  
  return (
    <td
      className={`px-2 sm:px-3 md:px-5 py-2 text-gray-700 ${textAlign} ${className}`}
      onClick={onClick}
    >
      {children}
    </td>
  )
}

