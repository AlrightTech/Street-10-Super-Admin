import type { CustomerInfo, OrderStatus } from '../../types/orderDetails'

/**
 * CustomerInformationCard component props
 */
export interface CustomerInformationCardProps {
  customer: CustomerInfo
  status: OrderStatus
}

/**
 * Customer information card component
 */
export default function CustomerInformationCard({ customer, status }: CustomerInformationCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden relative">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Customer Information</h3>
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <img
          src={customer.avatar}
          alt={customer.name}
          className="h-16 w-16 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="mb-1 text-lg font-semibold text-gray-900 break-words">{customer.name}</h4>
          <p className="mb-1 text-sm font-normal text-gray-600 break-words">{customer.email}</p>
          <p className="text-sm font-normal text-gray-600 break-words">{customer.phone}</p>
        </div>
      </div>
      <span className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 flex-shrink-0">
        {status === 'completed' ? 'Completed' : status === 'pending' ? 'Pending' : status === 'processing' ? 'Processing' : status === 'shipped' ? 'Shipped' : status === 'delivered' ? 'Delivered' : status === 'cancelled' ? 'Cancelled' : status}
      </span>
    </div>
  )
}

