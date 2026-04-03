import type { TimelineEvent } from '../../types/orderDetails'

/**
 * OrderTimelineCard component props
 */
export interface OrderTimelineCardProps {
  timeline: TimelineEvent[]
  onEventClick?: (event: TimelineEvent) => void
}

/**
 * Order timeline card component
 */
export default function OrderTimelineCard({ timeline, onEventClick }: OrderTimelineCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold text-gray-900">Order Timeline</h3>
      <div className="space-y-3 sm:space-y-4">
        {timeline.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => onEventClick?.(event)}
            className="w-full text-left flex items-start gap-2 sm:gap-3 hover:bg-gray-50 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 transition-colors"
          >
            <div
              className={`h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 rounded-full mt-1 sm:mt-1.5 ${
                event.type === 'refund' ? 'bg-indigo-500' : 'bg-green-500'
              }`}
            ></div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-normal text-gray-900">
                {event.status}
              </p>
              <p className="text-xs sm:text-sm font-normal text-gray-600 mt-0.5">
                {new Date(event.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                at{' '}
                {new Date(event.createdAt).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

