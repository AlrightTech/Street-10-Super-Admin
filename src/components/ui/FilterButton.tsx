/**
 * FilterButton component props
 */
export interface FilterButtonProps {
  label: string
  count?: number
  active?: boolean
  onClick?: () => void
  variant?: 'all' | 'active' | 'inactive'
  className?: string
}

/**
 * Filter button component for tables
 */
export default function FilterButton({
  label,
  count,
  active = false,
  onClick,
  variant = 'all',
  className = '',
}: FilterButtonProps) {
  const getBadgeClasses = () => {
    switch (variant) {
      case 'all':
        return 'bg-[#4C50A2] text-white' // Dark purple badge
      case 'active':
        return 'bg-green-100 text-green-700' // Light green badge with dark green text
      case 'inactive':
        return 'bg-orange-100 text-orange-700' // Light orange badge with dark orange text
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2
         bg-transparent px-0 p-3  text-sm font-medium
          text-gray-700 dark:text-gray-300 cursor-pointer transition-colors
           ${active ? 'border-gray-700 dark:border-gray-400 border-b-2 ' : 'border-gray-300 dark:border-gray-600'} ${className}`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${getBadgeClasses()}`}>
          {count}
        </span>
      )}
    </button>
  )
}

