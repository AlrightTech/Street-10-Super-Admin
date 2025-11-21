import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { RevenueSegment } from '../../types/dashboard'

/**
 * RevenueChart component props
 */
export interface RevenueChartProps {
  data: RevenueSegment[]
  centerText?: string
}

/**
 * Revenue overview donut chart component
 */
export default function RevenueChart({ data, centerText = '+42%' }: RevenueChartProps) {
  const [radius, setRadius] = useState({ inner: 70, outer: 100 })

  useEffect(() => {
    const updateRadius = () => {
      const width = window.innerWidth
      if (width < 640) {
        setRadius({ inner: 45, outer: 70 }) // Mobile
      } else if (width < 1024) {
        setRadius({ inner: 60, outer: 90 }) // Tablet
      } else {
        setRadius({ inner: 70, outer: 100 }) // Desktop
      }
    }

    updateRadius()
    window.addEventListener('resize', updateRadius)
    return () => window.removeEventListener('resize', updateRadius)
  }, [])

  return (
    <div className="flex h-full min-h-[280px] w-full min-w-0 sm:min-h-[350px] md:min-h-[400px] flex-col rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
      <div className="mb-3 sm:mb-4 flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Revenue Breakdown</h3>
      </div>
      <div className="relative flex-1 min-h-[180px] w-full min-w-0 sm:min-h-[250px] md:min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={radius.inner}
              outerRadius={radius.outer}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{centerText}</p>
          <p className="text-[10px] sm:text-xs text-gray-600">than last year</p>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 flex flex-shrink-0 flex-wrap justify-center gap-2 sm:gap-3">
        {data.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-xs text-gray-600">{segment.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

