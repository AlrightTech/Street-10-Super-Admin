import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { vendorsApi } from '../services/vendors.api'
import { ordersApi, type Order } from '../services/orders.api'
import { productsApi, type Product } from '../services/products.api'
import type { VendorDetailData, VendorServiceItem } from '../types/vendorDetails'
import { useTranslation } from '../hooks/useTranslation'

const MetricDocIcon = ({ gradient }: { gradient: string }) => (
  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${gradient} text-white sm:h-12 sm:w-12`}>
    <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8 4h8l4 4v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8 4v18M12 14h4M12 10h4" />
    </svg>
  </div>
)

const RatingChart = () => {
  const bars = [10, 18, 28, 22, 26, 18, 20]
  return (
    <div className="flex items-end gap-[3px]">
      {bars.map((height, index) => (
        <span
          key={index}
          className="w-1 rounded-full bg-gradient-to-t from-[#2563EB] to-[#A855F7]"
          style={{ height }}
        />
      ))}
    </div>
  )
}

function openDocumentUrl(url: string) {
  if (url.startsWith('data:')) {
    try {
      const parts = url.split(',')
      const mime = parts[0].match(/data:([^;]+)/)?.[1] || 'application/octet-stream'
      const binary = atob(parts[1] || '')
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      const blob = new Blob([bytes], { type: mime })
      const blobUrl = URL.createObjectURL(blob)
      window.open(blobUrl, '_blank')
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
    } catch {
      window.open(url, '_blank')
    }
  } else {
    window.open(url, '_blank')
  }
}

const DocumentCard = ({
  title,
  status,
  date,
  icon,
  url,
  fileName,
  translateTitle,
  translateStatus,
}: {
  title: string
  status: string
  date: string
  icon: 'doc' | 'briefcase'
  url?: string
  fileName?: string
  translateTitle: (title: string) => string
  translateStatus: (status: string) => string
}) => (
  <div className="flex h-full min-w-[280px] max-w-[320px] shrink-0 flex-col justify-between rounded-lg border border-[#E6E8F0] bg-white px-4 py-4 md:px-6 md:py-5">
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF5E6] sm:h-12 sm:w-12">
        {icon === 'doc' ? (
          <svg className="h-5 w-5 text-[#F39C12] sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M7 2h8l5 5v13a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M7 2h8v5h5" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-[#F39C12] sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 7h16v10H4V7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 7V5a3 3 0 013-3 3 3 0 013 3v2" />
          </svg>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-lg font-semibold text-[#1C1F30] sm:text-base truncate" title={title}>{translateTitle(title)}</p>
        {fileName && <p className="text-xs text-[#6B7280] truncate mt-0.5" title={fileName}>{fileName}</p>}
        <span className="text-sm font-medium text-[#22C55E]">{translateStatus(status)}</span>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between gap-2 text-sm font-medium text-[#374151] md:mt-6">
      <span>{date}</span>
      {url ? (
        <button
          type="button"
          onClick={() => openDocumentUrl(url)}
          className="inline-flex items-center gap-1 text-[#2563EB] hover:text-[#1D4ED8] hover:underline"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View
        </button>
      ) : null}
    </div>
  </div>
)

export default function VendorDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { translateStatus, translateLabel, translateTitle, translateRole, translateCategory, translateServiceName } = useTranslation()
  const [vendor, setVendor] = useState<VendorDetailData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVendor = async () => {
      if (!id) {
        navigate('/vendors', { replace: true })
        return
      }

      try {
        setLoading(true)
        let vendorIdToFetch: string = id

        // Check if id is numeric (not a UUID)
        const isNumericId = !id.includes("-") && /^\d+$/.test(id)

        if (isNumericId) {
          // Fetch vendors list to find UUID
          const vendorsResult = await vendorsApi.getAll({ page: 1, limit: 1000 })
          if (vendorsResult.data && vendorsResult.data.length > 0) {
            const vendorIdMap = new Map<number, string>()
            vendorsResult.data.forEach((v: any) => {
              try {
                if (v.id && typeof v.id === "string") {
                  const numericId =
                    parseInt(v.id.replace(/-/g, "").substring(0, 10), 16) %
                    1000000
                  vendorIdMap.set(numericId, v.id)
                }
              } catch (e) {
                console.error("Error converting vendor ID:", v.id, e)
              }
            })
            const numericId = parseInt(id)
            const uuid = vendorIdMap.get(numericId)
            if (uuid) {
              vendorIdToFetch = uuid
              console.log(`Successfully converted numeric ID ${id} to UUID: ${uuid}`)
            } else {
              throw new Error(`Vendor with ID ${id} not found`)
            }
          } else {
            throw new Error("No vendors found in the system")
          }
        }

        // Fetch vendor, orders, and products in parallel
        const [apiVendor, ordersResult, productsResult] = await Promise.all([
          vendorsApi.getById(vendorIdToFetch),
          ordersApi.getAll({ vendor_id: vendorIdToFetch, limit: 500 }).catch(() => ({ data: [] as Order[], pagination: { total: 0 } })),
          productsApi.getAll({ vendor_id: vendorIdToFetch, limit: 100 }).catch(() => ({ data: [] as Product[], pagination: { total: 0 } })),
        ])

        const orders: Order[] = ordersResult.data || []
        const products: Product[] = productsResult.data || []

        // Commission from API (vendor has commissionType + commissionValue)
        // Some backends may return commissionValue as string/undefined/NaN-like values.
        // Avoid rendering `NaN%` by parsing safely and falling back to 0.
        const rawCommissionValue =
          (apiVendor as any).commissionValue ??
          (apiVendor as any).commission_value ??
          (apiVendor as any).commission ??
          (apiVendor as any).commissionRate

        const toNumberSafe = (v: any): number => {
          if (typeof v === "number") return v
          if (typeof v === "string") return parseFloat(v.replace("%", "").trim())
          if (v && typeof v === "object") {
            // Handle common decimal/serialized forms
            // - Prisma Decimal instances
            // - { value: "15.00" } or { decimal: "15.00" } or { d: "15.00" }
            if (typeof v.toString === "function") {
              const s = v.toString()
              const n = parseFloat(String(s).replace("%", "").trim())
              if (Number.isFinite(n)) return n
            }
            const candidate =
              (v.value ?? v.decimal ?? v.d ?? v.amount ?? v.number ?? undefined) as any
            if (candidate !== undefined) return toNumberSafe(candidate)
          }
          return NaN
        }

        const parsedCommissionValue = toNumberSafe(rawCommissionValue ?? 0)
        const commissionValue = Number.isFinite(parsedCommissionValue) ? parsedCommissionValue : 0

        const commissionType =
          (apiVendor as any).commissionType ??
          (apiVendor as any).commission_type ??
          'percentage'
        const commissionRateStr =
          commissionType === 'percentage'
            ? `${commissionValue}%`
            : `QAR ${commissionValue.toFixed(2)}`

        // Total sales: sum of order totals (totalMinor is in minor units, e.g. cents)
        const totalSalesAmount = orders.reduce(
          (sum, o) => sum + parseFloat(String(o.totalMinor || 0)) / 100,
          0
        )
        const totalSalesStr = totalSalesAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })

        // Order counts for performance
        const completedStatuses = ['delivered', 'closed']
        const completedOrders = orders.filter((o) =>
          completedStatuses.includes(o.status)
        ).length
        const pendingStatuses = [
          'created',
          'paid',
          'fulfillment_pending',
          'shipped',
        ]
        const pendingOrders = orders.filter((o) =>
          pendingStatuses.includes(o.status)
        ).length

        // Order count per product (from order items)
        const orderCountByProductId: Record<string, number> = {}
        for (const order of orders) {
          for (const item of order.items || []) {
            const pid = item.productId
            if (!pid) continue
            orderCountByProductId[pid] =
              (orderCountByProductId[pid] || 0) + (item.quantity || 1)
          }
        }

        // Map products to VendorServiceItem
        const services: VendorServiceItem[] = products.map((p) => {
          const priceMajor = parseFloat(String(p.priceMinor || 0)) / 100
          const categoryName =
            p.categories?.[0]?.category?.name || '—'
          return {
            id: p.id,
            name: p.title,
            category: categoryName,
            price: `QAR ${priceMajor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            orders: String(orderCountByProductId[p.id] ?? 0),
            status: p.status || 'active',
          }
        })

        // Extract profile image from vendor or companyDocs
        const companyDocs = (apiVendor as any).companyDocs || {}
        const profileImageUrl =
          (apiVendor as any).profileImageUrl ||
          companyDocs.profileImageUrl ||
          ''
        
        // Extract owner name and business details
        const businessDetails = companyDocs.businessDetails || {}
        const ownerName = (apiVendor as any).ownerName || 
                         businessDetails.ownerName || 
                         apiVendor.user?.name || 
                         apiVendor.user?.email?.split('@')[0] || 
                         'Unknown'
        const vendorType = businessDetails.businessType || 'General'
        const addressParts = [
          businessDetails.businessAddress,
          businessDetails.city,
          businessDetails.state,
          businessDetails.zipCode,
          businessDetails.country,
        ].filter(Boolean)
        const address = addressParts.length > 0 ? addressParts.join(', ') : 'N/A'

        // Build real documents from companyDocs (no dummy data)
        const documents: VendorDetailData['documents'] = []
        const createdDate = new Date(apiVendor.createdAt).toLocaleDateString()
        const docStatus = apiVendor.status === 'approved' ? 'verified' : 'pending'
        if (companyDocs.companyRegistrationDoc?.url) {
          documents.push({
            id: 'company-registration',
            title: 'Company Registration Document',
            status: docStatus,
            date: createdDate,
            url: companyDocs.companyRegistrationDoc.url,
            fileName: companyDocs.companyRegistrationDoc.name,
          })
        }
        if (companyDocs.commercialLicense?.url) {
          documents.push({
            id: 'commercial-license',
            title: 'Commercial License',
            status: docStatus,
            date: createdDate,
            url: companyDocs.commercialLicense.url,
            fileName: companyDocs.commercialLicense.name,
          })
        }
        // If vendor has no uploaded docs, show a single placeholder card
        if (documents.length === 0) {
          documents.push({
            id: 'no-docs',
            title: 'No documents uploaded',
            status: 'pending',
            date: '—',
          })
        }

        // Transform API response to VendorDetailData format with real data
        const transformedVendor: VendorDetailData = {
          id: parseInt(apiVendor.id.replace(/-/g, "").substring(0, 10), 16) % 1000000,
          ownerName: ownerName,
          businessName: apiVendor.name || 'Unknown Business',
          email: apiVendor.email || apiVendor.user?.email || '',
          phone: apiVendor.phone || apiVendor.user?.phone || '',
          role: 'vendor',
          status: apiVendor.status === 'approved' ? 'approved' : 'pending',
          avatar: profileImageUrl,
          address,
          vendorType,
          commissionRate: commissionRateStr,
          financialInfo: {
            commissionRate: commissionRateStr,
            accountStatus: apiVendor.status === 'approved' ? 'active' : 'pending',
            totalSales: totalSalesStr,
            paymentRequest: 'None',
          },
          performance: [
            { id: '1', label: 'Total Orders', value: String(orders.length), icon: 'clipboard' },
            { id: '2', label: 'Completed Orders', value: String(completedOrders), icon: 'check' },
            { id: '3', label: 'Rating', value: '0', icon: 'star' },
            { id: '4', label: 'Pending Orders', value: String(pendingOrders), icon: 'clipboard' },
          ],
          documents,
          services,
        }

        if (transformedVendor.status !== 'approved') {
          navigate(`/vendors/vendor-request-detail/${transformedVendor.id}`, { replace: true })
          return
        }

        setVendor(transformedVendor)
      } catch (error: any) {
        console.error('Error loading vendor:', error)
        console.error('Vendor ID that failed:', id)
        // Don't show alert, just log and redirect
        // The error might be due to vendor not existing or API issue
        navigate('/vendors', { replace: true })
      } finally {
        setLoading(false)
      }
    }

    loadVendor()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading vendor data...</p>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Vendor not found</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-hidden space-y-8">
      <div>
        <h1 className="mb-5 text-2xl font-semibold text-[#1A1A1A] md:text-[28px]">Vendor Detail</h1>

        <div className="rounded-lg border border-[#E8E9EF] bg-gradient-to-r from-white via-white to-[#F4F6FB] px-4 py-5 shadow-[0_12px_35px_rgba(15,23,42,0.07)] sm:px-5 md:px-6 overflow-hidden">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="flex flex-col items-center gap-4 rounded-[18px] bg-transparent px-4 py-5 md:flex-row md:items-center md:gap-8 md:px-6 md:py-6">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-[6px] border-[#F39C12]/50 bg-white shadow-[0_14px_30px_rgba(243,156,18,0.22)] md:h-28 md:w-28">
                <img src={vendor.avatar} alt={vendor.ownerName} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <div>
                  <h2 className="text-2xl font-semibold text-[#111827] md:text-[26px] break-words">{vendor.ownerName}</h2>
                  <p className="text-base text-[#8F95B2] break-words">{translateRole(vendor.role)}</p>
                </div>
                <div className="space-y-1 text-base text-[#4B5563]">
                  <p className="break-words">{vendor.email}</p>
                  <p className="break-words">{vendor.phone}</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-lg border border-[#F0F1F5] bg-white px-4 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] md:px-10 md:py-6 overflow-hidden">
              <button
                type="button"
                onClick={() => navigate(`/vendors/${vendor.id}/edit-user-detail`, { state: { vendor } })}
                className="absolute right-2 top-2 md:right-5 md:top-1 inline-flex cursor-pointer items-center
                 gap-2 rounded-lg bg-[#F39C12] px-3 py-2 md:px-5 text-xs md:text-sm font-semibold text-white transition-colors hover:bg-[#E67E22]"
              >
                <svg className="h-3 w-3 md:h-4 md:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.6}
                    d="M16.862 5.487l1.651 1.651c.65.65.65 1.706 0 2.356L11.16 16.847a2 2 0 01-.897.52l-3.08.88a.5.5 0 01-.62-.62l.88-3.08a2 2 0 01.52-.897l7.353-7.353c.65-.65 1.706-.65 2.356 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 6l3 3" />
                </svg>
                <span className="hidden sm:inline">Edit</span>
              </button>
              <div className="grid gap-4 text-base text-[#3F4457] sm:grid-cols-2 md:gap-5 pt-8 md:pt-0">
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-semibold text-[#8991B0]">Business Name</p>
                  <p className="text-base md:text-[18px] font-semibold text-[#111827] break-words">{vendor.businessName}</p>
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-semibold text-[#8991B0]">Address</p>
                  <p className="text-base md:text-[18px] font-semibold text-[#111827] break-words">{vendor.address}</p>
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-semibold text-[#8991B0]">Vendor Type</p>
                  <p className="text-base md:text-[18px] font-semibold text-[#111827] break-words">{translateCategory(vendor.vendorType)}</p>
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-semibold  text-[#8991B0]">Commission Rate</p>
                  <p className="text-base md:text-[18px] font-semibold text-[#F39C12] break-words">{vendor.commissionRate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-[#1A1A1A] md:text-[26px]">Commission &amp; Financial Info</h2>
        <div className="mt-4 rounded-lg border border-[#F0F1F5] bg-white px-4 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:px-8 md:py-6 overflow-hidden">
          <div className="grid grid-cols-2 gap-4 border-b-2 border-gray-200 md:grid-cols-4 md:gap-8 pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-base font-semibold text-[#2C2C2C] md:text-sm">Commission Rate</p>
              <p className="text-base font-medium text-[#545454] md:text-sm break-words">{vendor.financialInfo.commissionRate}</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-base font-semibold text-[#2C2C2C] md:text-sm">Account Status</p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#22C55E] px-3 py-1 text-xs font-medium text-white md:px-4 md:text-xs">
                  {translateStatus(vendor.financialInfo.accountStatus)}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-base font-semibold text-[#2C2C2C] md:text-sm">Total Sales</p>
              <p className="text-base font-medium text-[#545454] md:text-sm break-words">{vendor.financialInfo.totalSales}</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-base font-semibold text-[#2C2C2C] md:text-sm">Payment Request</p>
              <div className="flex items-center  gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#D14343] text-xs font-semibold text-white md:h-5 md:w-5 md:text-sm">
                  {translateStatus(vendor.financialInfo.paymentRequest)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-[#1A1A1A] md:text-[26px]">Vendor Performance</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 md:gap-4">
          {vendor.performance.map((metric) => {
            const isRating = metric.icon === 'star'
            return (
              <div
                key={metric.id}
                className="flex h-full items-center justify-between rounded-lg border border-[#E6E8F0] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)] md:px-5"
              >
                <div>
                  <p className="text-base font-semibold text-[#6F7284] md:text-sm">{translateLabel(metric.label)}</p>
                  {isRating ? (
                    <p className="mt-2 flex items-center gap-2 text-[22px] font-semibold text-[#1F1F1F] md:text-[22px]">
                      <span className="text-lg md:text-base">⭐</span>
                      {metric.value}
                    </p>
                  ) : (
                    <p className="mt-2 text-[22px] font-semibold text-[#1F1F1F] md:text-[24px]">{metric.value}</p>
                  )}
                </div>
                {isRating ? (
                  <div className="flex w-10 justify-end md:w-12">
                    <RatingChart />
                  </div>
                ) : (
                  <MetricDocIcon
                    gradient={
                      metric.icon === 'clipboard'
                        ? 'bg-gradient-to-br from-[#A855F7] to-[#2563EB]'
                        : metric.icon === 'check'
                        ? 'bg-gradient-to-br from-[#34D399] to-[#0EA5E9]'
                        : 'bg-gradient-to-br from-[#FB923C] to-[#EF4444]'
                    }
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="text-[26px] font-semibold text-[#1A1A1A]">Documents &amp; Verification</h2>
        <div className="mt-4 overflow-x-auto overflow-y-hidden pb-2 -mx-1 px-1 scrollbar-thin">
          <div className="flex gap-4 w-max min-w-full">
            {vendor.documents.map((document, index) => (
              <DocumentCard
                key={document.id}
                title={document.title}
                status={document.status}
                date={document.date}
                icon={index === 2 ? 'briefcase' : 'doc'}
                url={document.url}
                fileName={document.fileName}
                translateTitle={translateTitle}
                translateStatus={translateStatus}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl sm:text-[26px] font-semibold text-[#1A1A1A]">Vendor Services/Product List</h2>
          <button
            type="button"
            onClick={() => navigate(`/vendors/${vendor.id}/products`, { state: { vendor } })}
            className="w-full sm:w-auto rounded-lg bg-[#F39C12] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#E67E22] cursor-pointer"
          >
            View All
          </button>
        </div>
        <div className="rounded-lg border border-[#ECECEC] bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="grid min-w-[600px] grid-cols-[1.4fr_1.2fr_1fr_1fr_1fr] border-b border-[#ECECEC] px-4 py-3 text-sm font-semibold text-[#6B7280] md:min-w-0 md:px-6 md:text-sm">
              <span className="pr-6">Service/Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Orders</span>
              <span>Status</span>
            </div>
            <div>
              {vendor.services.map((service) => (
                <div
                  key={service.id}
                  className="grid min-w-[600px] grid-cols-[1.4fr_1.2fr_1fr_1fr_1fr] items-center border-b border-[#F3F4F6] px-4 py-3 text-sm text-[#4B5563] last:border-b-0 md:min-w-0 md:px-6 md:text-sm"
                >
                  <span className="pr-6 font-medium text-[#111827] break-words">{translateServiceName(service.name)}</span>
                  <span className="break-words">{translateCategory(service.category)}</span>
                  <span className="break-words">{service.price}</span>
                  <span className="break-words">{service.orders}</span>
                  <span className="break-words">{translateStatus(service.status)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex sm:justify-end">
          <button
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#F39C12] px-4 py-2 sm:px-6 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#E67E22] cursor-pointer"
          >
            <svg className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M16.862 5.487l1.651 1.651c.65.65.65 1.706 0 2.356L11.16 16.847a2 2 0 01-.897.52l-3.08.88a.5.5 0 01-.62-.62l.88-3.08a2 2 0 01.52-.897l7.353-7.353c.65-.65 1.706-.65 2.356 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 6l3 3" />
            </svg>
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

