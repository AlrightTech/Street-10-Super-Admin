import type { ProductInfo } from '../../types/bidDetails'

/**
 * ProductInfoCard component props
 */
export interface ProductInfoCardProps {
  product: ProductInfo
}

/**
 * Product information card component
 */
export default function ProductInfoCard({ product }: ProductInfoCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Product Information</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
          <div className="space-y-2">
            <h4 className="text-base font-semibold text-gray-900 break-words">{product.name}</h4>
            <div>
              <p className="mb-3 text-sm font-normal text-gray-600">Auction Status</p>
              <span className={`inline-flex rounded-full mb-3 py-1 text-lg font-bold ${
                product.auctionStatus === 'ongoing'
                  ? 'text-orange-800'
                  : product.auctionStatus === 'completed'
                  ? 'text-green-800'
                  : 'text-gray-800'
              }`}>
                {product.auctionStatus === 'ongoing' ? 'Ongoing' : product.auctionStatus === 'completed' ? 'Completed' : 'Cancelled'}
              </span>
            </div>
            {product.reservePrice && (
              <div>
                <p className="mb-3 text-sm font-normal text-gray-600">Reserve Price</p>
                <p className="text-lg font-semibold text-gray-900">${product.reservePrice.toLocaleString()}</p>
              </div>
            )}
          </div>
          <div>
            <div>
              <p className="mb-1 text-sm font-normal text-gray-600">Starting Price</p>
              <p className="text-lg font-semibold text-gray-900">${product.startingPrice.toLocaleString()}</p>
            </div>
            <div className="mt-4 sm:mt-8">
              <p className="mb-1 text-sm font-normal text-gray-600">Current Highest Bid</p>
              <p className="text-lg font-bold text-gray-900">${product.currentHighestBid.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

