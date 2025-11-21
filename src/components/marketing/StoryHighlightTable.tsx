import { Fragment, type ReactNode } from 'react'
import MarketingStatusBadge, { type MarketingStatus } from './MarketingStatusBadge'
import StoryHighlightActionMenu, { type StoryHighlightActionType } from './StoryHighlightActionMenu'

export interface StoryHighlight {
  id: string
  thumbnail: string
  title: string
  type: string
  startDate: string
  endDate: string
  audience: string
  priority: 'High' | 'Medium' | 'Low'
  status: MarketingStatus
}

interface StoryHighlightTableProps {
  highlights: StoryHighlight[]
  emptyState?: ReactNode
  startIndex?: number
  onActionSelect?: (highlight: StoryHighlight, action: StoryHighlightActionType) => void
}

export default function StoryHighlightTable({ highlights, emptyState, onActionSelect }: StoryHighlightTableProps) {
  if (highlights.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        {emptyState ?? (
          <>
            <p className="text-base font-semibold text-gray-800">No story highlights to show</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Try adjusting your filters or search criteria to see different highlights.
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <Fragment>
      <div className="w-full rounded-xl overflow-hidden" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
        <div className="overflow-x-auto">
          <div className="max-h-[360px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
            <table className="min-w-[1000px] w-full border-collapse text-sm">
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
                {highlights.map((highlight) => (
                  <tr key={highlight.id} className="border-b border-gray-200 last:border-b-0">
                    <TableCell>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <img 
                          src={highlight.thumbnail} 
                          alt={highlight.title}
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0"
                        />
                        <span className="text-gray-700 font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{highlight.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{highlight.type}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{highlight.startDate}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{highlight.endDate}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{highlight.audience}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${
                        highlight.priority === 'High' ? 'text-red-600' : 
                        highlight.priority === 'Medium' ? 'text-yellow-600' : 
                        'text-gray-600'
                      }`}>
                        {highlight.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <MarketingStatusBadge status={highlight.status} />
                    </TableCell>
                    <TableCell align="center">
                      <StoryHighlightActionMenu onSelect={(action) => onActionSelect?.(highlight, action)} />
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      className={`whitespace-nowrap px-2 sm:px-3 md:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-700 border-b-2 border-gray-300 bg-white ${textAlign}`}
    >
      {children}
    </th>
  )
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'right' | 'center'
}

function TableCell({ children, className = '', align = 'left' }: TableCellProps) {
  const textAlign = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  
  return (
    <td
      className={`px-2 sm:px-3 md:px-5 py-2 sm:py-3 text-gray-700 ${textAlign} ${className}`}
    >
      {children}
    </td>
  )
}

