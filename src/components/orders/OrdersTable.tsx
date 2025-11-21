import { Fragment, type ReactNode } from 'react'
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
            <thead className="bg-white">
              <tr>
                <TableHeader>Order ID</TableHeader>
                <TableHeader withIcon>Name</TableHeader>
                <TableHeader>Product/Service</TableHeader>
                <TableHeader align="right">Amount</TableHeader>
                <TableHeader>Payment Method</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader align="right">Order Date</TableHeader>
                <TableHeader align="center">Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => {
                const orderNumber = startIndex + idx + 1
                const isHighlighted = orderNumber === 5 // Highlight row 5 as per reference image
                const isLastRow = idx === orders.length - 1
                
                return (
                  <tr 
                    key={order.id} 
                    className={`${isHighlighted ? 'bg-gray-50' : ''} hover:bg-gray-50 transition-colors ${!isLastRow ? 'border-b border-gray-200' : ''}`}
                  >
                    <TableCell>{orderNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={order.customerName} />
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
                          className={`font-medium text-gray-900 ${onNameClick ? 'cursor-pointer hover:text-gray-700 focus:text-gray-700 focus:outline-none' : ''}`}
                        >
                          {order.customerName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell align="right" className="whitespace-nowrap">{order.amount}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell align="right">{order.orderDate}</TableCell>
                    <TableCell align="center">
                      <OrdersActionMenu onSelect={(action) => onActionSelect?.(order, action)} />
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
  const textAlign = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  
  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 border-b border-gray-200 bg-white ${textAlign}`}
    >
      <span className="inline-flex items-center gap-1.5">
        {children}
        {withIcon && (
          <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
}

function TableCell({ children, className = '', align = 'left' }: TableCellProps) {
  const textAlign = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  
  // Extract custom padding from className if provided, otherwise use default
  const hasCustomPadding = className.match(/\bpy-\d+/)
  const paddingClass = hasCustomPadding ? '' : 'py-2'
  
  return (
    <td
      className={`px-4 ${paddingClass} text-sm text-gray-700 ${textAlign} ${className}`}
    >
      {children}
    </td>
  )
}

function Avatar({ name }: { name: string }) {
  const url = `https://i.pravatar.cc/48?img=${(name.length % 70) + 1}`
  return <img src={url} alt={name} className="h-9 w-9 rounded-full object-cover" />
}