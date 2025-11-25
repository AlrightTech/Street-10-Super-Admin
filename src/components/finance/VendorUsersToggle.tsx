interface VendorUsersToggleProps {
  activeTab: 'vendor' | 'users'
  onTabChange: (tab: 'vendor' | 'users') => void
  className?: string
}

export default function VendorUsersToggle({ activeTab, onTabChange, className = '' }: VendorUsersToggleProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => onTabChange('users')}
        className={`px-4 py-2 text-sm font-medium transition-colors bg-white cursor-pointer ${
          activeTab === 'users'
            ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Users
      </button>
      <button
        type="button"
        onClick={() => onTabChange('vendor')}
        className={`px-4 py-2 text-sm font-medium transition-colors bg-white cursor-pointer ${
          activeTab === 'vendor'
            ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Vendors
      </button>
    </div>
  )
}

