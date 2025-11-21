import type { BidDetails } from '../../types/bidDetails'

/**
 * BidderInfoCard component props
 */
export interface BidderInfoCardProps {
  bid: BidDetails
}

/**
 * Bidder information card component with Bid Summary
 */
export default function BidderInfoCardProps({ bid }: BidderInfoCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Section - Bidder Information */}
        <div>
          <h3 className="mb-4 text-base font-semibold text-gray-900">Bidder Information</h3>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-full border-2 border-[#F39C12] p-0.5">
                <img
                  src={bid.bidder.avatar}
                  alt={bid.bidder.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="mb-1 text-base font-semibold text-gray-900 break-words">{bid.bidder.name}</h4>
              <p className="mb-1 text-sm font-normal text-gray-600 break-words">{bid.bidder.email}</p>
              {bid.bidder.phone && (
                <p className="mb-1 text-sm font-normal text-gray-600 break-words">{bid.bidder.phone}</p>
              )}
              {bid.bidder.address && (
                <p className="text-sm font-normal text-gray-600 break-words">{bid.bidder.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Bid Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Bid Summary</h3>
            <h3 className="text-sm font-normal text-gray-500">Bid Date & Time</h3>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-[#5C54A4]">${bid.finalBidAmount.toLocaleString()}</p>
                </div>
                <div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium mt-3 ${
                    bid.status === 'winning'
                      ? 'bg-green-500 text-white'
                      : bid.status === 'outbid'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bid.status === 'winning' ? 'Winning' : bid.status === 'outbid' ? 'Outbid' : bid.status === 'pending' ? 'Pending' : 'Lost'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div>
                <p className="text-base sm:text-lg font-bold text-gray-900 break-words">{bid.bidDate}, {bid.bidTime}</p>
              </div>
              <div className="mt-4 sm:mt-8">
                <p className="mb-1 text-sm font-normal text-gray-500">Auction ID</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 break-words">{bid.auctionId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

