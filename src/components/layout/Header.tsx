import { useState, useRef, useEffect } from 'react'
import { UserIcon } from '../icons/Icons'
import SearchBar from '../ui/SearchBar'
import NotificationBell from '../ui/NotificationBell'
import LanguageSwitcher from '../LanguageSwitcher'

/**
 * Header component props
 */
export interface HeaderProps {
  onNotificationClick?: () => void
  notificationCount?: number
}

/**
 * Header component with search, language switcher, notifications, and profile
 */
export default function Header({ onNotificationClick, notificationCount = 3 }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
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

  return (
    <header className="flex flex-wrap items-center  bg-red-500 justify-between gap-3 px-3 sm:px-4 md:px-6 py-3 md:py-4">
      {/* Search Bar */}
      <div className="w-full min-w-0 sm:flex-1 sm:max-w-md">
        <SearchBar placeholder="Search" />
      </div>

      {/* Right Side Actions */}
      <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-3 md:gap-4">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications Bell */}
        <div className="bg-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
          <NotificationBell count={notificationCount} onClick={onNotificationClick} />
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
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white">
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
                  Profile
                </button>
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  role="menuitem"
                >
                  Settings
                </button>
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

