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
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden">
      <h3 className="mb-4 text-base font-medium text-gray-900">Order Timeline</h3>
      <div className="space-y-2">
        {timeline.map((event) => (
          <div key={event.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 flex-shrink-0 rounded-full bg-green-500"></div>
              <p className="text-sm font-normal text-gray-900">{event.status}</p>
            </div>
            <p className="text-sm font-normal text-gray-600 sm:text-right">
              {event.date} at {event.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

