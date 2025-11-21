import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserIcon } from '../icons/Icons'
import SearchBar from '../ui/SearchBar'
import NotificationBell from '../ui/NotificationBell'
import LanguageSwitcher from '../LanguageSwitcher'
import NotificationsPopup from '../dashboard/NotificationsPopup'
import { useTranslation } from '../../hooks/useTranslation'
import { useSidebar } from '../../contexts/SidebarContext'

/**
 * TopBar component with search, language switcher, notifications, and profile
 */
export default function TopBar() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isMobileOpen, setIsMobileOpen } = useSidebar()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('isAuthenticated')
    setIsProfileOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* Mobile: Hamburger button fixed on left top */}
      {!isMobileOpen && (
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="fixed left-4 top-4 z-50 rounded-lg bg-[#5C54A4] p-2 text-white md:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      <header className="flex flex-col md:flex-row w-full items-center justify-between gap-3 px-3 sm:px-4 md:px-6 py-3 md:py-4">
        {/* Desktop: Search Bar (first) */}
        <div className="hidden md:block w-full md:flex-1 md:min-w-0 md:max-w-md order-1">
          <SearchBar placeholder={t('search')} />
        </div>

        {/* Right Side Actions (Language, Bell, Profile) */}
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:justify-start sm:gap-3 md:gap-4 md:order-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications Bell */}
          <div className="bg-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex
           items-center justify-center flex-shrink-0">
            <NotificationBell count={3} onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} />
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-lg px-2 sm:px-3 py-2 text-gray-600 hover:bg-gray-100"
              aria-label="Profile menu"
              aria-expanded={isProfileOpen}
            >
              <div className="flex h-9 w-9 cursor-pointer sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white">
                <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="py-1" role="menu">
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    role="menuitem"
                  >
                    {t('profile')}
                  </button>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    role="menuitem"
                  >
                    {t('settings')}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    role="menuitem"
                  >
                    {t('logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: Search Bar (below actions) */}
        <div className="w-full md:hidden order-3">
          <SearchBar placeholder={t('search')} />
        </div>
      </header>

      {/* Notifications Popup */}
      {isNotificationsOpen && (
        <NotificationsPopup onClose={() => setIsNotificationsOpen(false)} />
      )}
    </>
  )
}

