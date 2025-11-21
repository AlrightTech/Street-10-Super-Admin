type FinanceStatus = 'paid' | 'refunded' | 'pending' | 'completed'

interface FinanceStatusBadgeProps {
  status: FinanceStatus
  className?: string
}

const STATUS_STYLES: Record<FinanceStatus, { bg: string; text: string }> = {
  paid: {
    bg: '#DCF6E5',
    text: '#118D57',
  },
  refunded: {
    bg: '#FFE4DE',
    text: '#B71D18',
  },
  pending: {
    bg: '#FFF2D6',
    text: '#B76E00',
  },
  completed: {
    bg: '#FFF2D6',
    text: '#B76E00',
  },
}

const STATUS_LABEL: Record<FinanceStatus, string> = {
  paid: 'Paid',
  refunded: 'Refunded',
  pending: 'Pending',
  completed: 'Completed',
}

export default function FinanceStatusBadge({ status, className = '' }: FinanceStatusBadgeProps) {
  const style = STATUS_STYLES[status]
  
  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium ${className}`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

export type { FinanceStatus }

