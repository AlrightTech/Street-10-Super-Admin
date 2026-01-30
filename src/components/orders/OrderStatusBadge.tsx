import type { OrderStatus } from '../../pages/Orders'

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  created: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-[#DCF6E5] text-[#118D57]',
  fulfillment_pending: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-[#FFE4DE] text-[#B71D18]',
  active: 'bg-[#DCF6E5] text-[#118D57]',
  inactive: 'bg-[#FFE4DE] text-[#B71D18]',
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  created: 'Created',
  paid: 'Paid',
  fulfillment_pending: 'Fulfillment Pending',
  shipped: 'Shipped',
  delivered: 'Delivered',
  closed: 'Closed',
  cancelled: 'Cancelled',
  active: 'Active',
  inactive: 'Inactive',
}

export default function OrderStatusBadge({ status, className = '' }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]} ${className}`}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}


