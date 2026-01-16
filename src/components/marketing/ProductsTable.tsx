import { Fragment, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import MarketingStatusBadge, { type MarketingStatus } from './MarketingStatusBadge'
import ProductsActionMenu, { type ProductActionType } from './ProductsActionMenu'

export interface Product {
  id: string
  product: string
  vendor: string
  category: string
  startDate: string
  endDate: string
  priority: 'High' | 'Medium' | 'Low'
  status: MarketingStatus
}

interface ProductsTableProps {
  products: Product[]
  emptyState?: ReactNode
  startIndex?: number
  onActionSelect?: (product: Product, action: ProductActionType) => void
}

export default function ProductsTable({ products, emptyState, onActionSelect }: ProductsTableProps) {
  const navigate = useNavigate()

  const handleRowClick = (product: Product, event: React.MouseEvent) => {
    // Don't navigate if clicking on the action menu or its buttons
    const target = event.target as HTMLElement
    if (
      target.closest('[role="menu"]') || 
      target.closest('button[aria-haspopup="menu"]') ||
      target.closest('[role="menuitem"]') ||
      target.closest('.relative.inline-flex')
    ) {
      return
    }

    if (product.status === 'active') {
      navigate(`/marketing/product/active/${product.id}`)
    } else if (product.status === 'scheduled') {
      navigate(`/marketing/product/scheduled/${product.id}`)
    } else if (product.status === 'expired') {
      navigate(`/marketing/product/expired/${product.id}`)
    }
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col  items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        {emptyState ?? (
          <>
            <p className="text-base font-semibold text-gray-800">No products to show</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Try adjusting your filters or search criteria to see different products.
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <Fragment>
      <div className="w-full rounded-xl overflow-hidden">
        <div className="overflow-x-auto md:overflow-x-visible">
          <table className="w-full border-collapse text-sm min-w-[600px] md:min-w-0">
              <thead className="bg-white dark:bg-gray-800 sticky top-0 z-10 transition-colors">
                <tr>
                  <TableHeader>Product</TableHeader>
                  <TableHeader>Vendor</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Start Date</TableHeader>
                  <TableHeader>End Date</TableHeader>
                  <TableHeader>Priority</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader align="center">Action</TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product, index) => (
                  <tr 
                    key={product.id}
                    onClick={(e) => handleRowClick(product, e)}
                    className={`border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      index === 4 ? 'bg-gray-50 dark:bg-gray-700' : ''
                    }`}
                  >
                    <TableCell>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm">{product.product}</span>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{product.vendor}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{product.category}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">{product.startDate}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">{product.endDate}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${
                        product.priority === 'High' ? 'text-red-600 dark:text-red-400' : 
                        product.priority === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-gray-600 dark:text-gray-300'
                      }`}>
                        {product.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <MarketingStatusBadge status={product.status} />
                    </TableCell>
                    <TableCell align="center" className="relative z-10">
                      <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <ProductsActionMenu onSelect={(action) => onActionSelect?.(product, action)} />
                      </div>
                    </TableCell>
                  </tr>
                ))}
            </tbody>
          </table>
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
      className={`whitespace-nowrap px-2 sm:px-3 
        md:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold 
         tracking-wide text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 ${textAlign} transition-colors`}
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
    <td
      className={`px-2 sm:px-3 md:px-5 py-2 text-gray-700 dark:text-gray-300 ${textAlign} ${className}`}
    >
      {children}
    </td>
  )
}

