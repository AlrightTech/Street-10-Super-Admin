import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MarketingFilterTabs, { type MarketingFilterKey } from '../components/marketing/MarketingFilterTabs'
import StoryHighlightTable, { type StoryHighlight } from '../components/marketing/StoryHighlightTable'
import BannersTable, { type Banner } from '../components/marketing/BannersTable'
import ProductsTable, { type Product } from '../components/marketing/ProductsTable'
import PushNotificationsTable, { type PushNotification } from '../components/marketing/PushNotificationsTable'
import { type StoryHighlightActionType } from '../components/marketing/StoryHighlightActionMenu'
import { type BannerActionType } from '../components/marketing/BannersActionMenu'
import { type ProductActionType } from '../components/marketing/ProductsActionMenu'
import { type PushNotificationActionType } from '../components/marketing/PushNotificationsActionMenu'
import FilterDropdown from '../components/finance/FilterDropdown'
import SearchBar from '../components/ui/SearchBar'
import { CalendarIcon, PlusIcon, FilterIcon, XIcon } from '../components/icons/Icons'

// Mock data for story highlights
const MOCK_HIGHLIGHTS: StoryHighlight[] = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop',
    title: 'BMW',
    type: 'Story',
    startDate: '12 Aug 2025',
    endDate: '12 Aug 2025',
    audience: 'User',
    priority: 'High',
    status: 'active',
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop',
    title: 'Mercedes',
    type: 'Story',
    startDate: '12 Aug 2025',
    endDate: '12 Aug 2025',
    audience: 'Vendor',
    priority: 'High',
    status: 'active',
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=100&h=100&fit=crop',
    title: 'Panches',
    type: 'Story',
    startDate: '12 Aug 2025',
    endDate: '12 Aug 2025',
    audience: 'User',
    priority: 'Medium',
    status: 'active',
  },
  {
    id: '4',
    thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop',
    title: 'Mercedes',
    type: 'Story',
    startDate: '12 Aug 2025',
    endDate: '12 Aug 2025',
    audience: 'Vendor',
    priority: 'Medium',
    status: 'scheduled',
  },
  // Add more mock data to reach 47 total
  // We already have: 3 active, 1 scheduled
  // Need: 3 more active (total 6), 5 more scheduled (total 6), 6 expired, and 32 more for total 47
  ...Array.from({ length: 43 }, (_, i) => {
    let status: 'active' | 'scheduled' | 'expired' = 'active'
    // First 6: expired
    if (i < 6) {
      status = 'expired'
    }
    // Next 5: scheduled (to reach 6 total including the 1 above)
    else if (i < 11) {
      status = 'scheduled'
    }
    // Next 3: active (to reach 6 total including the 3 above)
    else if (i < 14) {
      status = 'active'
    }
    // Rest: distribute evenly
    else {
      const remainder = (i - 14) % 3
      status = remainder === 0 ? 'active' : remainder === 1 ? 'scheduled' : 'expired'
    }
    
    return {
      id: String(i + 5),
      thumbnail: `https://images.unsplash.com/photo-${1552519507 + i}?w=100&h=100&fit=crop`,
      title: `Story ${i + 5}`,
      type: 'Story',
      startDate: '12 Aug 2025',
      endDate: '12 Aug 2025',
      audience: i % 2 === 0 ? 'User' : 'Vendor',
      priority: (i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
      status: status,
    }
  }),
]

// Mock data for banners
const MOCK_BANNERS: Banner[] = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop',
    title: 'Explore Our New Offers',
    type: 'Image',
    startDate: '12 Aug 2025',
    endDate: '12 Aug 2025',
    audience: 'User',
    priority: 'High',
    status: 'active',
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
    title: 'Explore Our New Offers',
    type: 'Video',
    startDate: '12 Aug 2025',
    endDate: '12 Aug 2025',
    audience: 'Vendor',
    priority: 'High',
    status: 'active',
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop',
    title: 'Explore Our New Offers',
    type: 'Video',
    startDate: '12 Aug 2025',
    endDate: '12 Aug 2025',
    audience: 'User',
    priority: 'Medium',
    status: 'expired',
  },
  {
    id: '4',
    thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop',
    title: 'Explore Our New Offers',
    type: 'Image',
    startDate: '12 Aug 2025',
    endDate: '12 Aug 2025',
    audience: 'Vendor',
    priority: 'Medium',
    status: 'scheduled',
  },
  // Add more mock data to reach 47 total
  ...Array.from({ length: 43 }, (_, i) => {
    let status: 'active' | 'scheduled' | 'expired' = 'active'
    // First 6: expired
    if (i < 6) {
      status = 'expired'
    }
    // Next 5: scheduled (to reach 6 total including the 1 above)
    else if (i < 11) {
      status = 'scheduled'
    }
    // Next 3: active (to reach 6 total including the 2 above)
    else if (i < 14) {
      status = 'active'
    }
    // Rest: distribute evenly
    else {
      const remainder = (i - 14) % 3
      status = remainder === 0 ? 'active' : remainder === 1 ? 'scheduled' : 'expired'
    }
    
    return {
      id: String(i + 5),
      thumbnail: `https://images.unsplash.com/photo-${1552519507 + i}?w=100&h=100&fit=crop`,
      title: 'Explore Our New Offers',
      type: (i % 2 === 0 ? 'Image' : 'Video') as 'Image' | 'Video',
      startDate: '12 Aug 2025',
      endDate: '12 Aug 2025',
      audience: i % 2 === 0 ? 'User' : 'Vendor',
      priority: (i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
      status: status,
    }
  }),
]

// Initial mock data for products
const INITIAL_MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    product: 'Flash Sale',
    vendor: 'Vendor',
    category: 'Promo',
    startDate: 'Immediate',
    endDate: 'Immediate',
    priority: 'High',
    status: 'active',
  },
  {
    id: '2',
    product: 'Payment Reminder',
    vendor: 'User',
    category: 'Reminder',
    startDate: 'Dec 22, 2024',
    endDate: 'Dec 22, 2024',
    priority: 'Medium',
    status: 'expired',
  },
  {
    id: '3',
    product: 'System Maintenance',
    vendor: 'User',
    category: '$100',
    startDate: 'Immediate',
    endDate: 'Immediate',
    priority: 'Low',
    status: 'active',
  },
  {
    id: '4',
    product: 'Flash Sale',
    vendor: 'Vendor',
    category: 'Info',
    startDate: 'Dec 22, 2024',
    endDate: 'Dec 22, 2024',
    priority: 'High',
    status: 'scheduled',
  },
  {
    id: '5',
    product: 'System Maintenance',
    vendor: 'User',
    category: 'Promo',
    startDate: 'Immediate',
    endDate: 'Immediate',
    priority: 'High',
    status: 'active',
  },
  {
    id: '6',
    product: 'Flash Sale',
    vendor: 'User',
    category: 'Reminder',
    startDate: 'Immediate',
    endDate: 'Immediate',
    priority: 'High',
    status: 'expired',
  },
  // Add more mock data to reach 47 total
  // Distribution: 5 active (already have 3), 6 scheduled (already have 1), 6 expired (already have 2)
  // So we need: 2 more active, 5 more scheduled, 4 more expired, and 29 more with mixed statuses
  ...Array.from({ length: 41 }, (_, i) => {
    let status: 'active' | 'scheduled' | 'expired' = 'active'
    // First 2: active (to reach 5 total)
    if (i < 2) {
      status = 'active'
    }
    // Next 5: scheduled (to reach 6 total)
    else if (i < 7) {
      status = 'scheduled'
    }
    // Next 4: expired (to reach 6 total)
    else if (i < 11) {
      status = 'expired'
    }
    // Rest: distribute evenly
    else {
      const remainder = (i - 11) % 3
      status = remainder === 0 ? 'active' : remainder === 1 ? 'scheduled' : 'expired'
    }
    
    const products = ['Flash Sale', 'Payment Reminder', 'System Maintenance', 'New Product', 'Special Offer']
    const vendors = ['Vendor', 'User']
    const categories = ['Promo', 'Reminder', 'Info', '$100', 'Category A', 'Category B']
    
    return {
      id: String(i + 7),
      product: products[i % products.length],
      vendor: vendors[i % vendors.length],
      category: categories[i % categories.length],
      startDate: i % 3 === 0 ? 'Immediate' : 'Dec 22, 2024',
      endDate: i % 3 === 0 ? 'Immediate' : 'Dec 22, 2024',
      priority: (i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
      status: status,
    }
  }),
]

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
  const [activeTab, setActiveTab] = useState<'story-highlight' | 'banners' | 'pop-up' | 'push-notifications' | 'product'>('story-highlight')
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
  const [products, setProducts] = useState<Product[]>(INITIAL_MOCK_PRODUCTS)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [deleteProductName, setDeleteProductName] = useState<string>('')

  const filterTabsWithCounts = useMemo(
    () => {
      const allCount = MOCK_HIGHLIGHTS.length
      const scheduledCount = MOCK_HIGHLIGHTS.filter((h) => h.status === 'scheduled').length
      const activeCount = MOCK_HIGHLIGHTS.filter((h) => h.status === 'active').length
      const expiredCount = MOCK_HIGHLIGHTS.filter((h) => h.status === 'expired').length

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
    [],
  )

  const filteredHighlights = useMemo(() => {
    let result = [...MOCK_HIGHLIGHTS]

    if (activeFilter !== 'all') {
      result = result.filter((highlight) => highlight.status === activeFilter)
    }

    if (searchValue.trim()) {
      const query = searchValue.toLowerCase()
      result = result.filter((highlight) => highlight.title.toLowerCase().includes(query))
    }

    if (audienceFilter !== 'All Audience') {
      result = result.filter((highlight) => highlight.audience === audienceFilter)
    }

    if (statusFilter !== 'All Status') {
      const statusMap: Record<string, MarketingFilterKey> = {
        'Active': 'active',
        'Scheduled': 'scheduled',
        'Expired': 'expired',
      }
      const filterStatus = statusMap[statusFilter]
      if (filterStatus) {
        result = result.filter((highlight) => highlight.status === filterStatus)
      }
    }

    // Limit to 10 rows
    return result.slice(0, 10)
  }, [activeFilter, searchValue, audienceFilter, statusFilter])

  const handleFilterChange = (filterKey: MarketingFilterKey) => {
    setActiveFilter(filterKey)
  }

  const handleStoryAction = (highlight: StoryHighlight, action: StoryHighlightActionType) => {
    // Handle action selection
    if (action === 'add-story') {
      navigate('/marketing/add-story')
    } else if (action === 'edit-story') {
      navigate(`/marketing/edit-story/${highlight.id}`)
    }
  }

  const handleBannerAction = (banner: Banner, action: BannerActionType) => {
    // Handle action selection
    if (action === 'add-new-banner') {
      navigate('/marketing/add-banner')
    } else if (action === 'explore-new-offer-banner') {
      navigate(`/marketing/banner/${banner.id}`)
    }
  }

  const handleProductAction = (product: Product, action: ProductActionType) => {
    // Handle action selection
    if (action === 'edit-product') {
      navigate(`/marketing/edit-product/${product.id}`)
    } else if (action === 'delete-product') {
      setDeleteProductId(product.id)
      setDeleteProductName(product.product)
    }
  }

  const handleDeleteConfirm = () => {
    if (deleteProductId) {
      // Calculate remaining products before updating state
      const remainingProducts = products.filter((p) => p.id !== deleteProductId)
      const totalPages = Math.ceil(remainingProducts.length / 6)
      
      // Update products state
      setProducts(remainingProducts)
      
      // Reset pagination if current page becomes empty
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages)
      } else if (totalPages === 0) {
        setCurrentPage(1)
      }
      
      // Close modal
      setDeleteProductId(null)
      setDeleteProductName('')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteProductId(null)
    setDeleteProductName('')
  }

  const handleNewHighlightClick = () => {
    navigate('/marketing/add-story')
  }

  const handleNewBannerClick = () => {
    navigate('/marketing/add-banner')
  }

  // Banner filter tabs with counts
  const bannerFilterTabsWithCounts = useMemo(
    () => {
      const allCount = MOCK_BANNERS.length
      const scheduledCount = MOCK_BANNERS.filter((b) => b.status === 'scheduled').length
      const activeCount = MOCK_BANNERS.filter((b) => b.status === 'active').length
      const expiredCount = MOCK_BANNERS.filter((b) => b.status === 'expired').length

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
    [],
  )

  const filteredBanners = useMemo(() => {
    let result = [...MOCK_BANNERS]

    if (bannerActiveFilter !== 'all') {
      result = result.filter((banner) => banner.status === bannerActiveFilter)
    }

    if (bannerSearchValue.trim()) {
      const query = bannerSearchValue.toLowerCase()
      result = result.filter((banner) => banner.title.toLowerCase().includes(query))
    }

    if (bannerAudienceFilter !== 'All Audience') {
      result = result.filter((banner) => banner.audience === bannerAudienceFilter)
    }

    if (bannerStatusFilter !== 'All Status') {
      const statusMap: Record<string, MarketingFilterKey> = {
        'Active': 'active',
        'Scheduled': 'scheduled',
        'Expired': 'expired',
      }
      const filterStatus = statusMap[bannerStatusFilter]
      if (filterStatus) {
        result = result.filter((banner) => banner.status === filterStatus)
      }
    }

    // Limit to 8-10 rows for display
    return result.slice(0, 10)
  }, [bannerActiveFilter, bannerSearchValue, bannerAudienceFilter, bannerStatusFilter])

  const handleBannerFilterChange = (filterKey: MarketingFilterKey) => {
    setBannerActiveFilter(filterKey)
  }

  // Product filter tabs with counts
  const productFilterTabsWithCounts = useMemo(
    () => {
      const allCount = products.length
      const scheduledCount = products.filter((p: Product) => p.status === 'scheduled').length
      const activeCount = products.filter((p: Product) => p.status === 'active').length
      const expiredCount = products.filter((p: Product) => p.status === 'expired').length

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
    [],
  )

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (productActiveFilter !== 'all') {
      result = result.filter((product) => product.status === productActiveFilter)
    }

    if (productNotificationSearch.trim()) {
      const query = productNotificationSearch.toLowerCase()
      result = result.filter((product) => product.product.toLowerCase().includes(query))
    }

    return result
  }, [productActiveFilter, productNotificationSearch])

  const handleProductFilterChange = (filterKey: MarketingFilterKey) => {
    setProductActiveFilter(filterKey)
    setCurrentPage(1)
  }

  const handleProductPageChange = (page: number) => {
    const totalPages = Math.ceil(filteredProducts.length / 6)
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const getProductPageNumbers = () => {
    const totalPages = Math.ceil(filteredProducts.length / 6)
    const pages: (number | string)[] = []
    
    if (totalPages <= 8) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * 6
    return filteredProducts.slice(start, start + 6)
  }, [filteredProducts, currentPage])

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

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Marketing</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard - Finance</p>
      </div>

      {/* Main Navigation Bar */}
      <nav className="flex flex-nowrap items-center bg-white rounded-lg gap-1 
      sm:gap-2 md:gap-4 border-b
       border-gray-200 overflow-x-auto md:overflow-x-visible md:flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('story-highlight')}
          className={`px-2 p-2 sm:px-3  text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'story-highlight'
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Story Highlight
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('banners')}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'banners'
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Banners
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pop-up')}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'pop-up'
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pop-Up
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('push-notifications')}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'push-notifications'
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Push Notifications
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('product')}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'product'
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 hover:text-gray-900'
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
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">Story Highlight</h2>

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
              <StoryHighlightTable highlights={filteredHighlights} onActionSelect={handleStoryAction} />
            </div>
          </section>
        </div>
      )}

      {/* Banners Section */}
      {activeTab === 'banners' && (
        <div className="space-y-4 md:space-y-6">
          {/* Section Title */}
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Banners</h2>

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
          <section className="rounded-xl bg-white shadow-sm">
            {/* Status Tabs and Search/Filter Controls - Inside Table Section */}
            <div className="flex flex-col gap-4 border-b border-gray-200 px-4 pt-3 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
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
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                >
                  <FilterIcon className="h-4 w-4" />
                  Filter
                </button>
              </div>
            </div>
            <div className="">
              <BannersTable banners={filteredBanners} onActionSelect={handleBannerAction} />
            </div>
          </section>
        </div>
      )}

      {/* Products Section */}
      {activeTab === 'product' && (
        <div className="space-y-4 md:space-y-6">
          {/* Section Title */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Products</h2>
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
          <section className="rounded-xl bg-white shadow-sm">
            {/* Status Tabs and Search/Filter Controls - Inside Table Section */}
            <header className="flex flex-col gap-4 border-b border-gray-200 px-4 pt-3 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
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
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                >
                  <FilterIcon className="h-4 w-4" />
                  Filter
                </button>
              </div>
            </header>

            {/* Table Content */}
            <div className="">
              <ProductsTable products={paginatedProducts} onActionSelect={handleProductAction} />
            </div>

            {/* Pagination */}
            <footer className="flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => handleProductPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  &lt; Back
                </button>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {getProductPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
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
                            : 'text-gray-600 hover:bg-gray-100'
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
                  disabled={currentPage >= Math.ceil(filteredProducts.length / 6)}
                  className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next &gt;
                </button>
              </div>
            </footer>
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
          <section className="rounded-xl bg-white shadow-sm">
            {/* Status Tabs and Search/Filter Controls - Inside Table Section */}
            <header className="flex flex-col gap-4 border-b border-gray-100 px-4 pt-3 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
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
                            ? 'text-black border-b-2 border-black relative z-10 -mb-px' 
                            : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
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
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap cursor-pointer"
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
            <footer className="flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => handlePushNotificationPageChange(pushNotificationPage - 1)}
                  disabled={pushNotificationPage === 1}
                  className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  &lt; Back
                </button>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {getPushNotificationPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
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
                            : 'text-gray-600 hover:bg-gray-100'
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
                  className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next &gt;
                </button>
              </div>
            </footer>
          </section>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab !== 'story-highlight' && activeTab !== 'banners' && activeTab !== 'product' && activeTab !== 'push-notifications' && (
        <div className="rounded-xl bg-white shadow-sm p-8 text-center">
          <p className="text-gray-500">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section coming soon</p>
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
              <XIcon className="h-5 w-5" />
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

