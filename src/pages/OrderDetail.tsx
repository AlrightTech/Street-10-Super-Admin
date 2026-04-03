import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { ordersApi, type OrderDetails } from '../services/orders.api'
import { customerNotesApi, type CustomerNote } from '../services/orders.api'
import type { OrderRecord } from './Orders'
import { buildOrderDisplayStatus } from './Orders'
import OrderStatusBadge from '../components/orders/OrderStatusBadge'
import OrderTimelineCard from '../components/orders/OrderTimelineCard'
import RefundDetailModal from '../components/orders/RefundDetailModal'
import type { TimelineEvent } from '../types/orderDetails'
import { ShoppingBagIcon, CheckCircleIcon, XCircleIcon, RefreshCwIcon, PhoneIcon, MailIcon, CalendarIcon, MapPinIcon, CheckIcon, PlusIcon, UserIcon, DownloadIcon, ChevronDownIcon } from '../components/icons/Icons'
import api from '../utils/api'

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const isDetailRoute = location.pathname.includes('/detail')
  const [order, setOrder] = useState<OrderRecord | null>(null)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null) // Store full order details from API
  const [customerOrders, setCustomerOrders] = useState<OrderRecord[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderRecord[]>([])
  const [timeFilter, setTimeFilter] = useState('All Time')
  const [currentPage, setCurrentPage] = useState(1)
  const [isTimeFilterDropdownOpen, setIsTimeFilterDropdownOpen] = useState(false)
  const timeFilterDropdownRef = useRef<HTMLDivElement>(null)
  const ordersPerPage = 3
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [totalRefundAmount, setTotalRefundAmount] = useState(0)
  const [customerNotes, setCustomerNotes] = useState<CustomerNote[]>([])
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [newNoteText, setNewNoteText] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [selectedRefundEvent, setSelectedRefundEvent] = useState<TimelineEvent | null>(null)

  const timeFilterOptions = [
    'All Time',
    'Last 7 Days',
    'Last 30 Days',
    'Last 90 Days',
  ]

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) {
          navigate('/orders')
          return
        }

        // Fetch order from API
        const orderData = await ordersApi.getById(orderId)
        
        // Debug: Log the user data to see what we're getting
        console.log('Order data user:', orderData.user)
        console.log('User name:', (orderData.user as any)?.name)
        console.log('User profileImageUrl:', (orderData.user as any)?.profileImageUrl)
        
        // Store full order details
        setOrderDetails(orderData)
        
        // Transform to OrderRecord format
        const total = parseFloat(orderData.totalMinor) / 100
        const firstItem = orderData.items?.[0]
        const productName = firstItem?.product?.title || 'N/A'
        // Get customer name - use name if available, otherwise use email prefix
        const customerName = (orderData.user as any)?.name 
          ? (orderData.user as any).name 
          : (orderData.user?.email?.split('@')[0] || 'Unknown')
        const customerImageUrl = (orderData.user as any)?.profileImageUrl || null
        
        const transformedOrder: OrderRecord = {
          id: `#${orderData.orderNumber || orderData.id.slice(-8)}`,
          customerName: customerName,
          customerEmail: orderData.user?.email,
          customerImageUrl: customerImageUrl,
          product: productName,
          productImage: firstItem?.product?.media?.[0]?.url,
          amount: total,
          amountFormatted: `${orderData.currency} ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          paymentMethod: orderData.paymentMethod || 'N/A',
          status: orderData.status as any,
          displayStatus: buildOrderDisplayStatus(orderData.status, orderData.refundStatus),
          orderDate: new Date(orderData.createdAt).toLocaleDateString('en-GB'),
          orderNumber: orderData.orderNumber,
          orderId: orderData.id,
        }
        
        setOrder(transformedOrder)
        
        // Fetch all orders for this customer
        try {
          const customerOrdersResponse = await ordersApi.getAll({
            user_id: orderData.userId,
            limit: 100,
          })
          
          const transformedCustomerOrders: OrderRecord[] = (customerOrdersResponse.data || []).map((o: any) => {
            const oTotal = parseFloat(o.totalMinor) / 100
            const oFirstItem = o.items?.[0]
            const oProductName = oFirstItem?.product?.title || 'N/A'
            const oCustomerName = (o.user as any)?.name || o.user?.email?.split('@')[0] || 'Unknown'
            const oCustomerImageUrl = (o.user as any)?.profileImageUrl || null
            
            return {
              id: `#${o.orderNumber || o.id.slice(-8)}`,
              customerName: oCustomerName,
              customerEmail: o.user?.email,
              customerImageUrl: oCustomerImageUrl,
              product: oProductName,
              productImage: oFirstItem?.product?.media?.[0]?.url,
              amount: oTotal,
              amountFormatted: `${o.currency} ${oTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              paymentMethod: o.paymentMethod || 'N/A',
              status: o.status as any,
              displayStatus: buildOrderDisplayStatus(o.status, o.refundStatus),
              orderDate: new Date(o.createdAt).toLocaleDateString('en-GB'),
              orderNumber: o.orderNumber,
              orderId: o.id,
            }
          })
          
          setCustomerOrders(transformedCustomerOrders)
          
          // Fetch refund requests for all customer orders
          try {
            const orderIds = transformedCustomerOrders.map(o => o.orderId)
            let totalRefund = 0
            
            // Fetch refund requests for each order
            for (const orderId of orderIds) {
              try {
                const refundResponse = await api.get(`/orders/${orderId}/refund-requests`)
                const refundRequests = refundResponse.data?.data?.refundRequests || []
                const approvedRefunds = refundRequests.filter((rr: any) => rr.status === 'approved')
                const refundSum = approvedRefunds.reduce((sum: number, rr: any) => {
                  const amount = rr.amountMinor ? parseFloat(rr.amountMinor) / 100 : 0
                  return sum + amount
                }, 0)
                totalRefund += refundSum
              } catch (err) {
                // Ignore errors for individual orders
                console.error(`Error fetching refunds for order ${orderId}:`, err)
              }
            }
            
            setTotalRefundAmount(totalRefund)
          } catch (error) {
            console.error('Error fetching refund requests:', error)
          }
          
          // Fetch customer notes
          try {
            const notes = await customerNotesApi.getNotes(orderData.userId)
            setCustomerNotes(notes)
          } catch (error) {
            console.error('Error fetching customer notes:', error)
          }
        } catch (error) {
          console.error('Error fetching customer orders:', error)
        }
      } catch (error: any) {
        console.error('Error fetching order:', error)
        alert(`Failed to load order: ${error?.message || 'Unknown error'}`)
        navigate('/orders')
      }
    }

    fetchOrder()
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
  const completedOrders = filteredOrders.filter(o => o.status === 'delivered' || o.status === 'closed').length
  const cancelledOrders = filteredOrders.filter(o => o.status === 'cancelled').length
  const totalRefunds = cancelledOrders // Count of cancelled orders (which may have refunds)

  // Get real customer data from orderDetails (prioritize orderDetails over order)
  const customerEmail = orderDetails?.user?.email || order.customerEmail || 'N/A'
  const customerPhone = (orderDetails?.user as any)?.phone || orderDetails?.shippingAddress?.phone || 'N/A'
  
  // Get customer name - ALWAYS prioritize orderDetails.user.name (from API) over order.customerName
  let customerName = 'Unknown'
  if (orderDetails?.user) {
    const user = orderDetails.user as any
    // Use name from API if available, otherwise fallback to email prefix
    customerName = user.name || user.email?.split('@')[0] || 'Unknown'
  } else if (order?.customerName) {
    // Fallback to order.customerName if orderDetails is not loaded yet
    customerName = order.customerName.includes('@') 
      ? order.customerName.split('@')[0] 
      : order.customerName
  } else if (order?.customerEmail) {
    customerName = order.customerEmail.split('@')[0]
  }
  
  // Use profile image from orderDetails (API) - this should have the real profile image
  const customerProfileImageUrl = orderDetails?.user ? (orderDetails.user as any)?.profileImageUrl : null
  // Also check order.customerImageUrl as fallback (from the table data)
  const finalProfileImageUrl = customerProfileImageUrl || (order as any)?.customerImageUrl || null
  const customerAvatar = finalProfileImageUrl 
    ? finalProfileImageUrl 
    : `https://i.pravatar.cc/100?img=${customerName.length % 70}`

  // Get real addresses from orderDetails
  const shippingAddressData = orderDetails?.shippingAddress || {}
  const shippingAddress = {
    street: shippingAddressData.street || shippingAddressData.addressLine1 || '',
    apartment: shippingAddressData.apartment || shippingAddressData.addressLine2 || '',
    city: shippingAddressData.city || '',
    state: shippingAddressData.state || shippingAddressData.province || '',
    postalCode: shippingAddressData.postalCode || shippingAddressData.zipCode || '',
    country: shippingAddressData.country || ''
  }

  // Calculate customer since date (use order creation date as fallback, or could fetch user.createdAt from API)
  const customerSince = orderDetails?.createdAt 
    ? new Date(orderDetails.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A'

  // Get customer location from shipping address
  const customerLocation = shippingAddress.city && shippingAddress.country
    ? `${shippingAddress.city}, ${shippingAddress.country}`
    : shippingAddress.country || 'N/A'

  // Billing address (usually same as shipping, or could be separate field)
  const billingAddress = shippingAddress // For now, use shipping address as billing

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

  const handleAddNote = async () => {
    if (!newNoteText.trim()) {
      alert('Please enter a note')
      return
    }

    if (!orderDetails?.user?.id) {
      alert('Customer information not available')
      return
    }

    setIsAddingNote(true)
    try {
      const newNote = await customerNotesApi.createNote(
        orderDetails.user.id,
        newNoteText.trim(),
        orderId || undefined
      )
      setCustomerNotes([newNote, ...customerNotes])
      setNewNoteText('')
      setShowAddNoteModal(false)
    } catch (error: any) {
      console.error('Error adding note:', error)
      alert(error?.response?.data?.message || 'Failed to add note. Please try again.')
    } finally {
      setIsAddingNote(false)
    }
    // Add functionality to add customer note
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Helper function to determine order type
  const getOrderType = (order: OrderDetails | null): 'auction' | 'admin-ecommerce' | 'vendor' => {
    if (!order) return 'admin-ecommerce'
    
    // If orderType is already set, use it
    if (order.orderType === 'vendor') return 'vendor'
    if (order.orderType === 'superadmin' || order.orderType === 'ecommerce') return 'admin-ecommerce'
    
    // Check auctionId
    if ((order as any).auctionId) {
      return 'auction'
    }
    
    // Check vendor role
    if (order.vendor && (order.vendor as any).role === 'vendor') {
      return 'vendor'
    }
    
    // Default to admin-ecommerce
    return 'admin-ecommerce'
  }

  // Helper function to get status badge color
  const getStatusBadgeClass = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'completed' || statusLower === 'delivered' || statusLower === 'closed') {
      return 'bg-green-100 text-green-700'
    }
    if (statusLower === 'paid') {
      return 'bg-blue-100 text-blue-700'
    }
    if (statusLower === 'pending' || statusLower === 'created' || statusLower === 'fulfillment_pending') {
      return 'bg-yellow-100 text-yellow-700'
    }
    if (statusLower === 'shipped') {
      return 'bg-orange-100 text-orange-700'
    }
    if (statusLower === 'cancelled') {
      return 'bg-red-100 text-red-700'
    }
    return 'bg-gray-100 text-gray-700'
  }

  // Helper function to format status display
  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'created': 'Pending',
      'paid': 'Paid',
      'fulfillment_pending': 'Pending',
      'shipped': 'Shipped',
      'delivered': 'Completed',
      'closed': 'Completed',
      'cancelled': 'Cancelled',
    }
    return statusMap[status.toLowerCase()] || status
  }

  const getPaymentStatusDisplay = (
    od: { status?: string; refundStatus?: string | null } | null | undefined
  ) => {
    if (!od) {
      return { label: '—', className: 'bg-gray-100 text-gray-700' }
    }
    const rs = String(od.refundStatus || 'none').toLowerCase()
    if (rs === 'refund_requested') {
      return { label: 'Refund requested', className: 'bg-orange-100 text-orange-800' }
    }
    if (rs === 'partially_refunded') {
      return { label: 'Partially refunded', className: 'bg-amber-100 text-amber-800' }
    }
    if (rs === 'fully_refunded') {
      return { label: 'Refunded', className: 'bg-blue-100 text-blue-700' }
    }
    const st = String(od.status || '').toLowerCase()
    if (st === 'created') {
      return { label: 'Pending payment', className: 'bg-yellow-100 text-yellow-800' }
    }
    return { label: 'Paid', className: 'bg-green-100 text-green-700' }
  }

  // If on detail route, show order detail view matching reference image
  if (isDetailRoute) {
    // Calculate totals from real order items - define orderItems first
    const orderItems = orderDetails?.items || []
    
    // Determine order type
    const orderType = getOrderType(orderDetails)
    
    // Get currency from order
    const currency = orderDetails?.currency || 'QAR'
    
    // Real products from order items
    const orderProducts = orderItems.map((item: any) => {
      const unitPrice = parseFloat(item.priceMinor || '0') / 100
      const quantity = item.quantity || 1
      const productImage = item.product?.media?.[0]?.url || 
                          item.product?.media?.[0]?.url || 
                          'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop'
      return {
        id: item.id || item.productId,
        name: item.product?.title || 'Unknown Product',
        sku: item.product?.id?.slice(0, 8).toUpperCase() || 'N/A',
        quantity: quantity,
        unitPrice: unitPrice,
        subtotal: unitPrice * quantity,
        image: productImage,
      }
    })

    // Build unified timeline from backend data (order + refund events)
    const orderTimeline: TimelineEvent[] =
      (orderDetails as any)?.timeline?.map((evt: any) => ({
        id: evt.id,
        status: evt.statusLabel || evt.statusCode || 'Event',
        createdAt: evt.createdAt,
        type: evt.type,
        statusCode: evt.statusCode,
        meta: evt.meta,
      })) || []

    // Use actual order number from API
    const formattedOrderId = orderDetails?.orderNumber || order.orderNumber || order.id
    
    // Format order date from real order data
    const parseDate = (dateStr: string) => {
      try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) {
          const fallback = new Date()
          return {
            formatted: fallback.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: fallback.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          }
        }
        const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        return { formatted, time }
      } catch {
        const fallback = new Date()
        return {
          formatted: fallback.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: fallback.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        }
      }
    }
    
    const orderDateStr = orderDetails?.createdAt || order.orderDate
    const { formatted: formattedDate, time: orderTime } = parseDate(orderDateStr)
    
    // Total from order (subtotal/discount used for display elsewhere)
    const shipping = 0 // Shipping might be in order data, for now 0
    const total = parseFloat(orderDetails?.totalMinor || '0') / 100

    // Map display status to API status
    const getStatusValue = (displayStatus: string): string => {
      const statusMap: Record<string, string> = {
        'Created': 'created',
        'Paid': 'paid',
        'Processing': 'fulfillment_pending',
        'Shipped': 'shipped',
        'Delivered': 'delivered',
        'Completed': 'closed',
        'Cancelled': 'cancelled',
      }
      return statusMap[displayStatus] || displayStatus.toLowerCase()
    }

    // Get available status options based on current status
    const getAvailableStatuses = (): string[] => {
      const currentStatus = orderDetails?.status || 'created'
      
      // For auction orders, check if payment is complete before allowing fulfillment statuses
      const isAuctionOrder = (orderDetails as any)?.auctionId
      const paymentStage = (orderDetails as any)?.paymentStage
      
      // If auction order and payment not complete, restrict status options
      if (isAuctionOrder && paymentStage && 
          ['down_payment_required', 'final_payment_required', 'full_payment_required'].includes(paymentStage)) {
        // Only allow payment-related statuses or cancellation
        if (currentStatus === 'created' || currentStatus === 'down_payment_paid') {
          return ['Cancelled'] // Can only cancel until payment is complete
        }
      }
      
      const validTransitions: Record<string, string[]> = {
        created: ['Paid', 'Cancelled'],
        down_payment_paid: ['Paid', 'Cancelled'], // For auction orders
        paid: ['Processing', 'Cancelled'],
        fulfillment_pending: ['Shipped', 'Cancelled'],
        shipped: ['Delivered', 'Cancelled'],
        delivered: ['Completed'],
        closed: [], // Terminal state
        cancelled: [], // Terminal state
      }
      return validTransitions[currentStatus] || []
    }

    const handleUpdateStatus = async (newStatus: string) => {
      if (!orderId) return
      
      setShowStatusDropdown(false)
      setIsUpdatingStatus(true)
      
      try {
        const statusValue = getStatusValue(newStatus)
        await ordersApi.updateStatus(orderId, statusValue)
        
        // Refresh order data to get updated timeline and status - ensures real-time update
        const updatedOrder = await ordersApi.getById(orderId)
        setOrderDetails(updatedOrder)
        
        // Timeline will automatically update based on new orderDetails status and updatedAt
        
        // Show success message
        alert(`Order status updated to ${newStatus} successfully`)
      } catch (error: any) {
        console.error('Error updating status:', error)
        alert(error?.response?.data?.message || 'Failed to update order status. Please try again.')
      } finally {
        setIsUpdatingStatus(false)
      }
    }

    const handleAddTracking = () => {
      if (orderId) {
        navigate(`/orders/${orderId}/shipping`)
      }
    }

    const handleDownloadInvoice = () => {
      if (orderId) {
        navigate(`/orders/${orderId}/invoice-new`)
      }
    }

    const handlePrintOrder = () => {
      window.print()
    }

    const handleViewProfile = () => {
      if (orderDetails?.userId) {
        navigate(`/users/${orderDetails.userId}`)
      }
    }

    const handleViewVendor = () => {
      if (orderDetails?.vendor?.id) {
        navigate(`/vendors/${orderDetails.vendor.id}/detail`)
      }
    }

    // Get customer data for header section
    const headerCustomerImageUrl = (orderDetails?.user as any)?.profileImageUrl || null
    const headerCustomerName = customerName
    const headerCustomerEmail = customerEmail
    const headerCustomerPhone = customerPhone || '-'

    // Get vendor info if it's a vendor order
    // Check if vendor exists (even if only id and email are available)
    const hasVendor = orderDetails?.vendor && orderDetails.vendor.id
    const vendorInfo = orderType === 'vendor' && hasVendor && orderDetails?.vendor ? {
      id: orderDetails.vendor.id,
      name: (orderDetails.vendor as any)?.name || orderDetails.vendor.email || 'Vendor',
      email: orderDetails.vendor.email,
      imageUrl: (orderDetails.vendor as any)?.profileImageUrl || null
    } : null
    
    // Debug: Log vendor info for troubleshooting
    if (orderType === 'vendor') {
      console.log('Vendor order detected:', { orderType, hasVendor, vendor: orderDetails?.vendor, vendorInfo })
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

        {/* Order ID, Date and Action Buttons - Above Customer Information */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
          {/* Left: Order ID and Date */}
          <div className="flex flex-col">
            <p className="text-base sm:text-lg font-bold text-gray-900">{formattedOrderId}</p>
            <p className="text-sm text-gray-600">{formattedDate} at {orderTime}</p>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleDownloadInvoice}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Download Invoice</span>
            </button>
            {/* Vendor Information Button - Only for vendor orders */}
            {orderType === 'vendor' && vendorInfo && (
              <button
                onClick={handleViewVendor}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {vendorInfo.imageUrl ? (
                    <img 
                      src={vendorInfo.imageUrl} 
                      alt={vendorInfo.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <span className="text-xs font-semibold text-white">
                      {vendorInfo.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span>Vendor Information</span>
              </button>
            )}
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 relative">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Customer Information</h2>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            {/* Left: Customer Info */}
            <div className="flex items-start gap-4 flex-1">
              {/* Customer Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {headerCustomerImageUrl ? (
                  <img 
                    src={headerCustomerImageUrl} 
                    alt={headerCustomerName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                ) : (
                  <span className="text-2xl font-semibold text-gray-600">
                    {headerCustomerName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {/* Customer Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{headerCustomerName}</h3>
                <p className="text-sm text-gray-600 mb-1">{headerCustomerEmail}</p>
                <p className="text-sm text-gray-600">{headerCustomerPhone}</p>
              </div>
            </div>

            {/* Right: View Profile Button (top right) and Status Badge (bottom right) */}
            <div className="flex flex-col items-start sm:items-end gap-4 sm:absolute sm:top-4 sm:right-6 sm:bottom-4 sm:justify-between">
              <button
                onClick={handleViewProfile}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                <UserIcon className="w-4 h-4" />
                <span>View Profile</span>
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(orderDetails?.status || '')}`}>
                {formatStatus(orderDetails?.status || '')}
              </span>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div>
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Order Items</h2>
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Product</th>
                    <th className="text-center py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Qty</th>
                    <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Unit Price</th>
                    <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orderProducts.map((product) => (
                    <tr key={product.id} className="bg-white">
                      <td className="py-3 px-3 sm:px-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <img 
                            src={product.image || 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop'} 
                            alt={product.name} 
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop'
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 text-center whitespace-nowrap">{product.quantity}</td>
                      <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap">{currency} {product.unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 text-right whitespace-nowrap">{currency} {product.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                  {/* Shipping Row */}
                  <tr className="bg-gray-50 border-t-2 border-gray-300">
                    <td className="py-3 px-3 sm:px-4">
                      <p className="text-xs sm:text-sm text-gray-700">Shipping</p>
                    </td>
                    <td className="py-3 px-3 sm:px-4"></td>
                    <td className="py-3 px-3 sm:px-4"></td>
                    <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap">{currency} {shipping.toFixed(2)}</td>
                  </tr>
                  {/* Total Row */}
                  <tr className="bg-gray-50">
                    <td className="py-3 px-3 sm:px-4">
                      <p className="text-sm sm:text-base font-bold text-gray-900">Total</p>
                    </td>
                    <td className="py-3 px-3 sm:px-4"></td>
                    <td className="py-3 px-3 sm:px-4"></td>
                    <td className="py-3 px-3 sm:px-4 text-sm sm:text-base font-bold text-gray-900 text-right whitespace-nowrap">{currency} {total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
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
                    {orderDetails?.paymentMethod ? (
                      <>
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                          <rect width="24" height="16" rx="2" fill="#1A1F71"/>
                          <path d="M8 8h8v8H8z" fill="#F79E1B"/>
                        </svg>
                        <p className="text-xs sm:text-sm text-gray-600 break-all">{orderDetails.paymentMethod}</p>
                      </>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-400 italic">Not specified</p>
                    )}
                  </div>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2'>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Transaction ID</p>
                  <p className="text-xs sm:text-sm text-gray-400 italic break-all">
                    {(orderDetails as any)?.paymentIntentId ? `#${(orderDetails as any).paymentIntentId.slice(-12)}` : 'Not available'}
                  </p>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 sm:items-center'>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Status</p>
                  {(() => {
                    const pay = getPaymentStatusDisplay(orderDetails)
                    return (
                      <span className={`inline-flex items-center px-2 sm:px-4 rounded-full text-xs font-medium w-fit ${pay.className}`}>
                        {pay.label}
                      </span>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Delivery Information</h2>
              <div className="space-y-3 sm:space-y-4 bg-gray-300 rounded-md p-3">
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 sm:items-center'>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Shipping Method</p>
                  <p className="text-xs sm:text-sm text-gray-400 italic">{orderDetails?.deliveryCompany ? 'Express Delivery' : 'Not specified'}</p>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 sm:items-center'>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Courier</p>
                  <p className="text-xs sm:text-sm text-gray-400 italic">{orderDetails?.deliveryCompany || 'Not specified'}</p>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 sm:items-center'>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Tracking Number</p>
                  {orderDetails?.trackingNumber ? (
                    <a href="#" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline break-all">
                      #{orderDetails.trackingNumber}
                    </a>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-400 italic">Not available</p>
                  )}
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 sm:items-center'>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Est. Delivery</p>
                  <p className="text-xs sm:text-sm text-gray-400 italic">
                    {orderDetails?.estimatedDeliveryDate 
                      ? new Date(orderDetails.estimatedDeliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline Section (order + refund events, clickable) */}
        {orderDetails && orderTimeline.length > 0 && (
          <div>
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
              Order Timeline
            </h2>
            <OrderTimelineCard
              timeline={orderTimeline}
              onEventClick={(event) => {
                if (event.type === 'refund') {
                  setSelectedRefundEvent(event)
                }
              }}
            />
            {selectedRefundEvent &&
              selectedRefundEvent.meta?.refundRequestId &&
              orderDetails?.id && (
                <RefundDetailModal
                  isOpen={!!selectedRefundEvent}
                  refundRequestId={selectedRefundEvent.meta.refundRequestId}
                  onClose={() => setSelectedRefundEvent(null)}
                  onActionComplete={async () => {
                    try {
                      if (!orderId) return
                      const refreshed = await ordersApi.getById(orderId)
                      setOrderDetails(refreshed)

                      // Rebuild the lightweight OrderRecord used elsewhere on the page
                      const total = parseFloat(refreshed.totalMinor as any) / 100
                      const firstItem = refreshed.items?.[0]
                      const productName =
                        firstItem?.product?.title || 'N/A'
                      const customerName =
                        (refreshed.user as any)?.name ||
                        refreshed.user?.email?.split('@')[0] ||
                        'Unknown'
                      const customerImageUrl =
                        (refreshed.user as any)?.profileImageUrl || null

                      const transformedOrder: OrderRecord = {
                        id: `#${refreshed.orderNumber || refreshed.id.slice(-8)}`,
                        customerName,
                        customerEmail: refreshed.user?.email,
                        customerImageUrl,
                        product: productName,
                        productImage:
                          firstItem?.product?.media?.[0]?.url,
                        amount: total,
                        amountFormatted: `${refreshed.currency} ${total.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`,
                        paymentMethod: refreshed.paymentMethod || 'N/A',
                        status: refreshed.status as any,
                        displayStatus: buildOrderDisplayStatus(
                          refreshed.status,
                          refreshed.refundStatus
                        ),
                        orderDate: new Date(
                          refreshed.createdAt,
                        ).toLocaleDateString('en-GB'),
                        orderNumber: refreshed.orderNumber,
                        orderId: refreshed.id,
                      }

                      setOrder(transformedOrder)
                    } catch (err) {
                      console.error(
                        'Failed to refresh order after refund action',
                        err,
                      )
                    }
                  }}
                />
              )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
          {/* Add Tracking Button */}
          <button
            type="button"
            onClick={handleAddTracking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-blue-700 cursor-pointer"
          >
            <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>
              {orderDetails?.trackingNumber || orderDetails?.deliveryCompany 
                ? 'Update Tracking Information' 
                : 'Add Tracking'}
            </span>
          </button>
          
          {/* Update Status Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowStatusDropdown(!showStatusDropdown)
              }}
              disabled={isUpdatingStatus}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Update Status</span>
              <ChevronDownIcon className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showStatusDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-[45]"
                  onClick={() => setShowStatusDropdown(false)}
                />
                <div className="absolute right-0 sm:right-0 bottom-full mb-2 z-[60] bg-white rounded-lg shadow-xl border border-gray-200 w-48 py-2 max-h-64 overflow-y-auto">
                  {getAvailableStatuses().length > 0 ? (
                    getAvailableStatuses().map((status) => (
                      <button
                        key={status}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUpdateStatus(status)
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 text-gray-700"
                      >
                        {status}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2.5 text-sm text-gray-400">
                      No status changes available
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
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
              alt={customerName}
              className="h-16 w-16 rounded-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement
                if (target.src !== `https://i.pravatar.cc/100?img=${customerName.length % 70}`) {
                  target.src = `https://i.pravatar.cc/100?img=${customerName.length % 70}`
                }
              }}
            />
          </div>

          {/* Center-Left: Name and Contact Info */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{customerName}</h2>
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
            <p className="text-sm font-medium text-orange-600">QAR {totalRefundAmount.toFixed(2)}</p>
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
                {shippingAddress.street && <p>{shippingAddress.street}</p>}
                {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
                {(shippingAddress.city || shippingAddress.state || shippingAddress.postalCode) && (
                  <p>
                    {[shippingAddress.city, shippingAddress.state, shippingAddress.postalCode].filter(Boolean).join(', ')}
                  </p>
                )}
                {shippingAddress.country && <p>{shippingAddress.country}</p>}
                {!shippingAddress.street && !shippingAddress.city && !shippingAddress.country && (
                  <p className="text-gray-400 italic">No shipping address provided</p>
                )}
              </div>
            </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Billing Address</h3>
            <div className="space-y-1 text-sm text-gray-600">
              {billingAddress.street && <p>{billingAddress.street}</p>}
              {billingAddress.apartment && <p>{billingAddress.apartment}</p>}
              {(billingAddress.city || billingAddress.state || billingAddress.postalCode) && (
                <p>
                  {[billingAddress.city, billingAddress.state, billingAddress.postalCode].filter(Boolean).join(', ')}
                </p>
              )}
              {billingAddress.country && <p>{billingAddress.country}</p>}
              {!billingAddress.street && !billingAddress.city && !billingAddress.country && (
                <p className="text-gray-400 italic">No billing address provided</p>
              )}
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
                  <td className="px-4 py-3 text-sm text-gray-900">{orderItem.amountFormatted || `QAR ${orderItem.amount.toFixed(2)}`}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={orderItem.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{orderItem.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/orders/${orderItem.orderId}/detail`)
                      }}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      View order
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
            onClick={() => setShowAddNoteModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-500 hover:text-blue-600 cursor-pointer"
          >
            <PlusIcon className="h-4 w-4" />
            Add Note
          </button>
        </div>
        <div className="space-y-4">
          {customerNotes.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No notes added yet.</p>
          ) : (
            customerNotes.map((note) => {
              const addedByName = note.addedByUser?.name || note.addedByUser?.email || 'Admin'
              const noteDate = new Date(note.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })
              // Alternate colors for visual distinction
              const colorClass = parseInt(note.id.slice(-1), 16) % 2 === 0 ? 'bg-blue-500' : 'bg-green-500'
              
              return (
                <div key={note.id} className="flex gap-4">
                  <div className={`w-1 rounded-full ${colorClass}`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{note.note}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Added by {addedByName} - {noteDate}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Customer Note</h3>
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Enter note text..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E] resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddNoteModal(false)
                  setNewNoteText('')
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNote}
                disabled={isAddingNote || !newNoteText.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#F7931E] rounded-lg hover:bg-[#E8840D] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAddingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

