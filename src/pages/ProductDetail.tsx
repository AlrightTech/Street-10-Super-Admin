import { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductDetailById, updateProductDetail, deleteProductDetail } from '../data/mockProductDetails'

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const product = useMemo(() => {
    if (!productId) return null
    return getProductDetailById(productId)
  }, [productId, refreshKey])

  useEffect(() => {
    if (!product) {
      navigate('/vendors', { replace: true })
    }
  }, [product, navigate])

  if (!product) {
    return null
  }

  return (
    <div className="space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-lg font-medium">Products Details</p>
         
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-[#F39C12] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E67E22] cursor-pointer"
        >
          Promote
        </button>
      </div>

      <div className="space-y-6 rounded-lg bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:space-y-8">
        <div>
        <h1 className="mt-1 text-lg font-semibold text-gray-900 sm:text-3xl">
            {product.name}
          </h1>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
            <div className="rounded-2xl border border-[#ECECEC] bg-white  px-3 py-3">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-60 object-cover rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((thumb) => (
                    <div
                      key={thumb}
                      className="flex h-10  items-center justify-center
                       rounded-lg border border-[#ECECEC] bg-[#F8F8FC]"
                    >
                      <span className="text-xs font-semibold text-gray-400">Img {thumb}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Description</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {product.descriptionLong}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold  tracking-wide">
                    Additional Documents
                  </h3>
                  <ul className=" space-y-2">
                    {product.additionalDocuments.map((document) => (
                      <li
                        key={document}
                        className="inline-flex text-sm text-[#374151]"
                      >
                        {document}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-4  sm:grid-cols-2">
                  <div className="">
                    <p className="text-xs font-semibold text-gray-400">Condition</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{product.condition}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Brand</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{product.brand}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Regular price</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{product.regularPrice}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Sale price</p>
                    <p className="mt-1 text-sm font-semibold text-[#22C55E]">{product.salePrice}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">Stock Quantity</p>
                    <p className="mt-1 text-sm font-semibold text-[#2563EB]">
                      {product.stockQuantity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#ECECEC] bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Weight</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{product.weight}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Dimensions</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{product.dimensions}</p>
                </div>
              </div>
            </div>

              <div className="rounded-2xl border  border-[#ECECEC] bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">SEO &amp; Marketing</h3>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Meta Title</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{product.metaTitle}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Meta Description</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {product.metaDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-[#ECECEC] bg-white px-3 py-3">
            <h3 className="text-lg font-semibold text-gray-900">Admin Actions</h3>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="w-full rounded-lg bg-[#F39C12] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E67E22] cursor-pointer"
              >
                Edit Product
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full rounded-lg border border-[#F5B1B1] bg-[#FEE2E2] px-4 py-2.5 text-sm font-semibold text-[#E11D48] transition-colors hover:bg-[#FECACA] cursor-pointer"
              >
                Delete Product
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ECECEC] bg-white px-3 py-2">
            <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
            <dl className="mt-4 space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <dt>Total Views</dt>
                <dd className="font-semibold text-gray-900">{product.performance.views}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Total Orders</dt>
                <dd className="font-semibold text-gray-900">{product.performance.orders}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Revenue</dt>
                <dd className="font-semibold text-gray-900">{product.performance.revenue}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Conversion Rate</dt>
                <dd className="font-semibold text-gray-900">
                  {product.performance.conversionRate}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Total Saved</dt>
                <dd className="font-semibold text-gray-900">{product.performance.saved}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Total Shared</dt>
                <dd className="font-semibold text-gray-900">{product.performance.shared}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && product && (
        <EditProductModal
          product={product}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedData) => {
            if (productId) {
              updateProductDetail(productId, updatedData)
              setRefreshKey((prev) => prev + 1) // Force refresh
              setIsEditModalOpen(false)
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && product && (
        <DeleteConfirmationModal
          productName={product.name}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            if (productId) {
              const deleted = deleteProductDetail(productId)
              if (deleted) {
                navigate('/vendors', { replace: true })
              }
            }
          }}
        />
      )}
    </div>
  )
}

// Edit Product Modal Component
interface EditProductModalProps {
  product: NonNullable<ReturnType<typeof getProductDetailById>>
  onClose: () => void
  onSave: (updatedProduct: any) => void
}

function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [editableFields, setEditableFields] = useState<Record<string, boolean>>({
    productName: false,
    category: false,
    subCategory: false,
    price: false,
    description: false,
  })

  const [formData, setFormData] = useState({
    productName: product.name,
    category: product.category,
    subCategory: product.category, // Using category as subcategory for now
    price: product.salePrice.replace('$', ''),
    description: product.descriptionLong,
    documents: [...product.additionalDocuments],
    media: [product.image],
  })

  const [productType, setProductType] = useState('Normal Product')

  const toggleEdit = (field: string) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDocumentRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const handleDocumentAdd = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setFormData((prev) => ({
          ...prev,
          documents: [...prev.documents, file.name],
        }))
      }
    }
    input.click()
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please select an image or video file')
      e.target.value = ''
      return
    }
    
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      if (result && typeof result === 'string') {
        console.log('Image loaded, updating state...')
        setFormData((prev) => {
          console.log('Previous media:', prev.media)
          // Replace the first image with the new one
          const newMedia: string[] = [result]
          // Keep other media items if they exist
          if (prev.media.length > 1) {
            const remainingMedia = prev.media.slice(1).filter((item): item is string => typeof item === 'string')
            newMedia.push(...remainingMedia)
          }
          console.log('New media:', newMedia)
          return {
            ...prev,
            media: newMedia,
          }
        })
      }
    }
    reader.onerror = () => {
      alert('Error reading file. Please try again.')
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  const handleMediaAdd = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,video/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            media: [...prev.media, reader.result as string],
          }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleSave = () => {
    // Convert formData to product format
    const updatedProduct = {
      name: formData.productName,
      category: formData.category,
      salePrice: `$${formData.price}`,
      descriptionLong: formData.description,
      additionalDocuments: formData.documents,
      image: formData.media[0] || product.image,
    }
    onSave(updatedProduct)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4 sm:py-6 overflow-y-auto">
        <div
          className="w-full max-w-4xl bg-white rounded-lg shadow-xl my-auto max-h-[95vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 relative">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
              Edit Product Details
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <XIcon />
            </button>
          </div>

          {/* Product Type Selector */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setProductType('Normal Product')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  productType === 'Normal Product'
                    ? 'bg-[#F39C12] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Normal Product
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
            {/* Product Information Fields */}
            <div className="space-y-4">
              {/* Product Name */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <div className="relative">
                  {editableFields.productName ? (
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) => handleInputChange('productName', e.target.value)}
                      onBlur={() => toggleEdit('productName')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F39C12] focus:border-transparent"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleEdit('productName')}
                    >
                      <span className="text-gray-900 flex-1">{formData.productName}</span>
                      <span className="ml-2 text-gray-400">
                        <EditIcon />
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <div className="relative">
                  {editableFields.category ? (
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      onBlur={() => toggleEdit('category')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F39C12] focus:border-transparent"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleEdit('category')}
                    >
                      <span className="text-gray-900 flex-1">{formData.category}</span>
                      <span className="ml-2 text-gray-400">
                        <EditIcon />
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sub Category */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category
                </label>
                <div className="relative">
                  {editableFields.subCategory ? (
                    <input
                      type="text"
                      value={formData.subCategory}
                      onChange={(e) => handleInputChange('subCategory', e.target.value)}
                      onBlur={() => toggleEdit('subCategory')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F39C12] focus:border-transparent"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleEdit('subCategory')}
                    >
                      <span className="text-gray-900 flex-1">{formData.subCategory}</span>
                      <span className="ml-2 text-gray-400">
                        <EditIcon />
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="relative">
                  {editableFields.price ? (
                    <div className="flex items-center">
                      <span className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-100 text-gray-700">
                        $
                      </span>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        onBlur={() => toggleEdit('price')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F39C12] focus:border-transparent"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleEdit('price')}
                    >
                      <span className="text-gray-900 flex-1">${formData.price}</span>
                      <span className="ml-2 text-gray-400">
                        <EditIcon />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documents
              </label>
              <div className="space-y-2">
                {formData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <DocumentIcon />
                      <span className="text-sm text-gray-900">{doc}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDocumentRemove(index)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <XIcon />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleDocumentAdd}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                + Add Another Document
              </button>
            </div>

            {/* Description */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="relative">
                {editableFields.description ? (
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    onBlur={() => toggleEdit('description')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F39C12] focus:border-transparent resize-none"
                    autoFocus
                  />
                  ) : (
                    <div
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px] flex items-start justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleEdit('description')}
                    >
                      <span className="text-gray-900 flex-1">{formData.description}</span>
                      <span className="ml-2 text-gray-400">
                        <EditIcon />
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* Upload Media */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Media
              </label>
              <div className="relative">
                <div className="relative w-full h-48 sm:h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden group">
                  {formData.media[0] ? (
                    <img
                      key={`media-${formData.media[0].substring(0, 100)}`}
                      src={formData.media[0]}
                      alt="Product media"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image load error:', e)
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <CameraIcon />
                        <p className="mt-2 text-xs">No image selected</p>
                      </div>
                    </div>
                  )}
                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-200 cursor-pointer z-10"
                    onClick={(e) => {
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                      id="media-upload-input"
                    />
                    <div className="flex flex-col items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <CameraIcon />
                      <UploadIcon />
                      <span className="text-xs text-center px-4">
                        {formData.media[0] ? 'Replace image/ Video' : 'Upload image/ Video'} (Recommended size: 1080x1080px, PNG)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleMediaAdd}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                + Add Another Picture/Video
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#F39C12] text-white text-sm font-semibold hover:bg-[#E67E22] transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// Icon Components
function EditIcon() {
  return (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  )
}

// Delete Confirmation Modal Component
interface DeleteConfirmationModalProps {
  productName: string
  onClose: () => void
  onConfirm: () => void
}

function DeleteConfirmationModal({ productName, onClose, onConfirm }: DeleteConfirmationModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
        <div
          className="w-full max-w-md bg-white rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 relative">
            <h2 className="text-xl font-semibold text-gray-900">Delete Product</h2>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <XIcon />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{productName}"</span>?
            </p>
            <p className="text-sm text-gray-500">
              This action cannot be undone. The product will be permanently removed from the system.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#E11D48] text-white text-sm font-semibold hover:bg-[#BE185D] transition-colors cursor-pointer"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </>
  )
}


