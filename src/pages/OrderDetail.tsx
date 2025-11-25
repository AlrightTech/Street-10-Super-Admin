import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { mockOrders } from '../data/mockOrders'
import type { OrderRecord } from './Orders'
import OrderStatusBadge from '../components/orders/OrderStatusBadge'
import { ShoppingBagIcon, CheckCircleIcon, XCircleIcon, RefreshCwIcon, PhoneIcon, MailIcon, CalendarIcon, MapPinIcon, CheckIcon, PlusIcon } from '../components/icons/Icons'

interface CustomerNote {
  id: string
  text: string
  addedBy: string
  date: string
  color: 'blue' | 'green'
}

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderRecord | null>(null)
  const [customerOrders, setCustomerOrders] = useState<OrderRecord[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderRecord[]>([])
  const [timeFilter, setTimeFilter] = useState('All Time')
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 3

  useEffect(() => {
    // Find the order by ID
    const foundOrder = mockOrders.find(o => o.id.replace('#', '') === orderId || o.id === orderId || o.id === `#${orderId}`)
    
    if (foundOrder) {
      setOrder(foundOrder)
      // Get all orders for this customer
      const allCustomerOrders = mockOrders.filter(o => o.customerName === foundOrder.customerName)
      setCustomerOrders(allCustomerOrders)
    } else {
      navigate('/orders')
    }
  }, [orderId, navigate])

  // Filter orders by time period
  useEffect(() => {
    let filtered = [...customerOrders]
    
    if (timeFilter !== 'All Time') {
      const now = new Date()
      let cutoffDate = new Date()
      
      if (timeFilter === 'Last 7 Days') {
        cutoffDate.setDate(now.getDate() - 7)
      } else if (timeFilter === 'Last 30 Days') {
        cutoffDate.setDate(now.getDate() - 30)
      } else if (timeFilter === 'Last 90 Days') {
        cutoffDate.setDate(now.getDate() - 90)
      }
      
      filtered = customerOrders.filter(order => {
        // Parse order date (format: "15 Mar 2024")
        const orderDate = new Date(order.orderDate)
        return orderDate >= cutoffDate
      })
    }
    
    setFilteredOrders(filtered)
    setCurrentPage(1) // Reset to first page when filter changes
  }, [customerOrders, timeFilter])

  // Get paginated orders
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  )
  
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    )
  }

  // Calculate summary statistics based on filtered orders
  const totalOrders = filteredOrders.length
  const completedOrders = filteredOrders.filter(o => o.status === 'completed').length
  const cancelledOrders = filteredOrders.filter(o => o.status === 'cancelled').length
  const totalRefunds = cancelledOrders // Simplified: assume cancelled orders are refunded
  const totalRefundAmount = filteredOrders
    .filter(o => o.status === 'cancelled')
    .reduce((sum, o) => sum + o.amount, 0)

  // Mock customer data
  const customerSince = 'March 15, 2023'
  const customerLocation = 'New York, NY'
  const customerEmail = `${order.customerName.toLowerCase().replace(/\s+/g, '.')}@email.com`
  const customerPhone = '+1 (555) 123-4567'
  const customerAvatar = `https://i.pravatar.cc/100?img=${order.customerName.length % 70}`

  // Mock addresses
  const shippingAddress = {
    street: '123 Main Street',
    apartment: 'Apartment 4B',
    city: 'New York, NY 10001',
    country: 'United States'
  }

  const billingAddress = {
    street: '123 Main Street',
    apartment: 'Apartment 4B',
    city: 'New York, NY 10001',
    country: 'United States'
  }

  // Mock customer notes
  const customerNotes: CustomerNote[] = [
    {
      id: '1',
      text: 'Regular buyer, prefers express shipping. Very responsive to promotional emails.',
      addedBy: 'John Doe',
      date: 'Jun 10, 2024',
      color: 'blue'
    },
    {
      id: '2',
      text: 'High-value customer. Always pays on time. Excellent communication.',
      addedBy: 'Jane Smith',
      date: 'Dec 28, 2023',
      color: 'green'
    }
  ]


  const handleViewAllOrders = () => {
    navigate('/orders')
  }

  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value)
  }

  const handleActive = () => {
    console.log('Active button clicked')
    // Add functionality to mark customer as active
  }

  const handleBlockCustomer = () => {
    if (window.confirm('Are you sure you want to block this customer?')) {
      console.log('Block customer clicked')
      // Add functionality to block customer
    }
  }

  const handleAddNote = () => {
    console.log('Add note clicked')
    // Add functionality to add customer note
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-600">
          <span className="text-gray-600">Dashboard · </span>
          <span className="text-gray-900">Orders</span>
        </p>
      </div>

      {/* Customer Information Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Profile Picture */}
          <div className="flex-shrink-0">
            <img
              src={customerAvatar}
              alt={order.customerName}
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>

          {/* Center-Left: Name and Contact Info */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{order.customerName}</h2>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <PhoneIcon className="h-4 w-4 text-gray-400" />
                <span>{customerPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MailIcon className="h-4 w-4 text-gray-400" />
                <span>{customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Center: Customer Since and Location with Buttons aligned */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span>Customer Since: {customerSince}</span>
              </div>
              {/* Action Buttons aligned horizontally with Customer Since */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleActive}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-200 transition-colors cursor-pointer"
                >
                  <CheckIcon className="h-4 w-4 text-green-600" />
                  Active
                </button>
                <button
                  type="button"
                  onClick={handleBlockCustomer}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500 bg-white px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Block Customer
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 text-gray-400" />
              <span>{customerLocation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 relative">
          <div className="flex justify-end absolute top-6 right-6">
            <p className="text-sm font-medium text-green-600">+12%</p>
          </div>
          <div className="flex flex-col">
            <div className="rounded-lg bg-blue-100 p-2 w-fit mb-3">
              <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            <p className="text-sm text-gray-600 mt-1">Total Orders</p>
          </div>
        </div>

        {/* Completed Orders Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 relative">
          <div className="flex justify-end absolute top-6 right-6">
            <p className="text-sm font-medium text-green-600">+8%</p>
          </div>
          <div className="flex flex-col">
            <div className="rounded-lg bg-green-100 p-2 w-fit mb-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
            <p className="text-sm text-gray-600 mt-1">Completed Orders</p>
          </div>
        </div>

        {/* Cancelled Orders Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 relative">
          <div className="flex justify-end absolute top-6 right-6">
            <p className="text-sm font-medium text-red-600">-2%</p>
          </div>
          <div className="flex flex-col">
            <div className="rounded-lg bg-red-100 p-2 w-fit mb-3">
              <XCircleIcon className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{cancelledOrders}</p>
            <p className="text-sm text-gray-600 mt-1">Cancelled Orders</p>
          </div>
        </div>

        {/* Total Refunds Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 relative">
          <div className="flex justify-end absolute top-6 right-6">
            <p className="text-sm font-medium text-orange-600">${totalRefundAmount.toFixed(0)}</p>
          </div>
          <div className="flex flex-col">
            <div className="rounded-lg bg-orange-100 p-2 w-fit mb-3">
              <RefreshCwIcon className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalRefunds}</p>
            <p className="text-sm text-gray-600 mt-1">Total Refunds</p>
          </div>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Shipping Address</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{shippingAddress.street}</p>
              <p>{shippingAddress.apartment}</p>
              <p>{shippingAddress.city}</p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Billing Address</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{billingAddress.street}</p>
              <p>{billingAddress.apartment}</p>
              <p>{billingAddress.city}</p>
              <p>{billingAddress.country}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order History Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h3 className="text-base font-semibold text-gray-900">Order History</h3>
          <div className="flex items-center gap-3">
            <select
              value={timeFilter}
              onChange={(e) => handleTimeFilterChange(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer"
            >
              <option>All Time</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
            <button
              type="button"
              onClick={handleViewAllOrders}
              className="rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
            >
              View All Orders
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Payment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map((orderItem) => (
                <tr key={orderItem.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/orders/${orderItem.id.replace('#', '')}`)}
                      className="text-sm text-gray-900 hover:text-[#F7931E] cursor-pointer"
                    >
                      {orderItem.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{orderItem.orderDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${orderItem.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={orderItem.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{orderItem.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/orders/${orderItem.id.replace('#', '')}/view`)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      View Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded border border-gray-300 bg-white"
          >
            &lt; Back
          </button>
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            className={`px-3 py-1 text-sm rounded border ${
              currentPage === 1
                ? 'font-medium text-white bg-[#4C50A2] border-[#4C50A2]'
                : 'text-gray-600 hover:text-gray-900 border-gray-300 bg-white'
            } cursor-pointer`}
          >
            1
          </button>
          {totalPages > 1 && (
            <button
              type="button"
              onClick={() => handlePageChange(2)}
              className={`px-3 py-1 text-sm rounded border ${
                currentPage === 2
                  ? 'font-medium text-white bg-[#4C50A2] border-[#4C50A2]'
                  : 'text-gray-600 hover:text-gray-900 border-gray-300 bg-white'
              } cursor-pointer`}
            >
              2
            </button>
          )}
          {totalPages > 2 && (
            <button
              type="button"
              onClick={() => handlePageChange(3)}
              className={`px-3 py-1 text-sm rounded border ${
                currentPage === 3
                  ? 'font-medium text-white bg-[#4C50A2] border-[#4C50A2]'
                  : 'text-gray-600 hover:text-gray-900 border-gray-300 bg-white'
              } cursor-pointer`}
            >
              3
            </button>
          )}
          {totalPages > 7 && (
            <button
              type="button"
              className="px-3 py-1 text-sm rounded border border-gray-300 bg-white text-gray-600 cursor-pointer"
            >
              ...
            </button>
          )}
          {totalPages > 6 && (
            <button
              type="button"
              onClick={() => handlePageChange(totalPages - 1)}
              className={`px-3 py-1 text-sm rounded border ${
                currentPage === totalPages - 1
                  ? 'font-medium text-white bg-[#4C50A2] border-[#4C50A2]'
                  : 'text-gray-600 hover:text-gray-900 border-gray-300 bg-white'
              } cursor-pointer`}
            >
              {totalPages - 1}
            </button>
          )}
          {totalPages > 1 && (
            <button
              type="button"
              onClick={() => handlePageChange(totalPages)}
              className={`px-3 py-1 text-sm rounded border ${
                currentPage === totalPages
                  ? 'font-medium text-white bg-[#4C50A2] border-[#4C50A2]'
                  : 'text-gray-600 hover:text-gray-900 border-gray-300 bg-white'
              } cursor-pointer`}
            >
              {totalPages}
            </button>
          )}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded border border-gray-300 bg-white"
          >
            Next &gt;
          </button>
          </div>
        </div>
      </div>

      {/* Customer Notes Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Customer Notes</h3>
          <button
            type="button"
            onClick={handleAddNote}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-500 hover:text-blue-600 cursor-pointer"
          >
            <PlusIcon className="h-4 w-4" />
            Add Note
          </button>
        </div>
        <div className="space-y-4">
          {customerNotes.map((note) => (
            <div key={note.id} className="flex gap-4">
              <div className={`w-1 rounded-full ${note.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'}`} />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{note.text}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Added by {note.addedBy} - {note.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

