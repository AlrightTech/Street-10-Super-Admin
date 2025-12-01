import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { mockOrders } from '../data/mockOrders'
import type { OrderRecord } from './Orders'
import OrderStatusBadge from '../components/orders/OrderStatusBadge'
import { ShoppingBagIcon, CheckCircleIcon, XCircleIcon, RefreshCwIcon, PhoneIcon, MailIcon, CalendarIcon, MapPinIcon, CheckIcon, PlusIcon, UserIcon } from '../components/icons/Icons'

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
  const location = useLocation()
  const isDetailRoute = location.pathname.includes('/detail')
  const [order, setOrder] = useState<OrderRecord | null>(null)
  const [customerOrders, setCustomerOrders] = useState<OrderRecord[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderRecord[]>([])
  const [timeFilter, setTimeFilter] = useState('All Time')
  const [currentPage, setCurrentPage] = useState(1)
  const [isTimeFilterDropdownOpen, setIsTimeFilterDropdownOpen] = useState(false)
  const timeFilterDropdownRef = useRef<HTMLDivElement>(null)
  const ordersPerPage = 3

  const timeFilterOptions = [
    'All Time',
    'Last 7 Days',
    'Last 30 Days',
    'Last 90 Days',
  ]

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
  const activeOrders = filteredOrders.filter(o => o.status === 'active').length
  const inactiveOrders = filteredOrders.filter(o => o.status === 'inactive').length
  const totalRefunds = inactiveOrders // Simplified: assume inactive orders are refunded
  const totalRefundAmount = filteredOrders
    .filter(o => o.status === 'inactive')
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
    if (orderId) {
      navigate(`/orders/${orderId}/view`)
    } else {
      navigate('/orders')
    }
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

  // If on detail route, show order detail view matching reference image
  if (isDetailRoute) {
    // Mock products for order detail view
    const orderProducts = [
      {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        sku: 'MSH-30',
        quantity: 2,
        unitPrice: 89.99,
        subtotal: 179.98,
      },
      {
        id: '2',
        name: 'Protective Phone Case',
        sku: 'PPC-021',
        quantity: 1,
        unitPrice: 24.99,
        subtotal: 24.99,
      },
      {
        id: '3',
        name: 'Wireless Charging Pad',
        sku: 'WCP-003',
        quantity: 1,
        unitPrice: 39.99,
        subtotal: 39.99,
      },
    ]

    const orderTimeline = [
      { status: 'Order Placed', date: 'Dec 15, 2024', time: '2:30 PM', completed: true },
      { status: 'Payment Confirmed', date: 'Dec 15, 2024', time: '3:20 PM', completed: true },
      { status: 'Processing', date: 'Dec 15, 2024', time: '9:15 AM', completed: false, isCurrent: true },
      { status: 'Shipped', date: '', time: '', completed: false },
      { status: 'Delivered', date: '', time: '', completed: false },
    ]

    // Format order ID
    const formatOrderId = (id: string) => {
      const numMatch = id.match(/\d+/)
      if (numMatch) {
        return `#${numMatch[0]}`
      }
      return id.startsWith('#') ? id : `#${id}`
    }
    const formattedOrderId = formatOrderId(order.id)
    
    // Format order date
    const parseDate = (dateStr: string) => {
      try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return { formatted: 'Dec 15, 2024', time: '1:30 PM' }
        const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        return { formatted, time: '1:30 PM' }
      } catch {
        return { formatted: 'Dec 15, 2024', time: '1:30 PM' }
      }
    }
    
    const { formatted: formattedDate, time: orderTime } = parseDate(order.orderDate)
    
    // Calculate totals
    const subtotal = orderProducts.reduce((sum, p) => sum + p.subtotal, 0)
    const shipping = 2.54
    const total = subtotal + shipping

    // Customer data
    const detailCustomerName = order.customerName === 'Sarah Johnson' ? 'Sarah Johnson' : order.customerName
    const detailCustomerEmail = 'sarah.johnson@email.com'
    const detailCustomerPhone = '+1 (240) 123-4567'

    const handleUpdateStatus = () => {
      console.log('Update status clicked')
    }

    const handleIssueRefund = () => {
      if (orderId) {
        navigate(`/orders/${orderId}/process-refund`)
      }
    }

    const handleDownloadInvoice = () => {
      if (orderId) {
        navigate(`/orders/${orderId}/invoice`)
      }
    }

    const handlePrintOrder = () => {
      window.print()
    }

    return (
      <div className="space-y-4 md:space-y-6 px-4 md:px-0">
        {/* Page Header */}
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            <span className="text-gray-600">Dashboard</span>
            <span className="mx-1 text-gray-600">&gt;</span>
            <span className="text-gray-900">Orders</span>
          </p>
        </div>

        {/* Order Details Section */}
        <div>
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Order Details</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Order ID Card - Light Blue */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-blue-800 mb-1">Order ID</p>
              <p className="text-base sm:text-lg font-semibold text-blue-800 break-all">{formattedOrderId}</p>
            </div>
            
            {/* Order Date Card - Light Green */}
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-green-800 mb-1">Order Date</p>
              <p className="text-base sm:text-lg font-semibold text-green-800">{formattedDate}</p>
              <p className="text-xs sm:text-sm text-green-800 mt-1">{orderTime}</p>
            </div>
            
            {/* Total Amount Card - Light Purple */}
            <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-purple-800 mb-1">Total Amount</p>
              <p className="text-base sm:text-lg font-semibold text-purple-800">${total.toFixed(2)}</p>
            </div>
          </div>
          </div>
        </div>

        {/* Customer Information Section */}
        <div>
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Customer Information</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <div className="flex items-start gap-2 mb-3 sm:mb-2">
                <UserIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Name</p>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">{detailCustomerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 mb-3 sm:mb-2">
                <PhoneIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-xs sm:text-sm text-gray-600 break-all">{detailCustomerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 mb-2">
                <MailIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Email</p>
                  <p className="text-xs sm:text-sm text-gray-600 break-all">{detailCustomerEmail}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPinIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Shipping Address</p>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                <p>23 Main Street, Apt 4B</p>
                <p>New York, NY 10012</p>
                <p>United States</p>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div>
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Order Items</h2>
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <table className="w-full border-collapse min-w-[600px] md:min-w-0">
              <thead>
                <tr className='bg-gray-100'>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap">Product</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap">SKU</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap">Qty</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap">Unit Price</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900 border-b border-gray-200">{product.name}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 border-b border-gray-200">{product.sku}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 border-b border-gray-200">{product.quantity}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 border-b border-gray-200 whitespace-nowrap">${product.unitPrice.toFixed(2)}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900 text-right border-b border-gray-200 whitespace-nowrap">${product.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className='sm:hidden block'>
                  <td colSpan={4} className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 text-right border-t border-gray-200">Shipping:</td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900 text-right border-t border-gray-200">${shipping.toFixed(2)}</td>
                </tr>
                <tr className='sm:hidden block'>
                  <td colSpan={4} className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-900 text-right">Total:</td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-900 text-right">${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div className='px-4 sm:block hidden pt-3 pb-3 bg-gray-100'>


            <div className='flex justify-between'>
              <div className='semi-bold'>Shipping:</div>
              <div>${total.toFixed(2)}</div>
            </div>
            <div className='flex justify-between'>

            <div className='semi-bold'>
            Total:
            </div>
            <div>
            ${total.toFixed(2)} 
            </div>
            </div>
            </div>
          </div>
            </div>
        </div>

        {/* Payment Information and Delivery Information Section */}
        <div className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4 md:gap-6">
            {/* Payment Information */}
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Payment Information</h2>
              <div className="flex flex-col space-y-3 sm:space-y-4 bg-gray-300 rounded-md p-3">
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2'>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                      <rect width="24" height="16" rx="2" fill="#1A1F71"/>
                      <path d="M8 8h8v8H8z" fill="#F79E1B"/>
                    </svg>
                    <p className="text-xs sm:text-sm text-gray-600 break-all">--- 4532</p>
                  </div>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2'>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Transaction ID</p>
                  <p className="text-xs sm:text-sm text-gray-600 break-all">TXN-789456123</p>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 sm:items-center'>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Status</p>
                  <span className="inline-flex items-center px-2 sm:px-4 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                    Paid
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Delivery Information</h2>
              <div className="space-y-3 sm:space-y-4 bg-gray-300 rounded-md p-3">
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 sm:items-center'>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Shipping Method</p>
                  <p className="text-xs sm:text-sm text-gray-600">Express Delivery</p>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 sm:items-center'>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Courier</p>
                  <p className="text-xs sm:text-sm text-gray-600">FedEx</p>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 sm:items-center'>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Tracking Number</p>
                  <a href="#" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline break-all">
                    #IZ999AA1234567890
                  </a>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 sm:items-center'>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Est. Delivery</p>
                  <p className="text-xs sm:text-sm text-gray-600">Dec 18, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline Section */}
        <div>
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Order Timeline</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4">
            {orderTimeline.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-shrink-0">
                    {item.completed ? (
                      <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-green-500">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : item.isCurrent ? (
                      <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-blue-500">
                        <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white" />
                      </div>
                    ) : (
                      <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                        <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-gray-300" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm md:text-base font-medium text-gray-900">{item.status}</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 sm:ml-auto">
                  {item.date && item.time ? `${item.date}, ${item.time}` : 'Pending'}
                </p>
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleUpdateStatus}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
          >
            <span>Update Status</span>
            <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleIssueRefund}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-red-700 cursor-pointer"
          >
            <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Issue Refund</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-gray-800 cursor-pointer"
          >
            <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Invoice</span>
          </button>
          <button
            type="button"
            onClick={handlePrintOrder}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-gray-800 cursor-pointer"
          >
            <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Order</span>
          </button>
        </div>
      </div>
    )
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
            <p className="text-2xl font-bold text-gray-900">{activeOrders}</p>
            <p className="text-sm text-gray-600 mt-1">Active Orders</p>
          </div>
        </div>

        {/* Inactive Orders Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 relative">
          <div className="flex justify-end absolute top-6 right-6">
            <p className="text-sm font-medium text-red-600">-2%</p>
          </div>
          <div className="flex flex-col">
            <div className="rounded-lg bg-red-100 p-2 w-fit mb-3">
              <XCircleIcon className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{inactiveOrders}</p>
            <p className="text-sm text-gray-600 mt-1">Inactive Orders</p>
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
            <div className="relative" ref={timeFilterDropdownRef}>
              <button
                type="button"
                onClick={() => setIsTimeFilterDropdownOpen(!isTimeFilterDropdownOpen)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between gap-2 hover:border-gray-400 transition-colors min-w-[140px]"
              >
                <span>{timeFilter}</span>
                <svg
                  className={`h-4 w-4 text-gray-400 transition-transform ${isTimeFilterDropdownOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isTimeFilterDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {timeFilterOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        handleTimeFilterChange(option)
                        setIsTimeFilterDropdownOpen(false)
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg ${
                        timeFilter === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
                    {orderItem.status === 'active' ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/orders/${orderItem.id.replace('#', '')}/detail`)
                        }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        View Detail
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">--</span>
                    )}
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

