import { Fragment } from 'react'
import BiddingProductsActionMenu from './BiddingProductsActionMenu'

export type BiddingProductStatus = 'ended-unsold' | 'payment-requested' | 'fully-paid-sold' | 'scheduled'

export interface BiddingProduct {
  id: string // Auction ID
  productId: string // Product ID (for deletion)
  name: string
  category: string
  startingPrice: string
  currentBid: string
  bids: number
  timeLeft: string
  status: BiddingProductStatus
  imageUrl?: string
}

interface BiddingProductsTableProps {
  products: BiddingProduct[]
  emptyState?: React.ReactNode
  onView?: (product: BiddingProduct) => void
  onDelete?: (product: BiddingProduct) => void
}

export default function BiddingProductsTable({ products, emptyState, onView, onDelete }: BiddingProductsTableProps) {
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
      <div className="w-full">
        <div className="overflow-x-auto lg:overflow-x-visible">
          <table className="w-full border-collapse bg-white">
            <colgroup>
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: '140px', minWidth: '140px' }} />
              <col style={{ width: 'auto' }} />
            </colgroup>
            <thead className="bg-white">
              <tr>
                <TableHeader>Product</TableHeader>
                <TableHeader>Starting Price</TableHeader>
                <TableHeader>Current Bid</TableHeader>
                <TableHeader>Bids</TableHeader>
                <TableHeader>Time Left</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader align="center">Action</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products.map((product, index) => (
                <tr key={product.id} className={`hover:bg-gray-50 border-b border-gray-200 ${index === products.length - 1 ? 'border-b-0' : ''}`}>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-3 min-w-0">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-gray-900 font-normal text-sm truncate">{product.name}</span>
                        <span className="text-gray-500 text-xs mt-0.5 truncate">{product.category}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-900 font-normal py-2 whitespace-nowrap">{product.startingPrice}</TableCell>
                  <TableCell className="text-sm text-gray-900 font-normal py-2 whitespace-nowrap">{product.currentBid}</TableCell>
                  <TableCell className="text-sm text-gray-600 font-normal py-2 whitespace-nowrap">{product.bids}</TableCell>
                  <TableCell className="text-sm text-gray-600 font-normal py-2 whitespace-nowrap">{product.timeLeft}</TableCell>
                  <TableCell className="py-2 max-w-[140px] text-xs">
                    <div className="flex items-center  justify-start">
                      <BiddingProductStatusBadge status={product.status} />
                    </div>
                  </TableCell>
                  <TableCell align="center" className="py-2 whitespace-nowrap">
                    <BiddingProductsActionMenu
                      onView={() => onView?.(product)}
                      onDelete={() => onDelete?.(product)}
                      align="right"
                    />
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

function BiddingProductStatusBadge({ status }: { status: BiddingProductStatus }) {
  const statusStyles: Record<BiddingProductStatus, string> = {
    'ended-unsold': 'bg-black text-white',
    'payment-requested': 'bg-[#F7931E] text-white',
    'fully-paid-sold': 'bg-[#FF6B6B] text-white',
    'scheduled': 'bg-[#118D57] text-white',
  }

  const statusLabels: Record<BiddingProductStatus, string> = {
    'ended-unsold': 'Ended - Unsold',
    'payment-requested': 'Payment Requested',
    'fully-paid-sold': 'Fully Paid - Sold',
    'scheduled': 'Scheduled',
  }

  // Reduce padding for longer status text to prevent overflow
  const isLongText = status === 'payment-requested' || status === 'fully-paid-sold'
  const paddingClass = isLongText ? 'px-1.5 py-1' : 'px-2 py-1'
  
  return (
    <span
      className={`inline-flex items-center justify-center rounded ${paddingClass} text-xs font-medium whitespace-nowrap ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
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
      className={`px-4 py-3 text-sm font-semibold text-gray-700 tracking-wider border-b border-gray-300 bg-white whitespace-nowrap ${textAlign}`}
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
      className={`px-4 text-sm ${textAlign} ${className}`}
    >
      {children}
    </td>
  )
}

