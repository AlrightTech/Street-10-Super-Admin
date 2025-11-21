import type { VendorStatus } from '../../types/vendors'
import { useTranslation } from '../../hooks/useTranslation'

interface StatusBadgeProps {
  status: VendorStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { translateStatus } = useTranslation()
  
  const getStatusStyles = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyles()}`}>
      {translateStatus(status)}
    </span>
  )
}

