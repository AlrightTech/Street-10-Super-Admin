import type { CustomerInfo, OrderStatus, ShippingInfo } from '../../types/orderDetails'

/**
 * CustomerInformationCard component props
 */
export interface CustomerInformationCardProps {
  customer: CustomerInfo
  status: OrderStatus
  shipping?: ShippingInfo
}

/**
 * Customer information card component
 */
export default function CustomerInformationCard({ customer, status: _status, shipping }: CustomerInformationCardProps) {
  // Format shipping address with line breaks
  const formatShippingAddress = () => {
    if (shipping) {
      const parts = []
      if (shipping.address) {
        // Split address if it contains "Apartment" or similar
        if (shipping.address.includes(',')) {
          const addressParts = shipping.address.split(',').map(p => p.trim())
          parts.push(...addressParts)
        } else {
          parts.push(shipping.address)
        }
      }
      if (shipping.city) {
        if (shipping.state && shipping.postalCode) {
          parts.push(`${shipping.city}, ${shipping.state} ${shipping.postalCode}`)
        } else if (shipping.state) {
          parts.push(`${shipping.city}, ${shipping.state}`)
        } else {
          parts.push(shipping.city)
        }
      }
      if (shipping.country) parts.push(shipping.country)
      return parts.length > 0 ? parts : ['123 Main Street', 'Apartment 4B', 'New York, NY 10001', 'United States']
    }
    return ['123 Main Street', 'Apartment 4B', 'New York, NY 10001', 'United States']
  }

  const shippingAddressLines = formatShippingAddress()

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold text-gray-900">Customer Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2 sm:space-y-3">
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Customer Name:</p>
            <p className="text-xs sm:text-sm text-gray-900 mt-0.5">{customer.name}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Email:</p>
            <p className="text-xs sm:text-sm text-gray-900 mt-0.5 break-words">{customer.email}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Phone:</p>
            <p className="text-xs sm:text-sm text-gray-900 mt-0.5">{customer.phone}</p>
          </div>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Shipping Address:</p>
            <div className="text-xs sm:text-sm text-gray-900">
              {shippingAddressLines.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

