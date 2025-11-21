import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getVendorDetailById } from '../data/mockVendorDetails'
import type { VendorDetailData } from '../types/vendorDetails'
import { ProductCard, type ProductCardProps } from '../components/products/ProductCard'

interface FilterState {
  search: string
  category: string
  price: string
}

const SearchIcon = ({ className = 'h-4 w-4 text-[#8F95B2]' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.4}
      d="M14.583 14.583L12.25 12.25m1.75-3.5a4.667 4.667 0 11-9.333 0 4.667 4.667 0 019.333 0z"
    />
  </svg>
)

const ChevronDown = ({ className = 'h-3.5 w-3.5 text-[#6B7280]' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor">
    <path d="M12 6 8 10 4 6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function AllVendorProducts() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const locationVendor = (location.state as { vendor?: VendorDetailData })?.vendor

  const [vendor, setVendor] = useState<VendorDetailData | null>(locationVendor ?? null)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'Categories',
    price: 'Price',
  })

  useEffect(() => {
    if (!vendor && id) {
      const detail = getVendorDetailById(Number(id))
      if (!detail) {
        navigate('/vendors', { replace: true })
        return
      }
      setVendor(detail)
    }
  }, [id, vendor, navigate])

  const products = useMemo(() => {
    if (!vendor) return []
    return vendor.services.map((service, index) => ({
      ...service,
      timeLeft:
        service.badge ??
        (service.orders ? `${service.orders} Left` : index % 2 === 0 ? '14 Left' : '1d Left'),
      image:
        service.image ??
        (index % 2 === 0
          ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&fit=crop'
          : 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=900&fit=crop'),
      description:
        service.description ??
        'Crafted with premium leather, these wallets are built with precision and are available in various colors and designs.',
      category: service.category ?? 'Accessories →Wallet',
      price: service.price ?? '$120',
    }))
  }, [vendor])

  const categories = useMemo(
    () => ['Categories', ...new Set(products.map((product) => product.category))],
    [products]
  )

  const filteredProducts = useMemo(() => {
    const toAmount = (value: string) => parseFloat(value.replace(/[^0-9.]/g, '')) || 0

    const sorted = [...products].sort((a, b) => {
      if (filters.price === 'Low to High') {
        return toAmount(a.price) - toAmount(b.price)
      }
      if (filters.price === 'High to Low') {
        return toAmount(b.price) - toAmount(a.price)
      }
      return 0
    })

    return sorted.filter((product) => {
      const matchesCategory = filters.category === 'Categories' || product.category === filters.category
      const query = filters.search.trim().toLowerCase()
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [products, filters])

  if (!vendor) {
    return null
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[#1F2937] sm:text-[28px]">All Vendor Product</h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-[#DFE3EE] bg-white px-4 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F3F4F6] cursor-pointer"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M12 5l-5 5 5 5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="flex w-full flex-col gap-3 sm:max-w-[520px] sm:flex-row sm:items-center sm:justify-end sm:gap-4">
          <div className="relative w-full sm:w-auto sm:min-w-[160px]">
            <select
              value={filters.category}
              onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
              className="appearance-none rounded-lg border border-[#E3E6F0] bg-white px-4 pr-10 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:border-[#D1D5DB] focus:outline-none w-full cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {/* Chevron Icon */}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3">
              <ChevronDown className="h-4 w-4 text-[#6B7280]" />
            </span>
          </div>

          <div className="relative w-full sm:w-auto sm:min-w-[160px]">
            <select
              value={filters.price}
              onChange={(event) => setFilters((prev) => ({ ...prev, price: event.target.value }))}
              className="appearance-none rounded-lg border border-[#E3E6F0] bg-white px-4 pr-10 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:border-[#D1D5DB] focus:outline-none w-full cursor-pointer"
            >
              <option value="Price">Price</option>
              <option value="Low to High">Low to High</option>
              <option value="High to Low">High to Low</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3">
              <ChevronDown className="h-4 w-4 text-[#6B7280]" />
            </span>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              placeholder="Search by Title"
              className="w-full rounded-lg border border-[#E3E6F0] bg-white py-3 pl-12 pr-4 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] transition-colors hover:border-[#D1D5DB] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const cardProps: ProductCardProps = {
              imageUrl: product.image ?? '',
              timeLeft:
                product.timeLeft ??
                (product.orders ? `${product.orders} Left` : '14 Left'),
              categoryPath: `Category→ ${product.category ?? 'Accessories →Wallet'}`,
              title: product.name,
              description:
                product.description ??
                'Crafted with premium leather, these wallets are built with precision and are available in various colors and designs.',
              price: product.price,
            }
            return (
              <Link
                key={product.id}
                to={`/vendor/product/${product.id}`}
                className="block w-full h-full"
              >
                <ProductCard {...cardProps} />
              </Link>
            )
          })}
          {filteredProducts.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-[#E5E7EB] bg-white py-12 text-center">
              <p className="text-lg font-semibold text-[#374151]">No products found</p>
              <p className="mt-2 text-sm text-[#6B7280]">Adjust your filters or search query to find products.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


