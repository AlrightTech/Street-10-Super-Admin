import type { OrderStatus } from '../../pages/Orders'

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  active: 'bg-[#DCF6E5] text-[#118D57]',
  inactive: 'bg-[#FFE4DE] text-[#B71D18]',
}

const STATUS_LABEL: Record<OrderStatus, string> = {
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


