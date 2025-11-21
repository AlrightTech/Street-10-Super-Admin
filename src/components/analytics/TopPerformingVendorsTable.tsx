import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import type { TopPerformingVendor } from '../../types/analytics'

/**
 * TopPerformingVendorsTable component props
 */
export interface TopPerformingVendorsTableProps {
  vendors: TopPerformingVendor[]
}

/**
 * Top performing vendors table component
 */
export default function TopPerformingVendorsTable({ vendors }: TopPerformingVendorsTableProps) {
  const navigate = useNavigate()

  const handleViewAll = () => {
    navigate('/analytics/top-performer-detail')
  }

  return (
    <div>
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Top Performing Vendors</h3>
        <Button 
          variant="primary" 
          className="rounded-lg text-[11px] px-3.5 py-2 cursor-pointer sm:text-xs sm:px-4 sm:py-2 w-full sm:w-auto"
          onClick={handleViewAll}
        >
          View All
        </Button>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="max-h-[360px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
            <table className="w-full min-w-[600px]">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-gray-200">
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal bg-white">
                    Vendor Name
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal bg-white">
                    Total Orders
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal bg-white">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-sm text-gray-900 whitespace-nowrap sm:whitespace-normal sm:break-words">
                      {vendor.vendorName}
                    </td>
                    <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal">
                      {vendor.totalOrders}
                    </td>
                    <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal">
                      {vendor.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

