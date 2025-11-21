import { Fragment, type ReactNode } from 'react'
import type { UserTransaction } from '../../pages/Finance'
import FinanceActionMenu, { type FinanceActionType } from './FinanceActionMenu'

interface UserTransactionsTableProps {
  transactions: UserTransaction[]
  onActionSelect?: (transaction: UserTransaction, action: FinanceActionType) => void
  emptyState?: ReactNode
  startIndex?: number
}

export default function UserTransactionsTable({ transactions, onActionSelect, emptyState }: UserTransactionsTableProps) {
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
                <TableHeader>User/Vendor</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader align="right">Amount</TableHeader>
                <TableHeader>Payment Method</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader align="center">Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-200 last:border-b-0">
                  <TableCell>{transaction.transactionId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">{transaction.userName}</span>
                      <span className="text-xs text-gray-500">{transaction.userEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                    </span>
                  </TableCell>
                  <TableCell align="right" className="font-medium">{transaction.amount}</TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell className="text-xs">{transaction.date}</TableCell>
                  <TableCell>
                    <UserTransactionStatusBadge status={transaction.status} />
                  </TableCell>
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

type UserTransactionStatus = 'pending' | 'completed' | 'failed'

interface UserTransactionStatusBadgeProps {
  status: UserTransactionStatus
  className?: string
}

const USER_STATUS_STYLES: Record<UserTransactionStatus, { bg: string; text: string }> = {
  pending: {
    bg: '#FFF2D6',
    text: '#B76E00',
  },
  completed: {
    bg: '#DCF6E5',
    text: '#118D57',
  },
  failed: {
    bg: '#FFE4DE',
    text: '#B71D18',
  },
}

const USER_STATUS_LABEL: Record<UserTransactionStatus, string> = {
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed',
}

function UserTransactionStatusBadge({ status, className = '' }: UserTransactionStatusBadgeProps) {
  const style = USER_STATUS_STYLES[status]
  
  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium ${className}`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {USER_STATUS_LABEL[status]}
    </span>
  )
}

