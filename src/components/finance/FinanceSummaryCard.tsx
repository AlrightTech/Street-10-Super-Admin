import { type ReactNode } from 'react'

interface FinanceSummaryCardProps {
  icon: ReactNode
  title: string
  value: string
  subtext: string
  iconBgColor: string
}

export default function FinanceSummaryCard({ icon, title, value, subtext, iconBgColor }: FinanceSummaryCardProps) {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 transition-colors hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Icon */}
          <div className="mb-3 flex items-center">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBgColor}`}>
              {icon}
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-sm font-normal text-gray-600 mb-2">{title}</h3>
          
          {/* Value */}
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{value}</p>
          
          {/* Subtext */}
          <p className="text-xs sm:text-sm text-gray-500">{subtext}</p>
        </div>
      </div>
    </div>
  )
}

