import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ordersApi, type OrderDetails } from '../services/orders.api'
import { Calendar, Bell } from '../components/icons/Icons'

export default function OrderShipping() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    deliveryCompany: '',
    deliveryPerson: '',
    deliveryContact: '',
    estimatedDeliveryDate: '',
    shippingNotes: '',
    trackingNumber: '',
    sendTrackingNotification: true,
  })

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) {
          navigate('/orders')
          return
        }

        const orderData = await ordersApi.getById(orderId)
        setOrder(orderData)
        
        // Pre-fill form with existing shipping data if available
        if (orderData) {
          setFormData({
            deliveryCompany: (orderData as any).deliveryCompany || '',
            deliveryPerson: (orderData as any).deliveryPerson || '',
            deliveryContact: (orderData as any).deliveryContact || '',
            estimatedDeliveryDate: (orderData as any).estimatedDeliveryDate 
              ? new Date((orderData as any).estimatedDeliveryDate).toISOString().split('T')[0]
              : '',
            shippingNotes: (orderData as any).shippingNotes || '',
            trackingNumber: (orderData as any).trackingNumber || '',
            sendTrackingNotification: true,
          })
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId) return

    setSaving(true)
    try {
      // Call API to update shipping information
      await ordersApi.updateShipping(orderId, {
        deliveryCompany: formData.deliveryCompany,
        deliveryPerson: formData.deliveryPerson,
        deliveryContact: formData.deliveryContact,
        estimatedDeliveryDate: formData.estimatedDeliveryDate ? new Date(formData.estimatedDeliveryDate).toISOString() : undefined,
        shippingNotes: formData.shippingNotes,
        trackingNumber: formData.trackingNumber,
        sendTrackingNotification: formData.sendTrackingNotification,
      })

      // Navigate back to order detail
      navigate(`/orders/${orderId}/detail`)
    } catch (error) {
      console.error('Error updating shipping:', error)
      alert('Failed to update shipping information. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const orderNumber = order?.orderNumber || orderId?.slice(-8) || 'N/A'
  const customerName = (order?.user as any)?.name || order?.user?.email?.split('@')[0] || 'Customer'
  const orderDate = order?.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A'

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600">
          <span className="text-gray-600">Dashboard • </span>
          <span className="text-gray-900">Add Tracking Information</span>
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-base sm:text-lg font-semibold text-blue-900">Order Summary</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs sm:text-sm text-blue-700 mb-1">Order ID</p>
            <p className="text-sm sm:text-base font-semibold text-blue-900">#{orderNumber}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-blue-700 mb-1">Customer Name</p>
            <p className="text-sm sm:text-base font-semibold text-blue-900">{customerName}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-blue-700 mb-1">Order Date</p>
            <p className="text-sm sm:text-base font-semibold text-blue-900">{orderDate}</p>
          </div>
        </div>
      </div>

      {/* Shipping Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Select Delivery Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.deliveryCompany}
              onChange={(e) => setFormData({ ...formData, deliveryCompany: e.target.value })}
              placeholder="e.g DHL, Leopard"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Delivery Person <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.deliveryPerson}
              onChange={(e) => setFormData({ ...formData, deliveryPerson: e.target.value })}
              placeholder="Enter delivery person name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Contact <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.deliveryContact}
              onChange={(e) => setFormData({ ...formData, deliveryContact: e.target.value })}
              placeholder="Enter contact number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Estimated Delivery Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.estimatedDeliveryDate}
                onChange={(e) => setFormData({ ...formData, estimatedDeliveryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Shipping Notes (Optional)
            </label>
            <textarea
              value={formData.shippingNotes}
              onChange={(e) => setFormData({ ...formData, shippingNotes: e.target.value })}
              placeholder="Add any special delivery instructions or notes for the customer..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tracking Number
            </label>
            <input
              type="text"
              value={formData.trackingNumber}
              onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
              placeholder="Enter tracking number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Notification Toggle */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Send tracking details to customer automatically After Patch</p>
                <p className="text-xs text-blue-700 mt-1">Customer will receive an email and SMS with tracking information</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sendTrackingNotification}
                onChange={(e) => setFormData({ ...formData, sendTrackingNotification: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate(`/orders/${orderId}/detail`)}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Save & Notify Customer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
