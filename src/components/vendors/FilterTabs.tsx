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
              ? 'bg-transparent text-gray-900 border-b-2 border-gray-900'
              : 'bg-transparent text-gray-600 hover:bg-transparent border-b-2 border-transparent'
          }`}
        >
          {tab.label}
          <span
            className={`ml-2 rounded-md px-2  py-0.5 text-xs font-medium ${
              activeFilter === tab.id
                ? 'bg-[#6B46C1] text-white'
                : tab.id === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : tab.id === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : tab.id === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  )
}

