import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusPill from './StatusPill'
import ActionDropdown from './ActionDropdown'
import FilterDropdown from './FilterDropdown'
import type { UserDetails, BiddingItem, OrderItem } from '../../types/userDetails'

/**
 * OrderHistoryTable component props
 */
export interface OrderHistoryTableProps {
  user: UserDetails
  onEdit?: (item: BiddingItem | OrderItem) => void
  onBlock?: (item: BiddingItem | OrderItem) => void
  onDelete?: (item: BiddingItem | OrderItem) => void
}

/**
 * Order history table component with tabs
 */
export default function OrderHistoryTable({ user, onEdit, onBlock, onDelete }: OrderHistoryTableProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'orders' | 'biddings'>('biddings')

  const handleEdit = (item: BiddingItem | OrderItem) => {
    onEdit?.(item)
  }

  const handleBlock = (item: BiddingItem | OrderItem) => {
    onBlock?.(item)
  }

  const handleDelete = (item: BiddingItem | OrderItem) => {
    onDelete?.(item)
  }

  // Format amount with commas
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })
  }

  return (
      <div className="overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">

        
      {/* Title */}

      {/* Tabs and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center px-4 py-3 sm:py-0 justify-between gap-3 sm:gap-0 border-b border-gray-200">
        <div className="flex gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`p-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'text-gray-900 font-semibold border-b-2 border-gray-900'
                : 'text-gray-600'
            }`}
          >
            Orders ({user.orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('biddings')}
            className={`p-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'biddings'
                ? 'text-gray-900 font-semibold border-b-2 border-gray-900'
                : 'text-gray-600'
            }`}
          >
            Biddings ({user.biddings.length})
          </button>
        </div>
        <div className="flex-shrink-0">
          <FilterDropdown
            label="All"
            options={['All', 'Won', 'Lost', 'Pending']}
            onSelect={() => {}}
            className=''
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <div className="max-h-[360px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
          <table className="min-w-[800px] md:min-w-0 md:w-full w-full">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b text-left border-gray-200">
                <th className="text-sm font-semibold py-2 px-4 text-gray-700 whitespace-nowrap bg-white">Product</th>
                <th className="text-sm font-semibold py-2 px-4 text-gray-700 whitespace-nowrap bg-white">Bid ID</th>
                <th className="text-sm font-semibold py-2 px-4 text-gray-700 whitespace-nowrap bg-white">Bid Amount</th>
                <th className="text-sm font-semibold py-2 px-4 text-gray-700 whitespace-nowrap bg-white">Current Price</th>
                <th className="text-sm font-semibold py-2 px-4 text-gray-700 whitespace-nowrap bg-white">Result</th>
                <th className="text-sm font-semibold py-2 px-4 text-gray-700 whitespace-nowrap bg-white">End Date</th>
                <th className="text-sm font-semibold py-2 px-4 text-gray-700 whitespace-nowrap bg-white">Status</th>
                <th className="text-sm font-semibold py-2 px-4 text-gray-700 whitespace-nowrap bg-white">Action</th>
              </tr>
            </thead>
            <tbody>
            {activeTab === 'biddings' &&
              user.biddings.map((bidding) => (
                <tr 
                  key={bidding.id} 
                  className="hover:bg-gray-50 border-b border-gray-200 text-left transition-colors cursor-pointer"
                  onClick={() => navigate(`/biddings/${bidding.bidId}`)}
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={bidding.productImage}
                        alt={bidding.productName}
                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-normal text-gray-900 truncate">{bidding.productName}</span>
                        <span className="text-xs text-gray-500 truncate">{bidding.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm font-normal text-gray-600 whitespace-nowrap">{bidding.bidId}</td>
                  <td className="px-4 py-2 text-sm font-normal text-gray-600 whitespace-nowrap">${formatAmount(bidding.bidAmount)}</td>
                  <td className="px-4 py-2 text-sm font-normal text-gray-600 whitespace-nowrap">${formatAmount(bidding.currentPrice)}</td>
                  <td className="px-4 py-2 text-sm font-normal text-gray-600 whitespace-nowrap">
                    {bidding.id === '1' ? 'won' : bidding.id === '2' ? 'Pending' : bidding.id === '3' ? 'Lost' : bidding.id === '4' ? 'pending' : bidding.result}
                  </td>
                  <td className="px-4 py-2 text-sm font-normal text-gray-600 whitespace-nowrap">{bidding.endDate}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <StatusPill status={bidding.status} />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-start">
                      <ActionDropdown
                        onEdit={() => handleEdit(bidding)}
                        onBlock={() => handleBlock(bidding)}
                        onDelete={() => handleDelete(bidding)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            {activeTab === 'orders' &&
              user.orders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50 border-b border-gray-200 transition-colors cursor-pointer"
                  onClick={() => navigate(`/orders/${order.orderId}`)}
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                      />
                      <span className="text-sm text-gray-900 truncate">{order.productName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">{order.orderId}</td>
                  <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">${order.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">${order.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">-</td>
                  <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">{order.date}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-start">
                      <ActionDropdown
                        onEdit={() => handleEdit(order)}
                        onBlock={() => handleBlock(order)}
                        onDelete={() => handleDelete(order)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        </div>
      </div>
        </div>
    </div>
  )
}

