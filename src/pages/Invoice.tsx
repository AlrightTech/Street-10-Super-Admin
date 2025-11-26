import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { mockOrders } from '../data/mockOrders'
import type { OrderRecord } from './Orders'

export default function Invoice() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderRecord | null>(null)

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

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading invoice...</p>
      </div>
    )
  }

  // Format invoice ID
  const formatInvoiceId = (id: string) => {
    const numMatch = id.match(/\d+/)
    if (numMatch) {
      return `INV-2024-${numMatch[0].padStart(3, '0')}`
    }
    return `INV-2024-001`
  }

  // Format order ID
  const formatOrderId = (id: string) => {
    const numMatch = id.match(/\d+/)
    if (numMatch) {
      return `ORD-2024-${numMatch[0].padStart(3, '0')}`
    }
    return `ORD-2024-001`
  }

  const invoiceId = formatInvoiceId(order.id)
  const formattedOrderId = formatOrderId(order.id)

  // Format date and time
  const parseDate = (dateStr: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dateParts = dateStr.split(' ')
    if (dateParts.length >= 3) {
      const day = dateParts[0]
      const monthName = dateParts[1]
      const year = dateParts[2]
      const monthIndex = months.indexOf(monthName)
      if (monthIndex !== -1) {
        const date = new Date(parseInt(year), monthIndex, parseInt(day))
        const formattedDate = date.toISOString().split('T')[0] // YYYY-MM-DD
        // Generate random time between 10:00 and 18:00
        const hour = Math.floor(Math.random() * 9) + 10
        const minute = Math.floor(Math.random() * 60)
        const second = Math.floor(Math.random() * 60)
        const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
        return { date: formattedDate, time: formattedTime, fullDateTime: `${formattedDate} at ${formattedTime}` }
      }
    }
    const defaultDate = new Date()
    const formattedDate = defaultDate.toISOString().split('T')[0]
    const formattedTime = '16:30:00'
    return { date: formattedDate, time: formattedTime, fullDateTime: `${formattedDate} at ${formattedTime}` }
  }

  const { date: issueDate, fullDateTime } = parseDate(order.orderDate)

  // Calculate due date (30 days from issue date)
  const dueDateObj = new Date(issueDate)
  dueDateObj.setDate(dueDateObj.getDate() + 30)
  const dueDate = dueDateObj.toISOString().split('T')[0]

  // Generate dynamic invoice items based on order
  const generateInvoiceItems = () => {
    // Use a seed based on order ID for consistent generation
    const orderNum = parseInt(order.id.replace(/[^0-9]/g, '')) || 1
    const seed = orderNum % 10
    
    // Generate items based on order amount and product
    const baseAmount = order.amount
    
    // Determine if order should have multiple items (based on amount and seed)
    if (baseAmount > 400 && seed % 2 === 0) {
      // Split into 2 items
      const item1Amount = Math.round((baseAmount * 0.7) * 100) / 100
      const item2Amount = Math.round((baseAmount * 0.3) * 100) / 100
      
      return [
        {
          id: 1,
          description: order.product,
          quantity: 1,
          unitPrice: item1Amount,
          total: item1Amount,
        },
        {
          id: 2,
          description: seed % 3 === 0 ? 'iPhone 15 Pro Max Case' : 'Protective Phone Case',
          quantity: 1,
          unitPrice: item2Amount,
          total: item2Amount,
        },
      ]
    } else if (baseAmount > 200 && seed % 3 === 0) {
      // Single item with quantity 2
      const unitPrice = Math.round((baseAmount / 2) * 100) / 100
      return [
        {
          id: 1,
          description: order.product,
          quantity: 2,
          unitPrice: unitPrice,
          total: baseAmount,
        },
      ]
    } else {
      // Single item with quantity 1
      return [
        {
          id: 1,
          description: order.product,
          quantity: 1,
          unitPrice: baseAmount,
          total: baseAmount,
        },
      ]
    }
  }

  const invoiceItems = generateInvoiceItems()
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0)
  
  // Calculate dynamic discount (5-10% of subtotal, but ensure it's reasonable)
  const orderNum = parseInt(order.id.replace(/[^0-9]/g, '')) || 1
  const discountPercentage = ((orderNum % 6) + 5) / 100 // 5-10%
  const discount = Math.round(subtotal * discountPercentage * 100) / 100
  
  // Calculate tax (8% of subtotal after discount)
  const taxRate = 0.08
  const tax = Math.round((subtotal - discount) * taxRate * 100) / 100
  
  // Calculate shipping (based on order amount)
  let shipping = 0
  if (order.amount > 500) {
    shipping = Math.round(((orderNum % 5) + 10) * 100) / 100 // $10-15
  } else if (order.amount > 200) {
    shipping = Math.round(((orderNum % 3) + 8) * 100) / 100 // $8-11
  } else {
    shipping = Math.round(((orderNum % 3) + 5) * 100) / 100 // $5-8
  }
  
  // Calculate total and ensure it's close to order amount
  const calculatedTotal = subtotal - discount + tax + shipping
  const total = Math.round(calculatedTotal * 100) / 100

  // Company information
  const companyInfo = {
    name: 'Your Company Name',
    address: '123 Business Street',
    city: 'New York, NY 10001',
    phone: '+1 (555) 987-6543',
    email: 'contact@yourcompany.com',
    website: 'www.yourcompany.com',
  }

  // Generate dynamic customer information based on order
  const generateCustomerInfo = () => {
    const customerName = order.customerName
    const nameParts = customerName.split(' ')
    const firstName = nameParts[0] || 'Customer'
    const lastName = nameParts[nameParts.length - 1] || 'Name'
    
    // Generate dynamic address based on customer name hash
    const addressNumbers = [
      '123', '456', '789', '234', '567', '890', '321', '654', '987', '111'
    ]
    const streetNames = [
      'Main Street', 'Oak Avenue', 'Park Boulevard', 'Elm Street', 'Maple Drive',
      'Cedar Lane', 'Pine Road', 'First Street', 'Second Avenue', 'Third Boulevard'
    ]
    const aptNumbers = ['Apt 4B', 'Apt 2A', 'Unit 5C', 'Suite 3D', 'Apt 1E', 'Unit 7F']
    
    const nameHash = customerName.length
    const addressNum = addressNumbers[nameHash % addressNumbers.length]
    const streetName = streetNames[(nameHash * 2) % streetNames.length]
    const aptNum = aptNumbers[(nameHash * 3) % aptNumbers.length]
    
    const cities = [
      'New York, NY 10001', 'Los Angeles, CA 90001', 'Chicago, IL 60601',
      'Houston, TX 77001', 'Phoenix, AZ 85001', 'Philadelphia, PA 19101',
      'San Antonio, TX 78201', 'San Diego, CA 92101', 'Dallas, TX 75201',
      'San Jose, CA 95101'
    ]
    const city = cities[nameHash % cities.length]
    
    // Generate phone number based on customer name
    const phoneBase = (nameHash * 123) % 10000
    const phone = `+1 (555) ${String(phoneBase).padStart(3, '0')}-${String((phoneBase * 2) % 10000).padStart(4, '0')}`
    
    return {
      name: customerName,
      address: `${addressNum} ${streetName}, ${aptNum}`,
      city: city,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: phone,
    }
  }

  const customerInfo = generateCustomerInfo()

  const handleDownload = () => {
    console.log('Downloading invoice:', invoiceId)
    // Add download logic here
  }

  const handleExport = () => {
    console.log('Exporting invoice:', invoiceId)
    // Add export logic here
  }

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-600">
          <span className="text-gray-600">Dashboard - </span>
          <span className="text-gray-900">Orders</span>
        </p>
      </div>

      {/* Invoice Header */}
      <div className='bg-white p-4 rounded-lg'>

      <div className="flex flex-col sm:flex-row mb-5  sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">Invoice</span>
            <span className="text-gray-400">#</span>
            <span className="text-sm font-semibold text-gray-900">{invoiceId}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">{fullDateTime}</p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Invoice
        </button>
      </div>

      {/* Company and Invoice Details */}
      <div className="rounded-lg border border-gray-200 mb-5   p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Company Information */}
          <div className="lg:border-r lg:border-gray-200 lg:pr-6">
            <h3 className="text-base font-bold text-gray-900 mb-3">{companyInfo.name}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{companyInfo.address}</p>
              <p>{companyInfo.city}</p>
              <p>{companyInfo.phone}</p>
              <p>{companyInfo.email}</p>
              <p>{companyInfo.website}</p>
            </div>
          </div>

          {/* Right Column - Invoice Details */}
          <div className="lg:pl-6 ">
            <h3 className="text-base font-bold text-gray-900 mb-3">INVOICE</h3>
            <div className="space-y-2 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-600">Invoice Number:</span>
                <span className="font-medium text-gray-900">{invoiceId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium text-gray-900">{formattedOrderId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Issue Date:</span>
                <span className="font-medium text-gray-900">{issueDate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-medium text-gray-900">{dueDate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${order.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {order.status === 'active' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing and Payment Information */}
      <div className="rounded-lg border mb-5 border-gray-200  p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Bill To */}
          <div className="lg:border-r lg:border-gray-200 lg:pr-6">
            <h3 className="text-base font-bold text-gray-900 mb-3">Bill To:</h3>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-gray-900">{customerInfo.name}</p>
              <p className="text-gray-600">{customerInfo.address}</p>
              <p className="text-gray-600">{customerInfo.city}</p>
              <p className="text-gray-600">{customerInfo.email}</p>
              <p className="text-gray-600">{customerInfo.phone}</p>
            </div>
          </div>

          {/* Right Column - Payment Information */}
          <div className="lg:pl-6">
            <h3 className="text-base font-bold text-gray-900 mb-3">Payment Information:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-medium ${order.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.status === 'active' ? 'Completed' : 'Pending'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Paid Date:</span>
                <span className="font-medium text-gray-900">{issueDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="rounded-lg border mb-5 border-gray-200 p-4 md:p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">Order Summary</h3>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full border-collapse min-w-[600px] md:min-w-0">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">Description</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">Quantity</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-700">Unit Price</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoiceItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-2 md:px-4 py-2 md:py-4 text-xs md:text-sm text-gray-900">{item.description}</td>
                  <td className="px-2 md:px-4 py-2 md:py-4 text-xs md:text-sm text-center text-gray-900">{item.quantity}</td>
                  <td className="px-2 md:px-4 py-2 md:py-4 text-xs md:text-sm text-right text-gray-900 whitespace-nowrap">${item.unitPrice.toFixed(2)}</td>
                  <td className="px-2 md:px-4 py-2 md:py-4 text-xs md:text-sm text-right font-medium text-gray-900 whitespace-nowrap">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium text-gray-900">-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium text-gray-900">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-base font-bold text-gray-900">Total:</span>
              <span className="text-base font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
            >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export
          </button>
        </div>
      </div>
    </div>
            </div>
  )
}

