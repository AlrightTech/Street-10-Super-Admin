import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BiddingProduct } from '../../components/bidding/BiddingProductsTable'

interface EndedUnsoldDetailProps {
  product: BiddingProduct
  onClose: () => void
}

interface BidHistoryItem {
  id: string
  bidderName: string
  bidderEmail: string
  status: string
  date: string
  time: string
  amount: string
}

// Sample bidding history data
const BIDDING_HISTORY: BidHistoryItem[] = [
  {
    id: '1',
    bidderName: 'Michael Johnson',
    bidderEmail: 'michael.j@mail.com',
    status: 'Ended',
    date: '10/02/2024',
    time: '19:30:00',
    amount: '$530',
  },
  {
    id: '2',
    bidderName: 'Michael Johnson',
    bidderEmail: 'michael.j@mail.com',
    status: 'Ended',
    date: '10/02/2024',
    time: '19:30:00',
    amount: '$530',
  },
  {
    id: '3',
    bidderName: 'Michael Johnson',
    bidderEmail: 'michael.j@mail.com',
    status: 'Ended',
    date: '10/02/2024',
    time: '19:30:00',
    amount: '$530',
  },
  {
    id: '4',
    bidderName: 'Michael Johnson',
    bidderEmail: 'michael.j@mail.com',
    status: 'Ended',
    date: '10/02/2024',
    time: '19:30:00',
    amount: '$530',
  },
]

/**
 * Ended Unsold Product Detail page
 */
export default function EndedUnsoldDetail({ product, onClose: _onClose }: EndedUnsoldDetailProps) {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)

  const handleEditProduct = () => {
    navigate(`/building-products/${product.id}/edit`)
  }
  const productImages = [
    product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Section - Outside white card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bidding Products</h1>
          <p className="mt-1 text-sm text-gray-700">
            <span>Dashboard</span>
            <span className="mx-1">:</span>
            <span className="text-gray-900">Bidding Products</span>
          </p>
        </div>
        <button
          onClick={handleEditProduct}
          className="inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer w-full sm:w-auto"
        >
          Edit Product
        </button>
      </div>

      {/* Main Content with Single White Background */}
      <div className="rounded-xl bg-white shadow-sm p-4 sm:p-6">
        {/* Header inside card */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Bidding Product Detail</h2>
          <p className="mt-1 text-sm text-gray-600">Manage auction item and bidding activity</p>
        </div>
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Information and Bidding History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Detail Card */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div>
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg"
                  />
                </div>
                {/* Thumbnail Images */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {productImages.slice(0, 4).map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`h-16 sm:h-20 w-full rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === index ? 'border-[#F7931E]' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">{product.category}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    A 1960 vintage Rolex Submariner watch from 1975 in excellent condition. This timepiece features the iconic black dial with luminous markers, unidirectional rotating bezel, and automatic movement. The watch has been serviced and comes with original box and papers. A true collector's item with historical significance and timeless appeal.
                  </p>
                </div>

                {/* Product Specifications */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Condition:</span>
                    <span className="text-sm font-medium text-gray-900">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Dimensions:</span>
                    <span className="text-sm font-medium text-gray-900">46mm case diameter</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Weight:</span>
                    <span className="text-sm font-medium text-gray-900">155 grams</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Starting Price:</span>
                    <span className="text-sm font-medium text-gray-900">{product.startingPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Reserve Price:</span>
                    <span className="text-sm font-medium text-blue-600">$7,500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* YouTube Review Section */}
            <div className="rounded-md bg-gray-100 p-4">
              <div className="flex items-center gap-3">
                {/* Orange PDF Icon */}
                <div className="flex items-center justify-center w-7 h-7 bg-[#F7931E] rounded">
                  <span className="text-white text-[10px] font-bold">PDF</span>
                </div>
                <span className="text-sm font-medium text-gray-900 underline">YouTube review</span>
                {/* Red Eye Icon */}
                <button className="ml-auto text-red-600 hover:text-red-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bidding History Section */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Bidding History</h3>
              <span className="text-sm text-gray-600">23 total bids</span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {BIDDING_HISTORY.map((bid) => (
                <div key={bid.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{bid.bidderName}</p>
                      <p className="text-xs text-gray-500 truncate">{bid.bidderEmail}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-xs text-gray-600">{bid.status}</span>
                      <span className="text-xs text-gray-500 hidden sm:inline">{bid.date}, {bid.time}</span>
                      <span className="text-xs text-gray-500 sm:hidden">{bid.date}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{bid.amount}</div>
                    <button className="inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-3 py-1.5 text-xs font-medium text-white cursor-pointer whitespace-nowrap">
                      Bidding
                    </button>
                    <div className="flex items-center gap-2">
                      <button className="text-green-600 hover:text-green-700" aria-label="Approve">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600" aria-label="Reject">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigate(`/building-products/${product.id}/history`)}
                className="inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer w-full sm:w-auto"
              >
                View All History
              </button>
            </div>
            </div>
          </div>

          {/* Right Column - Auction Status and Actions */}
          <div className="space-y-4 sm:space-y-6">
            {/* Current Auction Status Card */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Current Auction Status</h3>
              
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-[#118D57] mb-2">$8,750</p>
                  <p className="text-sm text-gray-500">Highest Bid</p>
                </div>

                <div className="bg-black text-white rounded-lg p-4">
                  <p className="text-sm font-medium mb-1">Auction Ended - unsold</p>
                  <p className="text-xs text-gray-300">Time Remaining</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">23</p>
                    <p className="text-xs font-medium text-gray-700">Total Bids</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">5</p>
                    <p className="text-xs font-medium text-gray-700">Matches</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">23</p>
                    <p className="text-xs font-medium text-gray-700">Bidders</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">23</p>
                    <p className="text-xs font-medium text-gray-700">Saved</p>
                  </div>
                </div>

                <button className="w-full inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer">
                  Resell
                </button>
              </div>
            </div>

            {/* Admin Actions Card */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full inline-flex items-center justify-center rounded-lg bg-[#118D57] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0F7A4A] cursor-pointer">
                Approve All Bids
              </button>
              <button className="w-full inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer">
                Pause Auction
              </button>
              <button className="w-full inline-flex items-center justify-center rounded-lg bg-[#B71D18] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#9A1914] cursor-pointer">
                End Auction Now
              </button>
              <button className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer">
                Delete Product
              </button>
            </div>
          </div>

            {/* Auction Timeline Card */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Auction Timeline</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Start Date:</span>
                  <span className="text-sm font-medium text-gray-900">28/01/2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">End Date:</span>
                  <span className="text-sm font-medium text-gray-900">15/02/2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Duration:</span>
                  <span className="text-sm font-medium text-gray-900">18 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Starting Time:</span>
                  <span className="text-sm font-medium text-gray-900">03:30:45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">End Time:</span>
                  <span className="text-sm font-medium text-gray-900">06:45:10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
