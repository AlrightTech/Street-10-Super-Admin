import type { TimelineEvent } from '../../types/orderDetails'

/**
 * OrderTimelineCard component props
 */
export interface OrderTimelineCardProps {
  timeline: TimelineEvent[]
}

/**
 * Order timeline card component
 */
export default function OrderTimelineCard({ timeline }: OrderTimelineCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold text-gray-900">Order Timeline</h3>
      <div className="space-y-3 sm:space-y-4">
        {timeline.map((event) => (
          <div key={event.id} className="flex items-start gap-2 sm:gap-3">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 rounded-full bg-green-500 mt-1 sm:mt-1.5"></div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-normal text-gray-900">{event.status}</p>
              <p className="text-xs sm:text-sm font-normal text-gray-600 mt-0.5">
                {event.date} at {event.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

