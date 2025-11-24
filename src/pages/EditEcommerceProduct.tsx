import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UploadIcon, XIcon } from '../components/icons/Icons'
import SelectDropdown from '../components/ui/SelectDropdown'

export default function EditEcommerceProduct() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    productTitle: 'Apple AirPods Pro (2nd Generation)',
    category: 'electronics',
    condition: 'excellent',
    productDescription: 'A rare vintage Rolex Submariner watch from HFS in excellent condition. The timepiece features the iconic black dial with luminous markers, unidirectional rotating bezel, and automatic movement. The watch has been serviced and comes with original box and papers. A true collector\'s item with historical significance and timeless appeal.',
    metaTitle: 'Apple AirPods Pro 2nd Gen + Premium Wireless Earbuds',
    metaDescription: 'Shop Apple AirPods Pro 2nd Generation with...',
    productUrlSlug: 'apple-airpods-pro-2nd-generation',
    price: '799.99',
    discountPrice: '599.99',
    stockQuantity: '12',
    stockStatus: 'in-stock',
    brand: 'Apple',
    weight: '0.056 kg',
    dimensions: '5.06 x 2.18 x 2.40cm',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<string[]>([])
  const [documentFiles, setDocumentFiles] = useState<string[]>([])

  useEffect(() => {
    // Load existing product data for editing
    const loadProduct = async () => {
      if (productId) {
        try {
          // TODO: Replace with actual API call
          // const product = await getEcommerceProductById(productId)
          // setFormData({
          //   productTitle: product.name,
          //   category: product.category,
          //   condition: product.condition,
          //   productDescription: product.description,
          //   metaTitle: product.metaTitle,
          //   metaDescription: product.metaDescription,
          //   productUrlSlug: product.productSlug,
          //   price: product.regularPrice.toString(),
          //   discountPrice: product.salePrice.toString(),
          //   stockQuantity: product.stockQuantity.toString(),
          //   stockStatus: product.stockStatus || 'in-stock',
          //   brand: product.brand,
          //   weight: product.weight,
          //   dimensions: product.dimensions,
          // })
          // setMediaFiles(product.images || [])
          // setDocumentFiles(product.documents || [])
          
          // For now, using mock data that's already set in initial state
          console.log('Loading product for editing:', productId)
        } catch (error) {
          console.error('Error loading product:', error)
          alert('Failed to load product data. Please try again.')
        }
      }
    }
    
    loadProduct()
  }, [productId])

  const categoryOptions = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports' },
    { value: 'books', label: 'Books' },
  ]

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
    { value: 'refurbished', label: 'Refurbished' },
  ]

  // Unused - keeping for reference
  // const stockStatusOptions = [
  //   { value: 'in-stock', label: 'In Stock' },
  //   { value: 'out-of-stock', label: 'Out of Stock' },
  //   { value: 'low-stock', label: 'Low Stock' },
  // ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const remainingSlots = 10 - mediaFiles.length
      if (remainingSlots > 0) {
        const fileUrls = newFiles.map(file => URL.createObjectURL(file))
        setMediaFiles([...mediaFiles, ...fileUrls.slice(0, remainingSlots)])
      } else {
        alert('Maximum 10 images allowed')
      }
    }
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const fileUrls = newFiles.map(file => URL.createObjectURL(file))
      setDocumentFiles([...documentFiles, ...fileUrls])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent, type: 'media' | 'document') => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    if (type === 'media') {
      const imageFiles = files.filter(file => file.type.startsWith('image/'))
      const remainingSlots = 10 - mediaFiles.length
      if (remainingSlots > 0) {
        const fileUrls = imageFiles.map(file => URL.createObjectURL(file))
        setMediaFiles([...mediaFiles, ...fileUrls.slice(0, remainingSlots)])
      } else {
        alert('Maximum 10 images allowed')
      }
    } else {
      const docFiles = files.filter(file => 
        file.type === 'application/pdf' || 
        file.type.includes('document') ||
        file.name.endsWith('.pdf') ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx')
      )
      const fileUrls = docFiles.map(file => URL.createObjectURL(file))
      setDocumentFiles([...documentFiles, ...fileUrls])
    }
  }

  const removeMediaFile = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index))
  }

  const removeDocumentFile = (index: number) => {
    setDocumentFiles(documentFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // API call to update product - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Updating product:', productId)
      console.log('Updated product data:', formData)
      console.log('Media files:', mediaFiles)
      console.log('Document files:', documentFiles)
      
      // TODO: Replace with actual API call
      // await updateEcommerceProduct(productId, formData, mediaFiles, documentFiles)
      
      // Navigate back to product detail page
      navigate(`/ecommerce-products/${productId}`)
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/ecommerce-products/${productId}`)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">E-commerce Products</h1>
        <p className="mt-1 text-sm text-gray-600">Dashboard : Edit Product</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
          {/* Product Details Section */}
          <div className="space-y-4">
            <div>
              <label htmlFor="productTitle" className="block text-sm font-normal text-[#888888] mb-1.5">
                Product Title
              </label>
              <input
                type="text"
                id="productTitle"
                name="productTitle"
                value={formData.productTitle}
                onChange={handleChange}
                placeholder="Apple AirPods Pro (2nd Generation)"
                className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-normal text-[#888888] mb-1.5">
                Category
              </label>
              <SelectDropdown
                value={formData.category}
                options={categoryOptions}
                onChange={(value) => handleSelectChange('category', value)}
                placeholder="Select Category"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-normal text-[#888888] mb-1.5">
                Condition
              </label>
              <SelectDropdown
                value={formData.condition}
                options={conditionOptions}
                onChange={(value) => handleSelectChange('condition', value)}
                placeholder="Select Condition"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="productDescription" className="block text-sm font-normal text-[#888888] mb-1.5">
                Product Description
              </label>
              <textarea
                id="productDescription"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                rows={6}
                className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E] resize-none"
              />
            </div>
          </div>

          {/* Product Images Section */}
          <div className="space-y-4">
            <label className="block text-sm font-normal text-[#888888] mb-1.5">Product Images</label>
            {mediaFiles.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={file}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeMediaFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F7931E] transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'media')}
              >
                <input
                  type="file"
                  id="mediaUpload"
                  multiple
                  accept="image/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <label htmlFor="mediaUpload" className="cursor-pointer block">
                  <UploadIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Drag & Drop or Browse</p>
                </label>
              </div>
            )}
            <button
              type="button"
              onClick={() => document.getElementById('mediaUpload')?.click()}
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              + Add Another Media
            </button>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <label className="block text-sm font-normal text-[#888888] mb-1.5">Documents</label>
            {documentFiles.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {documentFiles.map((_file, index) => (
                  <div key={index} className="relative group border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm text-gray-700">Document</span>
                    <button
                      type="button"
                      onClick={() => removeDocumentFile(index)}
                      className="bg-red-500 text-white rounded-full p-1 cursor-pointer"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F7931E] transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'document')}
              >
                <input
                  type="file"
                  id="documentUpload"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
                <label htmlFor="documentUpload" className="cursor-pointer block">
                  <UploadIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Drag & Drop or Browse</p>
                </label>
              </div>
            )}
            <button
              type="button"
              onClick={() => document.getElementById('documentUpload')?.click()}
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              + Add Another Document
            </button>
          </div>

          {/* SEO & Marketing Section */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">SEO & Marketing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="metaTitle" className="block text-sm font-normal text-[#888888] mb-1.5">
                  Meta Title
                </label>
                <input
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  placeholder="Apple AirPods Pro 2nd Gen + Premium Wireless Earbuds"
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>

              <div>
                <label htmlFor="metaDescription" className="block text-sm font-normal text-[#888888] mb-1.5">
                  Meta Description
                </label>
                <input
                  type="text"
                  id="metaDescription"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  placeholder="Shop Apple AirPods Pro 2nd Generation with..."
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="productUrlSlug" className="block text-sm font-normal text-[#888888] mb-1.5">
                Product URL Slug
              </label>
              <input
                type="text"
                id="productUrlSlug"
                name="productUrlSlug"
                value={formData.productUrlSlug}
                onChange={handleChange}
                placeholder="apple-airpods-pro-2nd-generation"
                className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>
          </div>

          {/* Pricing & Stock Section */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Pricing & Stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-normal text-[#888888] mb-1.5">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="799.99"
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>

              <div>
                <label htmlFor="discountPrice" className="block text-sm font-normal text-[#888888] mb-1.5">
                  Discount Price ($)
                </label>
                <input
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="599.99"
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>

              <div>
                <label htmlFor="stockQuantity" className="block text-sm font-normal text-[#888888] mb-1.5">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="12"
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-normal text-[#888888] mb-1.5">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Apple"
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-normal text-[#888888] mb-1.5">
                  Weight
                </label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="0.056 kg"
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>

              <div>
                <label htmlFor="dimensions" className="block text-sm font-normal text-[#888888] mb-1.5">
                  Dimensions
                </label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  placeholder="5.06 x 2.18 x 2.40cm"
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#F7931E] rounded-lg hover:bg-[#E8840D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

