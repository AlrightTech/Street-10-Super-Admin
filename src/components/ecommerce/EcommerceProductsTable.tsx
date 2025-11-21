import { Fragment } from 'react'

export interface EcommerceProduct {
  id: string
  name: string
  category: string
  price: string
  stock: string
  status: 'active' | 'inactive'
  imageUrl?: string
}

interface EcommerceProductsTableProps {
  products: EcommerceProduct[]
  emptyState?: React.ReactNode
}

export default function EcommerceProductsTable({ products, emptyState }: EcommerceProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
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
      <div className="w-full overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full w-full border-collapse">
            <thead className="bg-white">
              <tr>
                <TableHeader>Product</TableHeader>
                <TableHeader>Category</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Stock</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader align="center">Action</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <span className="text-gray-900 font-medium text-sm">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">{product.category}</TableCell>
                  <TableCell className={`text-sm ${product.price === 'No bids' ? 'text-gray-700' : 'font-medium text-gray-900'}`}>{product.price}</TableCell>
                  <TableCell className="text-sm text-gray-700">{product.stock}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-[#DCF6E5] text-[#118D57]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      aria-label="More options"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
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
      className={`whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-black tracking-wider border-b border-gray-200 ${textAlign}`}
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
      className={`px-4 py-3 whitespace-nowrap ${textAlign} ${className}`}
    >
      {children}
    </td>
  )
}

