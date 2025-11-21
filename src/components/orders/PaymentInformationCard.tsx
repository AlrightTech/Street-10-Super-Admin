import type { PaymentInfo } from '../../types/orderDetails'

/**
 * PaymentInformationCard component props
 */
export interface PaymentInformationCardProps {
  payment: PaymentInfo
}

/**
 * Format currency
 */
const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)}`
}

/**
 * Get payment method label
 */
const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case 'credit-card':
      return 'Credit Card'
    case 'debit-card':
      return 'Debit Card'
    case 'paypal':
      return 'PayPal'
    case 'bank-transfer':
      return 'Bank Transfer'
    case 'cash-on-delivery':
      return 'Cash on Delivery'
    default:
      return method
  }
}

/**
 * Get payment status label and color
 */
const getPaymentStatus = (status: string) => {
  switch (status) {
    case 'completed':
      return { label: 'Completed', color: 'text-green-600' }
    case 'pending':
      return { label: 'Pending', color: 'text-yellow-600' }
    case 'failed':
      return { label: 'Failed', color: 'text-red-600' }
    case 'refunded':
      return { label: 'Refunded', color: 'text-gray-600' }
    default:
      return { label: status, color: 'text-gray-600' }
  }
}

/**
 * Payment information card component
 */
export default function PaymentInformationCard({ payment }: PaymentInformationCardProps) {
  const statusInfo = getPaymentStatus(payment.status)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Payment Information</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Payment Details */}
        <div className="space-y-3 lg:pr-6 lg:border-r lg:border-gray-200">
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-900">Payment Details</p>
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-sm font-normal text-gray-600">Payment Method</p>
                <p className="text-sm font-semibold text-gray-900">{getPaymentMethodLabel(payment.method)}</p>
              </div>
              {payment.cardDetails && (
                <div>
                  <p className="mb-1 text-sm font-normal text-gray-600">Card Details</p>
                  <p className="text-sm font-semibold text-gray-900">{payment.cardDetails}</p>
                </div>
              )}
              <div>
                <p className="mb-1 text-sm font-normal text-gray-600">Transaction ID</p>
                <p className="text-sm font-semibold text-gray-900">{payment.transactionId}</p>
              </div>
              <div>
                <p className="mb-1 text-sm font-normal text-gray-600">Payment Status</p>
                <p className={`text-sm font-semibold ${statusInfo.color}`}>{statusInfo.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Summary */}
        <div className="space-y-3 lg:pl-6 flex flex-col">
          <div className="flex-1">
            <p className="mb-2 text-sm font-semibold text-gray-900">Payment Summary</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-normal text-gray-600">Subtotal</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(payment.subtotal)}</p>
              </div>
              {payment.discount > 0 && (
                <div className="flex justify-between items-center">
                  <p className="text-sm font-normal text-gray-600">Discount</p>
                  <p className="text-sm font-semibold text-green-600">-{formatCurrency(payment.discount)}</p>
                </div>
              )}
              <div className="flex justify-between items-center">
                <p className="text-sm font-normal text-gray-600">Tax</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(payment.tax)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-normal text-gray-600">Shipping</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(payment.shipping)}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-900">Total</p>
            <p className="text-base font-bold text-gray-900">{formatCurrency(payment.total)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

