import { Fragment, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { OrderRecord } from '../../pages/Orders'
import OrderStatusBadge from './OrderStatusBadge'
import OrdersActionMenu, { type OrderActionType } from './OrdersActionMenu'

interface OrdersTableProps {
  orders: OrderRecord[]
  onActionSelect?: (order: OrderRecord, action: OrderActionType) => void
  onNameClick?: (order: OrderRecord) => void
  emptyState?: ReactNode
  startIndex?: number
}

export default function OrdersTable({ orders, onActionSelect, onNameClick, emptyState, startIndex = 0 }: OrdersTableProps) {
  const navigate = useNavigate()
  
  if (orders.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        {emptyState ?? (
          <>
            <p className="text-base font-semibold text-gray-800">No orders to show</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Try adjusting your filters or search criteria to see different orders.
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
            <thead className="bg-white dark:bg-gray-800 transition-colors">
              <tr>
                <TableHeader>Order ID</TableHeader>
                <TableHeader withIcon>Name</TableHeader>
                <TableHeader>Product/S</TableHeader>
                <TableHeader align="right">Amount</TableHeader>
                <TableHeader>Payment/M</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader align="right">Order Date</TableHeader>
                <TableHeader align="center">Action</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order, idx) => {
                const orderNumber = startIndex + idx + 1
                const isHighlighted = orderNumber === 5 // Highlight row 5 as per reference image
                const isLastRow = idx === orders.length - 1
                
                return (
                  <tr 
                    key={order.id} 
                    onClick={(e) => {
                      // Only navigate if clicking on the row itself, not on action menu or name
                      if ((e.target as HTMLElement).closest('button, [role="menuitem"], .cursor-pointer')) {
                        return
                      }
                      const orderId = (order as any).orderId || order.id.replace('#', '')
                      navigate(`/orders/${orderId}`)
                    }}
                    className={`${isHighlighted ? 'bg-gray-50 dark:bg-gray-700' : ''} 
                    hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer
                     ${!isLastRow ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                  >
                    <TableCell>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {order.id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={order.customerName} imageUrl={(order as any).customerImageUrl} />
                        <span
                          role={onNameClick ? 'button' : undefined}
                          tabIndex={onNameClick ? 0 : undefined}
                          onClick={() => onNameClick?.(order)}
                          onKeyDown={(event) => {
                            if ((event.key === 'Enter' || event.key === ' ') && onNameClick) {
                              event.preventDefault()
                              onNameClick(order)
                            }
                          }}
                          className={`font-medium text-gray-900 dark:text-gray-100 ${onNameClick ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 focus:text-gray-700 dark:focus:text-gray-300 focus:outline-none' : ''}`}
                        >
                          {order.customerName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const orderType = (order as any).orderType || 'admin-ecommerce';
                        const typeLabels: Record<string, { label: string; bg: string; text: string }> = {
                          'auction': { label: 'Auction', bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-700 dark:text-purple-300' },
                          'admin-ecommerce': { label: 'Admin E-commerce', bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-700 dark:text-blue-300' },
                          'vendor': { label: 'Vendor Order', bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-700 dark:text-orange-300' },
                        };
                        const typeInfo = typeLabels[orderType] || typeLabels['admin-ecommerce'];
                        return (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.text}`}>
                            {typeInfo.label}
                          </span>
                        );
                      })()}
                    </TableCell>
                    <TableCell align="right" className="whitespace-nowrap">{order.amountFormatted || `$${order.amount.toLocaleString()}`}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>
                      <OrderStatusBadge 
                        status={order.status} 
                        displayStatus={order.displayStatus}
                        refundStatus={(order as any).refundStatus}
                        paymentStage={(order as any).paymentStage}
                        auctionId={(order as any).auctionId}
                      />
                    </TableCell>
                    <TableCell align="right">{order.orderDate}</TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <div onClick={(e) => e.stopPropagation()}>
                        <OrdersActionMenu 
                          onSelect={(action) => {
                            // Action menu click should not trigger row navigation
                            onActionSelect?.(order, action)
                          }} 
                          orderStatus={order.status}
                        />
                      </div>
                    </TableCell>
                  </tr>
                )
              })}
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
  withIcon?: boolean
}

function TableHeader({ children, align = 'left', withIcon = false }: TableHeaderProps) {
  const textAlign = align === 'left' ? 'text-left' : align === 'center' ? 'text-center' : 'text-left'
  
  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-2 py-2 
        text-sm font-semibold 
        tracking-wide text-gray-600 dark:text-gray-300 
        border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${textAlign} transition-colors`}
    >
      <span className="inline-flex items-center gap-1.5">
        {children}
        {withIcon && (
          <svg className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </span>
    </th>
  )
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'right' | 'center'
  onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void
}

function TableCell({ children, className = '', align = 'left', onClick }: TableCellProps) {
  const textAlign = align === 'left' ? 'text-left' : align === 'center' ? 'text-center' : 'text-left'
  
  // Extract custom padding from className if provided, otherwise use default
  const hasCustomPadding = className.match(/\bpy-\d+/)
  const paddingClass = hasCustomPadding ? '' : 'py-2'
  
  return (
    <td
      onClick={onClick}
      className={`px-2 ${paddingClass} text-sm
       text-gray-700 dark:text-gray-300 ${textAlign} ${className}`}
    >
      {children}
    </td>
  )
}

function Avatar({ name, imageUrl }: { name: string; imageUrl?: string | null }) {
  // Use product image if available, otherwise use placeholder
  const url = imageUrl || `https://i.pravatar.cc/48?img=${(name.length % 70) + 1}`
  return (
    <img 
      src={url} 
      alt={name} 
      className="h-9 w-9 rounded-full object-cover"
      onError={(e) => {
        // Fallback to placeholder if image fails to load
        (e.target as HTMLImageElement).src = `https://i.pravatar.cc/48?img=${(name.length % 70) + 1}`
      }}
    />
  )
}