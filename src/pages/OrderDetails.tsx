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

              if (!ordersResult.data || ordersResult.data.length === 0) {
                throw new Error("No orders found in the system")
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
              throw new Error(
                `Failed to find order: ${error?.message || "Unknown error"}`
              )
            }
          }

          // Store the UUID for later use (for invoice download, etc.)
          setOrderUuid(orderIdToFetch)

          // Fetch from API using UUID
          const apiOrder = await ordersApi.getById(orderIdToFetch)
          
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
          })

          // Show user-friendly error message
          if (error?.response?.status === 404) {
            alert(`Order with ID ${orderId} not found. Please check if the order exists.`)
        } else {
            alert(`Failed to load order details: ${error?.message || "Unknown error"}`)
          }

          navigate('/orders')
        }
      }
      setLoading(false)
    }

    loadOrder()
  }, [orderId, navigate])

  const handleUpdateStatus = () => {
    // Handle update status logic
    console.log('Update status for order:', order?.orderId)
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
      // Convert invoice data to JSON and download as file
      const blob = new Blob([JSON.stringify(invoiceData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${invoiceData.invoiceNumber}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      // TODO: If PDF generation is added, download PDF instead
      // For now, JSON download is available
      console.log('Invoice downloaded:', invoiceData.invoiceNumber)
    } catch (error) {
      console.error('Error downloading invoice:', error)
      alert('Failed to download invoice. Please try again.')
    }
  }

  const handleCancelOrder = () => {
    // Handle cancel order logic
    console.log('Cancel order:', order?.orderId)
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
    </div>
  )
}
