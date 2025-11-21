import type { BiddingStatus } from '../../types/userDetails'

/**
 * StatusPill component props
 */
export interface StatusPillProps {
  status: BiddingStatus
  className?: string
}

/**
 * Status pill component for bidding status
 */
export default function StatusPill({ status, className = '' }: StatusPillProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'won-fully-paid':
        return {
          backgroundColor: '#10B981', // Green
          color: '#FFFFFF',
          text: 'Won - Fully Paid',
        }
      case 'won-payment-pending':
        return {
          backgroundColor: '#F59E0B', // Yellow/Orange
          color: '#FFFFFF',
          text: 'Won - Payment Pend...',
        }
      case 'lost':
        return {
          backgroundColor: '#EF4444', // Red
          color: '#FFFFFF',
          text: 'Lost',
        }
      case 'refunded':
        return {
          backgroundColor: '#6B7280', // Gray
          color: '#FFFFFF',
          text: 'Re-founded',
        }
      default:
        return {
          backgroundColor: '#6B7280',
          color: '#FFFFFF',
          text: status,
        }
    }
  }

  const styles = getStatusStyles()

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${className}`}
      style={{
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      }}
    >
      {styles.text}
    </span>
  )
}

