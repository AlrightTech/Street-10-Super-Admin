import { type ReactNode } from 'react'

export type FinanceFilterKey = 'all' | 'refunded' | 'paid' | 'pending' | 'completed' | 'failed'

type BadgeStyle = string | { active: string; inactive: string }

export interface FinanceFilterTab {
  key: FinanceFilterKey
  label: string
  count?: number
  icon?: ReactNode
  badgeClassName?: BadgeStyle
}

interface FinanceFilterTabsProps {
  tabs: FinanceFilterTab[]
  activeTab: FinanceFilterKey
  onTabChange: (key: FinanceFilterKey) => void
  className?: string
}

export default function FinanceFilterTabs({ tabs, activeTab, onTabChange, className = '' }: FinanceFilterTabsProps) {
  return (
    <nav className={`flex flex-wrap items-center gap-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`inline-flex items-center p-2
               text-sm font-medium transition-colors
                duration-150 cursor-pointer ${
              isActive 
                ? 'text-[#F7931E] dark:text-[#F7931E] border-b-2 border-[#F7931E] relative z-10 -mb-px' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border-b-2 border-transparent'
            }`}
          >
            {tab.icon}
            <span className={tab.icon ? 'ml-1 sm:ml-1.5' : ''}>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className={`ml-1 sm:ml-1.5 rounded-md
               px-1.5 sm:px-2 py-1 text-xs sm:text-xs font-semibold ${resolveBadgeClasses(tab.badgeClassName, isActive)}`}>
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

function resolveBadgeClasses(badgeClassName: BadgeStyle | undefined, isActive: boolean) {
  if (!badgeClassName) {
    return isActive ? 'bg-[#4C50A2] text-white' : 'bg-[#4C50A2] text-white'
  }

  if (typeof badgeClassName === 'string') {
    return badgeClassName
  }

  return isActive ? badgeClassName.active : badgeClassName.inactive
}

