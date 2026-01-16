import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { XIcon } from '../components/icons/Icons'
import { auctionsApi, type Auction } from '../services/auctions.api'
import { productsApi } from '../services/products.api'
import { categoriesApi, type Category } from '../services/categories.api'
import { filtersApi, type Filter as BackendFilter } from '../services/filters.api'
import { getProductDetailRoute } from '../utils/biddingProducts'
import type { BiddingProduct } from '../components/bidding/BiddingProductsTable'

export default function EditBiddingProduct() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [formData, setFormData] = useState({
    productTitle: '',
    categoryId: '',
    description: '',
    startingPrice: '',
    reservePrice: '',
    buyNowPrice: '',
    minIncrement: '',
    auctionStartDate: '',
    auctionEndDate: '',
    auctionStartTime: '',
    auctionEndTime: '',
    status: 'scheduled' as BiddingProduct['status'],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [auction, setAuction] = useState<Auction | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [documents, setDocuments] = useState<Array<{ file?: File; url: string; title: string }>>([])
  const [availableFilters, setAvailableFilters] = useState<BackendFilter[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Array<{ filterId: string; value: string }>>([])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const tree = await categoriesApi.getTree()
        const flattenCategories = (cats: Category[]): Category[] => {
          const result: Category[] = []
          cats.forEach(cat => {
            result.push(cat)
            if (cat.children && cat.children.length > 0) {
              result.push(...flattenCategories(cat.children))
            }
          })
          return result
        }
        setCategories(flattenCategories(tree).filter(cat => cat.isActive))
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    fetchCategories()
  }, [])

  // Fetch available filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const filters = await filtersApi.getAll()
        setAvailableFilters(filters)
      } catch (err: any) {
        console.error('Error fetching filters:', err)
      }
    }
    fetchFilters()
  }, [])

  // Load filters for selected category
  useEffect(() => {
    const loadCategoryFilters = async () => {
      if (!formData.categoryId) {
        return
      }
      try {
        const categoryFilters = await categoriesApi.getCategoryFilters(formData.categoryId)
        const filterIds = categoryFilters.map((cf: any) => cf.filterId)
        const allFilters = await filtersApi.getAll()
        const relevantFilters = allFilters.filter((f: BackendFilter) => filterIds.includes(f.id))
        setAvailableFilters(relevantFilters)
      } catch (err: any) {
        console.error('Error fetching category filters:', err)
      }
    }
    loadCategoryFilters()
  }, [formData.categoryId])

  // Load auction and product data
  useEffect(() => {
    const loadAuction = async () => {
      if (!id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        const auctionData = await auctionsApi.getById(id)
        setAuction(auctionData)

        // Map auction data to form
        const product = auctionData.product
        const startDate = new Date(auctionData.startAt)
        const endDate = new Date(auctionData.endAt)
        
        setFormData({
          productTitle: product.title,
          categoryId: (product as any).categories?.[0]?.category?.id || '',
          description: product.description || '',
          startingPrice: (parseFloat(auctionData.reservePrice || auctionData.depositAmount) / 100).toString(),
          reservePrice: auctionData.reservePrice ? (parseFloat(auctionData.reservePrice) / 100).toString() : '',
          buyNowPrice: auctionData.buyNowPrice ? (parseFloat(auctionData.buyNowPrice) / 100).toString() : '',
          minIncrement: (parseFloat(auctionData.minIncrement) / 100).toString(),
          auctionStartDate: startDate.toISOString().split('T')[0],
          auctionEndDate: endDate.toISOString().split('T')[0],
          auctionStartTime: startDate.toTimeString().slice(0, 5),
          auctionEndTime: endDate.toTimeString().slice(0, 5),
          status: mapAuctionStateToStatus(auctionData.state),
        })

        // Load documents
        if ((product as any).documents) {
          setDocuments((product as any).documents.map((doc: any) => ({
            url: doc.url,
            title: doc.title,
          })))
        }

        // Load filter values
        if ((product as any).filterValues) {
          setSelectedFilters((product as any).filterValues.map((fv: any) => ({
            filterId: fv.filterId,
            value: fv.value,
          })))
        }
      } catch (err: any) {
        console.error('Error loading auction:', err)
        setError(err.response?.data?.message || 'Failed to load auction')
      } finally {
        setIsLoading(false)
      }
    }

    loadAuction()
  }, [id])

  // Map auction state to frontend status
  const mapAuctionStateToStatus = (state: string): BiddingProduct['status'] => {
    switch (state) {
      case 'ended':
        return 'payment-requested' // Ended auctions show as payment requested
      case 'settled':
        return 'fully-paid-sold'
      case 'scheduled':
        return 'scheduled'
      case 'live':
        return 'live' // Live auctions show as "Live" (started)
      default:
        return 'scheduled'
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setDocuments([...documents, { file, url: '', title: '' }])
      e.target.value = ''
    }
  }

  const updateDocumentTitle = (index: number, title: string) => {
    const updated = [...documents]
    updated[index] = { ...updated[index], title }
    setDocuments(updated)
  }

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  const handleAddFilter = () => {
    setSelectedFilters([...selectedFilters, { filterId: '', value: '' }])
  }

  const handleFilterChange = (index: number, field: 'filterId' | 'value', value: string) => {
    const updated = [...selectedFilters]
    updated[index] = { ...updated[index], [field]: value }
    setSelectedFilters(updated)
  }

  const removeFilter = (index: number) => {
    setSelectedFilters(selectedFilters.filter((_, i) => i !== index))
  }

  const convertFileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!id || !auction) {
      alert('Auction ID is missing')
      setIsSubmitting(false)
      return
    }

    try {
      // Validate required fields
      if (!formData.productTitle.trim()) {
        alert('Product title is required')
        setIsSubmitting(false)
        return
      }

      if (!formData.startingPrice || parseFloat(formData.startingPrice) <= 0) {
        alert('Starting price must be greater than 0')
        setIsSubmitting(false)
        return
      }

      if (!formData.auctionStartDate || !formData.auctionEndDate) {
        alert('Auction start and end dates are required')
        setIsSubmitting(false)
        return
      }

      // Combine date and time
      const startDateTime = new Date(`${formData.auctionStartDate}T${formData.auctionStartTime || '00:00'}`)
      const endDateTime = new Date(`${formData.auctionEndDate}T${formData.auctionEndTime || '23:59'}`)

      if (startDateTime >= endDateTime) {
        alert('End date must be after start date')
        setIsSubmitting(false)
        return
      }

      // Convert prices to minor units
      const startingPriceMinor = Math.round(parseFloat(formData.startingPrice) * 100)
      // const reservePriceMinor = formData.reservePrice ? Math.round(parseFloat(formData.reservePrice) * 100) : undefined
      // const buyNowPriceMinor = formData.buyNowPrice ? Math.round(parseFloat(formData.buyNowPrice) * 100) : undefined
      // const minIncrement = formData.minIncrement ? Math.round(parseFloat(formData.minIncrement) * 100) : Math.round(startingPriceMinor * 0.1)

      // Convert document files to URLs with titles
      const documentData: Array<{ url: string; title: string }> = []
      for (const doc of documents) {
        if (!doc.title.trim()) {
          alert(`Document title is required for ${doc.file?.name || 'document'}`)
          setIsSubmitting(false)
          return
        }
        let url = doc.url
        if (doc.file) {
          try {
            url = await convertFileToDataURL(doc.file)
          } catch (err) {
            console.error('Error converting document:', err)
            continue
          }
        }
        documentData.push({ url, title: doc.title.trim() })
      }

      // Prepare filter values
      const filterValues: Array<{ filterId: string; value: string }> = []
      for (const filter of selectedFilters) {
        if (!filter.filterId || !filter.value.trim()) {
          continue
        }
        filterValues.push({
          filterId: filter.filterId,
          value: filter.value.trim(),
        })
      }

      // Update product
      await productsApi.update(auction.productId, {
        title: formData.productTitle,
        description: formData.description || undefined,
        priceMinor: startingPriceMinor,
        categoryIds: formData.categoryId ? [formData.categoryId] : undefined,
        documents: documentData.length > 0 ? documentData : undefined,
        filterValues: filterValues.length > 0 ? filterValues : undefined,
      })

      // Prepare auction update data
      const newState = formData.status === 'scheduled' ? 'scheduled' 
        : formData.status === 'ended-unsold' ? 'ended'
        : formData.status === 'fully-paid-sold' ? 'settled'
        : 'live'

      const auctionUpdateData: any = {
        startAt: startDateTime.toISOString(),
        endAt: endDateTime.toISOString(),
        minIncrement: formData.minIncrement ? Math.round(parseFloat(formData.minIncrement) * 100) : undefined,
        depositAmount: startingPriceMinor, // Use starting price as deposit
      }

      // Only include state if it has changed
      if (newState !== auction.state) {
        auctionUpdateData.state = newState
      }

      if (formData.reservePrice) {
        auctionUpdateData.reservePrice = Math.round(parseFloat(formData.reservePrice) * 100)
      } else if (formData.reservePrice === '') {
        // Allow setting to null if explicitly cleared
        auctionUpdateData.reservePrice = null
      }

      if (formData.buyNowPrice) {
        auctionUpdateData.buyNowPrice = Math.round(parseFloat(formData.buyNowPrice) * 100)
      } else if (formData.buyNowPrice === '') {
        // Allow setting to null if explicitly cleared
        auctionUpdateData.buyNowPrice = null
      }

      // Update auction
      await auctionsApi.update(id, auctionUpdateData)

      alert('Product and auction updated successfully!')
      
      // Navigate back to the product detail page with refresh flag
      const route = getProductDetailRoute({
        id: id,
        productId: auction.productId,
        name: formData.productTitle,
        category: categories.find(c => c.id === formData.categoryId)?.name || '',
        startingPrice: formData.startingPrice,
        currentBid: '',
        bids: 0,
        timeLeft: '',
        status: formData.status,
      })
      // Add timestamp to force refetch - use state to trigger refetch
      navigate(`${route}?refresh=${Date.now()}`, { state: { refresh: true } })
    } catch (err: any) {
      console.error('Error updating product:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update product'
      setError(errorMessage)
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (id && auction) {
      const route = getProductDetailRoute({
        id: id,
        productId: auction.productId,
        name: formData.productTitle,
        category: categories.find(c => c.id === formData.categoryId)?.name || '',
        startingPrice: formData.startingPrice,
        currentBid: '',
        bids: 0,
        timeLeft: '',
        status: formData.status,
      })
      navigate(route)
    } else {
      navigate('/building-products')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#F7941D] border-r-transparent"></div>
          <p className="mt-4 text-lg font-semibold text-gray-900">Loading auction...</p>
        </div>
      </div>
    )
  }

  if (error || !id || !auction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">{error || 'Auction not found'}</p>
          <button
            onClick={() => navigate('/building-products')}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D]"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Bidding Product</h1>
        <p className="mt-1 text-sm text-gray-700">
          <span>Dashboard</span>
          <span className="mx-1">:</span>
          <span>Bidding Products</span>
          <span className="mx-1">:</span>
          <span className="text-gray-900">Edit Product</span>
        </p>
      </div>

      {/* Form Card */}
      <section className="rounded-xl bg-white shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Product Title */}
            <div>
              <label htmlFor="productTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                id="productTitle"
                name="productTitle"
                type="text"
                required
                placeholder="Enter product title"
                value={formData.productTitle}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E] resize-none"
              />
            </div>

            {/* Documents Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#F7931E] transition-colors">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">Upload Doc Here</p>
                    <p className="text-xs text-gray-500">Support PDF, DOC, DOCX up to 10MB each</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleDocumentUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <label
                    htmlFor="document-upload"
                    className="mt-4 inline-block cursor-pointer text-sm text-[#F7931E] hover:text-[#E8840D]"
                  >
                    + Add Another Document
                  </label>
                </div>
                {documents.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {documents.map((doc, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <svg className="h-8 w-8 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-700 truncate font-medium">
                                {doc.file?.name || 'Existing Document'}
                              </p>
                              {doc.file && (
                                <p className="text-xs text-gray-500">
                                  {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="ml-3 text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#888888] mb-2">
                            Document Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Document Title"
                            value={doc.title}
                            onChange={(e) => updateDocumentTitle(index, e.target.value)}
                            className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#F7931E]"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filters Section */}
            {formData.categoryId && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Filters</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Select filters from the category and set their values for this product
                </p>
                
                {selectedFilters.map((filter, index) => {
                  const filterDetails = availableFilters.find((f: BackendFilter) => f.id === filter.filterId)
                  const filterOptions = filterDetails?.options?.values || []
                  const filterType = filterDetails?.type || 'text'
                  
                  return (
                    <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-700">Filter {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeFilter(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-[#888888] mb-2">
                            Select Filter
                          </label>
                          <select
                            value={filter.filterId}
                            onChange={(e) => handleFilterChange(index, 'filterId', e.target.value)}
                            className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
                          >
                            <option value="">-- Select Filter --</option>
                            {availableFilters.map((f: BackendFilter) => (
                              <option key={f.id} value={f.id}>
                                {f.i18n?.en?.label || f.key}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {filter.filterId && (
                          <div>
                            <label className="block text-sm font-medium text-[#888888] mb-2">
                              Filter Value <span className="text-red-500">*</span>
                            </label>
                            {filterType === 'number' ? (
                              <input
                                type="number"
                                value={filter.value}
                                onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                placeholder="Enter value"
                                className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
                                required
                              />
                            ) : filterOptions.length > 0 ? (
                              <select
                                value={filter.value}
                                onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
                                required
                              >
                                <option value="">-- Select Value --</option>
                                {filterOptions.map((opt: string) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={filter.value}
                                onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                placeholder="Enter value"
                                className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
                                required
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                
                <button
                  type="button"
                  onClick={handleAddFilter}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#F7931E] bg-[#FDF4EB] rounded-lg hover:bg-[#F9E8D3] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Filter
                </button>
              </div>
            )}

            {/* Starting Price */}
            <div>
              <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Starting Price (QAR) <span className="text-red-500">*</span>
              </label>
              <input
                id="startingPrice"
                name="startingPrice"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={formData.startingPrice}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Reserve Price */}
            <div>
              <label htmlFor="reservePrice" className="block text-sm font-medium text-gray-700 mb-2">
                Reserve Price (QAR)
              </label>
              <input
                id="reservePrice"
                name="reservePrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.reservePrice}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Buy Now Price */}
            <div>
              <label htmlFor="buyNowPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Buy Now Price (QAR)
              </label>
              <input
                id="buyNowPrice"
                name="buyNowPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.buyNowPrice}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Minimum Increment */}
            <div>
              <label htmlFor="minIncrement" className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Bid Increment (QAR)
              </label>
              <input
                id="minIncrement"
                name="minIncrement"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.minIncrement}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Auction Start Date */}
            <div>
              <label htmlFor="auctionStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                Auction Start Date <span className="text-red-500">*</span>
              </label>
              <input
                id="auctionStartDate"
                name="auctionStartDate"
                type="date"
                required
                value={formData.auctionStartDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Auction End Date */}
            <div>
              <label htmlFor="auctionEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                Auction End Date <span className="text-red-500">*</span>
              </label>
              <input
                id="auctionEndDate"
                name="auctionEndDate"
                type="date"
                required
                value={formData.auctionEndDate}
                onChange={handleChange}
                min={formData.auctionStartDate}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Auction Start Time */}
            <div>
              <label htmlFor="auctionStartTime" className="block text-sm font-medium text-gray-700 mb-2">
                Auction Start Time
              </label>
              <input
                id="auctionStartTime"
                name="auctionStartTime"
                type="time"
                value={formData.auctionStartTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Auction End Time */}
            <div>
              <label htmlFor="auctionEndTime" className="block text-sm font-medium text-gray-700 mb-2">
                Auction End Time
              </label>
              <input
                id="auctionEndTime"
                name="auctionEndTime"
                type="time"
                value={formData.auctionEndTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              >
                <option value="scheduled">Scheduled</option>
                <option value="ended-unsold">Ended - Unsold</option>
                <option value="payment-requested">Payment Requested</option>
                <option value="fully-paid-sold">Fully Paid - Sold</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap cursor-pointer"
              >
                <XIcon className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
              >
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

