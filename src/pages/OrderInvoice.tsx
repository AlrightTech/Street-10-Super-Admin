import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ordersApi, type InvoiceData } from '../services/orders.api'
import { DownloadIcon, PrinterIcon, MailIcon, PhoneIcon } from '../components/icons/Icons'

export default function OrderInvoice() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (!orderId) {
          setError('Order ID is required')
          setLoading(false)
          return
        }

        setLoading(true)
        setError(null)
        const data = await ordersApi.getInvoice(orderId)
        setInvoiceData(data as any)
      } catch (err: any) {
        console.error('Error fetching invoice:', err)
        setError(err.message || 'Failed to load invoice')
      } finally {
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [orderId])

  const handleDownloadPDF = () => {
    const invoiceElement = document.getElementById('invoice-content')
    
    if (invoiceElement) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        const invoiceHTML = invoiceElement.innerHTML
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice ${invoiceData?.invoiceNumber || ''}</title>
              <meta charset="utf-8">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                  font-family: Arial, sans-serif; 
                  padding: 20px; 
                  background: white;
                  color: #000;
                  line-height: 1.5;
                }
                @media print { 
                  body { padding: 0; }
                  @page { margin: 0.5cm; size: A4; }
                }
                .bg-white { background: white !important; }
                .text-gray-900 { color: #111827 !important; }
                .text-gray-700 { color: #374151 !important; }
                .text-gray-600 { color: #4B5563 !important; }
                .border-gray-200 { border-color: #E5E7EB !important; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; text-align: left; }
                .no-print { display: none !important; }
              </style>
            </head>
            <body>
              ${invoiceHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }
    } else {
      window.print()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Format currency
  const formatCurrency = (amountMinor: string, currency: string = 'QAR') => {
    const amount = parseFloat(amountMinor) / 100
    return `${currency} ${amount.toFixed(2)}`
  }

  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  // Get status display
  const getStatusDisplay = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'created': 'Pending',
      'paid': 'Paid',
      'fulfillment_pending': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'closed': 'Completed',
      'cancelled': 'Cancelled',
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading invoice...</div>
      </div>
    )
  }

  if (error || !invoiceData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Invoice not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Extract data
  const superAdminContact = (invoiceData as any).superAdminContact
  const vendorStoreInfo = (invoiceData as any).vendorStoreInfo
  const isVendorOrder = (invoiceData as any).isVendorOrder

  // Header company info (Super Admin contact)
  const headerCompany = {
    name: 'Street10',
    address: superAdminContact?.address || null,
    email: superAdminContact?.email || null,
    phone: superAdminContact?.phone || null,
  }

  // From section (vendor store for vendor orders, Super Admin for admin orders)
  const fromCompany = isVendorOrder && vendorStoreInfo ? {
    name: vendorStoreInfo.storeName || 'Vendor',
    email: vendorStoreInfo.email || null,
    phone: vendorStoreInfo.phone || null,
  } : {
    name: 'Street10',
    address: superAdminContact?.address || null,
    email: superAdminContact?.email || null,
    phone: superAdminContact?.phone || null,
  }

  // Calculate totals
  const subtotal = parseFloat(invoiceData.subtotal || '0') / 100
  const discount = parseFloat(invoiceData.discount || '0') / 100
  const shipping = parseFloat(invoiceData.shipping || '0') / 100
  const tax = parseFloat(invoiceData.tax || '0') / 100
  const total = parseFloat(invoiceData.total || '0') / 100
  const currency = invoiceData.currency || 'QAR'

  // Format shipping address
  const shippingAddress = invoiceData.customer?.shippingAddress
  let formattedAddress = ''
  if (shippingAddress && typeof shippingAddress === 'object') {
    const parts = []
    if (shippingAddress.street) parts.push(shippingAddress.street)
    if (shippingAddress.apartment) parts.push(shippingAddress.apartment)
    if (shippingAddress.city || shippingAddress.state || shippingAddress.postalCode) {
      parts.push([shippingAddress.city, shippingAddress.state, shippingAddress.postalCode].filter(Boolean).join(', '))
    }
    if (shippingAddress.country) parts.push(shippingAddress.country)
    formattedAddress = parts.join(', ')
  } else if (typeof shippingAddress === 'string') {
    formattedAddress = shippingAddress
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0 print:p-0">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>
      
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
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <DownloadIcon className="h-4 w-4" />
          Download PDF
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
      <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 print:border-0 print:shadow-none" id="invoice-content">
        {/* Header Section - Top Left */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Street10</h2>
              {headerCompany.address && (
                <p className="text-sm text-gray-700 mb-1">{headerCompany.address}</p>
              )}
              {headerCompany.email && (
                <div className="flex items-center gap-2 mt-1">
                  <MailIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600 break-all">{headerCompany.email}</span>
                </div>
              )}
              {headerCompany.phone && (
                <div className="flex items-center gap-2 mt-1">
                  <PhoneIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{headerCompany.phone}</span>
                </div>
              )}
            </div>

            <div className="mt-4 md:mt-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">INVOICE</h1>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Invoice #:</span>
                  <span className="font-medium text-gray-900">{invoiceData.invoiceNumber}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">{formatDate(invoiceData.invoiceDate)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(new Date(new Date(invoiceData.invoiceDate).getTime() + 30 * 24 * 60 * 60 * 1000))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* From & To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">From:</h3>
            <p className="text-base font-bold text-gray-900">{fromCompany.name}</p>
            {!isVendorOrder && fromCompany.address && (
              <p className="text-sm text-gray-700 mt-1">{fromCompany.address}</p>
            )}
            {fromCompany.email && (
              <div className="flex items-center gap-2 mt-2">
                <MailIcon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <span className="text-sm text-gray-600 break-all">{fromCompany.email}</span>
              </div>
            )}
            {fromCompany.phone && (
              <div className="flex items-center gap-2 mt-1">
                <PhoneIcon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <span className="text-sm text-gray-600">{fromCompany.phone}</span>
              </div>
            )}
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">To:</h3>
            <p className="text-base font-bold text-gray-900">
              {(invoiceData.customer as any)?.name || invoiceData.customer?.email || 'Customer'}
            </p>
            {formattedAddress && (
              <p className="text-sm text-gray-700 mt-1">{formattedAddress}</p>
            )}
            {invoiceData.customer?.email && (
              <div className="flex items-center gap-2 mt-2">
                <MailIcon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <span className="text-sm text-gray-600 break-all">{invoiceData.customer.email}</span>
              </div>
            )}
            {invoiceData.customer?.phone && (
              <div className="flex items-center gap-2 mt-1">
                <PhoneIcon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <span className="text-sm text-gray-600">{invoiceData.customer.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Details Table */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Product</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">SKU</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Qty</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Unit Price</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoiceData.items?.map((item: any) => {
                  return (
                    <tr key={item.id} className="bg-white">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.productName || 'Product'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.sku || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.quantity || 0}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(item.unitPrice || '0', item.currency || currency)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(item.total || '0', item.currency || currency)}</td>
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
                <span className="font-medium text-gray-900">{formatCurrency((subtotal * 100).toString(), currency)}</span>
              </div>
              {shipping > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium text-gray-900">{formatCurrency((shipping * 100).toString(), currency)}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium text-gray-900">{formatCurrency((tax * 100).toString(), currency)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">-{formatCurrency((discount * 100).toString(), currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>{formatCurrency((total * 100).toString(), currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-base font-bold text-gray-900 mb-2">Payment Method</h4>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {invoiceData.paymentMethod === 'card' ? 'Credit Card' : 
                   invoiceData.paymentMethod === 'wallet' ? 'Wallet' : 
                   invoiceData.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                   invoiceData.paymentMethod || 'Not specified'}
                </p>
                {invoiceData.status === 'paid' && (
                  <p className="text-sm text-gray-600 mt-1">
                    Charged on {formatDate((invoiceData as any).updatedAt || invoiceData.invoiceDate)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-base font-bold text-gray-900 mb-2">Status</h4>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                invoiceData.status === 'paid' || invoiceData.status === 'delivered' || invoiceData.status === 'closed' 
                  ? 'bg-green-500' 
                  : invoiceData.status === 'cancelled' 
                  ? 'bg-red-500' 
                  : 'bg-yellow-500'
              }`}></div>
              <p className="text-sm font-medium text-gray-900">{getStatusDisplay(invoiceData.status)}</p>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="text-center mb-6">
          <p className="text-base font-bold text-gray-900 mb-2">Thank you for shopping with us!</p>
          <p className="text-sm text-gray-600">We appreciate your business and hope you enjoy your purchase.</p>
        </div>
      </div>
    </div>
  )
}
