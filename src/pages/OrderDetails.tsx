import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CustomerInformationCard from '../components/orders/CustomerInformationCard'
import OrderTimelineCard from '../components/orders/OrderTimelineCard'
import QuickActionsCard from '../components/orders/QuickActionsCard'
import { ordersApi } from '../services/orders.api'
import type { OrderDetails as OrderDetailsType } from '../types/orderDetails'

/**
 * Order Details page component
 */
export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetailsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderUuid, setOrderUuid] = useState<string | null>(null) // State to store the UUID
  const [backendStatus, setBackendStatus] = useState<string>('') // Store backend status separately
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true)
      let orderIdToFetch: string | null = null

      if (orderId) {
        try {
          // Check if orderId is a UUID (contains hyphens)
          // UUIDs contain hyphens, numeric IDs and order numbers don't
          const isUuid = orderId.includes("-") && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)
          const isNumericId = !orderId.includes("-") && /^\d+$/.test(orderId)

          console.log("Processing order ID:", { orderId, isUuid, isNumericId })

          if (isUuid) {
            // It's already a UUID, use it directly
            orderIdToFetch = orderId
            console.log("Using UUID directly:", orderIdToFetch)
          } else if (isNumericId) {
            // This is a numeric ID, we need to convert it to UUID
            // Fetch orders list to build the mapping
            console.log(
              "Numeric ID detected, fetching orders list to find UUID...",
              orderId
            )

            try {
              const ordersResult = await ordersApi.getAll({
                page: 1,
                limit: 1000,
              })
              console.log(
                "Fetched orders for mapping:",
                ordersResult.data?.length || 0
              )

              if (!ordersResult.data || ordersResult.data.length === 0) {
                throw new Error("No orders found in the system")
              }

              const orderIdMap = new Map<number, string>()
              ordersResult.data.forEach((order: any) => {
                try {
                  if (order.id && typeof order.id === "string") {
                    const numericId =
                      parseInt(order.id.replace(/-/g, "").substring(0, 10), 16) %
                      1000000
                    orderIdMap.set(numericId, order.id)
                  }
                } catch (e) {
                  console.error("Error converting order ID for mapping:", order.id, e)
                }
              })

              console.log("Order ID map built with", orderIdMap.size, "entries")

              const numericId = parseInt(orderId)
              const uuid = orderIdMap.get(numericId)

              if (!uuid) {
                console.error(
                  `Order with numeric ID ${orderId} not found in mapping.`
                )
                throw new Error(
                  `Order with ID ${orderId} not found. The order may not exist or the ID mapping failed.`
                )
              }

              orderIdToFetch = uuid
              console.log(
                `Successfully converted numeric ID ${orderId} to UUID: ${uuid}`
              )
            } catch (error: any) {
              console.error("Error converting numeric ID to UUID:", error)
              throw new Error(
                `Failed to convert order ID: ${
                  error?.message || "Unknown error"
                }`
              )
            }
          } else {
            // It might be an order number (like "ORD-..."), try to find by order number
            console.log(
              "Order number detected, fetching orders to find UUID...",
              orderId
            )

            try {
              const ordersResult = await ordersApi.getAll({
                page: 1,
                limit: 1000,
              })

              console.log("Orders result for lookup:", {
                hasResult: !!ordersResult,
                hasData: !!ordersResult?.data,
                isArray: Array.isArray(ordersResult?.data),
                dataLength: ordersResult?.data?.length || 0,
                pagination: ordersResult?.pagination,
              })

              // Safety check: ensure ordersResult has valid structure
              if (!ordersResult) {
                console.error("Orders API returned null/undefined")
                throw new Error("Failed to fetch orders from API. Please check backend logs.")
              }

              if (!ordersResult.data || !Array.isArray(ordersResult.data)) {
                console.error("Invalid API response structure:", ordersResult)
                throw new Error("Invalid orders data structure received from API.")
              }

              if (ordersResult.data.length === 0) {
                console.error("No orders returned from API. This might indicate:")
                console.error("1. No orders exist in the database")
                console.error("2. API error (check backend logs)")
                console.error("3. BigInt serialization issue (check backend)")
                throw new Error("No orders found in the system. Please check if orders exist or if there's an API error.")
              }

              // Try to find order by order number
              // Remove '#' prefix if present
              const cleanOrderNumber = orderId.replace(/^#/, "")
              const matchingOrder = ordersResult.data.find(
                (order: any) =>
                  order.orderNumber === cleanOrderNumber ||
                  order.orderNumber === orderId ||
                  order.id === orderId
              )

              if (!matchingOrder) {
                console.error(
                  `Order with number/ID ${orderId} not found.`
                )
                throw new Error(
                  `Order with ID ${orderId} not found. The order may not exist.`
                )
              }

              orderIdToFetch = matchingOrder.id
              console.log(
                `Successfully found order: ${orderId} -> UUID: ${orderIdToFetch}`
              )
            } catch (error: any) {
              console.error("Error finding order by number:", error)
              console.error("Error details:", {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
                orderId,
                stack: error?.stack,
              })
              
              // Provide more specific error message
              let errorMessage = 'Failed to find order'
              if (error?.response?.status === 500) {
                errorMessage = 'Server error while fetching orders. This might be a BigInt serialization issue. Please check backend logs.'
                console.error('Backend 500 error - likely BigInt serialization issue')
              } else if (error?.message) {
                errorMessage = `Failed to find order: ${error.message}`
              } else {
                errorMessage = 'Failed to find order: Unknown error occurred.'
              }
              
              throw new Error(errorMessage)
            }
          }

          // Store the UUID for later use (for invoice download, etc.)
          setOrderUuid(orderIdToFetch)

          // Fetch from API using UUID
          const apiOrder = await ordersApi.getById(orderIdToFetch)
          setBackendStatus(apiOrder.status) // Store backend status
          
          // Transform API order to frontend format
          const transformedOrder: OrderDetailsType = {
            id: apiOrder.id,
            orderId: apiOrder.orderNumber,
            date: new Date(apiOrder.createdAt).toLocaleDateString(),
            time: new Date(apiOrder.createdAt).toLocaleTimeString(),
            status: apiOrder.status as any,
            customer: {
              id: parseInt(apiOrder.user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000,
              name: apiOrder.user.email.split('@')[0],
              email: apiOrder.user.email,
              phone: (apiOrder.user as any).phone || '',
              avatar: '',
            },
            products: apiOrder.items.map((item: any) => ({
              id: item.id,
              name: item.product.title,
              image: item.product.media?.[0]?.url || '',
              category: '',
              quantity: item.quantity,
              price: parseFloat(item.priceMinor?.toString() || '0') / 100,
              total: (parseFloat(item.priceMinor?.toString() || '0') / 100) * item.quantity,
            })),
            payment: {
              method: apiOrder.paymentMethod as any,
              transactionId: apiOrder.id,
              status: apiOrder.status === 'paid' ? 'completed' : 'pending',
              subtotal: parseFloat(apiOrder.totalMinor?.toString() || '0') / 100,
              discount: parseFloat(apiOrder.discountMinor?.toString() || '0') / 100,
              tax: 0,
              shipping: 0,
              total: parseFloat(apiOrder.totalMinor?.toString() || '0') / 100,
            },
            shipping: {
              address: (apiOrder.shippingAddress as any)?.street || (apiOrder.shippingAddress as any)?.address || '',
              city: (apiOrder.shippingAddress as any)?.city || '',
              state: (apiOrder.shippingAddress as any)?.state || '',
              postalCode: (apiOrder.shippingAddress as any)?.postalCode || '',
              country: (apiOrder.shippingAddress as any)?.country || '',
              method: 'Standard',
              trackingNumber: '',
              estimatedDelivery: '',
            },
            timeline: [
              {
                id: '1',
                status: 'Order Created',
                date: new Date(apiOrder.createdAt).toLocaleDateString(),
                time: new Date(apiOrder.createdAt).toLocaleTimeString(),
              },
            ],
          }
          
          setOrder(transformedOrder)
        } catch (error: any) {
          console.error('Error fetching order:', error)
          console.error('Error details:', {
            message: error?.message,
            response: error?.response?.data,
            status: error?.response?.status,
            orderId,
            orderIdToFetch,
            stack: error?.stack,
          })

          // Show user-friendly error message based on error type
          let errorMessage = 'Failed to load order details'
          
          if (error?.response?.status === 404) {
            errorMessage = `Order with ID ${orderId} not found. Please check if the order exists.`
          } else if (error?.response?.status === 500) {
            errorMessage = `Server error while loading order details. This might be a BigInt serialization issue. Please check backend logs.`
            console.error('Backend 500 error - likely BigInt serialization issue')
          } else if (error?.response?.status === 401) {
            errorMessage = `Unauthorized. Please log in again.`
          } else if (error?.message) {
            errorMessage = `Failed to load order details: ${error.message}`
        } else {
            errorMessage = `Failed to load order details: Unknown error occurred.`
          }

          alert(errorMessage)
          navigate('/orders')
        }
      }
      setLoading(false)
    }

    loadOrder()
  }, [orderId, navigate])

  const handleUpdateStatus = () => {
    if (!order || !orderUuid) return
    
    // Use the stored backend status
    setSelectedStatus(backendStatus || 'created')
    setStatusModalOpen(true)
  }

  const handleConfirmStatusUpdate = async () => {
    if (!orderUuid || !order || !selectedStatus || selectedStatus === backendStatus) {
      if (selectedStatus === backendStatus) {
        alert('Status is already set to this value')
      }
      setStatusModalOpen(false)
      return
    }

    try {
      await ordersApi.updateStatus(orderUuid, selectedStatus)
      
      // Reload order data to get updated status
      const updatedOrder = await ordersApi.getById(orderUuid)
      
      // Transform updated order to frontend format
      const transformedOrder: OrderDetailsType = {
        id: updatedOrder.id,
        orderId: updatedOrder.orderNumber,
        date: new Date(updatedOrder.createdAt).toLocaleDateString(),
        time: new Date(updatedOrder.createdAt).toLocaleTimeString(),
        customer: {
          id: parseInt(updatedOrder.user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000,
          name: updatedOrder.user.email.split('@')[0],
          email: updatedOrder.user.email,
          phone: (updatedOrder.user as any).phone || '',
          avatar: '',
        },
        status: updatedOrder.status === 'closed' || updatedOrder.status === 'delivered' ? 'completed' :
                updatedOrder.status === 'cancelled' ? 'cancelled' : 'pending',
        products: updatedOrder.items.map((item: any) => ({
          id: item.product?.id || '',
          name: item.product?.title || 'Product',
          image: item.product?.media?.[0]?.url || '',
          category: item.product?.category || 'General',
          quantity: item.quantity,
          price: parseFloat(item.priceMinor?.toString() || '0') / 100,
          total: parseFloat(item.priceMinor?.toString() || '0') / 100 * item.quantity,
        })),
        payment: {
          method: updatedOrder.paymentMethod === 'card' ? 'credit-card' : 
                  updatedOrder.paymentMethod === 'wallet' ? 'bank-transfer' : 
                  updatedOrder.paymentMethod === 'cod' ? 'cash-on-delivery' : 'credit-card',
          transactionId: updatedOrder.id,
          status: updatedOrder.status === 'paid' || updatedOrder.status === 'closed' || updatedOrder.status === 'delivered' ? 'completed' : 
                  updatedOrder.status === 'cancelled' ? 'refunded' : 'pending',
          subtotal: parseFloat(updatedOrder.totalMinor?.toString() || '0') / 100,
          discount: parseFloat(updatedOrder.discountMinor?.toString() || '0') / 100,
          tax: 0,
          shipping: 0,
          total: parseFloat(updatedOrder.totalMinor?.toString() || '0') / 100,
        },
        shipping: {
          address: (updatedOrder.shippingAddress as any)?.street || (updatedOrder.shippingAddress as any)?.address || '',
          city: (updatedOrder.shippingAddress as any)?.city || '',
          state: (updatedOrder.shippingAddress as any)?.state || '',
          postalCode: (updatedOrder.shippingAddress as any)?.postalCode || '',
          country: (updatedOrder.shippingAddress as any)?.country || '',
          method: 'Standard',
          trackingNumber: '',
          estimatedDelivery: '',
        },
        timeline: [
          {
            id: '1',
            status: 'Order Created',
            date: new Date(updatedOrder.createdAt).toLocaleDateString(),
            time: new Date(updatedOrder.createdAt).toLocaleTimeString(),
          },
        ],
      }
      
      setOrder(transformedOrder)
      setStatusModalOpen(false)
      alert('Order status updated successfully!')
    } catch (error: any) {
      console.error('Error updating order status:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update order status'
      alert(`Error: ${errorMessage}`)
    }
  }

  // Unused - keeping for reference
  // const _handleVendorInformation = () => {
  //   if (order?.customer) {
  //     // Navigate to vendor detail page if available
  //     console.log('View vendor information for order:', order?.orderId)
  //   }
  // }

  const handleDownloadInvoice = async () => {
    if (!orderUuid || !order) return
    
    try {
      const invoiceData = await ordersApi.getInvoice(orderUuid)
      
      // Generate HTML invoice
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { border-bottom: 2px solid #F39C12; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #F39C12; margin: 0; }
            .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .info-section { flex: 1; }
            .info-section h3 { margin-top: 0; color: #666; font-size: 14px; }
            .info-section p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background-color: #f5f5f5; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .text-right { text-align: right; }
            .total-section { margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd; }
            .total-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .total-row.final { font-size: 18px; font-weight: bold; color: #F39C12; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <p>Invoice #${invoiceData.invoiceNumber}</p>
            <p>Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString()}</p>
          </div>
          
          <div class="invoice-info">
            <div class="info-section">
              <h3>Bill To:</h3>
              <p><strong>${invoiceData.customer.email}</strong></p>
              ${invoiceData.customer.phone ? `<p>Phone: ${invoiceData.customer.phone}</p>` : ''}
              ${invoiceData.customer.shippingAddress ? `
                <p>${invoiceData.customer.shippingAddress.street || invoiceData.customer.shippingAddress.address || ''}</p>
                <p>${invoiceData.customer.shippingAddress.city || ''}, ${invoiceData.customer.shippingAddress.state || ''} ${invoiceData.customer.shippingAddress.postalCode || ''}</p>
                <p>${invoiceData.customer.shippingAddress.country || ''}</p>
              ` : ''}
            </div>
            <div class="info-section">
              <h3>Ship From:</h3>
              <p><strong>${invoiceData.vendor.email}</strong></p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items.map((item: any) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td class="text-right">${(parseFloat(item.unitPrice?.toString() || '0') / 100).toFixed(2)} ${item.currency || invoiceData.currency}</td>
                  <td class="text-right">${(parseFloat(item.total?.toString() || '0') / 100).toFixed(2)} ${item.currency || invoiceData.currency}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${(parseFloat(invoiceData.subtotal?.toString() || '0') / 100).toFixed(2)} ${invoiceData.currency}</span>
            </div>
            ${parseFloat(invoiceData.discount?.toString() || '0') > 0 ? `
              <div class="total-row">
                <span>Discount:</span>
                <span>-${(parseFloat(invoiceData.discount?.toString() || '0') / 100).toFixed(2)} ${invoiceData.currency}</span>
              </div>
            ` : ''}
            ${parseFloat(invoiceData.tax?.toString() || '0') > 0 ? `
              <div class="total-row">
                <span>Tax:</span>
                <span>${(parseFloat(invoiceData.tax?.toString() || '0') / 100).toFixed(2)} ${invoiceData.currency}</span>
              </div>
            ` : ''}
            ${parseFloat(invoiceData.shipping?.toString() || '0') > 0 ? `
              <div class="total-row">
                <span>Shipping:</span>
                <span>${(parseFloat(invoiceData.shipping?.toString() || '0') / 100).toFixed(2)} ${invoiceData.currency}</span>
              </div>
            ` : ''}
            <div class="total-row final">
              <span>Total:</span>
              <span>${(parseFloat(invoiceData.total?.toString() || '0') / 100).toFixed(2)} ${invoiceData.currency}</span>
            </div>
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p><strong>Payment Method:</strong> ${invoiceData.paymentMethod === 'card' ? 'Credit Card' : invoiceData.paymentMethod === 'wallet' ? 'Wallet' : invoiceData.paymentMethod === 'cod' ? 'Cash on Delivery' : invoiceData.paymentMethod}</p>
            <p><strong>Status:</strong> ${invoiceData.status}</p>
          </div>
        </body>
        </html>
      `
      
      // Create blob and download
      const blob = new Blob([invoiceHTML], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${invoiceData.invoiceNumber}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      // Also provide option to print (which can save as PDF)
      if (window.confirm('Invoice downloaded. Would you like to open it for printing (can save as PDF)?')) {
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(invoiceHTML)
          printWindow.document.close()
          printWindow.focus()
          setTimeout(() => {
            printWindow.print()
          }, 250)
        }
      }
      
      console.log('Invoice downloaded:', invoiceData.invoiceNumber)
    } catch (error: any) {
      console.error('Error downloading invoice:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to download invoice. Please try again.'
      alert(`Error: ${errorMessage}`)
    }
  }

  const handleCancelOrder = async () => {
    if (!orderUuid || !order) return
    
    if (!confirm(`Are you sure you want to cancel order ${order.orderId}? This action cannot be undone.`)) {
      return
    }

    try {
      // Update order status to cancelled
      await ordersApi.updateStatus(orderUuid, 'cancelled')
      
      // Reload order data to get updated status
      const updatedOrder = await ordersApi.getById(orderUuid)
      setBackendStatus(updatedOrder.status)
      
      // Transform updated order to frontend format
      const transformedOrder: OrderDetailsType = {
        id: updatedOrder.id,
        orderId: updatedOrder.orderNumber,
        date: new Date(updatedOrder.createdAt).toLocaleDateString(),
        time: new Date(updatedOrder.createdAt).toLocaleTimeString(),
        customer: {
          id: parseInt(updatedOrder.user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000,
          name: updatedOrder.user.email.split('@')[0],
          email: updatedOrder.user.email,
          phone: (updatedOrder.user as any).phone || '',
          avatar: '',
        },
        status: 'cancelled',
        products: updatedOrder.items.map((item: any) => ({
          id: item.product?.id || '',
          name: item.product?.title || 'Product',
          image: item.product?.media?.[0]?.url || '',
          category: item.product?.category || 'General',
          quantity: item.quantity,
          price: parseFloat(item.priceMinor?.toString() || '0') / 100,
          total: parseFloat(item.priceMinor?.toString() || '0') / 100 * item.quantity,
        })),
        payment: {
          method: updatedOrder.paymentMethod === 'card' ? 'credit-card' :
                  updatedOrder.paymentMethod === 'wallet' ? 'bank-transfer' :
                  updatedOrder.paymentMethod === 'cod' ? 'cash-on-delivery' : 'credit-card',
          transactionId: updatedOrder.id,
          status: 'refunded',
          subtotal: parseFloat(updatedOrder.totalMinor?.toString() || '0') / 100,
          discount: parseFloat(updatedOrder.discountMinor?.toString() || '0') / 100,
          tax: 0,
          shipping: 0,
          total: parseFloat(updatedOrder.totalMinor?.toString() || '0') / 100,
        },
        shipping: {
          address: (updatedOrder.shippingAddress as any)?.street || (updatedOrder.shippingAddress as any)?.address || '',
          city: (updatedOrder.shippingAddress as any)?.city || '',
          state: (updatedOrder.shippingAddress as any)?.state || '',
          postalCode: (updatedOrder.shippingAddress as any)?.postalCode || '',
          country: (updatedOrder.shippingAddress as any)?.country || '',
          method: 'Standard',
          trackingNumber: '',
          estimatedDelivery: '',
        },
        timeline: [
          {
            id: '1',
            status: 'Order Created',
            date: new Date(updatedOrder.createdAt).toLocaleDateString(),
            time: new Date(updatedOrder.createdAt).toLocaleTimeString(),
          },
          {
            id: '2',
            status: 'Order Cancelled',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
          },
        ],
      }
      
      setOrder(transformedOrder)
      alert('Order cancelled successfully! Refund will be processed if payment was made.')
    } catch (error: any) {
      console.error('Error cancelling order:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to cancel order'
      alert(`Error: ${errorMessage}`)
    }
  }

  // Unused - keeping for reference
  // const _handleProcessRefund = () => {
  //   // Handle process refund logic
  //   console.log('Process refund for order:', order?.orderId)
  // }

  const handleSendInvoice = () => {
    // Handle send invoice logic
    console.log('Send invoice for order:', order?.orderId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Order not found</p>
      </div>
    )
  }

  // Calculate totals for order summary
  const subtotal = order.products.reduce((sum, product) => sum + product.total, 0)
  const itemsCount = order.products.reduce((sum, product) => sum + product.quantity, 0)

  return (
    <div className="w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900">E-commerce Products</h1>
        <p className="mb-4 text-xs sm:text-sm text-gray-600">Dashboard · Order View</p>
      </div>

      {/* Order Details Container */}
      <div className="space-y-4 sm:space-y-6">
        {/* Order Details Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Order #{order.orderId}</h2>
              <p className="mt-1 text-sm text-gray-600">Manage order status and view details</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select 
                  defaultValue={order.status}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleUpdateStatus}
                className="rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D]"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Customer Information Card */}
            <CustomerInformationCard customer={order.customer} status={order.status} shipping={order.shipping} />

            {/* Ordered Items Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-gray-900">Ordered Items</h3>
              <div className="space-y-0 divide-y divide-gray-200">
                {order.products.map((product, _index) => (
                  <div key={product.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                    <img
                      src={product.image || 'https://via.placeholder.com/80'}
                      alt={product.name}
                      className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                      <p className="mt-1 text-xs text-gray-600">Color: Black, Size: One Size</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                        <span>Quantity: {product.quantity}</span>
                        <span>Price: ${product.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Subtotal: ${product.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Order Summary Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-gray-900">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Placed On:</span>
                  <span className="font-medium text-gray-900">{order.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Type:</span>
                  <span className="font-medium text-gray-900">Regular Order</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-900">{order.payment.method === 'credit-card' ? 'Online Payment' : order.payment.method}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items Count:</span>
                  <span className="font-medium text-gray-900">{itemsCount} items</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium text-gray-900">${order.payment.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium text-gray-900">${order.payment.tax.toFixed(2)}</span>
                </div>
                {order.payment.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-green-600">-${order.payment.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-base font-bold text-gray-900">${order.payment.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <QuickActionsCard
              onPrintInvoice={handleDownloadInvoice}
              onSendEmail={handleSendInvoice}
              onTrackShipment={() => console.log('Track shipment')}
              onCancelOrder={handleCancelOrder}
            />

            {/* Order Timeline Card */}
            <OrderTimelineCard timeline={order.timeline} />
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {statusModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setStatusModalOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div
              className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-xl my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Update Order Status</h3>
              <div className="space-y-4 mb-6">
                <p className="text-sm text-gray-600">Select new status for this order:</p>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]"
                >
                  <option value="created">Created</option>
                  <option value="paid">Paid</option>
                  <option value="fulfillment_pending">Fulfillment Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {order && selectedStatus !== backendStatus && (
                  <p className="text-xs text-gray-500">
                    Current status: <span className="font-semibold">{backendStatus}</span> → New status: <span className="font-semibold">{selectedStatus}</span>
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmStatusUpdate}
                  className="w-full sm:w-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
