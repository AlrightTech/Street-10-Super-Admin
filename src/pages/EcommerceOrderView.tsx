import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CustomerInformationCard from '../components/orders/CustomerInformationCard'
import OrderTimelineCard from '../components/orders/OrderTimelineCard'
import QuickActionsCard from '../components/orders/QuickActionsCard'
import SelectDropdown from '../components/ui/SelectDropdown'
import { DocumentIcon } from '../components/icons/Icons'
import { ordersApi } from '../services/orders.api'
import type { OrderDetails as OrderDetailsType } from '../types/orderDetails'

/**
 * E-commerce Order View page component
 */
export default function EcommerceOrderView() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetailsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string>('pending')

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
  ]

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true)
      if (orderId) {
        try {
          // For now, use mock data if API fails
          // Fetch from API
          let apiOrder
          try {
            apiOrder = await ordersApi.getById(orderId)
          } catch (apiError) {
            console.warn('API call failed, using mock data:', apiError)
            // Use mock data for development
            apiOrder = {
              id: orderId,
              orderNumber: orderId,
              createdAt: new Date().toISOString(),
              status: 'pending',
              user: {
                id: 'user-123',
                email: 'sarah.johnson@email.com',
              },
              items: [
                {
                  id: '1',
                  quantity: 2,
                  priceMinor: 4500,
                  product: {
                    title: 'Wireless Bluetooth Headphones',
                    media: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' }],
                  },
                },
                {
                  id: '2',
                  quantity: 1,
                  priceMinor: 2500,
                  product: {
                    title: 'Protective Phone Case',
                    media: [{ url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop' }],
                  },
                },
                {
                  id: '3',
                  quantity: 1,
                  priceMinor: 3500,
                  product: {
                    title: 'Wireless Charging Pad',
                    media: [{ url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop' }],
                  },
                },
              ],
              totalMinor: 17000,
              discountMinor: 700,
              paymentMethod: 'credit-card',
              shippingAddress: {
                street: '123 Main Street, Apartment 4B',
                city: 'New York',
                state: 'NY',
                postalCode: '10001',
                country: 'United States',
              },
            }
          }
          
          // Transform API order to frontend format
          const transformedOrder: OrderDetailsType = {
            id: apiOrder.id,
            orderId: apiOrder.orderNumber,
            date: new Date(apiOrder.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            time: new Date(apiOrder.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            status: apiOrder.status as any,
            customer: {
              id: parseInt(apiOrder.user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000,
              name: apiOrder.user.email.split('@')[0],
              email: apiOrder.user.email,
              phone: (apiOrder.user as any).phone || '+1 (555) 123-4567',
              avatar: '',
            },
            products: apiOrder.items.map((item: any) => ({
              id: item.id,
              name: item.product.title,
              image: item.product.media?.[0]?.url || 'https://via.placeholder.com/80',
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
              tax: 12.00,
              shipping: 15.00,
              total: parseFloat(apiOrder.totalMinor?.toString() || '0') / 100,
            },
            shipping: {
              address: (apiOrder.shippingAddress as any)?.street || (apiOrder.shippingAddress as any)?.address || '123 Main Street',
              city: (apiOrder.shippingAddress as any)?.city || 'New York',
              state: (apiOrder.shippingAddress as any)?.state || 'NY',
              postalCode: (apiOrder.shippingAddress as any)?.postalCode || '10001',
              country: (apiOrder.shippingAddress as any)?.country || 'United States',
              method: 'Standard',
              trackingNumber: '',
              estimatedDelivery: '',
            },
            timeline: [
              {
                id: '1',
                status: 'Order Placed',
                date: new Date(apiOrder.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
                time: new Date(apiOrder.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                }),
              },
              {
                id: '2',
                status: 'Payment Confirmed',
                date: new Date(apiOrder.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
                time: new Date(new Date(apiOrder.createdAt).getTime() + 2 * 60000).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                }),
              },
              {
                id: '3',
                status: 'Order Processing',
                date: new Date(apiOrder.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
                time: new Date(new Date(apiOrder.createdAt).getTime() + 4 * 3600000).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                }),
              },
            ],
          }
          
          setOrder(transformedOrder)
          setStatus(transformedOrder.status)
        } catch (error) {
          console.error('Error fetching order:', error)
          // Don't navigate away, show error state instead
          setOrder(null)
        }
      }
      setLoading(false)
    }

    loadOrder()
  }, [orderId, navigate])

  const handleUpdateStatus = async () => {
    if (!orderId || !order || !status) return
    
    try {
      // Update order status via API
      await ordersApi.updateStatus(orderId, status)
      
      // Update local state
      setOrder({
        ...order,
        status: status as any,
      })
      
      // Show success message
      alert(`Order status updated to ${statusOptions.find(opt => opt.value === status)?.label || status}`)
      
      console.log('Status updated successfully:', status)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update order status. Please try again.')
    }
  }

  const handleDownloadInvoice = async () => {
    if (!orderId || !order) return
    
    try {
      const invoiceData = await ordersApi.getInvoice(orderId)
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
      
      console.log('Invoice downloaded:', invoiceData.invoiceNumber)
    } catch (error) {
      console.error('Error downloading invoice:', error)
      alert('Failed to download invoice. Please try again.')
    }
  }

  const handleCancelOrder = async () => {
    if (!orderId || !order) return
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to cancel order #${order.orderId}? This action cannot be undone.`
    )
    
    if (!confirmed) return
    
    try {
      // Cancel order via API
      await ordersApi.updateStatus(orderId, 'cancelled')
      
      // Update local state
      setOrder({
        ...order,
        status: 'cancelled' as any,
      })
      setStatus('cancelled')
      
      // Show success message
      alert('Order has been cancelled successfully.')
      
      console.log('Order cancelled successfully:', order.orderId)
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert('Failed to cancel order. Please try again.')
    }
  }

  const handleSendInvoice = async () => {
    if (!orderId || !order) return
    
    try {
      // Send invoice via API
      await ordersApi.sendInvoice(orderId)
      
      // Show success message
      alert(`Invoice has been sent to ${order.customer.email}`)
      
      console.log('Invoice sent successfully:', order.orderId)
    } catch (error) {
      console.error('Error sending invoice:', error)
      alert('Failed to send invoice. Please try again.')
    }
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
        <p className="mb-4 text-xs sm:text-sm text-gray-600">Dashboard : Order View</p>
      </div>

      {/* Order Details Container */}
      <div className="space-y-3 sm:space-y-4">
        {/* Order Details Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Order #{order.orderId}</h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">Manage order status and view details</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Status:</label>
                <SelectDropdown
                  value={status}
                  options={statusOptions}
                  onChange={(value) => setStatus(value)}
                  className="min-w-[120px] sm:min-w-[150px]"
                />
              </div>
              <button
                type="button"
                onClick={handleUpdateStatus}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
              >
                <DocumentIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Update Status</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {/* Customer Information Card */}
            <CustomerInformationCard customer={order.customer} status={order.status} shipping={order.shipping} />

            {/* Ordered Items Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
              <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold text-gray-900">Ordered Items</h3>
              <div className="space-y-3">
                {order.products.map((product) => (
                  <div key={product.id} className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 py-3 sm:py-4 bg-[#F3F5F6] rounded-lg px-3 sm:px-4">
                    <img
                      src={product.image || 'https://via.placeholder.com/80'}
                      alt={product.name}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-900">{product.name}</h4>
                      <p className="mt-1 text-xs text-gray-600">Color: Black, Size: One Size</p>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0 w-full sm:w-auto">
                      <div className="flex items-center justify-center gap-4 sm:gap-6">
                        <div className="text-center flex-1 sm:flex-none sm:min-w-[60px]">
                          <p className="text-xs text-gray-600">Quantity</p>
                        </div>
                        <div className="text-center flex-1 sm:flex-none sm:min-w-[70px]">
                          <p className="text-xs text-gray-600">Price</p>
                        </div>
                        <div className="text-center flex-1 sm:flex-none sm:min-w-[80px]">
                          <p className="text-xs text-gray-600">Subtotal</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-4 sm:gap-6">
                        <div className="text-center flex-1 sm:flex-none sm:min-w-[60px]">
                          <p className="text-xs sm:text-sm text-gray-900">{product.quantity}</p>
                        </div>
                        <div className="text-center flex-1 sm:flex-none sm:min-w-[70px]">
                          <p className="text-xs sm:text-sm text-gray-900">${product.price.toFixed(2)}</p>
                        </div>
                        <div className="text-center flex-1 sm:flex-none sm:min-w-[80px]">
                          <p className="text-xs sm:text-sm text-gray-900">${product.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline Card */}
            <OrderTimelineCard timeline={order.timeline} />
          </div>

          {/* Right Column */}
          <div className="space-y-3 sm:space-y-4">
            {/* Order Summary Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
              <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold text-gray-900">Order Summary</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Placed On:</span>
                  <span className="font-medium text-gray-900">{order.date}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Order Type:</span>
                  <span className="font-medium text-gray-900">Regular Order</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-900">{order.payment.method === 'credit-card' ? 'Online Payment' : order.payment.method}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm pb-2 sm:pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Items Count:</span>
                  <span className="font-medium text-gray-900">{itemsCount} items</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium text-gray-900">${order.payment.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium text-gray-900">${order.payment.tax.toFixed(2)}</span>
                </div>
                {order.payment.discount > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-green-600">-${order.payment.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 my-2 sm:my-3"></div>
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm font-semibold text-gray-900">Total Amount:</span>
                <span className="text-sm sm:text-base font-bold text-gray-900">${order.payment.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <QuickActionsCard
              onPrintInvoice={handleDownloadInvoice}
              onSendEmail={handleSendInvoice}
              onTrackShipment={() => console.log('Track shipment')}
              onCancelOrder={handleCancelOrder}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

