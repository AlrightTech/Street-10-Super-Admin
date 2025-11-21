import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChevronDownIcon } from '../icons/Icons'
import type { UserGrowthData } from '../../types/dashboard'

/**
 * UserGrowthChart component props
 */
export interface UserGrowthChartProps {
  data: UserGrowthData[]
}

/**
 * User growth line chart component
 */
export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <div className="flex h-full min-h-[280px] w-full min-w-0 sm:min-h-[350px] md:min-h-[400px] flex-col rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
      <div className="mb-3 sm:mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 sm:text-lg">User Growth</h3>
          <p className="text-xs sm:text-sm text-gray-600">Last 30 Days - 15%</p>
        </div>
        <div className="relative w-full max-w-[200px] sm:w-auto">
          <select className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-1.5 pr-7 text-xs text-gray-700 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 sm:w-auto sm:px-4 sm:py-2 sm:pr-8 sm:text-sm">
            <option>Year</option>
            <option>Month</option>
            <option>Week</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400 sm:h-4 sm:w-4" />
        </div>
      </div>
      <div className="flex-1 min-h-[180px] w-full min-w-0 sm:min-h-[250px] md:min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              stroke="#6b7280" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#3B82F6" 
              strokeWidth={2.5} 
              name="Users"
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="growth" 
              stroke="#FF8C00" 
              strokeWidth={2.5} 
              name="Growth %"
              dot={{ fill: '#FF8C00', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

