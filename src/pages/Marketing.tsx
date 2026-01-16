import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MarketingFilterTabs, { type MarketingFilterKey } from '../components/marketing/MarketingFilterTabs'
import StoryHighlightTable, { type StoryHighlight } from '../components/marketing/StoryHighlightTable'
import BannersTable, { type Banner } from '../components/marketing/BannersTable'
import PopupsTable, { type Popup } from '../components/marketing/PopupsTable'
import ProductsTable, { type Product } from '../components/marketing/ProductsTable'
import PushNotificationsTable, { type PushNotification } from '../components/marketing/PushNotificationsTable'
import { type StoryHighlightActionType } from '../components/marketing/StoryHighlightActionMenu'
import { type BannerActionType } from '../components/marketing/BannersActionMenu'
import { type PopupActionType } from '../components/marketing/PopupsActionMenu'
import { type ProductActionType } from '../components/marketing/ProductsActionMenu'
import { type PushNotificationActionType } from '../components/marketing/PushNotificationsActionMenu'
import FilterDropdown from '../components/finance/FilterDropdown'
import SearchBar from '../components/ui/SearchBar'
import { CalendarIcon, PlusIcon, FilterIcon, XIcon } from '../components/icons/Icons'
import { storyHighlightsApi, type StoryHighlight as ApiStoryHighlight } from '../services/story-highlights.api'
import { bannersApi, type Banner as ApiBanner } from '../services/banners.api'
import { popupsApi, type Popup as ApiPopup } from '../services/popups.api'
import { featuredProductsApi, type FeaturedProduct as ApiFeaturedProduct } from '../services/featured-products.api'
import { type MarketingStatus } from '../components/marketing/MarketingStatusBadge'

// Helper function to format date from ISO string to "DD MMM YYYY"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

// Helper function to convert API story highlight to UI story highlight
const convertApiToUI = (apiHighlight: ApiStoryHighlight): StoryHighlight => {
  return {
    id: apiHighlight.id,
    thumbnail: apiHighlight.thumbnailUrl || (apiHighlight.mediaUrls && apiHighlight.mediaUrls.length > 0 ? apiHighlight.mediaUrls[0] : ''),
    title: apiHighlight.title,
    type: apiHighlight.type === 'image' ? 'Image' : apiHighlight.type === 'video' ? 'Video' : 'Story',
    startDate: formatDate(apiHighlight.startDate),
    endDate: formatDate(apiHighlight.endDate),
    audience: apiHighlight.audience === 'user' ? 'User' : 'Vendor',
    priority: apiHighlight.priority === 'high' ? 'High' : apiHighlight.priority === 'medium' ? 'Medium' : 'Low',
    status: apiHighlight.status,
  }
}

// Helper function to normalize image URL (handle relative paths)
const normalizeImageUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  // If it's already a full URL (http/https), return as is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  // If it's a relative path starting with /, try to use it as is
  // The browser will resolve it relative to the current domain
  if (url.startsWith('/')) {
    return url
  }
  // Otherwise, prepend / to make it a root-relative path
  return `/${url}`
}

// Helper function to convert API banner to UI banner
const convertApiBannerToUI = (apiBanner: ApiBanner): Banner => {
  // Get thumbnail - prioritize thumbnailUrl, then first mediaUrl, then empty string
  let thumbnail = ''
  if (apiBanner.thumbnailUrl) {
    thumbnail = normalizeImageUrl(apiBanner.thumbnailUrl)
  } else if (apiBanner.mediaUrls && Array.isArray(apiBanner.mediaUrls) && apiBanner.mediaUrls.length > 0) {
    thumbnail = normalizeImageUrl(apiBanner.mediaUrls[0])
  }
  
  return {
    id: apiBanner.id,
    thumbnail: thumbnail,
    title: apiBanner.title,
    type: apiBanner.type === 'image' ? 'Image' : 'Video',
    startDate: formatDate(apiBanner.startDate),
    endDate: formatDate(apiBanner.endDate),
    audience: apiBanner.audience === 'user' ? 'User' : 'Vendor',
    priority: apiBanner.priority === 'high' ? 'High' : apiBanner.priority === 'medium' ? 'Medium' : 'Low',
    status: apiBanner.status,
  }
}

// Helper function to convert API popup to UI popup
const convertApiPopupToUI = (apiPopup: ApiPopup): Popup => {
  // Use status from API (already calculated on backend)
  let status: MarketingStatus = 'scheduled'
  if (apiPopup.status === 'active') {
    status = 'active'
  } else if (apiPopup.status === 'expired') {
    status = 'expired'
  } else {
    status = 'scheduled'
  }

  return {
    id: apiPopup.id,
    imageUrl: normalizeImageUrl(apiPopup.imageUrl) || '',
    title: apiPopup.title,
    redirectType: apiPopup.redirectType === 'product' ? 'Product' : apiPopup.redirectType === 'category' ? 'Category' : 'External',
    startDate: formatDate(apiPopup.startDate),
    endDate: formatDate(apiPopup.endDate),
    priority: apiPopup.priority === 'high' ? 'High' : apiPopup.priority === 'medium' ? 'Medium' : 'Low',
    status: status,
    deviceTarget: apiPopup.deviceTarget === 'desktop' ? 'Desktop' : apiPopup.deviceTarget === 'mobile' ? 'Mobile' : 'Both',
  }
}

// Helper function to convert API featured product to UI product
const convertApiProductToUI = (apiProduct: ApiFeaturedProduct): Product => {
  return {
    id: apiProduct.id,
    product: apiProduct.product.title,
    vendor: 'Super Admin', // Featured products are always super admin products
    category: apiProduct.product.categories && apiProduct.product.categories.length > 0 
      ? apiProduct.product.categories[0]?.category?.name || 'Uncategorized'
      : 'Uncategorized',
    startDate: formatDate(apiProduct.startDate),
    endDate: formatDate(apiProduct.endDate),
    priority: apiProduct.priority === 'high' ? 'High' : apiProduct.priority === 'medium' ? 'Medium' : 'Low',
    status: apiProduct.status === 'active' ? 'active' : apiProduct.status === 'scheduled' ? 'scheduled' : 'expired',
  }
}

// Mock data for push notifications
const MOCK_PUSH_NOTIFICATIONS: PushNotification[] = [
  {
    id: '1',
    name: 'Touseef Ahmed',
    title: 'Flash Sale',
    audience: 'Vendor',
    category: 'Promo',
    deliveryTime: 'Immediate',
    priority: 'High',
    status: 'sent',
  },
  {
    id: '2',
    name: 'Qasim Muneer',
    title: 'Payment Reminder',
    audience: 'User',
    category: 'Reminder',
    deliveryTime: 'Dec 22, 2024 at...',
    priority: 'Medium',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Yasir Hafeez',
    title: 'System Maintenance',
    audience: 'User',
    category: '$160',
    deliveryTime: 'Immediate',
    priority: 'Low',
    status: 'sent',
  },
  {
    id: '4',
    name: 'Junaid Akhtar Butt',
    title: 'Flash Sale',
    audience: 'Vendor',
    category: 'Info',
    deliveryTime: 'Dec 22, 2024 at...',
    priority: 'High',
    status: 'scheduled',
  },
  {
    id: '5',
    name: 'Yasir Hafeez',
    title: 'System Maintenance',
    audience: 'User',
    category: 'Promo',
    deliveryTime: 'Immediate',
    priority: 'High',
    status: 'sent',
  },
  {
    id: '6',
    name: 'Yasir Hafeez',
    title: 'Flash Sale',
    audience: 'User',
    category: 'Reminder',
    deliveryTime: 'Immediate',
    priority: 'High',
    status: 'expired',
  },
  // Add more mock data to reach 47 total
  // Distribution: 6 sent, 6 scheduled, 6 expired, 6 pending
  ...Array.from({ length: 41 }, (_, i) => {
    let status: 'sent' | 'scheduled' | 'expired' | 'pending' = 'sent'
    // First 1: sent (to reach 6 total)
    if (i < 1) {
      status = 'sent'
    }
    // Next 6: scheduled (to reach 6 total)
    else if (i < 7) {
      status = 'scheduled'
    }
    // Next 5: expired (to reach 6 total)
    else if (i < 12) {
      status = 'expired'
    }
    // Next 6: pending (to reach 6 total)
    else if (i < 18) {
      status = 'pending'
    }
    // Rest: distribute evenly
    else {
      const remainder = (i - 18) % 4
      status = remainder === 0 ? 'sent' : remainder === 1 ? 'scheduled' : remainder === 2 ? 'expired' : 'pending'
    }
    
    const names = ['Touseef Ahmed', 'Qasim Muneer', 'Yasir Hafeez', 'Junaid Akhtar Butt', 'Ahmed Ali', 'Muhammad Hassan']
    const titles = ['Flash Sale', 'Payment Reminder', 'System Maintenance', 'New Product', 'Special Offer']
    const audiences = ['Vendor', 'User']
    const categories = ['Promo', 'Reminder', 'Info', '$160', 'Category A', 'Category B']
    
    return {
      id: String(i + 7),
      name: names[i % names.length],
      title: titles[i % titles.length],
      audience: audiences[i % audiences.length],
      category: categories[i % categories.length],
      deliveryTime: i % 3 === 0 ? 'Immediate' : 'Dec 22, 2024 at...',
      priority: (i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
      status: status,
    }
  }),
]

const STATUS_BADGE_CLASS: Record<MarketingFilterKey, { active: string; inactive: string }> = {
  all: {
    active: 'bg-[#4C50A2] text-white',
    inactive: 'bg-[#4C50A2] text-white',
  },
  scheduled: {
    active: 'bg-[#FFF2D6] text-[#B76E00]',
    inactive: 'bg-[#FFF2D6] text-[#B76E00]',
  },
  active: {
    active: 'bg-[#DCF6E5] text-[#118D57]',
    inactive: 'bg-[#DCF6E5] text-[#118D57]',
  },
  expired: {
    active: 'bg-[#FFE4DE] text-[#B71D18]',
    inactive: 'bg-[#FFE4DE] text-[#B71D18]',
  },
}

/**
 * Marketing page component
 */
export default function Marketing() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab') as 'story-highlight' | 'banners' | 'pop-up' | 'push-notifications' | 'product' | null
  const [activeTab, setActiveTab] = useState<'story-highlight' | 'banners' | 'pop-up' | 'push-notifications' | 'product'>(
    tabFromUrl || 'story-highlight'
  )

  // Update URL when tab changes (but not on initial load)
  useEffect(() => {
    const currentTab = searchParams.get('tab')
    if (currentTab !== activeTab) {
      setSearchParams({ tab: activeTab }, { replace: true })
    }
  }, [activeTab, setSearchParams])

  // Update activeTab when URL changes
  useEffect(() => {
    const urlTab = searchParams.get('tab') as typeof activeTab | null
    if (urlTab && urlTab !== activeTab && ['story-highlight', 'banners', 'pop-up', 'push-notifications', 'product'].includes(urlTab)) {
      setActiveTab(urlTab)
    }
  }, [searchParams])
  const [activeFilter, setActiveFilter] = useState<MarketingFilterKey>('all')
  const [bannerActiveFilter, setBannerActiveFilter] = useState<MarketingFilterKey>('all')
  const [productActiveFilter, setProductActiveFilter] = useState<MarketingFilterKey>('all')
  const [pushNotificationFilter, setPushNotificationFilter] = useState<'all' | 'scheduled' | 'sent' | 'expired' | 'pending'>('all')
  const [searchValue, setSearchValue] = useState('')
  const [bannerSearchValue, setBannerSearchValue] = useState('')
  const [notificationSearch, setNotificationSearch] = useState('')
  const [bannerNotificationSearch, setBannerNotificationSearch] = useState('')
  const [productNotificationSearch, setProductNotificationSearch] = useState('')
  const [pushNotificationSearch, setPushNotificationSearch] = useState('')
  const [pushNotificationPage, setPushNotificationPage] = useState(1)
  const [sortBy, setSortBy] = useState('Sort By Date')
  const [bannerSortBy, setBannerSortBy] = useState('Sort By Date')
  const [audienceFilter, setAudienceFilter] = useState('All Audience')
  const [bannerAudienceFilter, setBannerAudienceFilter] = useState('All Audience')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [bannerStatusFilter, setBannerStatusFilter] = useState('All Status')
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [deleteProductName, setDeleteProductName] = useState<string>('')
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [productsError, setProductsError] = useState<string | null>(null)
  const [_totalProducts, setTotalProducts] = useState(0)
  const [totalProductsPages, setTotalProductsPages] = useState(1)

  // Story highlights state
  const [highlights, setHighlights] = useState<StoryHighlight[]>([])
  const [isLoadingHighlights, setIsLoadingHighlights] = useState(false)
  const [highlightsError, setHighlightsError] = useState<string | null>(null)
  const [highlightsPage, setHighlightsPage] = useState(1)
  const [totalHighlights, setTotalHighlights] = useState(0)
  const [totalHighlightsPages, setTotalHighlightsPages] = useState(1)

  // Banners state
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoadingBanners, setIsLoadingBanners] = useState(false)
  const [bannersError, setBannersError] = useState<string | null>(null)
  const [bannersPage, _setBannersPage] = useState(1)
  const [_totalBanners, setTotalBanners] = useState(0)
  const [_totalBannersPages, setTotalBannersPages] = useState(1)

  // Popups state
  const [popups, setPopups] = useState<Popup[]>([])
  const [isLoadingPopups, setIsLoadingPopups] = useState(false)
  const [popupsError, setPopupsError] = useState<string | null>(null)
  const [popupsPage, setPopupsPage] = useState(1)
  const [totalPopups, setTotalPopups] = useState(0)
  const [totalPopupsPages, setTotalPopupsPages] = useState(1)
  const [popupActiveFilter, setPopupActiveFilter] = useState<MarketingFilterKey>('all')
  const [popupSearchValue, setPopupSearchValue] = useState('')
  const [popupSortBy, setPopupSortBy] = useState('Sort By Date')
  const [popupStatusFilter, setPopupStatusFilter] = useState('All Status')
  const [popupDeviceFilter, setPopupDeviceFilter] = useState('All Devices')
  const [allPopupsForCounts, setAllPopupsForCounts] = useState<Popup[]>([])

  // Fetch story highlights
  useEffect(() => {
    const fetchHighlights = async () => {
      if (activeTab !== 'story-highlight') return

      setIsLoadingHighlights(true)
      setHighlightsError(null)

      try {
        const filters: any = {
          page: highlightsPage,
          limit: 10,
          sortBy: sortBy === 'Newest First' ? 'newest' : sortBy === 'Oldest First' ? 'oldest' : 'newest',
        }

        if (searchValue.trim()) {
          filters.search = searchValue.trim()
        }

        if (audienceFilter !== 'All Audience') {
          filters.audience = audienceFilter.toLowerCase()
        }

        if (statusFilter !== 'All Status') {
          const statusMap: Record<string, 'active' | 'scheduled' | 'expired'> = {
            'Active': 'active',
            'Scheduled': 'scheduled',
            'Expired': 'expired',
          }
          filters.status = statusMap[statusFilter]
        }

        if (activeFilter !== 'all') {
          filters.status = activeFilter
        }

        const response = await storyHighlightsApi.getAll(filters)
        const uiHighlights = response.data.map(convertApiToUI)
        setHighlights(uiHighlights)
        setTotalHighlights(response.pagination.total)
        setTotalHighlightsPages(response.pagination.totalPages)
      } catch (error: any) {
        console.error('Error fetching story highlights:', error)
        setHighlightsError(error.response?.data?.message || 'Failed to load story highlights')
        setHighlights([])
      } finally {
        setIsLoadingHighlights(false)
      }
    }

    fetchHighlights()
  }, [activeTab, highlightsPage, sortBy, searchValue, audienceFilter, statusFilter, activeFilter])

  // Fetch all highlights for counts (without pagination)
  const [allHighlightsForCounts, setAllHighlightsForCounts] = useState<ApiStoryHighlight[]>([])
  
  useEffect(() => {
    const fetchAllForCounts = async () => {
      if (activeTab !== 'story-highlight') return

      try {
        const response = await storyHighlightsApi.getAll({ limit: 1000 })
        setAllHighlightsForCounts(response.data)
      } catch (error) {
        console.error('Error fetching highlights for counts:', error)
      }
    }

    fetchAllForCounts()
  }, [activeTab, highlights])

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      if (activeTab !== 'banners') return

      setIsLoadingBanners(true)
      setBannersError(null)

      try {
        const filters: any = {
          page: bannersPage,
          limit: 10,
          sortBy: bannerSortBy === 'Newest First' ? 'newest' : bannerSortBy === 'Oldest First' ? 'oldest' : 'newest',
        }

        if (bannerSearchValue.trim()) {
          filters.search = bannerSearchValue.trim()
        }

        if (bannerAudienceFilter !== 'All Audience') {
          filters.audience = bannerAudienceFilter.toLowerCase()
        }

        if (bannerStatusFilter !== 'All Status') {
          const statusMap: Record<string, 'active' | 'scheduled' | 'expired'> = {
            'Active': 'active',
            'Scheduled': 'scheduled',
            'Expired': 'expired',
          }
          filters.status = statusMap[bannerStatusFilter]
        }

        if (bannerActiveFilter !== 'all') {
          filters.status = bannerActiveFilter
        }

        const response = await bannersApi.getAll(filters)
        const uiBanners = response.data.map(convertApiBannerToUI)
        setBanners(uiBanners)
        setTotalBanners(response.pagination.total)
        setTotalBannersPages(response.pagination.totalPages)
      } catch (error: any) {
        console.error('Error fetching banners:', error)
        setBannersError(error.response?.data?.message || 'Failed to load banners')
        setBanners([])
      } finally {
        setIsLoadingBanners(false)
      }
    }

    fetchBanners()
  }, [activeTab, bannersPage, bannerSortBy, bannerSearchValue, bannerAudienceFilter, bannerStatusFilter, bannerActiveFilter])

  // Fetch all banners for counts (without pagination)
  const [allBannersForCounts, setAllBannersForCounts] = useState<ApiBanner[]>([])
  
  useEffect(() => {
    const fetchAllBannersForCounts = async () => {
      if (activeTab !== 'banners') return

      try {
        const response = await bannersApi.getAll({ limit: 1000 })
        setAllBannersForCounts(response.data)
      } catch (error) {
        console.error('Error fetching banners for counts:', error)
      }
    }

    fetchAllBannersForCounts()
  }, [activeTab, banners])

  // Reset popups page when filters change
  useEffect(() => {
    if (activeTab === 'pop-up') {
      setPopupsPage(1)
    }
  }, [popupStatusFilter, popupDeviceFilter, popupActiveFilter, popupSearchValue, popupSortBy, activeTab])

  // Fetch popups
  useEffect(() => {
    const fetchPopups = async () => {
      if (activeTab !== 'pop-up') return

      setIsLoadingPopups(true)
      setPopupsError(null)

      try {
        const filters: any = {
          page: popupsPage,
          limit: 10,
          sortBy: popupSortBy === 'Newest First' ? 'newest' : popupSortBy === 'Oldest First' ? 'oldest' : 'newest',
        }

        if (popupSearchValue.trim()) {
          filters.search = popupSearchValue.trim()
        }

        // Apply status filter - prioritize dropdown filter over tab filter
        if (popupStatusFilter !== 'All Status') {
          const statusMap: Record<string, 'active' | 'scheduled' | 'expired'> = {
            'Active': 'active',
            'Scheduled': 'scheduled',
            'Expired': 'expired',
          }
          if (statusMap[popupStatusFilter]) {
            filters.status = statusMap[popupStatusFilter]
          }
        } else if (popupActiveFilter !== 'all') {
          // Fallback to tab filter if dropdown filter is not set
          const statusMap: Record<string, 'active' | 'scheduled' | 'expired'> = {
            'active': 'active',
            'scheduled': 'scheduled',
            'expired': 'expired',
          }
          if (statusMap[popupActiveFilter]) {
            filters.status = statusMap[popupActiveFilter]
          }
        }

        if (popupDeviceFilter !== 'All Devices') {
          const deviceMap: Record<string, 'desktop' | 'mobile' | 'both'> = {
            'Desktop': 'desktop',
            'Mobile': 'mobile',
            'Both': 'both',
          }
          if (deviceMap[popupDeviceFilter]) {
            filters.deviceTarget = deviceMap[popupDeviceFilter]
          }
        }

        const response = await popupsApi.getAll(filters)
        const uiPopups = response.data.map(convertApiPopupToUI)
        setPopups(uiPopups)
        setTotalPopups(response.pagination.total)
        setTotalPopupsPages(response.pagination.totalPages)
      } catch (error: any) {
        console.error('Error fetching popups:', error)
        setPopupsError(error.response?.data?.message || 'Failed to load popups')
        setPopups([])
      } finally {
        setIsLoadingPopups(false)
      }
    }

    fetchPopups()
  }, [activeTab, popupsPage, popupSortBy, popupSearchValue, popupActiveFilter, popupStatusFilter, popupDeviceFilter])

  // Fetch all popups for counts
  useEffect(() => {
    const fetchAllPopupsForCounts = async () => {
      if (activeTab !== 'pop-up') return

      try {
        const response = await popupsApi.getAll({ limit: 1000 })
        const uiPopups = response.data.map(convertApiPopupToUI)
        setAllPopupsForCounts(uiPopups)
      } catch (error) {
        console.error('Error fetching popups for counts:', error)
      }
    }

    fetchAllPopupsForCounts()
  }, [activeTab, popups])

  const filterTabsWithCounts = useMemo(
    () => {
      const allCount = allHighlightsForCounts.length
      const scheduledCount = allHighlightsForCounts.filter((h) => h.status === 'scheduled').length
      const activeCount = allHighlightsForCounts.filter((h) => h.status === 'active').length
      const expiredCount = allHighlightsForCounts.filter((h) => h.status === 'expired').length

      return [
        {
          key: 'all' as MarketingFilterKey,
          label: 'All',
          count: allCount,
          badgeClassName: STATUS_BADGE_CLASS.all,
        },
        {
          key: 'scheduled' as MarketingFilterKey,
          label: 'Scheduled',
          count: scheduledCount,
          badgeClassName: STATUS_BADGE_CLASS.scheduled,
        },
        {
          key: 'active' as MarketingFilterKey,
          label: 'Active',
          count: activeCount,
          badgeClassName: STATUS_BADGE_CLASS.active,
        },
        {
          key: 'expired' as MarketingFilterKey,
          label: 'Expired',
          count: expiredCount,
          badgeClassName: STATUS_BADGE_CLASS.expired,
        },
      ]
    },
    [allHighlightsForCounts],
  )

  // Filtered highlights are now handled by the API, but we keep this for any client-side filtering if needed
  const filteredHighlights = highlights

  const handleFilterChange = (filterKey: MarketingFilterKey) => {
    setActiveFilter(filterKey)
  }

  const handleStoryAction = async (highlight: StoryHighlight, action: StoryHighlightActionType) => {
    // Handle action selection
    if (action === 'add-story') {
      navigate('/marketing/add-story')
    } else if (action === 'edit-story') {
      navigate(`/marketing/edit-story/${highlight.id}`)
    } else if (action === 'delete-story') {
      if (window.confirm(`Are you sure you want to delete "${highlight.title}"?`)) {
        try {
          await storyHighlightsApi.delete(highlight.id)
          // Refresh highlights
          const response = await storyHighlightsApi.getAll({
            page: highlightsPage,
            limit: 10,
            sortBy: sortBy === 'Newest First' ? 'newest' : 'oldest',
          })
          const uiHighlights = response.data.map(convertApiToUI)
          setHighlights(uiHighlights)
          setTotalHighlights(response.pagination.total)
          setTotalHighlightsPages(response.pagination.totalPages)
        } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to delete story highlight')
        }
      }
    }
  }

  const handleNewHighlightClick = () => {
    navigate('/marketing/add-story')
  }

  const handleBannerAction = async (banner: Banner, action: BannerActionType) => {
    // Handle action selection
    if (action === 'add-new-banner') {
      navigate('/marketing/add-banner')
    } else if (action === 'edit-banner') {
      navigate(`/marketing/edit-banner/${banner.id}`)
    } else if (action === 'delete-banner') {
      if (window.confirm(`Are you sure you want to delete "${banner.title}"?`)) {
        try {
          await bannersApi.delete(banner.id)
          // Refresh banners
          const response = await bannersApi.getAll({
            page: bannersPage,
            limit: 10,
            sortBy: bannerSortBy === 'Newest First' ? 'newest' : 'oldest',
          })
          const uiBanners = response.data.map(convertApiBannerToUI)
          setBanners(uiBanners)
          setTotalBanners(response.pagination.total)
          setTotalBannersPages(response.pagination.totalPages)
        } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to delete banner')
        }
      }
    } else if (action === 'explore-new-offer-banner') {
      navigate(`/marketing/banner/${banner.id}`)
    }
  }

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      if (activeTab !== 'product') return

      setIsLoadingProducts(true)
      setProductsError(null)

      try {
        const filters: any = {
          page: currentPage,
          limit: 6,
          sortBy: 'newest',
        }

        if (productActiveFilter !== 'all') {
          filters.status = productActiveFilter
        }

        if (productNotificationSearch.trim()) {
          filters.search = productNotificationSearch.trim()
        }

        const result = await featuredProductsApi.getAll(filters)
        setProducts(result.data.map(convertApiProductToUI))
        setTotalProducts(result.pagination.total)
        setTotalProductsPages(result.pagination.totalPages)
      } catch (err: any) {
        console.error('Error fetching featured products:', err)
        setProductsError(err.response?.data?.message || 'Failed to load featured products')
        setProducts([])
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [activeTab, currentPage, productActiveFilter, productNotificationSearch])

  const handleProductAction = (product: Product, action: ProductActionType) => {
    // Handle action selection
    if (action === 'edit-product') {
      navigate(`/marketing/edit-product/${product.id}`)
    } else if (action === 'delete-product') {
      setDeleteProductId(product.id)
      setDeleteProductName(product.product)
    }
  }

  const handleDeleteConfirm = async () => {
    if (deleteProductId) {
      try {
        await featuredProductsApi.delete(deleteProductId)
        
        // Refetch products
        const filters: any = {
          page: currentPage,
          limit: 6,
          sortBy: 'newest',
        }

        if (productActiveFilter !== 'all') {
          filters.status = productActiveFilter
        }

        if (productNotificationSearch.trim()) {
          filters.search = productNotificationSearch.trim()
        }

        const result = await featuredProductsApi.getAll(filters)
        setProducts(result.data.map(convertApiProductToUI))
        setTotalProducts(result.pagination.total)
        setTotalProductsPages(result.pagination.totalPages)
        
        // Reset pagination if current page becomes empty
        if (currentPage > result.pagination.totalPages && result.pagination.totalPages > 0) {
          setCurrentPage(result.pagination.totalPages)
        } else if (result.pagination.totalPages === 0) {
          setCurrentPage(1)
        }
      } catch (err: any) {
        console.error('Error deleting featured product:', err)
        alert(err.response?.data?.message || 'Failed to delete featured product')
      } finally {
        // Close modal
        setDeleteProductId(null)
        setDeleteProductName('')
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteProductId(null)
    setDeleteProductName('')
  }

  const handleNewBannerClick = () => {
    navigate('/marketing/add-banner')
  }

  const handlePopupAction = async (popup: Popup, action: PopupActionType) => {
    if (action === 'view-popup') {
      navigate(`/marketing/popup/${popup.id}`)
    } else if (action === 'edit-popup') {
      navigate(`/marketing/edit-popup/${popup.id}`)
    } else if (action === 'delete-popup') {
      if (window.confirm(`Are you sure you want to delete "${popup.title}"?`)) {
        try {
          await popupsApi.delete(popup.id)
          // Refresh popups
          const response = await popupsApi.getAll({
            page: popupsPage,
            limit: 10,
            sortBy: popupSortBy === 'Newest First' ? 'newest' : 'oldest',
          })
          const uiPopups = response.data.map(convertApiPopupToUI)
          setPopups(uiPopups)
          setTotalPopups(response.pagination.total)
          setTotalPopupsPages(response.pagination.totalPages)
        } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to delete popup')
        }
      }
    }
  }

  const handleNewPopupClick = () => {
    navigate('/marketing/add-popup')
  }

  const handlePopupFilterChange = (filterKey: MarketingFilterKey) => {
    setPopupActiveFilter(filterKey)
  }

  // Popup filter tabs with counts
  const popupFilterTabsWithCounts = useMemo(
    () => {
      const allCount = allPopupsForCounts.length
      const scheduledCount = allPopupsForCounts.filter((p) => p.status === 'scheduled').length
      const activeCount = allPopupsForCounts.filter((p) => p.status === 'active').length
      const expiredCount = allPopupsForCounts.filter((p) => p.status === 'expired').length

      return [
        {
          key: 'all' as MarketingFilterKey,
          label: 'All',
          count: allCount,
          badgeClassName: STATUS_BADGE_CLASS.all,
        },
        {
          key: 'scheduled' as MarketingFilterKey,
          label: 'Scheduled',
          count: scheduledCount,
          badgeClassName: STATUS_BADGE_CLASS.scheduled,
        },
        {
          key: 'active' as MarketingFilterKey,
          label: 'Active',
          count: activeCount,
          badgeClassName: STATUS_BADGE_CLASS.active,
        },
        {
          key: 'expired' as MarketingFilterKey,
          label: 'Expired',
          count: expiredCount,
          badgeClassName: STATUS_BADGE_CLASS.expired,
        },
      ]
    },
    [allPopupsForCounts],
  )

  const filteredPopups = popups

  // Banner filter tabs with counts
  const bannerFilterTabsWithCounts = useMemo(
    () => {
      const allCount = allBannersForCounts.length
      const scheduledCount = allBannersForCounts.filter((b) => b.status === 'scheduled').length
      const activeCount = allBannersForCounts.filter((b) => b.status === 'active').length
      const expiredCount = allBannersForCounts.filter((b) => b.status === 'expired').length

      return [
        {
          key: 'all' as MarketingFilterKey,
          label: 'All',
          count: allCount,
          badgeClassName: STATUS_BADGE_CLASS.all,
        },
        {
          key: 'scheduled' as MarketingFilterKey,
          label: 'Scheduled',
          count: scheduledCount,
          badgeClassName: STATUS_BADGE_CLASS.scheduled,
        },
        {
          key: 'active' as MarketingFilterKey,
          label: 'Active',
          count: activeCount,
          badgeClassName: STATUS_BADGE_CLASS.active,
        },
        {
          key: 'expired' as MarketingFilterKey,
          label: 'Expired',
          count: expiredCount,
          badgeClassName: STATUS_BADGE_CLASS.expired,
        },
      ]
    },
    [allBannersForCounts],
  )

  // Filtered banners are now handled by the API, but we keep this for any client-side filtering if needed
  const filteredBanners = banners

  const handleBannerFilterChange = (filterKey: MarketingFilterKey) => {
    setBannerActiveFilter(filterKey)
  }

  // Product filter tabs with counts - fetch all products for counts
  const [allProductsForCounts, setAllProductsForCounts] = useState<Product[]>([])
  
  useEffect(() => {
    const fetchAllProductsForCounts = async () => {
      if (activeTab !== 'product') return
      
      try {
        const result = await featuredProductsApi.getAll({ limit: 1000 })
        setAllProductsForCounts(result.data.map(convertApiProductToUI))
      } catch (err) {
        console.error('Error fetching products for counts:', err)
      }
    }
    
    fetchAllProductsForCounts()
  }, [activeTab])

  const productFilterTabsWithCounts = useMemo(
    () => {
      const allCount = allProductsForCounts.length
      const scheduledCount = allProductsForCounts.filter((p: Product) => p.status === 'scheduled').length
      const activeCount = allProductsForCounts.filter((p: Product) => p.status === 'active').length
      const expiredCount = allProductsForCounts.filter((p: Product) => p.status === 'expired').length

      return [
        {
          key: 'all' as MarketingFilterKey,
          label: 'All',
          count: allCount,
          badgeClassName: STATUS_BADGE_CLASS.all,
        },
        {
          key: 'scheduled' as MarketingFilterKey,
          label: 'Scheduled',
          count: scheduledCount,
          badgeClassName: STATUS_BADGE_CLASS.scheduled,
        },
        {
          key: 'active' as MarketingFilterKey,
          label: 'Active',
          count: activeCount,
          badgeClassName: STATUS_BADGE_CLASS.active,
        },
        {
          key: 'expired' as MarketingFilterKey,
          label: 'Expired',
          count: expiredCount,
          badgeClassName: STATUS_BADGE_CLASS.expired,
        },
      ]
    },
    [allProductsForCounts],
  )

  const handleProductFilterChange = (filterKey: MarketingFilterKey) => {
    setProductActiveFilter(filterKey)
    setCurrentPage(1)
  }

  const handleProductPageChange = (page: number) => {
    if (page < 1 || page > totalProductsPages) return
    setCurrentPage(page)
  }

  const getProductPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (!totalProductsPages || totalProductsPages === 0) {
      return [1]
    }
    
    if (totalProductsPages <= 8) {
      for (let i = 1; i <= totalProductsPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalProductsPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalProductsPages) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalProductsPages - 2) {
        pages.push('...')
      }
      
      if (totalProductsPages > 1) {
        pages.push(totalProductsPages)
      }
    }
    
    return pages
  }


  // Push Notifications filter tabs with counts
  const pushNotificationFilterTabsWithCounts = useMemo(
    () => {
      const allCount = MOCK_PUSH_NOTIFICATIONS.length
      const scheduledCount = MOCK_PUSH_NOTIFICATIONS.filter((n) => n.status === 'scheduled').length
      const sentCount = MOCK_PUSH_NOTIFICATIONS.filter((n) => n.status === 'sent').length
      const expiredCount = MOCK_PUSH_NOTIFICATIONS.filter((n) => n.status === 'expired').length
      const pendingCount = MOCK_PUSH_NOTIFICATIONS.filter((n) => n.status === 'pending').length

      return [
        {
          key: 'all' as const,
          label: 'All',
          count: allCount,
          badgeClassName: STATUS_BADGE_CLASS.all,
        },
        {
          key: 'scheduled' as const,
          label: 'Scheduled',
          count: scheduledCount,
          badgeClassName: STATUS_BADGE_CLASS.scheduled,
        },
        {
          key: 'sent' as const,
          label: 'Send',
          count: sentCount,
          badgeClassName: STATUS_BADGE_CLASS.active, // Use active style for sent
        },
        {
          key: 'pending' as const,
          label: 'Pending',
          count: pendingCount,
          badgeClassName: STATUS_BADGE_CLASS.expired, // Use expired style for pending (red)
        },
        {
          key: 'expired' as const,
          label: 'Expired',
          count: expiredCount,
          badgeClassName: STATUS_BADGE_CLASS.expired,
        },
      ]
    },
    [],
  )

  const filteredPushNotifications = useMemo(() => {
    let result = [...MOCK_PUSH_NOTIFICATIONS]

    if (pushNotificationFilter !== 'all') {
      result = result.filter((notification) => notification.status === pushNotificationFilter)
    }

    if (pushNotificationSearch.trim()) {
      const query = pushNotificationSearch.toLowerCase()
      result = result.filter((notification) => 
        notification.name.toLowerCase().includes(query) ||
        notification.title.toLowerCase().includes(query)
      )
    }

    return result
  }, [pushNotificationFilter, pushNotificationSearch])

  const handlePushNotificationFilterChange = (filterKey: 'all' | 'scheduled' | 'sent' | 'expired' | 'pending') => {
    setPushNotificationFilter(filterKey)
    setPushNotificationPage(1)
  }

  const handlePushNotificationPageChange = (page: number) => {
    const totalPages = Math.ceil(filteredPushNotifications.length / 6)
    if (page < 1 || page > totalPages) return
    setPushNotificationPage(page)
  }

  const getPushNotificationPageNumbers = () => {
    const totalPages = Math.ceil(filteredPushNotifications.length / 6)
    const pages: (number | string)[] = []
    
    if (totalPages <= 8) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      
      if (pushNotificationPage > 3) {
        pages.push('...')
      }
      
      const start = Math.max(2, pushNotificationPage - 1)
      const end = Math.min(totalPages - 1, pushNotificationPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }
      
      if (pushNotificationPage < totalPages - 2) {
        pages.push('...')
      }
      
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const paginatedPushNotifications = useMemo(() => {
    const start = (pushNotificationPage - 1) * 6
    return filteredPushNotifications.slice(start, start + 6)
  }, [filteredPushNotifications, pushNotificationPage])

  const handlePushNotificationAction = (notification: PushNotification, action: PushNotificationActionType) => {
    // Handle action selection
    if (action === 'notification-detail') {
      // Route to appropriate detail screen based on status
      // Expired status does not have a detail screen
      if (notification.status === 'sent') {
        navigate(`/marketing/push-notification/send/${notification.id}`)
      } else if (notification.status === 'pending') {
        navigate(`/marketing/push-notification/pending/${notification.id}`)
      } else if (notification.status === 'scheduled') {
        navigate(`/marketing/push-notification/scheduled/${notification.id}`)
      }
      // Expired status: do nothing or show a message
    }
  }

  // Get breadcrumb text based on active tab
  const getBreadcrumbText = () => {
    switch (activeTab) {
      case 'story-highlight':
        return 'Dashboard - Story Highlight'
      case 'banners':
        return 'Dashboard - Banners'
      case 'pop-up':
        return 'Dashboard - Pop-Up'
      case 'push-notifications':
        return 'Dashboard - Push Notifications'
      case 'product':
        return 'Dashboard - Products'
      default:
        return 'Dashboard - Marketing'
    }
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Marketing</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{getBreadcrumbText()}</p>
      </div>

      {/* Main Navigation Bar */}
      <nav className="flex flex-nowrap items-center bg-white dark:bg-gray-800 rounded-lg gap-1 
      sm:gap-2 md:gap-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto md:overflow-x-visible md:flex-wrap transition-colors">
        <button
          type="button"
          onClick={() => {
            setActiveTab('story-highlight')
            setSearchParams({ tab: 'story-highlight' }, { replace: true })
          }}
          className={`px-2 p-2 sm:px-3  text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'story-highlight'
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          Story Highlight
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('banners')
            setSearchParams({ tab: 'banners' }, { replace: true })
          }}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'banners'
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          Banners
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('pop-up')
            setSearchParams({ tab: 'pop-up' }, { replace: true })
          }}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'pop-up'
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          Pop-Up
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('push-notifications')
            setSearchParams({ tab: 'push-notifications' }, { replace: true })
          }}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'push-notifications'
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          Push Notifications
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('product')
            setSearchParams({ tab: 'product' }, { replace: true })
          }}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'product'
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          Product
        </button>
      </nav>

      {/* Story Highlight Section */}
      {activeTab === 'story-highlight' && (
        <div className="space-y-4 md:space-y-6">
          {/* Section Title and Filtering Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
            {/* Section Title */}
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">Story Highlight</h2>

            {/* Filtering and Search Controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 flex-1">
              <FilterDropdown
                label={sortBy}
                options={['Sort By Date', 'Newest First', 'Oldest First']}
                onSelect={(value) => setSortBy(value)}
                icon={<CalendarIcon className="h-4 w-4" />}
                className="w-full sm:w-auto"
              />
              <FilterDropdown
                label={audienceFilter}
                options={['All Audience', 'User', 'Vendor']}
                onSelect={(value) => setAudienceFilter(value)}
                className="w-full sm:w-auto"
              />
              <FilterDropdown
                label={statusFilter}
                options={['All Status', 'Active', 'Scheduled', 'Expired']}
                onSelect={(value) => setStatusFilter(value)}
                className="w-full sm:w-auto"
              />
              <SearchBar
                placeholder="Search by Title"
                value={searchValue}
                onChange={setSearchValue}
                className="w-full sm:min-w-[220px] sm:min-w-[240px]"
              />
            </div>

            {/* New Highlight Button */}
            <button
              type="button"
              onClick={handleNewHighlightClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" />
              New Highlight
            </button>
          </div>

          {/* Data Table */}
          <section className="rounded-xl bg-white shadow-sm">
            {/* Status Tabs and Search/Filter Controls - Inside Table Section */}
            <div className="flex flex-col gap-4 border-b border-gray-200 px-4 pt-3 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 w-full sm:w-auto">
                <MarketingFilterTabs tabs={filterTabsWithCounts} activeTab={activeFilter} onTabChange={handleFilterChange} />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                <SearchBar
                  placeholder="Search Notification #"
                  value={notificationSearch}
                  onChange={setNotificationSearch}
                  className="w-full sm:min-w-[220px] sm:min-w-[240px]"
                />
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                >
                  <FilterIcon className="h-4 w-4" />
                  Filter
                </button>
              </div>
            </div>
            <div className="py-2">
              {isLoadingHighlights ? (
                <div className="flex min-h-[240px] items-center justify-center">
                  <p className="text-gray-500">Loading story highlights...</p>
                </div>
              ) : highlightsError ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50 py-12 text-center">
                  <p className="text-base font-semibold text-red-800">Error loading story highlights</p>
                  <p className="mt-1 max-w-sm text-sm text-red-600">{highlightsError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <StoryHighlightTable highlights={filteredHighlights} onActionSelect={handleStoryAction} />
                  {totalHighlightsPages > 1 && (
                    <div className="mt-4 flex items-center justify-between px-4 sm:px-6">
                      <div className="text-sm text-gray-700">
                        Showing {((highlightsPage - 1) * 10) + 1} to {Math.min(highlightsPage * 10, totalHighlights)} of {totalHighlights} results
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setHighlightsPage((p) => Math.max(1, p - 1))}
                          disabled={highlightsPage === 1}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setHighlightsPage((p) => Math.min(totalHighlightsPages, p + 1))}
                          disabled={highlightsPage >= totalHighlightsPages}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Banners Section */}
      {activeTab === 'banners' && (
        <div className="space-y-4 md:space-y-6">
          {/* Section Title */}
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Banners</h2>

          {/* Filtering and Search Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 w-full sm:w-auto">
              <FilterDropdown
                label={bannerSortBy}
                options={['Sort By Date', 'Newest First', 'Oldest First']}
                onSelect={(value) => setBannerSortBy(value)}
                icon={<CalendarIcon className="h-4 w-4" />}
                className="w-full sm:w-auto"
              />
              <FilterDropdown
                label={bannerAudienceFilter}
                options={['All Audience', 'User', 'Vendor']}
                onSelect={(value) => setBannerAudienceFilter(value)}
                className="w-full sm:w-auto"
              />
              <FilterDropdown
                label={bannerStatusFilter}
                options={['All Status', 'Active', 'Scheduled', 'Expired']}
                onSelect={(value) => setBannerStatusFilter(value)}
                className="w-full sm:w-auto"
              />
              <SearchBar
                placeholder="Search by Title"
                value={bannerSearchValue}
                onChange={setBannerSearchValue}
                className="w-full sm:min-w-[220px] sm:min-w-[240px]"
              />
            </div>
            <button
              type="button"
              onClick={handleNewBannerClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" />
              Add New Banner
            </button>
          </div>

          {/* Data Table */}
          <section className="rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-colors overflow-visible">
            {/* Status Tabs and Search/Filter Controls - Inside Table Section */}
            <div className="flex flex-col gap-4 border-b border-gray-200 dark:border-gray-700 px-4 pt-3 sm:px-6 sm:flex-row sm:items-center sm:justify-between transition-colors">
              <div className="flex-1 w-full sm:w-auto">
                <MarketingFilterTabs tabs={bannerFilterTabsWithCounts} activeTab={bannerActiveFilter} onTabChange={handleBannerFilterChange} />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                <SearchBar
                  placeholder="Search Notification #"
                  value={bannerNotificationSearch}
                  onChange={setBannerNotificationSearch}
                  className="w-full sm:min-w-[220px] sm:min-w-[240px]"
                />
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap cursor-pointer"
                >
                  <FilterIcon className="h-4 w-4" />
                  Filter
                </button>
              </div>
            </div>
            <div className="overflow-visible">
              {isLoadingBanners ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center py-12">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Loading banners...</p>
                </div>
              ) : bannersError ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center py-12">
                  <p className="text-sm text-red-600 dark:text-red-400">{bannersError}</p>
                </div>
              ) : (
                <BannersTable banners={filteredBanners} onActionSelect={handleBannerAction} />
              )}
            </div>
          </section>
        </div>
      )}

      {/* Products Section */}
      {activeTab === 'product' && (
        <div className="space-y-4 md:space-y-6">
          {/* Section Title */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Products</h2>
            <button
              type="button"
              onClick={() => navigate('/marketing/add-product')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" />
              Add New Product
            </button>
          </div>

          {/* Data Table Section */}
          <section className="rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-colors">
            {/* Status Tabs and Search/Filter Controls - Inside Table Section */}
            <header className="flex flex-col gap-4 border-b border-gray-200 dark:border-gray-700 px-4 pt-3 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 w-full sm:w-auto">
                <MarketingFilterTabs tabs={productFilterTabsWithCounts} activeTab={productActiveFilter} onTabChange={handleProductFilterChange} />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                <SearchBar
                  placeholder="Search Notification #"
                  value={productNotificationSearch}
                  onChange={setProductNotificationSearch}
                  className="w-full sm:min-w-[220px] sm:min-w-[240px]"
                />
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-600 whitespace-nowrap cursor-pointer"
                >
                  <FilterIcon className="h-4 w-4" />
                  Filter
                </button>
              </div>
            </header>

            {/* Table Content */}
            <div className="">
              {isLoadingProducts ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500 dark:text-gray-400">Loading products...</div>
                </div>
              ) : productsError ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-red-500 dark:text-red-400">{productsError}</div>
                </div>
              ) : (
                <ProductsTable products={products} onActionSelect={handleProductAction} />
              )}
            </div>

            {/* Pagination */}
            {!isLoadingProducts && !productsError && (
              <footer className="flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4 sm:px-6 transition-colors">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleProductPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:border-gray-900 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    &lt; Back
                  </button>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {getProductPageNumbers().map((page, index) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-500 dark:text-gray-400">
                            ...
                          </span>
                        )
                      }
                      
                      const pageNum = page as number
                      const isActive = pageNum === currentPage
                      
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handleProductPageChange(pageNum)}
                          className={`h-7 w-7 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
                            isActive
                              ? 'bg-[#4C50A2] text-white'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleProductPageChange(currentPage + 1)}
                    disabled={currentPage >= totalProductsPages}
                    className="cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:border-gray-900 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next &gt;
                  </button>
                </div>
              </footer>
            )}
          </section>
        </div>
      )}

      {/* Push Notifications Section */}
      {activeTab === 'push-notifications' && (
        <div className="space-y-4 md:space-y-6">
          {/* Section Title */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Push Notifications</h2>
            <button
              type="button"
              onClick={() => {
                navigate('/marketing/add-push-notification')
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" />
              Create New Notification
            </button>
          </div>

          {/* Data Table Section */}
          <section className="rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-colors">
            {/* Status Tabs and Search/Filter Controls - Inside Table Section */}
            <header className="flex flex-col gap-4 border-b border-gray-100 dark:border-gray-700 px-4 pt-3 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 w-full sm:w-auto">
                <nav className="flex flex-nowrap items-center pt-3 gap-1 sm:gap-2 overflow-x-auto md:overflow-x-visible md:flex-wrap">
                  {pushNotificationFilterTabsWithCounts.map((tab) => {
                    const isActive = tab.key === pushNotificationFilter

                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => handlePushNotificationFilterChange(tab.key)}
                        className={`inline-flex items-center px-2 sm:px-3 pt-1.5 pb-3 text-sm font-medium transition-colors duration-150 cursor-pointer ${
                          isActive 
                            ? 'text-[#F7931E] dark:text-[#F7931E] border-b-2 border-[#F7931E] relative z-10 -mb-px' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border-b-2 border-transparent'
                        }`}
                      >
                        <span>{tab.label}</span>
                        {typeof tab.count === 'number' && (
                          <span className={`ml-1.5 sm:ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            typeof tab.badgeClassName === 'string' 
                              ? tab.badgeClassName 
                              : isActive ? tab.badgeClassName.active : tab.badgeClassName.inactive
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </nav>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                <SearchBar
                  placeholder="Search Notification #"
                  value={pushNotificationSearch}
                  onChange={setPushNotificationSearch}
                  className="w-full sm:min-w-[220px] sm:min-w-[240px]"
                />
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-600 whitespace-nowrap cursor-pointer"
                >
                  <FilterIcon className="h-4 w-4" />
                  Filter
                </button>
              </div>
            </header>

            {/* Table Content */}
            <div className="">
              <PushNotificationsTable notifications={paginatedPushNotifications} onActionSelect={handlePushNotificationAction} />
            </div>

            {/* Pagination */}
            <footer className="flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4 sm:px-6 transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => handlePushNotificationPageChange(pushNotificationPage - 1)}
                  disabled={pushNotificationPage === 1}
                  className="cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:border-gray-900 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  &lt; Back
                </button>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {getPushNotificationPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-500 dark:text-gray-400">
                          ...
                        </span>
                      )
                    }
                    
                    const pageNum = page as number
                    const isActive = pageNum === pushNotificationPage
                    
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePushNotificationPageChange(pageNum)}
                        className={`h-7 w-7 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
                          isActive
                            ? 'bg-[#4C50A2] text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => handlePushNotificationPageChange(pushNotificationPage + 1)}
                  disabled={pushNotificationPage >= Math.ceil(filteredPushNotifications.length / 6)}
                  className="cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:border-gray-900 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next &gt;
                </button>
              </div>
            </footer>
          </section>
        </div>
      )}

      {/* Popups Section */}
      {activeTab === 'pop-up' && (
        <div className="space-y-4 md:space-y-6">
          {/* Section Title */}
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Popups</h2>

          {/* Filtering and Search Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 w-full sm:w-auto">
              <FilterDropdown
                label={popupSortBy}
                options={['Sort By Date', 'Newest First', 'Oldest First']}
                onSelect={(value) => setPopupSortBy(value)}
                icon={<CalendarIcon className="h-4 w-4" />}
                className="w-full sm:w-auto"
              />
              <FilterDropdown
                label={popupStatusFilter}
                options={['All Status', 'Active', 'Scheduled', 'Expired']}
                onSelect={(value) => setPopupStatusFilter(value)}
                className="w-full sm:w-auto"
              />
              <FilterDropdown
                label={popupDeviceFilter}
                options={['All Devices', 'Desktop', 'Mobile', 'Both']}
                onSelect={(value) => setPopupDeviceFilter(value)}
                className="w-full sm:w-auto"
              />
              <SearchBar
                placeholder="Search by Title"
                value={popupSearchValue}
                onChange={setPopupSearchValue}
                className="w-full sm:min-w-[220px] sm:min-w-[240px]"
              />
            </div>
            <button
              type="button"
              onClick={handleNewPopupClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" />
              Add New Popup
            </button>
          </div>

          {/* Filter Tabs */}
          <section className="rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-colors overflow-visible">
            <div className="flex flex-col gap-4 p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <MarketingFilterTabs tabs={popupFilterTabsWithCounts} activeTab={popupActiveFilter} onTabChange={handlePopupFilterChange} />
                </div>
              </div>
              <div className="py-2">
                {isLoadingPopups ? (
                  <div className="flex min-h-[240px] items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Loading popups...</p>
                  </div>
                ) : popupsError ? (
                  <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 py-12 text-center">
                    <p className="text-base font-semibold text-red-800 dark:text-red-200">Error loading popups</p>
                    <p className="mt-1 max-w-sm text-sm text-red-600 dark:text-red-400">{popupsError}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    <PopupsTable popups={filteredPopups} onActionSelect={handlePopupAction} />
                    {totalPopupsPages > 1 && (
                      <div className="mt-4 flex items-center justify-between px-4 sm:px-6">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          Showing {((popupsPage - 1) * 10) + 1} to {Math.min(popupsPage * 10, totalPopups)} of {totalPopups} results
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPopupsPage((p) => Math.max(1, p - 1))}
                            disabled={popupsPage === 1}
                            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setPopupsPage((p) => Math.min(totalPopupsPages, p + 1))}
                            disabled={popupsPage >= totalPopupsPages}
                            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab !== 'story-highlight' && activeTab !== 'banners' && activeTab !== 'pop-up' && activeTab !== 'product' && activeTab !== 'push-notifications' && (
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm p-8 text-center transition-colors">
          <p className="text-gray-500 dark:text-gray-400">{String(activeTab).charAt(0).toUpperCase() + String(activeTab).slice(1)} section coming soon</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProductId && (
        <DeleteConfirmationModal
          productName={deleteProductName}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
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
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 relative">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Delete Product</h2>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-gray-100">"{productName}"</span>?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This action cannot be undone. The product will be permanently removed from the system.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
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

