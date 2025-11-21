import type { BidTimelineEvent } from '../../types/bidDetails'

/**
 * BidTimeline component props
 */
export interface BidTimelineProps {
  timeline: BidTimelineEvent[]
}

/**
 * Bid timeline component
 */
export default function BidTimeline({ timeline }: BidTimelineProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Bid Timeline</h3>
      <div className="space-y-2">
        {timeline.map((event) => (
          <div key={event.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div className="flex items-center py-2.5 gap-3 min-w-0 flex-1">
              <div className={`h-3 w-3 flex-shrink-0 rounded-full ${
                event.status === 'winning' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <p className="text-sm font-normal text-gray-900 whitespace-nowrap">${event.amount.toLocaleString()}</p>
              <span className={`inline-flex rounded-full ml-2 sm:ml-8 px-3 py-1 text-xs font-medium flex-shrink-0 ${
                event.status === 'winning'
                  ? 'bg-green-100 text-green-800'
                  : event.status === 'outbid'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {event.status === 'winning' ? 'Winning' : event.status === 'outbid' ? 'Outbid' : event.status === 'pending' ? 'Pending' : 'Lost'}
              </span>
            </div>
            <p className="text-sm font-normal text-gray-600 text-left sm:text-right whitespace-nowrap flex-shrink-0">
              {event.date} at {event.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

