import { type ReactNode } from 'react'

export type OrdersTabKey = string

type BadgeStyle = string | { active: string; inactive: string }

export interface OrdersFilterTab {
  key: OrdersTabKey
  label: string
  count?: number
  icon?: ReactNode
  badgeClassName?: BadgeStyle
}

interface OrdersFilterTabsProps {
  tabs: OrdersFilterTab[]
  activeTab: OrdersTabKey
  onTabChange: (key: OrdersTabKey) => void
  className?: string
}

export default function OrdersFilterTabs({ tabs, activeTab, onTabChange, className = '' }: OrdersFilterTabsProps) {
  return (
    <nav className={`flex flex-nowrap items-center gap-1 -mx-1 px-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`inline-flex items-center px-2 sm:px-3 pt-1.5 pb-3 text-xs sm:text-sm font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
              isActive 
                ? 'text-black border-b-2 border-black relative z-10 -mb-px' 
                : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
            }`}
          >
            {tab.icon}
            <span className={tab.icon ? 'ml-1 sm:ml-2' : ''}>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className={`ml-1 sm:ml-2 rounded-lg px-2 py-0.5 text-xs font-semibold ${resolveBadgeClasses(tab.badgeClassName, isActive)}`}>
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
    return isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
  }

  if (typeof badgeClassName === 'string') {
    return badgeClassName
  }

  return isActive ? badgeClassName.active : badgeClassName.inactive
}



