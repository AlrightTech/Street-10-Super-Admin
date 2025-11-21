import { Fragment, type ReactNode } from 'react'
import type { FinanceTransaction } from '../../pages/Finance'
import FinanceStatusBadge from './FinanceStatusBadge'
import FinanceActionMenu, { type FinanceActionType } from './FinanceActionMenu'

interface FinanceTableProps {
  transactions: FinanceTransaction[]
  onActionSelect?: (transaction: FinanceTransaction, action: FinanceActionType) => void
  emptyState?: ReactNode
  startIndex?: number
}

export default function FinanceTable({ transactions, onActionSelect, emptyState }: FinanceTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        {emptyState ?? (
          <>
            <p className="text-base font-semibold text-gray-800">No transactions to show</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Try adjusting your filters or search criteria to see different transactions.
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <Fragment>
      <div className="w-full rounded-xl" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
        <div className="overflow-x-auto md:overflow-x-visible">
          <table className="min-w-[900px] md:min-w-full w-full border-collapse text-sm">
            <thead className="bg-transparent">
              <tr>
                <TableHeader>Transaction ID</TableHeader>
                <TableHeader>User</TableHeader>
                <TableHeader>Order ID</TableHeader>
                <TableHeader align="right">Amount Paid</TableHeader>
                <TableHeader align="right">Commission</TableHeader>
                <TableHeader>Payment Method</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader align="right">Order Date</TableHeader>
                <TableHeader align="center">Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-200 last:border-b-0">
                  <TableCell>{transaction.transactionId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar name={transaction.user} />
                      <span className="text-gray-700 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{transaction.user}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{transaction.orderId}</TableCell>
                  <TableCell align="right" className="text-xs sm:text-sm whitespace-nowrap">{transaction.amountPaid}</TableCell>
                  <TableCell align="right" className="text-xs sm:text-sm whitespace-nowrap">{transaction.commission}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{transaction.paymentMethod}</TableCell>
                  <TableCell>
                    <FinanceStatusBadge status={transaction.status} />
                  </TableCell>
                  <TableCell align="right" className="text-xs">{transaction.orderDate}</TableCell>
                  <TableCell align="center">
                    <FinanceActionMenu onSelect={(action) => onActionSelect?.(transaction, action)} />
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
      className={`whitespace-nowrap px-2 sm:px-2.5 md:px-3 py-2 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b-2 border-gray-300 bg-white ${textAlign}`}
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
  const hasCustomTextSize = className.match(/\btext-(xs|sm|base|lg|xl)\b/)
  const textSizeClass = hasCustomTextSize ? hasCustomTextSize[0] : 'text-sm'
  
  return (
    <td
      className={`px-2 sm:px-2.5 md:px-3 py-2 text-gray-700 ${textAlign} ${textSizeClass} ${className}`}
    >
      {children}
    </td>
  )
}

function Avatar({ name }: { name: string }) {
  const url = `https://i.pravatar.cc/48?img=${(name.length % 70) + 1}`
  return <img src={url} alt={name} className="h-7 w-7 rounded-full object-cover ring-1 ring-gray-200 shadow-sm" />
}

