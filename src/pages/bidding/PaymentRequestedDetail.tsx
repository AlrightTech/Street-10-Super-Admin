import type { BiddingProduct } from '../../components/bidding/BiddingProductsTable'

interface PaymentRequestedDetailProps {
  product: BiddingProduct
  onClose: () => void
}

/**
 * Payment Requested Product Detail page
 */
export default function PaymentRequestedDetail({ product, onClose }: PaymentRequestedDetailProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Requested</h1>
          <p className="mt-1 text-sm text-gray-600">
            <span>Dashboard &gt; </span>
            <span className="text-gray-900">Bidding Products &gt; Payment Requested</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Back to Products
        </button>
      </div>

      {/* Product Details Card */}
      <div className="rounded-xl bg-white shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="flex-shrink-0">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-48 w-48 rounded-lg object-cover"
              />
            ) : (
              <div className="h-48 w-48 rounded-lg bg-gray-200 flex items-center justify-center">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.category}</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Starting Price</p>
                  <p className="text-lg font-semibold text-gray-900">{product.startingPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Winning Bid</p>
                  <p className="text-lg font-semibold text-gray-900">{product.currentBid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Bids</p>
                  <p className="text-lg font-semibold text-gray-900">{product.bids}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ended On</p>
                  <p className="text-lg font-semibold text-gray-900">{product.timeLeft}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Status</p>
                <span className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium bg-[#F7931E] text-white">
                  Payment Requested
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">Payment has been requested from the winning bidder. Waiting for payment confirmation.</p>
                <div className="flex gap-3">
                  <button className="inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer">
                    View Payment Details
                  </button>
                  <button className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                    Contact Bidder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

