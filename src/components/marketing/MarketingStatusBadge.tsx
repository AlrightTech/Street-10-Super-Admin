/**
 * Marketing status badge component
 */

export type MarketingStatus = 'active' | 'scheduled' | 'expired'

interface MarketingStatusBadgeProps {
  status: MarketingStatus
  className?: string
}

const STATUS_STYLES: Record<MarketingStatus, { bg: string; text: string }> = {
  active: {
    bg: '#DCF6E5',
    text: '#118D57',
  },
  scheduled: {
    bg: '#FFF2D6',
    text: '#B76E00',
  },
  expired: {
    bg: '#FFE4DE',
    text: '#B71D18',
  },
}

const STATUS_LABEL: Record<MarketingStatus, string> = {
  active: 'Active',
  scheduled: 'Scheduled',
  expired: 'Expired',
}

export default function MarketingStatusBadge({ status, className = '' }: MarketingStatusBadgeProps) {
  const style = STATUS_STYLES[status]
  
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

