import { type ReactNode } from 'react'

export type MarketingFilterKey = 'all' | 'scheduled' | 'active' | 'expired'

type BadgeStyle = string | { active: string; inactive: string }

export interface MarketingFilterTab {
  key: MarketingFilterKey
  label: string
  count?: number
  icon?: ReactNode
  badgeClassName?: BadgeStyle
}

interface MarketingFilterTabsProps {
  tabs: MarketingFilterTab[]
  activeTab: MarketingFilterKey
  onTabChange: (key: MarketingFilterKey) => void
  className?: string
}

export default function MarketingFilterTabs({ tabs, activeTab, onTabChange, className = '' }: MarketingFilterTabsProps) {
  return (
    <nav className={`flex flex-wrap items-center gap-1 sm:gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`inline-flex items-center px-2 sm:px-3 pt-1.5 pb-3 text-sm font-medium transition-colors duration-150 ${
              isActive 
                ? 'text-black border-b-2 border-black relative z-10 -mb-px' 
                : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
            }`}
          >
            {tab.icon}
            <span className={tab.icon ? 'ml-1.5 sm:ml-2' : ''}>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className={`ml-1.5 sm:ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${resolveBadgeClasses(tab.badgeClassName, isActive)}`}>
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

