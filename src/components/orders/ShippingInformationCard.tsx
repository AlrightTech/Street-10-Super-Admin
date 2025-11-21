import type { ShippingInfo } from '../../types/orderDetails'

/**
 * ShippingInformationCard component props
 */
export interface ShippingInformationCardProps {
  shipping: ShippingInfo
}

/**
 * Shipping information card component
 */
export default function ShippingInformationCard({ shipping }: ShippingInformationCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Shipping Information</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Delivery Address */}
        <div className="space-y-3">
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-900">Delivery Address</p>
            <div className="space-y-1">
              <p className="text-sm font-normal text-gray-600">{shipping.address}</p>
              <p className="text-sm font-normal text-gray-600">
                {shipping.city}, {shipping.state} {shipping.postalCode}
              </p>
              <p className="text-sm font-normal text-gray-600">{shipping.country}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Shipping Details */}
        <div className="space-y-3">
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-900">Shipping Details</p>
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-sm font-normal text-gray-600">Shipping Method</p>
                <p className="text-sm font-semibold text-gray-900">{shipping.method}</p>
              </div>
              <div>
                <p className="mb-1 text-sm font-normal text-gray-600">Tracking Number</p>
                <p className="text-sm font-semibold text-blue-600 underline">{shipping.trackingNumber}</p>
              </div>
              <div>
                <p className="mb-1 text-sm font-normal text-gray-600">Estimated Delivery</p>
                <p className="text-sm font-semibold text-gray-900">{shipping.estimatedDelivery}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

