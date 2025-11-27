import { useState, useRef, useEffect, useMemo } from 'react'
import { UploadIcon, EyeIcon, EyeOffIcon, ChevronDownIcon, CheckIcon, MegaphoneIcon, SettingsIcon, DollarSignIcon, HeadsetIcon, ProductManagementIcon, OrderManagementIcon, UsersIcon } from '../components/icons/Icons'
import TextField from '../components/ui/TextField'
import SearchBar from '../components/ui/SearchBar'
import StatusBadge from '../components/users/StatusBadge'

/**
 * Notification item interface
 */
interface NotificationItem {
  id: string
  message: string
  timestamp: string
}

/**
 * Sub Admin interface
 */
interface SubAdmin {
  id: number
  name: string
  role: string
  status: 'active' | 'pending' | 'blocked'
}

/**
 * Mock sub admins data
 */
// Generate mock sub admins data (144 entries for 8 pages with 18 per page)
const generateMockSubAdmins = (): SubAdmin[] => {
  const names = [
    'Touseef Ahmed', 'Qasim Muneer', 'Yasir Hafeez', 'Junaid Akhtar Butt',
    'Tariq Iqbal', 'Muhammed Saeed', 'Abdurrahman', 'Ahmed Ali',
    'Hassan Khan', 'Usman Malik', 'Bilal Sheikh', 'Zain Abbas',
    'Hamza Raza', 'Faisal Iqbal', 'Nadeem Ahmed', 'Shahid Hussain',
    'Imran Ali', 'Kamran Malik'
  ]
  const statuses: ('active' | 'pending' | 'blocked')[] = ['active', 'pending', 'blocked']
  
  const admins: SubAdmin[] = []
  for (let i = 1; i <= 144; i++) {
    const nameIndex = (i - 1) % names.length
    const statusIndex = (i - 1) % statuses.length
    admins.push({
      id: i,
      name: names[nameIndex],
      role: 'Math',
      status: statuses[statusIndex]
    })
  }
  
  // Set specific entries to match reference image exactly
  admins[0] = { id: 1, name: 'Touseef Ahmed', role: 'Math', status: 'active' }
  admins[1] = { id: 2, name: 'Qasim Muneer', role: 'Math', status: 'pending' }
  admins[2] = { id: 3, name: 'Yasir Hafeez', role: 'Math', status: 'blocked' }
  admins[3] = { id: 4, name: 'Junaid Akhtar Butt', role: 'Math', status: 'pending' }
  admins[4] = { id: 5, name: 'Tariq Iqbal', role: 'Math', status: 'blocked' }
  admins[5] = { id: 6, name: 'Muhammed Saeed', role: 'Math', status: 'blocked' }
  admins[6] = { id: 7, name: 'Qasim Muneer', role: 'Math', status: 'blocked' }
  admins[7] = { id: 8, name: 'Abdurrahman', role: 'Math', status: 'active' }
  admins[8] = { id: 9, name: 'Yasir Hafeez', role: 'Math', status: 'pending' }
  admins[9] = { id: 10, name: 'Yasir Hafeez', role: 'Math', status: 'blocked' }
  admins[10] = { id: 11, name: 'Yasir Hafeez', role: 'Math', status: 'active' }
  admins[11] = { id: 12, name: 'Yasir Hafeez', role: 'Math', status: 'blocked' }
  admins[12] = { id: 13, name: 'Yasir Hafeez', role: 'Math', status: 'active' }
  admins[13] = { id: 14, name: 'Yasir Hafeez', role: 'Math', status: 'pending' }
  admins[14] = { id: 15, name: 'Yasir Hafeez', role: 'Math', status: 'pending' }
  admins[15] = { id: 16, name: 'Yasir Hafeez', role: 'Math', status: 'active' }
  admins[16] = { id: 17, name: 'Yasir Hafeez', role: 'Math', status: 'pending' }
  admins[17] = { id: 18, name: 'Yasir Hafeez', role: 'Math', status: 'active' }
  
  return admins
}

const mockSubAdmins: SubAdmin[] = generateMockSubAdmins()

/**
 * Mock notifications data
 */
const mockNotifications: NotificationItem[] = [
  { id: '1', message: 'Your recent auction listing has been approved and is now live', timestamp: 'Just Now' },
  { id: '2', message: 'System update scheduled for 12:00 AM - 2:00 AM. Platform may be temporarily unavailable.', timestamp: '11:41 am - 14-April-24' },
  { id: '3', message: 'Your account has been suspended due to multiple reported violations. Contact support for more details.', timestamp: '11:41 am - 14-April-24' },
  { id: '4', message: 'Your profile verification was successful. Welcome aboard.', timestamp: '11:41 am - 14-April-24' },
  { id: '5', message: 'Auction for Toyota Corolla 2022 ends in 1 hour. Place your final bids.', timestamp: 'Just Now' },
  { id: '6', message: 'New comment on your auction listing: Is this car still under warranty?', timestamp: '11:41 am - 14-April-24' },
  { id: '7', message: 'Password changed successfully. If you did not perform this action, contact support immediately.', timestamp: '11:41 am - 14-April-24' },
  { id: '8', message: 'Congratulations. Your bid won the auction for Honda Civic 2023', timestamp: '11:41 am - 14-April-24' },
  { id: '9', message: 'Your post has been removed due to policy violations. Please review our community guidelines', timestamp: 'Just Now' },
  { id: '10', message: 'New auction listing available: Ford Mustang GT 2021. Check it out now.', timestamp: '11:41 am - 14-April-24' },
  { id: '11', message: 'Congratulations. Your bid won the auction for Honda Civic 2023', timestamp: '11:41 am - 14-April-24' },
  { id: '12', message: 'Auction for Toyota Corolla 2022 ends in 1 hour. Place your final bids.', timestamp: '11:41 am - 14-April-24' },
  { id: '13', message: 'System update scheduled for 12:00 AM - 2:00 AM. Platform may be temporarily unavailable.', timestamp: '11:41 am - 14-April-24' },
]

/**
 * Settings page component with sidebar navigation and general settings form
 */
export default function Settings() {
  const [activeSection, setActiveSection] = useState('admin-profile')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [accountPreferences, setAccountPreferences] = useState(() => {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode')
    const isDarkMode = savedDarkMode === 'true'
    return {
      darkMode: isDarkMode,
      language: localStorage.getItem('language') || '',
      timeZone: localStorage.getItem('timeZone') || '',
    }
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
  })
  const [subAdminSearch, setSubAdminSearch] = useState('')
  const [subAdminPage, setSubAdminPage] = useState(1)
  const [selectedSubAdminId] = useState<number | null>(5) // Row 5 highlighted
  const [showAddSubAdminModal, setShowAddSubAdminModal] = useState(false)
  const [addSubAdminStep, setAddSubAdminStep] = useState(1)
  const [addSubAdminForm, setAddSubAdminForm] = useState({
    fullName: 'Tousif Ahmed',
    email: 'dina.johnson@example.com',
    password: '',
    confirmPassword: '',
    status: 'active' as 'active' | 'inactive',
    selectedRoles: [] as string[],
    permissions: {
      productManagement: ['view'] as string[],
      userManagement: ['view'] as string[],
      orderManagement: ['view'] as string[],
      supportTickets: [] as string[],
    },
  })
  const [showAddSubAdminPassword, setShowAddSubAdminPassword] = useState(false)
  const [showAddSubAdminConfirmPassword, setShowAddSubAdminConfirmPassword] = useState(false)
  const [expandedPermissions, setExpandedPermissions] = useState<{ [key: string]: boolean }>({
    productManagement: false,
    userManagement: false,
    orderManagement: false,
    supportTickets: false,
  })
  const [sendInviteLink, setSendInviteLink] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [timeZoneDropdownOpen, setTimeZoneDropdownOpen] = useState(false)
  const [loginHistoryDropdownOpen, setLoginHistoryDropdownOpen] = useState(false)
  const languageDropdownRef = useRef<HTMLDivElement>(null)
  const timeZoneDropdownRef = useRef<HTMLDivElement>(null)
  const loginHistoryDropdownRef = useRef<HTMLDivElement>(null)

  const SUB_ADMIN_PAGE_SIZE = 18

  const languageOptions = ['English', 'Arabic', 'French', 'Spanish']
  const timeZoneOptions = ['UTC', 'EST', 'PST', 'GMT', 'CST']

  // Filter and paginate sub admins
  const filteredSubAdmins = useMemo(() => {
    let result = [...mockSubAdmins]
    if (subAdminSearch.trim()) {
      const query = subAdminSearch.toLowerCase()
      result = result.filter((admin) => admin.name.toLowerCase().includes(query))
    }
    return result
  }, [subAdminSearch])

  const totalSubAdminPages = Math.max(1, Math.ceil(filteredSubAdmins.length / SUB_ADMIN_PAGE_SIZE))

  const paginatedSubAdmins = useMemo(() => {
    const start = (subAdminPage - 1) * SUB_ADMIN_PAGE_SIZE
    return filteredSubAdmins.slice(start, start + SUB_ADMIN_PAGE_SIZE)
  }, [filteredSubAdmins, subAdminPage])

  const getSubAdminPageNumbers = () => {
    const totalPages = totalSubAdminPages
    const pages: (number | string)[] = []
    
    if (totalPages <= 8) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // When on page 1, show: 1, 2, 3, ..., 7, 8 (matching reference image)
      if (subAdminPage === 1) {
        pages.push(1, 2, 3, '...', totalPages - 1, totalPages)
      } else if (subAdminPage === totalPages) {
        // When on last page, show: 1, 2, ..., totalPages-2, totalPages-1, totalPages
        pages.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1)
        
        if (subAdminPage > 3) {
          pages.push('...')
        }
        
        const start = Math.max(2, subAdminPage - 1)
        const end = Math.min(totalPages - 1, subAdminPage + 1)
        
        for (let i = start; i <= end; i++) {
          if (i !== 1 && i !== totalPages) {
            pages.push(i)
          }
        }
        
        if (subAdminPage < totalPages - 2) {
          pages.push('...')
        }
        
        if (totalPages > 1) {
          pages.push(totalPages)
        }
      }
    }
    
    return pages
  }

  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSubAdminPageChange = (page: number) => {
    if (page < 1 || page > totalSubAdminPages) return
    setSubAdminPage(page)
  }

  // Apply dark mode to document
  useEffect(() => {
    if (accountPreferences.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Save to localStorage
    localStorage.setItem('darkMode', accountPreferences.darkMode.toString())
  }, [accountPreferences.darkMode])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false)
      }
      if (timeZoneDropdownRef.current && !timeZoneDropdownRef.current.contains(event.target as Node)) {
        setTimeZoneDropdownOpen(false)
      }
      if (loginHistoryDropdownRef.current && !loginHistoryDropdownRef.current.contains(event.target as Node)) {
        setLoginHistoryDropdownOpen(false)
      }
    }

    if (languageDropdownOpen || timeZoneDropdownOpen || loginHistoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [languageDropdownOpen, timeZoneDropdownOpen, loginHistoryDropdownOpen])

  const settingsSections = [
    { id: 'admin-profile', label: 'Admin Profile' },
    { id: 'notification', label: 'Notification' },
    { id: 'account-preferences', label: 'Account Preferences' },
    { id: 'security-settings', label: 'Security Settings' },
    { id: 'sub-admins', label: 'Sub Admins' },
  ]

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
  }

  const handleSaveChanges = () => {
    // Handle save logic here
    console.log('Saving changes:', formData)
  }

  const handleDeleteAccount = () => {
    // Handle delete account logic here
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...')
    }
  }

  const handleSavePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('darkMode', accountPreferences.darkMode.toString())
    localStorage.setItem('language', accountPreferences.language)
    localStorage.setItem('timeZone', accountPreferences.timeZone)
    
    // Handle save preferences logic here
    console.log('Saving preferences:', accountPreferences)
    // You can add a success notification here
    alert('Preferences saved successfully!')
  }

  const handleLogoutAllDevices = () => {
    // Handle logout from all devices logic here
    if (window.confirm('Are you sure you want to logout from all devices? This will end all active sessions.')) {
      // Mock data: Simulate logging out from all devices
      const mockDevices = [
        { id: '1', device: 'Chrome on Windows', location: 'New York, USA', lastActive: '2 hours ago' },
        { id: '2', device: 'Safari on iPhone', location: 'Los Angeles, USA', lastActive: '5 hours ago' },
        { id: '3', device: 'Firefox on Mac', location: 'London, UK', lastActive: '1 day ago' },
      ]
      
      console.log('Logging out from all devices:', mockDevices)
      
      // Simulate API call delay
      setTimeout(() => {
        alert('Successfully logged out from all devices. You will need to log in again on all devices.')
        // In a real app, you would redirect to login page or refresh the session
        // window.location.href = '/login'
      }, 500)
    }
  }

  return (
    <div className="flex flex-col min-h-full w-full">
      {/* Add New Sub Admin Screen */}
      {showAddSubAdminModal ? (
        <div className="w-full">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Users</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Dashboard &gt; Users</p>
          </div>
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Add New Sub Admin</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Create a new sub-admin and customize permissions.</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
            {/* Multi-Step Progress Indicator */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold ${
                  addSubAdminStep === 1 ? 'bg-[#F7931E] text-white' : addSubAdminStep > 1 ? 'bg-[#F7931E] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {addSubAdminStep > 1 ? (
                    <CheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  ) : (
                    '1'
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-900 mt-2">Basic Info</p>
                <p className="text-xs text-gray-500 mt-1 text-center">Personal details and credentials</p>
              </div>

              {/* Connector Line */}
              <div className={`flex-1 h-0.5 mx-2 sm:mx-4 ${addSubAdminStep >= 2 ? 'bg-[#F7931E]' : 'bg-gray-200'}`} />

              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold ${
                  addSubAdminStep === 2 ? 'bg-[#F7931E] text-white' : addSubAdminStep > 2 ? 'bg-[#F7931E] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {addSubAdminStep > 2 ? (
                    <CheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  ) : (
                    '2'
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-900 mt-2">Role Assignment</p>
                <p className="text-xs text-gray-500 mt-1 text-center">Select admin role and responsibilities</p>
              </div>

              {/* Connector Line */}
              <div className={`flex-1 h-0.5 mx-2 sm:mx-4 ${addSubAdminStep >= 3 ? 'bg-[#F7931E]' : 'bg-gray-200'}`} />

              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold ${
                  addSubAdminStep === 3 ? 'bg-[#F7931E] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-900 mt-2">Permission Control</p>
                <p className="text-xs text-gray-500 mt-1 text-center">Customize access permissions</p>
              </div>
            </div>

            {/* Step 1: Basic Information */}
            {addSubAdminStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Basic Information</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    Enter the details to create a user account and set up login credentials.
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={addSubAdminForm.fullName}
                      onChange={(e) => setAddSubAdminForm((prev) => ({ ...prev, fullName: e.target.value }))}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm placeholder:text-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-2 focus:ring-[#F7931E]/20"
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={addSubAdminForm.email}
                      onChange={(e) => setAddSubAdminForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm placeholder:text-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-2 focus:ring-[#F7931E]/20"
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showAddSubAdminPassword ? 'text' : 'password'}
                        value={addSubAdminForm.password}
                        onChange={(e) => setAddSubAdminForm((prev) => ({ ...prev, password: e.target.value }))}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 pr-10 text-sm placeholder:text-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-2 focus:ring-[#F7931E]/20"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAddSubAdminPassword(!showAddSubAdminPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                        aria-label={showAddSubAdminPassword ? 'Hide password' : 'Show password'}
                      >
                        {showAddSubAdminPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showAddSubAdminConfirmPassword ? 'text' : 'password'}
                        value={addSubAdminForm.confirmPassword}
                        onChange={(e) => setAddSubAdminForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 pr-10 text-sm placeholder:text-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-2 focus:ring-[#F7931E]/20"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAddSubAdminConfirmPassword(!showAddSubAdminConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                        aria-label={showAddSubAdminConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showAddSubAdminConfirmPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">Status</label>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          checked={addSubAdminForm.status === 'active'}
                          onChange={(e) => setAddSubAdminForm((prev) => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 border-gray-300"
                        />
                        <span className="text-xs sm:text-sm text-gray-700">Active</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="inactive"
                          checked={addSubAdminForm.status === 'inactive'}
                          onChange={(e) => setAddSubAdminForm((prev) => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                          className="w-4 h-4 text-gray-300 focus:ring-gray-300 focus:ring-2 border-gray-300"
                        />
                        <span className="text-xs sm:text-sm text-gray-700">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Role Assignment */}
            {addSubAdminStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Role Assignment</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    Select an admin role. Default permissions will be applied automatically.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Marketing Admin */}
                  <div
                    onClick={() => {
                      const roles = addSubAdminForm.selectedRoles
                      const isSelected = roles.includes('marketing')
                      setAddSubAdminForm((prev) => ({
                        ...prev,
                        selectedRoles: isSelected
                          ? roles.filter((r) => r !== 'marketing')
                          : [...roles, 'marketing'],
                      }))
                    }}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      addSubAdminForm.selectedRoles.includes('marketing')
                        ? 'border-[#F7931E] bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
                      <MegaphoneIcon className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Marketing Admin</h4>
                      <p className="text-xs text-gray-600">Manages campaigns, content, and marketing analytics.</p>
                    </div>
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={addSubAdminForm.selectedRoles.includes('marketing')}
                        onChange={() => {}}
                        className="w-5 h-5 border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Operation Admin */}
                  <div
                    onClick={() => {
                      const roles = addSubAdminForm.selectedRoles
                      const isSelected = roles.includes('operation')
                      setAddSubAdminForm((prev) => ({
                        ...prev,
                        selectedRoles: isSelected
                          ? roles.filter((r) => r !== 'operation')
                          : [...roles, 'operation'],
                      }))
                    }}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      addSubAdminForm.selectedRoles.includes('operation')
                        ? 'border-[#F7931E] bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <SettingsIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Operation Admin</h4>
                      <p className="text-xs text-gray-600">Handles products, orders, and operational tasks.</p>
                    </div>
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={addSubAdminForm.selectedRoles.includes('operation')}
                        onChange={() => {}}
                        className="w-5 h-5 border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Finance Admin */}
                  <div
                    onClick={() => {
                      const roles = addSubAdminForm.selectedRoles
                      const isSelected = roles.includes('finance')
                      setAddSubAdminForm((prev) => ({
                        ...prev,
                        selectedRoles: isSelected
                          ? roles.filter((r) => r !== 'finance')
                          : [...roles, 'finance'],
                      }))
                    }}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      addSubAdminForm.selectedRoles.includes('finance')
                        ? 'border-[#F7931E] bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <DollarSignIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Finance Admin</h4>
                      <p className="text-xs text-gray-600">Access to financial reports and budget management.</p>
                    </div>
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={addSubAdminForm.selectedRoles.includes('finance')}
                        onChange={() => {}}
                        className="w-5 h-5 border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Support Admin */}
                  <div
                    onClick={() => {
                      const roles = addSubAdminForm.selectedRoles
                      const isSelected = roles.includes('support')
                      setAddSubAdminForm((prev) => ({
                        ...prev,
                        selectedRoles: isSelected
                          ? roles.filter((r) => r !== 'support')
                          : [...roles, 'support'],
                      }))
                    }}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      addSubAdminForm.selectedRoles.includes('support')
                        ? 'border-[#F7931E] bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                      <HeadsetIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Support Admin</h4>
                      <p className="text-xs text-gray-600">Manages customer support and ticket resolution.</p>
                    </div>
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={addSubAdminForm.selectedRoles.includes('support')}
                        onChange={() => {}}
                        className="w-5 h-5 border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Permission Control */}
            {addSubAdminStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Permission Control</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    Customize access permissions for the selected role:{' '}
                    <span className="text-blue-600 underline cursor-pointer">
                      {addSubAdminForm.selectedRoles.length > 0
                        ? addSubAdminForm.selectedRoles
                            .map((role) => {
                              const roleMap: { [key: string]: string } = {
                                marketing: 'Marketing Admin',
                                operation: 'Operation Admin',
                                finance: 'Finance Admin',
                                support: 'Support Admin',
                              }
                              return roleMap[role] || role
                            })
                            .join(', ')
                        : 'Marketing Admin'}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Product Management */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ProductManagementIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Product Management</h4>
                          <p className="text-xs text-gray-600">
                            {addSubAdminForm.permissions.productManagement.length} of 4 permissions granted
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedPermissions((prev) => ({
                            ...prev,
                            productManagement: !prev.productManagement,
                          }))
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={addSubAdminForm.permissions.productManagement.length === 4}
                          onChange={() => {
                            const allPermissions = ['view', 'edit', 'delete', 'approve']
                            const current = addSubAdminForm.permissions.productManagement
                            const isAllSelected = allPermissions.every((p) => current.includes(p))
                            setAddSubAdminForm((prev) => ({
                              ...prev,
                              permissions: {
                                ...prev.permissions,
                                productManagement: isAllSelected ? [] : allPermissions,
                              },
                            }))
                          }}
                          className="w-4 h-4 border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                        />
                        <span>Select All</span>
                        <ChevronDownIcon
                          className={`h-4 w-4 text-gray-400 transition-transform ${
                            expandedPermissions.productManagement ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                    {expandedPermissions.productManagement && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { key: 'view', label: 'View Products' },
                            { key: 'edit', label: 'Edit Products' },
                            { key: 'delete', label: 'Delete Products' },
                            { key: 'approve', label: 'Approve Products' },
                          ].map((permission) => (
                            <label key={permission.key} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={addSubAdminForm.permissions.productManagement.includes(permission.key)}
                                onChange={(e) => {
                                  const current = addSubAdminForm.permissions.productManagement
                                  if (e.target.checked) {
                                    setAddSubAdminForm((prev) => ({
                                      ...prev,
                                      permissions: {
                                        ...prev.permissions,
                                        productManagement: [...current, permission.key],
                                      },
                                    }))
                                  } else {
                                    setAddSubAdminForm((prev) => ({
                                      ...prev,
                                      permissions: {
                                        ...prev.permissions,
                                        productManagement: current.filter((p) => p !== permission.key),
                                      },
                                    }))
                                  }
                                }}
                                className="w-4 h-4 border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                              />
                              <span className="text-xs sm:text-sm text-gray-700">{permission.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Management */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <UsersIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">User Management</h4>
                          <p className="text-xs text-gray-600">
                            {addSubAdminForm.permissions.userManagement.length} of 4 permissions granted
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedPermissions((prev) => ({
                            ...prev,
                            userManagement: !prev.userManagement,
                          }))
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={addSubAdminForm.permissions.userManagement.length === 4}
                          onChange={() => {
                            const allPermissions = ['view', 'edit', 'delete', 'approve']
                            const current = addSubAdminForm.permissions.userManagement
                            const isAllSelected = allPermissions.every((p) => current.includes(p))
                            setAddSubAdminForm((prev) => ({
                              ...prev,
                              permissions: {
                                ...prev.permissions,
                                userManagement: isAllSelected ? [] : allPermissions,
                              },
                            }))
                          }}
                          className="w-4 h-4 border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                        />
                        <span>Select All</span>
                        <ChevronDownIcon
                          className={`h-4 w-4 text-gray-400 transition-transform ${
                            expandedPermissions.userManagement ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                    {expandedPermissions.userManagement && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { key: 'view', label: 'View Users' },
                            { key: 'edit', label: 'Edit Users' },
                            { key: 'delete', label: 'Delete Users' },
                            { key: 'approve', label: 'Approve Users' },
                          ].map((permission) => (
                            <label key={permission.key} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={addSubAdminForm.permissions.userManagement.includes(permission.key)}
                                onChange={(e) => {
                                  const current = addSubAdminForm.permissions.userManagement
                                  if (e.target.checked) {
                                    setAddSubAdminForm((prev) => ({
                                      ...prev,
                                      permissions: {
                                        ...prev.permissions,
                                        userManagement: [...current, permission.key],
                                      },
                                    }))
                                  } else {
                                    setAddSubAdminForm((prev) => ({
                                      ...prev,
                                      permissions: {
                                        ...prev.permissions,
                                        userManagement: current.filter((p) => p !== permission.key),
                                      },
                                    }))
                                  }
                                }}
                                className="w-4 h-4 border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                              />
                              <span className="text-xs sm:text-sm text-gray-700">{permission.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Management */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <OrderManagementIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Order Management</h4>
                          <p className="text-xs text-gray-600">
                            {addSubAdminForm.permissions.orderManagement.length} of 4 permissions granted
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedPermissions((prev) => ({
                            ...prev,
                            orderManagement: !prev.orderManagement,
                          }))
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={addSubAdminForm.permissions.orderManagement.length === 4}
                          onChange={() => {
                            const allPermissions = ['view', 'edit', 'delete', 'approve']
                            const current = addSubAdminForm.permissions.orderManagement
                            const isAllSelected = allPermissions.every((p) => current.includes(p))
                            setAddSubAdminForm((prev) => ({
                              ...prev,
                              permissions: {
                                ...prev.permissions,
                                orderManagement: isAllSelected ? [] : allPermissions,
                              },
                            }))
                          }}
                          className="w-4 h-4 border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                        />
                        <span>Select All</span>
                        <ChevronDownIcon
                          className={`h-4 w-4 text-gray-400 transition-transform ${
                            expandedPermissions.orderManagement ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                    {expandedPermissions.orderManagement && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { key: 'view', label: 'View Orders' },
                            { key: 'edit', label: 'Edit Orders' },
                            { key: 'delete', label: 'Delete Orders' },
                            { key: 'approve', label: 'Approve Orders' },
                          ].map((permission) => (
                            <label key={permission.key} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={addSubAdminForm.permissions.orderManagement.includes(permission.key)}
                                onChange={(e) => {
                                  const current = addSubAdminForm.permissions.orderManagement
                                  if (e.target.checked) {
                                    setAddSubAdminForm((prev) => ({
                                      ...prev,
                                      permissions: {
                                        ...prev.permissions,
                                        orderManagement: [...current, permission.key],
                                      },
                                    }))
                                  } else {
                                    setAddSubAdminForm((prev) => ({
                                      ...prev,
                                      permissions: {
                                        ...prev.permissions,
                                        orderManagement: current.filter((p) => p !== permission.key),
                                      },
                                    }))
                                  }
                                }}
                                className="w-4 h-4 border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                              />
                              <span className="text-xs sm:text-sm text-gray-700">{permission.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Support Tickets */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <HeadsetIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Support Tickets</h4>
                          <p className="text-xs text-gray-600">
                            {addSubAdminForm.permissions.supportTickets.length} of 4 permissions granted
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedPermissions((prev) => ({
                            ...prev,
                            supportTickets: !prev.supportTickets,
                          }))
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={addSubAdminForm.permissions.supportTickets.length === 4}
                          onChange={() => {
                            const allPermissions = ['view', 'edit', 'delete', 'approve']
                            const current = addSubAdminForm.permissions.supportTickets
                            const isAllSelected = allPermissions.every((p) => current.includes(p))
                            setAddSubAdminForm((prev) => ({
                              ...prev,
                              permissions: {
                                ...prev.permissions,
                                supportTickets: isAllSelected ? [] : allPermissions,
                              },
                            }))
                          }}
                          className="w-4 h-4 border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                        />
                        <span>Select All</span>
                        <ChevronDownIcon
                          className={`h-4 w-4 text-gray-400 transition-transform ${
                            expandedPermissions.supportTickets ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                    {expandedPermissions.supportTickets && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { key: 'view', label: 'View Tickets' },
                            { key: 'edit', label: 'Edit Tickets' },
                            { key: 'delete', label: 'Delete Tickets' },
                            { key: 'approve', label: 'Approve Tickets' },
                          ].map((permission) => (
                            <label key={permission.key} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={addSubAdminForm.permissions.supportTickets.includes(permission.key)}
                                onChange={(e) => {
                                  const current = addSubAdminForm.permissions.supportTickets
                                  if (e.target.checked) {
                                    setAddSubAdminForm((prev) => ({
                                      ...prev,
                                      permissions: {
                                        ...prev.permissions,
                                        supportTickets: [...current, permission.key],
                                      },
                                    }))
                                  } else {
                                    setAddSubAdminForm((prev) => ({
                                      ...prev,
                                      permissions: {
                                        ...prev.permissions,
                                        supportTickets: current.filter((p) => p !== permission.key),
                                      },
                                    }))
                                  }
                                }}
                                className="w-4 h-4 border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                              />
                              <span className="text-xs sm:text-sm text-gray-700">{permission.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Setup Section */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Password Setup</h3>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendInviteLink}
                      onChange={(e) => setSendInviteLink(e.target.checked)}
                      className="w-4 h-4 border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">
                      Send invite link via email (user sets password later)
                    </span>
                  </label>

                  {!sendInviteLink && (
                    <>
                      <div>
                        <label htmlFor="permissionPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="permissionPassword"
                            type={showAddSubAdminPassword ? 'text' : 'password'}
                            value={addSubAdminForm.password}
                            onChange={(e) => setAddSubAdminForm((prev) => ({ ...prev, password: e.target.value }))}
                            className="block w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 pr-10 text-sm placeholder:text-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-2 focus:ring-[#F7931E]/20"
                            placeholder="Enter password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAddSubAdminPassword(!showAddSubAdminPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                            aria-label={showAddSubAdminPassword ? 'Hide password' : 'Show password'}
                          >
                            {showAddSubAdminPassword ? (
                              <EyeOffIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="permissionConfirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            id="permissionConfirmPassword"
                            type={showAddSubAdminConfirmPassword ? 'text' : 'password'}
                            value={addSubAdminForm.confirmPassword}
                            onChange={(e) => setAddSubAdminForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                            className="block w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 pr-10 text-sm placeholder:text-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-2 focus:ring-[#F7931E]/20"
                            placeholder="Confirm password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAddSubAdminConfirmPassword(!showAddSubAdminConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                            aria-label={showAddSubAdminConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            {showAddSubAdminConfirmPassword ? (
                              <EyeOffIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              {addSubAdminStep > 1 && (
                <button
                  type="button"
                  onClick={() => setAddSubAdminStep(addSubAdminStep - 1)}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 mr-3 sm:mr-4"
                >
                  Previous
                </button>
              )}
              {addSubAdminStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setAddSubAdminStep(addSubAdminStep + 1)}
                  className="bg-[#F7931E] hover:bg-[#E6851A] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 cursor-pointer"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    console.log('Submitting form:', addSubAdminForm)
                    setShowAddSubAdminModal(false)
                    setAddSubAdminStep(1)
                    setSendInviteLink(false)
                    setExpandedPermissions({
                      productManagement: false,
                      userManagement: false,
                      orderManagement: false,
                      supportTickets: false,
                    })
                    setAddSubAdminForm({
                      fullName: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                      status: 'active',
                      selectedRoles: [],
                      permissions: {
                        productManagement: [],
                        userManagement: [],
                        orderManagement: [],
                        supportTickets: [],
                      },
                    })
                  }}
                  className="bg-[#F7931E] hover:bg-[#E6851A] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 cursor-pointer"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Top Section: Heading and Action Bar */}
          {activeSection === 'sub-admins' && (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-0.5">Settings</h1>
            <p className="text-xs sm:text-sm text-gray-500">Dashboard - Sub Admin</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto sm:ml-auto">
            <div className="w-full sm:w-48 md:w-64">
              <SearchBar
                placeholder="Search by Name"
                value={subAdminSearch}
                onChange={(value) => {
                  setSubAdminSearch(value)
                  setSubAdminPage(1)
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAddSubAdminModal(true)}
              className="bg-[#F7931E] hover:bg-[#E6851A] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 cursor-pointer whitespace-nowrap w-full sm:w-auto"
            >
              +Add New
            </button>
          </div>
        </div>
          )}

      {/* Main Content: Sidebar and Table */}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 flex-1 items-start">
        {/* Left Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          {/* Header outside sidebar */}
          {activeSection !== 'sub-admins' && (
            <div className="mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-0.5">Profile Setting</h1>
              <p className="text-xs sm:text-sm text-gray-500">Dashboard - Setting</p>
            </div>
          )}
          
          {/* Sidebar Card */}
          <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm w-full">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleSectionChange(section.id)}
                  className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    activeSection === section.id
                      ? 'bg-[#F7931E] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0 w-full">
          {activeSection === 'admin-profile' && (
            <>
              <div className="bg-white rounded-lg p-3 mt-17 sm:p-4 md:p-6 lg:p-8 shadow-sm">
                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">General Settings</h2>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">Update your profile</p>
                </div>

                <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                  {/* Upload Image Section */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Upload image</label>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative group">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group-hover:border-gray-400 transition-colors">
                          <UploadIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-gray-400" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            // Handle image upload
                            const file = e.target.files?.[0]
                            if (file) {
                              console.log('Image selected:', file)
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name Field */}
                  <TextField
                    id="name"
                    label="Name"
                    type="text"
                    placeholder="Enter your name"
                    onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
                    className="w-full"
                  />

                  {/* Email Field */}
                  <TextField
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
                    className="w-full"
                  />

                  {/* Change Password Field */}
                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Change Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm placeholder:text-gray-400 focus:border-[#F7941D] focus:outline-none focus:ring-2 focus:ring-[#F7941D]/20"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Outside white card div */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-2 sm:py-1 text-center sm:text-left"
                >
                  Delete My Account
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer sm:ml-auto w-full sm:w-auto"
                >
                  Save Changes
                </button>
              </div>
            </>
          )}

          {activeSection === 'notification' && (
            <div className="bg-white rounded-lg p-3 mt-17 sm:p-4 md:p-6 lg:p-8 shadow-sm">
              <div className="space-y-0">
                {mockNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`py-2 ${
                      index !== mockNotifications.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="flex-1 text-sm text-gray-900 leading-relaxed">
                        {notification.message}
                      </p>
                      <span className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">
                        {notification.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'account-preferences' && (
            <>
              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm mt-17">
                <div className="space-y-4 sm:space-y-6">
                  {/* Row 1: Dark Mode / Light Mode and Language */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Dark Mode / Light Mode - Bordered Container */}
                    <div className="flex-1 rounded-lg border border-gray-200 px-2.5 py-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm   text-gray-500">
                          Dark Mode / Light Mode
                        </label>
                        <button
                          type="button"
                          onClick={() => setAccountPreferences((prev) => ({ ...prev, darkMode: !prev.darkMode }))}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 ${
                            accountPreferences.darkMode ? 'bg-gray-900' : 'bg-gray-300'
                          }`}
                          role="switch"
                          aria-checked={accountPreferences.darkMode}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              accountPreferences.darkMode ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Language */}
                    <div className="flex-1">
                      <div ref={languageDropdownRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 text-sm hover:bg-gray-50 transition-colors w-full justify-between"
                        >
                          <span className="text-sm text-gray-500">
                            {accountPreferences.language || 'Language'}
                          </span>
                          <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        </button>

                        {languageDropdownOpen && (
                          <div className="absolute left-0 right-0 z-50 mt-2 w-full origin-top rounded-lg border border-gray-200 bg-white shadow-lg">
                            <div className="py-1" role="menu">
                              {languageOptions.map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => {
                                    setAccountPreferences((prev) => ({ ...prev, language: option }))
                                    setLanguageDropdownOpen(false)
                                  }}
                                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                  role="menuitem"
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Time Zone */}
                  <div>
                    <div ref={timeZoneDropdownRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setTimeZoneDropdownOpen(!timeZoneDropdownOpen)}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 text-sm hover:bg-gray-50 transition-colors w-full justify-between"
                      >
                        <span className="text-sm text-gray-500">
                          {accountPreferences.timeZone || 'Time Zone'}
                        </span>
                        <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </button>

                      {timeZoneDropdownOpen && (
                        <div className="absolute left-0 right-0 z-50 mt-2 w-full origin-top rounded-lg border border-gray-200 bg-white shadow-lg">
                          <div className="py-1" role="menu">
                            {timeZoneOptions.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setAccountPreferences((prev) => ({ ...prev, timeZone: option }))
                                  setTimeZoneDropdownOpen(false)
                                }}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                role="menuitem"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Preferences Button - Outside white card */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="bg-[#F7931E] hover:bg-[#E6851A] text-white px-6 py-2.5 rounded-lg text-sm sm:text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </>
          )}

          {activeSection === 'security-settings' && (
            <>
              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm mt-17">
                <div className="space-y-4">
                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <label className="text-sm font-medium text-gray-900">
                      Two-Factor Authentication
                    </label>
                    <button
                      type="button"
                      onClick={() => setSecuritySettings((prev) => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 ${
                        securitySettings.twoFactorAuth ? 'bg-gray-900' : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={securitySettings.twoFactorAuth}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          securitySettings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Login History Dropdown */}
                  <div ref={loginHistoryDropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setLoginHistoryDropdownOpen(!loginHistoryDropdownOpen)}
                      className="w-full flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors justify-between"
                    >
                      <span className="text-sm text-gray-500">See recent login history</span>
                      <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </button>

                    {loginHistoryDropdownOpen && (
                      <div className="absolute left-0 z-50 mt-2 w-full origin-top-left rounded-lg border border-gray-200 bg-white shadow-lg">
                        <div className="py-1" role="menu">
                          <div className="px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
                            Recent Login History
                          </div>
                          <div className="px-4 py-2 text-xs text-gray-500">
                            No recent login history available
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Logout from all devices Button - Outside white card */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleLogoutAllDevices}
                  className="bg-[#F7931E] hover:bg-[#E6851A] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 cursor-pointer"
                >
                  Logout from all devices
                </button>
              </div>
            </>
          )}

          {activeSection === 'sub-admins' && (
            <div className="bg-white rounded-lg  p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm">
            <div className="space-y-4 sm:space-y-6">
              {/* Table Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">
                          ID:
                        </th>
                        <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">
                          <div className="flex items-center gap-1">
                            Name
                            <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">
                          Role
                        </th>
                        <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">
                          Status
                        </th>
                        <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {paginatedSubAdmins.map((admin) => {
                        const isHighlighted = admin.id === selectedSubAdminId
                        return (
                          <tr
                            key={admin.id}
                            className={`transition-colors ${
                              isHighlighted
                                ? 'bg-gray-100'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="px-3 sm:px-4 lg:px-6 py-3 text-xs sm:text-sm text-gray-900">
                              {admin.id}
                            </td>
                            <td className="px-3 sm:px-4 lg:px-6 py-3">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 flex-shrink-0">
                                  {getAvatarInitials(admin.name)}
                                </div>
                                <span className="text-xs sm:text-sm text-gray-900 truncate max-w-[150px] sm:max-w-none">
                                  {admin.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 lg:px-6 py-3 text-xs sm:text-sm text-gray-900">
                              {admin.role}
                            </td>
                            <td className="px-3 sm:px-4 lg:px-6 py-3">
                              <StatusBadge status={admin.status} />
                            </td>
                            <td className="px-3 sm:px-4 lg:px-6 py-3 text-xs sm:text-sm text-gray-500">
                              ---
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalSubAdminPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 border-t border-gray-200 px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                      <button
                        type="button"
                        onClick={() => handleSubAdminPageChange(subAdminPage - 1)}
                        disabled={subAdminPage === 1}
                        className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        &lt; Back
                      </button>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {getSubAdminPageNumbers().map((page, idx) => {
                          if (page === '...') {
                            return (
                              <span key={`ellipsis-${idx}`} className="px-2 text-xs sm:text-sm text-gray-600">
                                ...
                              </span>
                            )
                          }
                          const pageNum = page as number
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => handleSubAdminPageChange(pageNum)}
                              className={`h-7 w-7 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                                subAdminPage === pageNum
                                  ? 'bg-blue-600 text-white'
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
                        onClick={() => handleSubAdminPageChange(subAdminPage + 1)}
                        disabled={subAdminPage === totalSubAdminPages}
                        className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next &gt;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          )}

          {activeSection !== 'admin-profile' && activeSection !== 'notification' && activeSection !== 'account-preferences' && activeSection !== 'security-settings' && activeSection !== 'sub-admins' && (
            <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] py-8 sm:py-12">
              <p className="text-gray-500 text-xs sm:text-sm lg:text-base text-center px-4">
                {settingsSections.find((s) => s.id === activeSection)?.label} section coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  )
}
