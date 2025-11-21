import { Fragment, type ReactNode } from 'react'
import type { CategoryRecord } from '../../pages/Categories'
import { EditIcon, TrashIcon, LaptopIcon, SmartphoneIcon, ShirtIcon, UserIcon, HomeIcon } from '../icons/Icons'
import { LinkIcon } from '../icons/Icons'

interface CategoriesTableProps {
  categories: CategoryRecord[]
  onEdit?: (category: CategoryRecord) => void
  onDelete?: (category: CategoryRecord) => void
  onToggleStatus?: (category: CategoryRecord) => void
  emptyState?: ReactNode
  startIndex?: number
}

/**
 * Status toggle switch component
 */
function StatusToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full border border-transparent px-1 transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      } cursor-pointer`}
      aria-pressed={checked}
      aria-label="Toggle status"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

/**
 * Category icon component
 */
function CategoryIcon({ iconName }: { iconName: string }) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    laptop: LaptopIcon,
    smartphone: SmartphoneIcon,
    shirt: ShirtIcon,
    person: UserIcon,
    home: HomeIcon,
  }

  const IconComponent = iconMap[iconName] || LaptopIcon
  const colorMap: Record<string, string> = {
    laptop: 'text-blue-600',
    smartphone: 'text-green-600',
    shirt: 'text-purple-600',
    person: 'text-pink-600',
    home: 'text-orange-600',
  }

  return <IconComponent className={`h-5 w-5 ${colorMap[iconName] || 'text-gray-600'}`} />
}

export default function CategoriesTable({
  categories,
  onEdit,
  onDelete,
  onToggleStatus,
  emptyState,
  startIndex = 0,
}: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        {emptyState ?? (
          <>
            <p className="text-base font-semibold text-gray-800">No categories to show</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Try adjusting your filters or search criteria to see different categories.
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <Fragment>
      <div className="w-full overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full w-full border-collapse divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <TableHeader>ID</TableHeader>
                    <TableHeader>Category Name</TableHeader>
                    <TableHeader>Parent Category</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader align="center">Actions</TableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category, idx) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>{String(startIndex + idx + 1).padStart(3, '0')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CategoryIcon iconName={category.icon} />
                          <span className="text-gray-700 text-xs sm:text-sm font-medium truncate max-w-[150px] sm:max-w-none">
                            {category.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {category.parentCategory ? (
                          <span className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs sm:text-sm cursor-pointer truncate max-w-[120px] sm:max-w-none">
                            <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">{category.parentCategory}</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs sm:text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusToggle checked={category.status === 'active'} onChange={() => onToggleStatus?.(category)} />
                      </TableCell>
                      <TableCell align="center">
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit?.(category)}
                        className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded cursor-pointer"
                        aria-label="Edit category"
                      >
                        <EditIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(category)}
                        className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded cursor-pointer"
                        aria-label="Delete category"
                      >
                        <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                        </div>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

interface TableHeaderProps {
  children: React.ReactNode
  align?: 'left' | 'right' | 'center'
}

function TableHeader({ children, align = 'left' }: TableHeaderProps) {
  const textAlign = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'

  return (
    <th
      scope="col"
      className={`px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 ${textAlign} whitespace-nowrap`}
    >
      {children}
    </th>
  )
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'right' | 'center'
}

function TableCell({ children, className = '', align = 'left' }: TableCellProps) {
  const textAlign = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'

  return (
    <td className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 ${textAlign} ${className}`}>
      {children}
    </td>
  )
}
