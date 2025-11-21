import type { UserStatus } from '../../types/users'

/**
 * StatusBadge component props
 */
export interface StatusBadgeProps {
  status: UserStatus
  className?: string
}

/**
 * Status badge component with exact color mapping
 */
export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return {
          backgroundColor: '#E6F6E7',
          color: '#299D37',
        }
      case 'pending':
        return {
          backgroundColor: '#FFF7D6',
          color: '#B38700',
        }
      case 'blocked':
        return {
          backgroundColor: '#FFE6E6',
          color: '#C03434',
        }
      default:
        return {
          backgroundColor: '#E6F6E7',
          color: '#299D37',
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
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

