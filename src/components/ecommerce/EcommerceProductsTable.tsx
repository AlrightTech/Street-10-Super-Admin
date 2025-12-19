import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EcommerceProductsActionMenu from './EcommerceProductsActionMenu'
import { productsApi } from '../../services/products.api'

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
  onProductDeleted?: () => void
}

export default function EcommerceProductsTable({ products, emptyState, onProductDeleted }: EcommerceProductsTableProps) {
  const navigate = useNavigate()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleView = (productId: string) => {
    navigate(`/ecommerce-products/${productId}`)
  }

  const handleEdit = (productId: string) => {
    navigate(`/ecommerce-products/${productId}/edit`)
  }

  const handleDelete = async (productId: string, productName: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)
    if (!confirmed) return

    try {
      setDeletingId(productId)
      await productsApi.delete(productId)
      alert('Product deleted successfully!')
      // Refresh the list by calling the callback
      if (onProductDeleted) {
        onProductDeleted()
      }
    } catch (error: any) {
      console.error('Error deleting product:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete product'
      alert(`Error: ${errorMessage}`)
    } finally {
      setDeletingId(null)
    }
  }
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
    <div className="w-full bg-white">
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
                    <div className="flex items-center gap-2 sm:gap-3">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <span className="text-gray-900 font-medium text-xs sm:text-sm truncate">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-gray-700">{product.category}</TableCell>
                  <TableCell className={`text-xs sm:text-sm ${product.price === 'No bids' ? 'text-gray-700' : 'font-medium text-gray-900'}`}>{product.price}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-gray-700">{product.stock}</TableCell>
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
                    <EcommerceProductsActionMenu
                      onView={() => handleView(product.id)}
                      onEdit={() => handleEdit(product.id)}
                      onDelete={() => handleDelete(product.id, product.name)}
                    />
                  </TableCell>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
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
      className={`whitespace-nowrap px-2 sm:px-4 py-1 
        text-left text-xs sm:text-sm font-semibold text-black
         tracking-wider border-b border-gray-200 ${textAlign}`}
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
      className={`px-2 sm:px-4 py-2 whitespace-nowrap ${textAlign} ${className}`}
    >
      {children}
    </td>
  )
}

