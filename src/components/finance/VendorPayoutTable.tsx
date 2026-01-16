import { Fragment, type ReactNode } from 'react'
import FinanceActionMenu, { type FinanceActionType } from './FinanceActionMenu'

export interface VendorPayout {
  id: number
  name: string
  businessName: string
  totalSales: string
  commissionRate: string
  totalCommission: string
  status: 'active' | 'pending' | 'blocked'
  totalPayout: string
  paymentStatus: 'paid' | 'pending' | 'unpaid'
  avatar?: string
}

interface VendorPayoutTableProps {
  payouts: VendorPayout[]
  onActionSelect?: (payout: VendorPayout, action: FinanceActionType) => void
  onRowClick?: (payout: VendorPayout) => void
  emptyState?: ReactNode
  startIndex?: number
}

export default function VendorPayoutTable({ payouts, onActionSelect, onRowClick, emptyState, startIndex = 0 }: VendorPayoutTableProps) {
  if (payouts.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center
       justify-center rounded-2xl border border-dashed
        border-gray-200 bg-gray-50 py-12 text-center">
        {emptyState ?? (
          <>
            <p className="text-base font-semibold text-gray-800">No payouts to show</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Try adjusting your filters or search criteria to see different payouts.
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
          <table className="min-w-[1200px] md:min-w-full w-full border-collapse text-sm">
            <thead className="bg-white dark:bg-gray-800 transition-colors">
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Business/N</TableHeader>
                <TableHeader align="right">Total/S</TableHeader>
                <TableHeader align="right">Commission%</TableHeader>
                <TableHeader align="right">Total/C</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader align="right">Total Payout</TableHeader>
                <TableHeader>Payment/S</TableHeader>
                <TableHeader align="center">Action</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {payouts.map((payout, index) => (
                <tr 
                  key={payout.id} 
                  className={`border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors' : ''}`}
                  onClick={() => onRowClick?.(payout)}
                >
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar name={payout.name} avatar={payout.avatar} />
                      <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{payout.name}</span>
                      <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">{payout.businessName}</TableCell>
                  <TableCell align="right" className="text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">{payout.totalSales}</TableCell>
                  <TableCell align="right" className="text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">{payout.commissionRate}</TableCell>
                  <TableCell align="right" className="text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">{payout.totalCommission}</TableCell>
                  <TableCell>
                    <StatusBadge status={payout.status} />
                  </TableCell>
                  <TableCell align="right" className="text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">{payout.totalPayout}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payout.paymentStatus} />
                  </TableCell>
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <FinanceActionMenu onSelect={(action) => onActionSelect?.(payout, action)} />
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
  const textAlign = align === 'left' ? 'text-left'
   : align === 'center' ? 'text-center' : 'text-left'
  
  return (
    <th
      scope="col"
      className={`whitespace-nowrap py-2
         text-xs
          sm:text-sm font-semibold tracking-wide
           text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800 ${textAlign} first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 transition-colors`}
    >
      {children}
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
  
  return (
    <td
      onClick={onClick}
      className={`py-2 text-gray-700 dark:text-gray-300 ${textAlign} text-sm first:pl-4
       sm:first:pl-6 last:pr-4 sm:last:pr-6 ${className}`}
    >
      {children}
    </td>
  )
}

function Avatar({ name, avatar }: { name: string; avatar?: string }) {
  const url = avatar || `https://i.pravatar.cc/48?img=${(name.length % 70) + 1}`
  return <img src={url} alt={name} className="h-8 w-8 
  rounded-full object-cover ring-1 ring-gray-200 shadow-sm" />
}

function StatusBadge({ status }: { status: 'active' | 'pending' | 'blocked' }) {
  const styles = {
    active: { bg: '#DCF6E5', text: '#118D57', label: 'Active' },
    pending: { bg: '#FFF2D6', text: '#B76E00', label: 'Pending' },
    blocked: { bg: '#FFE4DE', text: '#B71D18', label: 'Blocked' },
  }
  
  const style = styles[status]
  
  return (
    <span
      className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  )
}

function PaymentStatusBadge({ status }: { status: 'paid' | 'pending' | 'unpaid' }) {
  const styles = {
    paid: { bg: '#DCF6E5', text: '#118D57', label: 'Paid' },
    pending: { bg: '#FFE4DE', text: '#B71D18', label: 'Pending' },
    unpaid: { bg: '#FFF2D6', text: '#B76E00', label: 'Unpaid' },
  }
  
  const style = styles[status]
  
  return (
    <span
      className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  )
}

