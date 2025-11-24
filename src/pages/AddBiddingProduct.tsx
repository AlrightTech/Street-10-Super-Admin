import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarIcon, ClockIcon, UploadIcon } from '../components/icons/Icons'
import SelectDropdown from '../components/ui/SelectDropdown'

export default function AddBiddingProduct() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    productTitle: '',
    category: '',
    condition: '',
    productDescription: '',
    startingPrice: '0.0',
    reservePrice: '0.0',
    buyNowPrice: '0.0',
    auctionStartDate: '0.0',
    auctionEndDate: '0.0',
    duration: '0.0',
    auctionStartTime: '0.0',
    auctionEndTime: '0.0',
    durationTime: '0.0',
    paymentAmount: 'By Percentage of the total winning bid',
    daysForPaymentSettlement: '',
    biddingMinimumAmount: '',
    dimensions: '',
    weight: '',
    documentTitle: '',
    allowFullPayment: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [documentFiles, setDocumentFiles] = useState<File[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggle = (name: string) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles([...mediaFiles, ...Array.from(e.target.files)])
    }
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocumentFiles([...documentFiles, ...Array.from(e.target.files)])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Implement API call to add product
      console.log('Adding product:', formData)
      console.log('Media files:', mediaFiles)
      console.log('Document files:', documentFiles)
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Navigate back to bidding products page after success
      navigate('/building-products')
    } catch (error) {
      console.error('Error adding product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/building-products')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Bidding Products</h1>
        <p className="text-sm text-gray-700">
          <span>Dashboard</span>
          <span className="mx-1">·</span>
          <span className="text-gray-900">Add New Product</span>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-6">
          {/* Product Details Section */}
          <div>
          <div className="space-y-4">
            {/* Product Title */}
            <div>
              <label htmlFor="productTitle" className="block text-sm font-medium text-[#888888] mb-2">
                Product Title
              </label>
              <input
                id="productTitle"
                name="productTitle"
                type="text"
                placeholder="Enter Product Title"
                value={formData.productTitle}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#888888] mb-2">
                Category
              </label>
              <SelectDropdown
                value={formData.category}
                options={[
                  { value: 'luxury-goods', label: 'Luxury Goods' },
                  { value: 'collectibles', label: 'Collectibles' },
                  { value: 'art', label: 'Art' },
                  { value: 'home-decor', label: 'Home Decor' },
                ]}
                placeholder="Select Category"
                onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              />
            </div>

            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-[#888888] mb-2">
                Condition
              </label>
              <SelectDropdown
                value={formData.condition}
                options={[
                  { value: 'new', label: 'New' },
                  { value: 'like-new', label: 'Like New' },
                  { value: 'excellent', label: 'Excellent' },
                  { value: 'good', label: 'Good' },
                  { value: 'fair', label: 'Fair' },
                ]}
                placeholder="Select Condition"
                onChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}
              />
            </div>

            {/* Product Description */}
            <div>
              <label htmlFor="productDescription" className="block text-sm font-medium text-[#888888] mb-2">
                Product Description
              </label>
              <textarea
                id="productDescription"
                name="productDescription"
                rows={4}
                placeholder="Add Description here"
                value={formData.productDescription}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#F7931E] resize-none"
              />
            </div>
          </div>
          </div>

          {/* Upload Media Section */}
          <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Media</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center space-x-2 text-gray-400">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <UploadIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">drag & drop for image!</p>
                  <p className="text-xs text-gray-500 mt-1">Support JPG, PNG, WEBP up to 10MB each. Max 10 images</p>
                </div>
              </div>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleMediaUpload}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="mt-4 inline-block cursor-pointer text-sm text-[#F7931E] hover:text-[#E8840D]"
              >
                + Add Another Media
              </label>
            </div>
          </div>
          </div>

          {/* Add Document Section */}
          <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Document</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center space-x-2 text-gray-400">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <UploadIcon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-700">Upload Doc Here</p>
              </div>
              <label
                htmlFor="document-upload"
                className="mt-4 inline-block cursor-pointer text-sm text-[#F7931E] hover:text-[#E8840D]"
              >
                + Add Another Document
              </label>
              <input
                type="file"
                multiple
                onChange={handleDocumentUpload}
                className="hidden"
                id="document-upload"
              />
            </div>
            <div>
              <label htmlFor="documentTitle" className="block text-sm font-medium text-[#888888] mb-2">
                Add Document Title
              </label>
              <input
                id="documentTitle"
                name="documentTitle"
                type="text"
                placeholder="Enter Title"
                value={formData.documentTitle}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>
          </div>
          </div>

          {/* Auction Settings Section */}
          <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Auction Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Starting Price */}
            <div>
              <label htmlFor="startingPrice" className="block text-sm font-medium text-[#888888] mb-2">
                Starting Price ($)
              </label>
              <input
                id="startingPrice"
                name="startingPrice"
                type="text"
                value={formData.startingPrice}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Reserve Price */}
            <div>
              <label htmlFor="reservePrice" className="block text-sm font-medium text-[#888888] mb-2">
                Reserve Price ($)
              </label>
              <input
                id="reservePrice"
                name="reservePrice"
                type="text"
                value={formData.reservePrice}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum acceptable winning bid amount</p>
            </div>

            {/* Buy Now Price */}
            <div>
              <label htmlFor="buyNowPrice" className="block text-sm font-medium text-[#888888] mb-2">
                Buy Now Price ($)
              </label>
              <input
                id="buyNowPrice"
                name="buyNowPrice"
                type="text"
                value={formData.buyNowPrice}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <p className="text-xs text-gray-500 mt-1">Fixed price for immediate purchase (not a bid)</p>
            </div>

            {/* Auction Start Date */}
            <div>
              <label htmlFor="auctionStartDate" className="block text-sm font-medium text-[#888888] mb-2">
                Auction Start Date
              </label>
              <div className="relative">
                <input
                  id="auctionStartDate"
                  name="auctionStartDate"
                  type="text"
                  value={formData.auctionStartDate}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 pr-10 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Auction End Date */}
            <div>
              <label htmlFor="auctionEndDate" className="block text-sm font-medium text-[#888888] mb-2">
                Auction End Date
              </label>
              <div className="relative">
                <input
                  id="auctionEndDate"
                  name="auctionEndDate"
                  type="text"
                  value={formData.auctionEndDate}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 pr-10 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-[#888888] mb-2">
                Duration
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                value={formData.duration}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <p className="text-xs text-gray-500 mt-1">Automatically calculated from dates</p>
            </div>

            {/* Auction Start Time */}
            <div>
              <label htmlFor="auctionStartTime" className="block text-sm font-medium text-[#888888] mb-2">
                Auction Start Time
              </label>
              <div className="relative">
                <input
                  id="auctionStartTime"
                  name="auctionStartTime"
                  type="text"
                  value={formData.auctionStartTime}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 pr-10 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Auction End Time */}
            <div>
              <label htmlFor="auctionEndTime" className="block text-sm font-medium text-[#888888] mb-2">
                Auction End Time
              </label>
              <div className="relative">
                <input
                  id="auctionEndTime"
                  name="auctionEndTime"
                  type="text"
                  value={formData.auctionEndTime}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 pr-10 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Duration Time */}
            <div>
              <label htmlFor="durationTime" className="block text-sm font-medium text-[#888888] mb-2">
                Duration
              </label>
              <input
                id="durationTime"
                name="durationTime"
                type="text"
                value={formData.durationTime}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <p className="text-xs text-gray-500 mt-1">Automatically calculated from dates and time</p>
            </div>
          </div>
          </div>

          {/* Down Payment Section */}
          <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Down Payment</h2>
          <div className="space-y-4">
            {/* Payment Amount */}
            <div>
              <label htmlFor="paymentAmount" className="block text-sm font-medium text-[#888888] mb-2">
                Payment Amount
              </label>
              <div className="relative">
                <select
                  id="paymentAmount"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none appearance-none focus:ring-1 focus:ring-[#F7931E]"
                >
                  <option value="By Percentage of the total winning bid">By Percentage of the total winning bid</option>
                  <option value="Fixed Amount">Fixed Amount</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Days For Payment Settlement */}
            <div>
              <label htmlFor="daysForPaymentSettlement" className="block text-sm font-medium text-[#888888] mb-2">
                Days For Payment Settlement
              </label>
              <input
                id="daysForPaymentSettlement"
                name="daysForPaymentSettlement"
                type="text"
                placeholder="Enter number of days"
                value={formData.daysForPaymentSettlement}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Bidding Minimum Amount and Full Payment Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bidding Minimum Amount */}
              <div>
                <label htmlFor="biddingMinimumAmount" className="block text-sm font-medium text-[#888888] mb-2">
                  Bidding Minimum Amount
                </label>
                <input
                  id="biddingMinimumAmount"
                  name="biddingMinimumAmount"
                  type="text"
                  placeholder="Type the next bid minimum and multiplies Example 500, 1000, 1500"
                  value={formData.biddingMinimumAmount}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>
              {/* Full Payment Toggle */}
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-[#888888] mb-2">
                  Open the option to make Full payment at the end of the bidding
                </label>
                <div className="flex items-center h-[42px]">
                  <button
                    type="button"
                    onClick={() => handleToggle('allowFullPayment')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      formData.allowFullPayment ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.allowFullPayment ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Additional Details Section */}
          <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dimensions */}
            <div>
              <label htmlFor="dimensions" className="block text-sm font-medium text-[#888888] mb-2">
                Dimensions
              </label>
              <input
                id="dimensions"
                name="dimensions"
                type="text"
                placeholder="Enter Dimensions e.g. 40 mm, case"
                value={formData.dimensions}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-[#888888] mb-2">
                Weight
              </label>
              <input
                id="weight"
                name="weight"
                type="text"
                placeholder="Enter Weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>
          </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#E8840D] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Product'}
          </button>
          </div>
        </div>
      </form>
    </div>
  )
}
