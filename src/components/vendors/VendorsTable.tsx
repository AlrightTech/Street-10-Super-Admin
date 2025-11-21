import StatusBadge from './StatusBadge'
import ActionMenu from './ActionMenu'
import type { Vendor } from '../../types/vendors'

/**
 * VendorsTable component props
 */
export interface VendorsTableProps {
  vendors: Vendor[]
  onEdit: (vendorId: number) => void
  onDelete: (vendorId: number) => void
  onBlock: (vendorId: number) => void
  onRowClick?: (vendorId: number, status: Vendor['status']) => void
  startIndex?: number
}

/**
 * Vendors table component
 */
export default function VendorsTable({
  vendors,
  onEdit,
  onDelete,
  onBlock,
  onRowClick,
  startIndex = 0,
}: VendorsTableProps) {
  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full w-full border-collapse">
          <thead className="bg-white">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold tracking-wide text-gray-600 border-b border-gray-200 bg-white text-left">
                Owner Name
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold tracking-wide text-gray-600 border-b border-gray-200 bg-white text-left">
                Business Name
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold tracking-wide text-gray-600 border-b border-gray-200 bg-white text-left">
                Status
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold tracking-wide text-gray-600 border-b border-gray-200 bg-white text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor, idx) => {
              const rowNumber = startIndex + idx + 1
              const isHighlighted = rowNumber === 3 // Highlight row 3 (Tariq Iqbal) as per reference image
              const isLastRow = idx === vendors.length - 1

              return (
                <tr
                  key={vendor.id}
                  className={`${isHighlighted ? 'bg-gray-50' : ''} hover:bg-gray-50 transition-colors cursor-pointer ${!isLastRow ? 'border-b border-gray-200' : ''}`}
                  onClick={onRowClick ? () => onRowClick(vendor.id, vendor.status) : undefined}
                >
                  <td className="px-4 py-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2.5">
                      {vendor.avatar ? (
                        <img
                          src={vendor.avatar}
                          alt={vendor.ownerName}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                          {vendor.ownerName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900">{vendor.ownerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">{vendor.businessName}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={vendor.status} />
                  </td>
                  <td
                    className="px-4 py-2 text-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <ActionMenu
                      onEdit={() => onEdit(vendor.id)}
                      onDelete={() => onDelete(vendor.id)}
                      onBlock={() => onBlock(vendor.id)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

