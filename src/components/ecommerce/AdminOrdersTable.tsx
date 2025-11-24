import { useNavigate } from 'react-router-dom'
import AdminOrdersActionMenu from './AdminOrdersActionMenu'

export type AdminOrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded'

export interface AdminOrder {
  id: string
  placedOn: string
  type: string
  items: number
  amount: string
  paymentMethod: string
  status: AdminOrderStatus
}

interface AdminOrdersTableProps {
  orders: AdminOrder[]
  emptyState?: React.ReactNode
}

export default function AdminOrdersTable({ orders, emptyState }: AdminOrdersTableProps) {
  const navigate = useNavigate()

  const handleView = (order: AdminOrder) => {
    const path = `/ecommerce-products/orders/${order.id}`
    console.log('Navigating to:', path, 'Order ID:', order.id)
    navigate(path, { replace: false })
  }

  const handleEdit = (order: AdminOrder) => {
    // Navigate to edit page or show edit modal
    console.log('Edit order:', order.id)
    // navigate(`/ecommerce-products/orders/${order.id}/edit`)
  }

  const handleBlock = (order: AdminOrder) => {
    // Handle block action
    console.log('Block order:', order.id)
    // You can add confirmation dialog here
  }

  const handleRowClick = (order: AdminOrder) => {
    navigate(`/ecommerce-products/orders/${order.id}`)
  }
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
    <div className="w-full bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full w-full border-collapse">
          <thead className="bg-white">
            <tr>
              <TableHeader>Order ID</TableHeader>
              <TableHeader>Placed on</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Items</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Payment Method</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader align="center">Action</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white">
              {orders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50 border-b border-gray-200 cursor-pointer"
                  onClick={() => handleRowClick(order)}
                >
                  <TableCell className="text-xs sm:text-sm font-medium text-gray-900">{order.id}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-gray-700">{order.placedOn}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-gray-700">{order.type}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-gray-700">{order.items}</TableCell>
                  <TableCell className="text-xs sm:text-sm font-medium text-gray-900">{order.amount}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-gray-700">{order.paymentMethod}</TableCell>
                  <TableCell>
                    <AdminOrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell align="center">
                    <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                      <AdminOrdersActionMenu
                        onView={() => handleView(order)}
                        onEdit={() => handleEdit(order)}
                        onBlock={() => handleBlock(order)}
                      />
                    </div>
                  </TableCell>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminOrderStatusBadge({ status }: { status: AdminOrderStatus }) {
  const statusStyles: Record<AdminOrderStatus, string> = {
    pending: 'bg-[#FFF2D6] text-[#B76E00]',
    completed: 'bg-[#DCF6E5] text-[#118D57]',
    cancelled: 'bg-[#FFE4DE] text-[#B71D18]',
    refunded: 'bg-gray-100 text-gray-600',
  }

  const statusLabels: Record<AdminOrderStatus, string> = {
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  }

  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
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
      className={`whitespace-nowrap 
        px-2 sm:px-4 py-1 text-left text-xs sm:text-sm font-semibold text-gray-700 tracking-wider border-b border-gray-200 ${textAlign}`}
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

