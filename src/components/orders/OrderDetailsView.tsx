import { useState, useMemo } from 'react'
import type { OrderRecord } from '../../pages/Orders'

interface OrderDetailsViewProps {
  order: OrderRecord
  onClose: () => void
  onViewOrder?: (order: OrderRecord) => void
}

// Dummy customer data - replace with real API data later
const getCustomerData = (order: OrderRecord) => ({
  name: order.customerName,
  phone: '+1 (555) 123-4567',
  email: `${order.customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
  joinDate: '15 Jan 2024',
  location: 'New York, USA',
  profileImage: `https://i.pravatar.cc/100?img=${order.customerName.length % 70}`,
  isActive: true,
  hasBasicGuarantee: true,
})

// Dummy statistics data
const getStatistics = () => [
  { 
    label: 'Total Orders', 
    value: '47', 
    change: '+2%', 
    changeType: 'positive',
    icon: 'shopping-cart',
    iconColor: 'text-blue-600'
  },
  { 
    label: 'Completed Orders', 
    value: '38', 
    change: '+5%', 
    changeType: 'positive',
    icon: 'check',
    iconColor: 'text-green-600'
  },
  { 
    label: 'Cancelled Orders', 
    value: '6', 
    change: '-3%', 
    changeType: 'negative',
    icon: 'x',
    iconColor: 'text-red-600'
  },
  { 
    label: 'Total Refunds', 
    value: '$1,234', 
    change: '+1%', 
    changeType: 'positive',
    icon: 'refresh',
    iconColor: 'text-orange-600'
  },
]

// Dummy addresses data
const getAddresses = () => ({
  shipping: {
    name: 'John Doe',
    address: '123 Main Street',
    address2: 'Apt 4B',
    city: 'New York',
    country: 'United States',
  },
  billing: {
    name: 'John Doe',
    address: '123 Main Street',
    address2: 'Apt 4B',
    city: 'New York',
    country: 'United States',
  },
})

// Dummy order history data - expanded for pagination
const getOrderHistory = () => [
  { id: '#ORD-2024-001', date: 'Jan 15, 2024', amount: '$249.99', paymentType: 'Credit Card', status: 'completed' },
  { id: '#ORD-2024-002', date: 'Jan 12, 2024', amount: '$89.50', paymentType: 'PayPal', status: 'completed' },
  { id: '#ORD-2024-003', date: 'Jan 08, 2024', amount: '$56.75', paymentType: 'Credit Card', status: 'cancelled' },
  { id: '#ORD-2024-004', date: 'Jan 05, 2024', amount: '$234.00', paymentType: 'Credit Card', status: 'completed' },
  { id: '#ORD-2024-005', date: 'Jan 03, 2024', amount: '$156.20', paymentType: 'PayPal', status: 'completed' },
  { id: '#ORD-2024-006', date: 'Dec 28, 2023', amount: '$345.80', paymentType: 'Credit Card', status: 'completed' },
  { id: '#ORD-2024-007', date: 'Dec 25, 2023', amount: '$78.90', paymentType: 'PayPal', status: 'cancelled' },
  { id: '#ORD-2024-008', date: 'Dec 22, 2023', amount: '$123.45', paymentType: 'Credit Card', status: 'completed' },
  { id: '#ORD-2024-009', date: 'Dec 20, 2023', amount: '$267.30', paymentType: 'PayPal', status: 'completed' },
  { id: '#ORD-2024-010', date: 'Dec 18, 2023', amount: '$189.60', paymentType: 'Credit Card', status: 'completed' },
  { id: '#ORD-2024-011', date: 'Dec 15, 2023', amount: '$98.75', paymentType: 'PayPal', status: 'completed' },
  { id: '#ORD-2024-012', date: 'Dec 12, 2023', amount: '$312.40', paymentType: 'Credit Card', status: 'cancelled' },
  { id: '#ORD-2024-013', date: 'Dec 10, 2023', amount: '$145.20', paymentType: 'PayPal', status: 'completed' },
  { id: '#ORD-2024-014', date: 'Dec 08, 2023', amount: '$278.90', paymentType: 'Credit Card', status: 'completed' },
  { id: '#ORD-2024-015', date: 'Dec 05, 2023', amount: '$67.30', paymentType: 'PayPal', status: 'completed' },
  { id: '#ORD-2024-016', date: 'Dec 03, 2023', amount: '$456.80', paymentType: 'Credit Card', status: 'completed' },
]

// Dummy notes data
const getNotes = () => [
  { text: 'Regular buyer, prefers express shipping. Very responsive to promotional emails.', addedBy: 'John Doe', date: 'Jan 10, 2024' },
  { text: 'High-value customer. Always pays on time. Excellent communication.', addedBy: 'Jane Smith', date: 'Dec 28, 2023' },
]

export default function OrderDetailsView({ order, onViewOrder }: OrderDetailsViewProps) {
  const customer = getCustomerData(order)
  const statistics = getStatistics()
  const addresses = getAddresses()
  const allOrderHistory = getOrderHistory()
  const notes = getNotes()

  // Pagination state for Order History
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1)
  const HISTORY_PAGE_SIZE = 5

  // Calculate pagination for Order History
  const totalHistoryPages = useMemo(() => {
    return Math.ceil(allOrderHistory.length / HISTORY_PAGE_SIZE)
  }, [allOrderHistory.length])

  const paginatedOrderHistory = useMemo(() => {
    const startIndex = (currentHistoryPage - 1) * HISTORY_PAGE_SIZE
    const endIndex = startIndex + HISTORY_PAGE_SIZE
    return allOrderHistory.slice(startIndex, endIndex)
  }, [allOrderHistory, currentHistoryPage])

  const handleHistoryPageChange = (page: number) => {
    setCurrentHistoryPage(page)
  }

  // Generate page numbers for pagination
  const getHistoryPageNumbers = () => {
    const pages: (number | string)[] = []
    const total = totalHistoryPages

    if (total <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentHistoryPage > 3) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentHistoryPage - 1)
      const end = Math.min(total - 1, currentHistoryPage + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== total) {
          pages.push(i)
        }
      }

      if (currentHistoryPage < total - 2) {
        pages.push('...')
      }

      // Always show last page
      if (total > 1) {
        pages.push(total)
      }
    }

    return pages
  }

  return (
    <div className="space-y-6">
      {/* Unified Content Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Customer Profile Section with Border Bottom */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Side: Image, Name, Phone, Email */}
            <div className="flex items-start gap-4">
              <img
                src={customer.profileImage}
                alt={customer.name}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-200"
              />
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{customer.name}</h2>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{customer.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Customer Since and Location */}
            <div className="flex flex-col gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Customer Since:</span>
                <span>{customer.joinDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">Location:</span>
                <span>{customer.location}</span>
              </div>
            </div>

            {/* Right Side: Active and Block Customer */}
            <div className="flex flex-row gap-2 items-center">
              {customer.isActive && (
                <span className="inline-flex items-center rounded-lg bg-green-100 px-3 py-2 text-xs font-medium text-green-700">
                  Active
                </span>
              )}
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-[#E97777] px-3 py-2 text-xs font-medium text-[#E97777] hover:bg-[#E97777]/5 transition-colors"
              >
                <svg className="h-4 w-4 text-[#E97777]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Block Customer
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statistics.map((stat) => {
              const getIcon = () => {
                const iconClass = `h-5 w-5 text-white`
                switch (stat.icon) {
                  case 'shopping-cart':
                    return (
                      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )
                  case 'check':
                    return (
                      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )
                  case 'x':
                    return (
                      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )
                  case 'refresh':
                    return (
                      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )
                  default:
                    return null
                }
              }

              const getIconBgColor = () => {
                switch (stat.icon) {
                  case 'shopping-cart':
                    return 'bg-blue-500'
                  case 'check':
                    return 'bg-green-500'
                  case 'x':
                    return 'bg-red-500'
                  case 'refresh':
                    return 'bg-orange-500'
                  default:
                    return 'bg-gray-500'
                }
              }

              return (
                <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`${getIconBgColor()} rounded-lg p-2 flex-shrink-0`}>
                      {getIcon()}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div className="mb-2">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Addresses Section */}
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Addresses</h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Shipping Address */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h4 className="mb-3 text-base font-semibold text-gray-900">Shipping Address</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-900">{addresses.shipping.name}</p>
                <p>{addresses.shipping.address}</p>
                <p>{addresses.shipping.address2}</p>
                <p>
                  {addresses.shipping.city}, {addresses.shipping.country}
                </p>
              </div>
            </div>

            {/* Billing Address */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h4 className="mb-3 text-base font-semibold text-gray-900">Billing Address</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-900">{addresses.billing.name}</p>
                <p>{addresses.billing.address}</p>
                <p>{addresses.billing.address2}</p>
                <p>
                  {addresses.billing.city}, {addresses.billing.country}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order History Table Section */}
        <div className="border-t border-gray-200 p-6">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button className="cursor-pointer inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:border-[#4C50A2] focus:outline-none focus:ring-1 focus:ring-[#4C50A2] transition-colors">
                  <span>All Time</span>
                  <svg className="ml-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button className="cursor-pointer rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E22] transition-colors">
                  View All Orders
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                      Payment Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedOrderHistory.map((historyOrder) => (
                    <tr key={historyOrder.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{historyOrder.id}</td>
                      <td className="px-6 py-4 text-gray-600">{historyOrder.date}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{historyOrder.amount}</td>
                      <td className="px-6 py-4 text-gray-600">{historyOrder.paymentType}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium ${
                            historyOrder.status === 'completed'
                              ? 'bg-[#DCF6E5] text-[#118D57]'
                              : 'bg-[#FFE4DE] text-[#B71D18]'
                          }`}
                        >
                          {historyOrder.status.charAt(0).toUpperCase() + historyOrder.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            // Create a temporary order record from history order for viewing
                            const tempOrder: OrderRecord = {
                              id: historyOrder.id,
                              customerName: order.customerName,
                              product: historyOrder.paymentType,
                              amount: parseFloat(historyOrder.amount.replace('$', '').replace(',', '')),
                              paymentMethod: historyOrder.paymentType,
                              status: historyOrder.status as OrderRecord['status'],
                              orderDate: historyOrder.date,
                            }
                            onViewOrder?.(tempOrder)
                          }}
                          className="cursor-pointer text-sm font-medium text-[#4C50A2] hover:text-[#3a3d7a] transition-colors"
                        >
                          View Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination for Order History Table */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleHistoryPageChange(currentHistoryPage - 1)}
                    disabled={currentHistoryPage === 1}
                    className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    &lt; Back
                  </button>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {getHistoryPageNumbers().map((page, index) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-600">
                            ...
                          </span>
                        )
                      }
                      const pageNum = page as number
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handleHistoryPageChange(pageNum)}
                          className={`h-7 w-7 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                            currentHistoryPage === pageNum
                              ? 'bg-[#6B46C1] text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleHistoryPageChange(currentHistoryPage + 1)}
                    disabled={currentHistoryPage === totalHistoryPages}
                    className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Notes Section */}
        <div className="p-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Customer Notes</h3>
              <button className="text-sm font-medium text-[#4C50A2] hover:text-[#3a3d7a] transition-colors">
                + Add Note
              </button>
            </div>
            <div className="space-y-3">
              {notes.map((note, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg border-l-4 border-green-500 bg-gray-50 p-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{note.text}</p>
                    <p className="mt-1 text-xs text-gray-500">Added by: {note.addedBy} - {note.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
