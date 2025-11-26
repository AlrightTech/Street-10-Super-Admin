import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { mockOrders } from '../data/mockOrders'
import type { OrderRecord } from './Orders'
import { DocumentIcon } from '../components/icons/Icons'

export default function ProcessRefundOrder() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderRecord | null>(null)
  const [deliveryCompany, setDeliveryCompany] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('')
  const [shippingNotes, setShippingNotes] = useState('')
  const [sendTrackingDetails, setSendTrackingDetails] = useState(true)
  const [isDeliveryDropdownOpen, setIsDeliveryDropdownOpen] = useState(false)
  const dateInputRef = useRef<HTMLInputElement>(null)
  const deliveryDropdownRef = useRef<HTMLDivElement>(null)

  const deliveryCompanies = [
    { value: 'dhl', label: 'DHL' },
    { value: 'leopard', label: 'Leopard' },
    { value: 'fedex', label: 'FedEx' },
    { value: 'ups', label: 'UPS' },
    { value: 'aramex', label: 'Aramex' },
  ]

  useEffect(() => {
    // Find the order by ID
    const foundOrder = mockOrders.find(
      (o) => o.id.replace('#', '') === orderId || o.id === orderId || o.id === `#${orderId}`
    )

    if (foundOrder) {
      setOrder(foundOrder)
    } else {
      navigate('/orders')
    }
  }, [orderId, navigate])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deliveryDropdownRef.current && !deliveryDropdownRef.current.contains(event.target as Node)) {
        setIsDeliveryDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    )
  }

  // Format order ID to match reference: #ORD-2024-001234
  const formatOrderId = (id: string) => {
    const cleanId = id.replace('#', '').replace('ORD-', '')
    return `#ORD-2024-${cleanId.padStart(6, '0')}`
  }

  const formattedOrderId = formatOrderId(order.id)
  
  // Format order date to match reference: March 15, 2024
  const formatOrderDate = (dateStr: string) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const dateParts = dateStr.split(' ')
    if (dateParts.length >= 3) {
      const day = dateParts[0]
      const monthName = dateParts[1]
      const year = dateParts[2]
      const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthName)
      if (monthIndex !== -1) {
        return `${months[monthIndex]} ${day}, ${year}`
      }
    }
    return dateStr || 'March 15, 2024'
  }

  const formattedOrderDate = formatOrderDate(order.orderDate)
  const customerName = order.customerName || 'Sarah Johnson'

  const handleCancel = () => {
    navigate(-1)
  }

  const handleSaveAndNotify = () => {
    if (!deliveryCompany || !orderNumber || !estimatedDeliveryDate) {
      alert('Please fill in all required fields')
      return
    }

    console.log('Save and Notify Customer', {
      deliveryCompany,
      orderNumber,
      estimatedDeliveryDate,
      shippingNotes,
      sendTrackingDetails,
    })
    
    // Add save logic here
    navigate(-1)
  }

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-600">
          <span className="text-gray-600">Dashboard • </span>
          <span className="text-gray-900">Orders</span>
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <DocumentIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 grid  sm:gap-20 gird-cols-1 sm:grid-cols-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-base font-semi-bold text-gray-900">{formattedOrderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Customer Name</p>
                <p className="text-base font-semi-bold text-gray-900">{customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="text-base font-semi-bold text-gray-900">{formattedOrderDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Select Delivery Company */}
        <div>
          <label htmlFor="deliveryCompany" className="block text-sm 
          font-medium text-gray-900 mb-2">
            Select Delivery Company
          </label>
          <div className="relative" ref={deliveryDropdownRef}>
            <button
              type="button"
              onClick={() => setIsDeliveryDropdownOpen(!isDeliveryDropdownOpen)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg  text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#4C50A2] focus:border-transparent cursor-pointer flex items-center justify-between hover:border-gray-400 transition-colors"
            >
              <span className={deliveryCompany ? 'text-gray-900' : 'text-gray-400'}>
                {deliveryCompany
                  ? deliveryCompanies.find((c) => c.value === deliveryCompany)?.label || 'e.g DHL, Leopard'
                  : 'e.g DHL, Leopard'}
              </span>
              <svg
                className={`h-5 w-5 text-gray-400 transition-transform ${isDeliveryDropdownOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDeliveryDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {deliveryCompanies.map((company) => (
                  <button
                    key={company.value}
                    type="button"
                    onClick={() => {
                      setDeliveryCompany(company.value)
                      setIsDeliveryDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                      deliveryCompany === company.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    {company.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enter Order No. */}
        <div>
          <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-900 mb-2">
            Enter Order No.
          </label>
          <input
            type="text"
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter order number"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg  text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C50A2] focus:border-transparent"
          />
        </div>

        {/* Estimated Delivery Date */}
        <div>
          <label htmlFor="estimatedDeliveryDate" className="block text-sm font-medium text-gray-900 mb-2">
            Estimated Delivery Date
          </label>
          <div className="relative">
            <input
              type="text"
              id="estimatedDeliveryDate"
              ref={dateInputRef}
              value={estimatedDeliveryDate}
              onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
              placeholder="mm/dd/yyyy"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C50A2] focus:border-transparent pr-10"
            />
            <input
              type="date"
              id="estimatedDeliveryDatePicker"
              onChange={(e) => {
                if (e.target.value) {
                  const date = new Date(e.target.value)
                  const month = String(date.getMonth() + 1).padStart(2, '0')
                  const day = String(date.getDate()).padStart(2, '0')
                  const year = date.getFullYear()
                  setEstimatedDeliveryDate(`${month}/${day}/${year}`)
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
              style={{ width: '100%', height: '100%' }}
            />
            <button
              type="button"
              onClick={() => {
                const datePicker = document.getElementById('estimatedDeliveryDatePicker') as HTMLInputElement
                if (datePicker) {
                  datePicker.showPicker?.()
                }
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer z-10"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Shipping Notes (Optional) */}
        <div>
          <label htmlFor="shippingNotes" className="block text-sm font-medium 
          text-gray-900 mb-2">
            Shipping Notes <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <textarea
            id="shippingNotes"
            value={shippingNotes}
            onChange={(e) => setShippingNotes(e.target.value)}
            placeholder="Add any special delivery instructions or notes for the customer..."
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg  text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C50A2] focus:border-transparent resize-none"
          />
        </div>

        {/* Tracking Details Toggle */}
        <div className="rounded-lg border border-gray-200 bg-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">
                Send tracking details to customer automatically After Patch
              </p>
              <p className="text-xs text-gray-500">
                Customer will receive an email and SMS with tracking information
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSendTrackingDetails(!sendTrackingDetails)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4C50A2] focus:ring-offset-2 ${
                sendTrackingDetails ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={sendTrackingDetails}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  sendTrackingDetails ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveAndNotify}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#F7931E] text-white text-sm font-medium hover:bg-[#E8840D] transition-colors cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Save & Notify Customer
        </button>
      </div>
    </div>
  )
}
