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

// Payment stage labels for auction orders
const PAYMENT_STAGE_LABEL: Record<string, string> = {
  down_payment_required: 'Down Payment Required',
  final_payment_required: 'Final Payment Required',
  full_payment_required: 'Full Payment Required',
  fully_paid: 'Fully Paid',
  settlement_missed: 'Settlement Missed',
}

const PAYMENT_STAGE_STYLES: Record<string, string> = {
  down_payment_required: 'bg-yellow-100 text-yellow-800',
  final_payment_required: 'bg-orange-100 text-orange-800',
  full_payment_required: 'bg-purple-100 text-purple-800',
  fully_paid: 'bg-[#DCF6E5] text-[#118D57]',
  settlement_missed: 'bg-[#FFE4DE] text-[#B71D18]',
}

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
  paymentStage?: string; // For auction orders
  auctionId?: string; // For auction orders
}

export default function OrderStatusBadge({ status, className = '', paymentStage, auctionId }: OrderStatusBadgeProps) {
  // For auction orders, show payment stage instead of status
  if (auctionId && paymentStage && PAYMENT_STAGE_LABEL[paymentStage]) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium ${PAYMENT_STAGE_STYLES[paymentStage] || STATUS_STYLES[status]} ${className}`}
      >
        {PAYMENT_STAGE_LABEL[paymentStage]}
      </span>
    )
  }
  
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]} ${className}`}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}


