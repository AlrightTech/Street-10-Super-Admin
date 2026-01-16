import type { VendorStatus } from '../../types/vendors'

interface FilterTabsProps {
  activeFilter: 'all' | VendorStatus
  onFilterChange: (filter: 'all' | VendorStatus) => void
  counts: {
    all: number
    pending: number
    approved: number
    rejected: number
  }
}

export default function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  const tabs = [
    { id: 'all' as const, label: 'All', count: counts.all },
    { id: 'pending' as const, label: 'Pending', count: counts.pending },
    { id: 'approved' as const, label: 'Approved', count: counts.approved },
    { id: 'rejected' as const, label: 'Rejected', count: counts.rejected },
  ]

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onFilterChange(tab.id)}
          className={`relative px-4 p-3 text-sm font-medium transition-colors cursor-pointer ${
            activeFilter === tab.id
              ? 'bg-transparent text-[#F7931E] dark:text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border-b-2 border-transparent'
          }`}
        >
          {tab.label}
          <span
            className={`ml-2 rounded-md px-2  py-0.5 text-xs font-medium ${
              activeFilter === tab.id
                ? 'bg-[#6B46C1] text-white'
                : tab.id === 'pending'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                  : tab.id === 'approved'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    : tab.id === 'rejected'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  )
}

