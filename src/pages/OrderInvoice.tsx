import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ordersApi, type OrderDetails, type InvoiceData } from '../services/orders.api'
import { DownloadIcon, PrinterIcon } from '../components/icons/Icons'

export default function OrderInvoice() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [invoice, setInvoice] = useState<InvoiceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!orderId) {
          navigate('/orders')
          return
        }

        const [orderData, invoiceData] = await Promise.all([
          ordersApi.getById(orderId),
          ordersApi.getInvoice(orderId).catch(() => null), // Fallback if invoice endpoint doesn't exist
        ])

        setOrder(orderData)
        setInvoice(invoiceData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [orderId, navigate])

  const handleDownloadPDF = async () => {
    if (!orderId) return

    setDownloading(true)
    try {
      // Call API to generate and download PDF
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/orders/${orderId}/invoice/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${order?.orderNumber || orderId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        // Fallback: generate client-side PDF or show error
        alert('PDF generation is not available. Please use the print option.')
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const handleExport = () => {
    // Export as JSON or CSV
    if (!order) return

    const data = {
      invoiceNumber: invoice?.invoiceNumber || `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      date: new Date().toISOString(),
      customer: order.user,
      items: order.items,
      total: order.totalMinor,
      currency: order.currency,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${order.orderNumber}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Order not found</div>
      </div>
    )
  }

  // Calculate totals
  const subtotal = order.items.reduce((sum, item) => {
    const itemPrice = parseFloat(item.priceMinor) / 100
    return sum + (itemPrice * item.quantity)
  }, 0)
  const discount = parseFloat(order.discountMinor || '0') / 100
  const shipping = 0 // Shipping might be in order data
  const tax = 0 // Tax calculation if needed
  const total = parseFloat(order.totalMinor) / 100

  const invoiceNumber = invoice?.invoiceNumber || `INV-${order.orderNumber}`
  const invoiceDate = invoice?.invoiceDate || new Date().toISOString().split('T')[0]
  const dueDate = invoice?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Company details (should come from settings/config)
  const companyDetails = {
    name: 'Your Company Name',
    address: '123 Business Street',
    city: 'New York, NY 10001',
    phone: '+1 (555) 987-6543',
    email: 'contact@yourcompany.com',
    website: 'www.yourcompany.com',
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0 print:p-0">
      {/* Page Header - Hidden when printing */}
      <div className="print:hidden">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600">
          <span className="text-gray-600">Dashboard • </span>
          <span className="text-gray-900">INVOICE</span>
        </p>
      </div>

      {/* Action Buttons - Hidden when printing */}
      <div className="print:hidden flex flex-col sm:flex-row gap-3 justify-end">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <DownloadIcon className="h-4 w-4" />
          {downloading ? 'Downloading...' : 'Download PDF'}
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <DownloadIcon className="h-4 w-4" />
          Export
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <PrinterIcon className="h-4 w-4" />
          Print Invoice
        </button>
      </div>

      {/* Invoice Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 print:border-0 print:shadow-none">
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">{companyDetails.name}</h2>
            </div>
            <p className="text-sm text-gray-600">{companyDetails.address}</p>
            <p className="text-sm text-gray-600">{companyDetails.city}</p>
            <p className="text-sm text-gray-600 mt-1">{companyDetails.phone}</p>
            <p className="text-sm text-gray-600">{companyDetails.email}</p>
            <p className="text-sm text-gray-600">{companyDetails.website}</p>
          </div>

          <div className="mt-4 md:mt-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">INVOICE</h1>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Invoice Number:</span>
                <span className="font-medium text-gray-900">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium text-gray-900">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Issue Date:</span>
                <span className="font-medium text-gray-900">{new Date(invoiceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-medium text-gray-900">{new Date(dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {order.status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To and Payment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Bill To:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{(order.user as any)?.name || order.user.email}</p>
              {order.shippingAddress && typeof order.shippingAddress === 'object' && (
                <>
                  {(order.shippingAddress as any).street && (
                    <p>{(order.shippingAddress as any).street}{(order.shippingAddress as any).apartment ? `, ${(order.shippingAddress as any).apartment}` : ''}</p>
                  )}
                  {((order.shippingAddress as any).city || (order.shippingAddress as any).state || (order.shippingAddress as any).postalCode) && (
                    <p>
                      {[(order.shippingAddress as any).city, (order.shippingAddress as any).state, (order.shippingAddress as any).postalCode].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {(order.shippingAddress as any).country && <p>{(order.shippingAddress as any).country}</p>}
                </>
              )}
              <p>{order.user.email}</p>
              {(order.user as any)?.phone && <p>{(order.user as any).phone}</p>}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Information:</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <rect width="24" height="16" rx="2" fill="#1A1F71"/>
                  <path d="M8 8h8v8H8z" fill="#F79E1B"/>
                </svg>
                <span>Payment Method: {order.paymentMethod === 'card' ? 'Credit Card' : order.paymentMethod.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-gray-600">Payment Status: </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {order.status === 'paid' ? 'Completed' : 'Pending'}
                </span>
              </div>
              {order.status === 'paid' && (
                <div>
                  <span className="text-gray-600">Paid Date: </span>
                  <span>{new Date(order.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Table */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 border-b border-gray-200">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 border-b border-gray-200">SKU</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 border-b border-gray-200">Quantity</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 border-b border-gray-200">Unit Price</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 border-b border-gray-200">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const unitPrice = parseFloat(item.priceMinor) / 100
                  const itemTotal = unitPrice * item.quantity
                  return (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.product?.title || 'Product'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.productId.slice(0, 8).toUpperCase()}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">{order.currency} {unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{order.currency} {itemTotal.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Summary of Charges */}
          <div className="mt-6 flex justify-end">
            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">{order.currency} {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">-{order.currency} {discount.toFixed(2)}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium text-gray-900">{order.currency} {tax.toFixed(2)}</span>
                </div>
              )}
              {shipping > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium text-gray-900">{order.currency} {shipping.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>{order.currency} {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Messages */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-6">Thank you for shopping with us!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h4>
              <p>Payment is due within 30 days. Late payments may incur additional charges. All sales are final unless otherwise specified.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Support Contact</h4>
              <p>For any questions or concerns, please contact our support team at {companyDetails.email} or call {companyDetails.phone}.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
