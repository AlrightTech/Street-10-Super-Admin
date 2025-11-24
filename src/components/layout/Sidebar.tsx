import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSidebar } from '../../contexts/SidebarContext'
import {
  LayoutDashboardIcon,
  UsersIcon,
  ShoppingBagIcon,
  DollarSignIcon,
  MegaphoneIcon,
  BarChart3Icon,
  SettingsIcon,
  PackageIcon,
  WalletIcon,
  FolderTreeIcon,
  ChevronDownIcon,
  GridIcon,
  CubeIcon,
} from '../icons/Icons'
import type { NavigationItem } from '../../types/navigation'
import { useTranslation } from '../../hooks/useTranslation'

/**
 * Sidebar navigation items with badges
 */
const navigationItems: Array<NavigationItem & { badge?: number; hasDropdown?: boolean }> = [
  { id: '1', label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard', active: true },
  { id: '2', label: 'Users', icon: 'Users', path: '/users' },
  { id: '3', label: 'Vendors', icon: 'ShoppingBag', path: '/vendors' },
  { id: '4', label: 'Orders', icon: 'Package', path: '/orders', badge: 34 },
  { id: '5', label: 'Finance', icon: 'DollarSign', path: '/finance', badge: 34 },
  { id: '6', label: 'Marketing', icon: 'Megaphone', path: '/marketing' },
  { id: '7', label: 'Analytics', icon: 'BarChart3', path: '/analytics' },
  { id: '8', label: 'Main Control', icon: 'Settings', path: '/main-control' },
  { id: '9', label: 'Categories', icon: 'FolderTree', path: '/categories' },
  { id: '10', label: 'Products', icon: 'Package', path: '/products', hasDropdown: true },
  { id: '11', label: 'Wallet', icon: 'Wallet', path: '/wallet' },
  { id: '12', label: 'Settings', icon: 'Settings', path: '/settings' },
]

/**
 * Icon mapping
 */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard: LayoutDashboardIcon,
  Users: UsersIcon,
  ShoppingBag: ShoppingBagIcon,
  DollarSign: DollarSignIcon,
  Megaphone: MegaphoneIcon,
  BarChart3: BarChart3Icon,
  Settings: SettingsIcon,
  Package: PackageIcon,
  Wallet: WalletIcon,
  FolderTree: FolderTreeIcon,
  Grid: GridIcon,
  Cube: CubeIcon,
}

/**
 * Sidebar component with navigation
 */
export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { translateSidebarLabel } = useTranslation()
  const { isMobileOpen, setIsMobileOpen } = useSidebar()
  const [isProductsOpen, setIsProductsOpen] = useState(false)

  // Check if any product sub-route is active
  const isBuildingProductsActive = location.pathname === '/building-products'
  const isEcommerceProductsActive = location.pathname === '/ecommerce-products'
  const isAnyProductSubRouteActive = isBuildingProductsActive || isEcommerceProductsActive
  
  // Auto-open products dropdown if on a product sub-route
  useEffect(() => {
    if (isAnyProductSubRouteActive) {
      setIsProductsOpen(true)
    }
  }, [isAnyProductSubRouteActive])

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('isAuthenticated')
    } finally {
      setIsMobileOpen(false)
      navigate('/login', { replace: true })
    }
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName]
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-[#5C54A4] transition-all duration-300 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col relative">
          {/* Close button - only show on mobile when sidebar is open */}
          {isMobileOpen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsMobileOpen(false)
              }}
              className="absolute right-4 top-4 z-[60] rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 md:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Navigation - scrollable area */}
          <nav className="flex-1 z-50 space-y-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <img 
                src="/Images/Street10-logo.png" 
                alt="Street10 logo"
                className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain mb-6 sm:mb-8 md:mb-10"
              />
            </div>
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path
              const isProductsItem = item.id === '10'
              
              if (isProductsItem) {
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProductsOpen(!isProductsOpen)
                      }}
                      className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        // Active if on /products route OR any product sub-route
                        isActive || isAnyProductSubRouteActive
                          ? 'bg-[#F7931E] text-white'
                          : 'text-white hover:bg-[#4A4458]'
                      }`}
                    >
                      <span className="text-white flex-shrink-0 relative">
                        {getIcon(item.icon)}
                        {item.badge && (
                          <span className="absolute -top-4 sm:-top-2 -right-1.5 z-10 flex h-6 w-7 sm:h-4 sm:w-4
                           items-center justify-center rounded-full 
                           bg-red-500 sm:text-[8px] font-semibold
                            leading-none text-white">
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </span>
                      <span className="flex flex-1 items-center gap-2">
                        <span className="truncate">{translateSidebarLabel(item.label)}</span>
                      </span>
                      <ChevronDownIcon 
                        className={`h-3 w-3 sm:h-4 sm:w-4 text-white flex-shrink-0 transition-transform duration-200 ${
                          isProductsOpen ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    {isProductsOpen && (
                      <div className="mt-1 space-y-1">
                        <Link
                          to="/building-products"
                          onClick={() => setIsMobileOpen(false)}
                          className={`flex items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
                            isBuildingProductsActive
                              ? 'bg-[#F7931E] text-white'
                              : 'text-white hover:bg-[#4A4458]'
                          }`}
                        >
                          <span className="text-white flex-shrink-0">
                            <GridIcon className="h-5 w-5" />
                          </span>
                          <span className="truncate">Bidding Products</span>
                        </Link>
                        <Link
                          to="/ecommerce-products"
                          onClick={() => setIsMobileOpen(false)}
                          className={`flex items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
                            isEcommerceProductsActive
                              ? 'bg-[#F7931E] text-white'
                              : 'text-white hover:bg-[#4A4458]'
                          }`}
                        >
                          <span className="text-white flex-shrink-0">
                            <CubeIcon className="h-5 w-5" />
                          </span>
                          <span className="truncate">E-commerce Products</span>
                        </Link>
                      </div>
                    )}
                  </div>
                )
              }
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F7931E] text-white'
                      : 'text-white hover:bg-[#4A4458]'
                  }`}
                >
                  <span className="text-white flex-shrink-0 relative">
                    {getIcon(item.icon)}
                    {item.badge && (
                      <span className="absolute -top-4 sm:-top-2 -right-1.5 z-10 flex h-6 w-7 sm:h-4 sm:w-4
                       items-center justify-center rounded-full 
                       bg-red-500 sm:text-[8px] font-semibold
                        leading-none text-white">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </span>
                  <span className="flex flex-1 items-center gap-2">
                    <span className="truncate">{translateSidebarLabel(item.label)}</span>
                  </span>
                  {item.hasDropdown && (
                    <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white flex-shrink-0" />
                  )}
                </Link>
              )
            })}
             <div className=" pb-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#4A4458] cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8l-4 4m0 0l4 4m-4-4h14m-6 4v1a3 3 0 006 0V7a3 3 0 00-6 0v1" />
              </svg>
              <span>{translateSidebarLabel('Logout')}</span>
            </button>
          </div>
          </nav>
         
        </div>
      </aside>

      {/* Overlay for mobile - outside sidebar to prevent interference */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}

