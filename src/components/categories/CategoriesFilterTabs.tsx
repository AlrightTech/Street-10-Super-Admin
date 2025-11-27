interface CategoriesFilterTabsProps {
  tabs: Array<{ key: string; label: string }>
  activeTab: string
  onTabChange: (key: string) => void
  className?: string
}

export default function CategoriesFilterTabs({ tabs, activeTab, onTabChange, className = '' }: CategoriesFilterTabsProps) {
  return (
    <nav className={`flex flex-wrap items-center gap-2 sm:gap-4 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`px-2 sm:px-3 p-4 text-xs sm:text-sm
               font-medium transition-colors duration-150 border-b-2 cursor-pointer ${
              isActive
                ? 'text-black border-[#F7931E]'
                : 'text-gray-600 hover:text-gray-900 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}

