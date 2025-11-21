import type { OrderRecord } from '../../pages/Orders'

interface InvoiceViewProps {
  order: OrderRecord
}

// Format order data for invoice view
const getInvoiceData = (order: OrderRecord) => {
  const orderDate = new Date(order.orderDate)
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const formattedTime = orderDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  // Format order ID to match reference (e.g., INV-2024-001, ORD-2024-001)
  const formatInvoiceId = (id: string) => {
    const numMatch = id.match(/\d+/)
    if (numMatch) {
      return `INV-2024-${numMatch[0].padStart(3, '0')}`
    }
    return `INV-2024-001`
  }

  const formatOrderId = (id: string) => {
    const numMatch = id.match(/\d+/)
    if (numMatch) {
      return `ORD-2024-${numMatch[0].padStart(3, '0')}`
    }
    return `ORD-2024-001`
  }

  // Calculate due date (30 days from order date)
  const dueDate = new Date(orderDate)
  dueDate.setDate(dueDate.getDate() + 30)
  const formattedDueDate = dueDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return {
    invoiceId: formatInvoiceId(order.id),
    orderId: formatOrderId(order.id),
    date: formattedDate,
    time: formattedTime,
    issueDate: formattedDate,
    dueDate: formattedDueDate,
    customer: {
      name: order.customerName,
      address: '123 Main Street, Apt 4B, New York, NY 10001',
      email: `${order.customerName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: '+1 (555) 123-4567',
    },
    company: {
      name: 'Your Company Name',
      address: '123 Business Street, New York, NY 10001',
      phone: '+1 (555) 987-6543',
      email: 'contact@yourcompany.com',
      website: 'www.yourcompany.com',
    },
    items: [
      {
        id: 1,
        description: 'Apple AirPods Pro (2nd Generation)',
        quantity: 2,
        unitPrice: 199.99,
        total: 399.98,
      },
      {
        id: 2,
        description: 'iPhone 15 Pro Max Case',
        quantity: 1,
        unitPrice: 49.99,
        total: 49.99,
      },
    ],
    subtotal: 449.97,
    discount: 45.0,
    tax: 36.0,
    shipping: 12.99,
    total: 453.96,
  }
}

export default function InvoiceView({ order }: InvoiceViewProps) {
  const invoiceData = getInvoiceData(order)

  const handleDownload = () => {
    // eslint-disable-next-line no-console
    console.log('Downloading invoice:', invoiceData.invoiceId)
  }

  const handleExport = () => {
    // eslint-disable-next-line no-console
    console.log('Exporting invoice:', invoiceData.invoiceId)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-600">Invoice</p>
            <span className="text-gray-400">#</span>
            <p className="text-sm font-semibold text-gray-900">{invoiceData.invoiceId}</p>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {invoiceData.date} at {invoiceData.time}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E67E22]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download Invoice
        </button>
      </div>

      {/* Top Information Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column - Company Information */}
          <div>
            <h3 className="mb-3 text-base font-bold text-gray-900">
              {invoiceData.company.name}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{invoiceData.company.address}</p>
              <p>{invoiceData.company.phone}</p>
              <p>{invoiceData.company.email}</p>
              <p>{invoiceData.company.website}</p>
            </div>
          </div>

          {/* Right Column - Invoice Details */}
          <div>
            <h3 className="mb-3 text-base font-bold text-gray-900">INVOICE</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice Number:</span>
                <span className="font-medium text-gray-900">{invoiceData.invoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium text-gray-900">{invoiceData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Issue Date:</span>
                <span className="font-medium text-gray-900">{invoiceData.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-medium text-gray-900">{invoiceData.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Paid</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Information Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column - Bill To */}
          <div>
            <h3 className="mb-3 text-base font-bold text-gray-900">Bill To:</h3>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-gray-900">{invoiceData.customer.name}</p>
              <p className="text-gray-600">{invoiceData.customer.address}</p>
              <p className="text-gray-600">{invoiceData.customer.email}</p>
              <p className="text-gray-600">{invoiceData.customer.phone}</p>
            </div>
          </div>

          {/* Right Column - Payment Information */}
          <div>
            <h3 className="mb-3 text-base font-bold text-gray-900">Payment Information:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="font-medium text-green-600">Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid Date:</span>
                <span className="font-medium text-gray-900">{invoiceData.issueDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Information Card - Order Summary */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-bold text-gray-900">Order Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-700">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-700">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoiceData.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-gray-900">{item.description}</td>
                  <td className="px-4 py-4 text-center text-gray-900">{item.quantity}</td>
                  <td className="px-4 py-4 text-right text-gray-900">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-gray-900">
                    ${item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary of Charges */}
        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">${invoiceData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium text-gray-900">-${invoiceData.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium text-gray-900">${invoiceData.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium text-gray-900">${invoiceData.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-base font-bold text-gray-900">Total:</span>
              <span className="text-base font-bold text-gray-900">
                ${invoiceData.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleExport}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E67E22]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </button>
        </div>
      </div>
    </div>
  )
}

