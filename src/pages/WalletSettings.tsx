import { useState, useEffect, useRef } from 'react'

/**
 * Toggle Switch Component
 */
interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

const Toggle = ({ enabled, onChange }: ToggleProps) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:ring-offset-2 cursor-pointer ${
        enabled ? 'bg-[#FF8C00]' : 'bg-gray-300'
      }`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

/**
 * Dropdown Component
 */
interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
}

const Dropdown = ({ value, options, onChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value) || options[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#FF8C00] focus:outline-none focus:ring-1 focus:ring-[#FF8C00] cursor-pointer flex items-center justify-between"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedOption.label}</span>
        <svg 
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full px-3 py-2 text-left text-sm transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg ${
                option.value === value
                  ? 'bg-[#FF8C00] text-white'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Wallet Settings page component
 */
export default function WalletSettings() {
  // General Settings state
  const [generalSettings, setGeneralSettings] = useState({
    minimumWalletBalance: '10',
    transactionFee: '2.5',
    maximumWithdrawalAmount: '500',
    minimumWithdrawalAmount: '80',
    dailyWithdrawalLimit: '20000',
    withdrawalProcessingDays: '3',
  })

  // Approval Settings state
  const [autoApproveWithdrawals, setAutoApproveWithdrawals] = useState(true)
  const [requireKYCForWithdrawals, setRequireKYCForWithdrawals] = useState(true)

  // Notification Settings state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  // Export Transactions state
  const [dateRange, setDateRange] = useState('last-30-days')
  const [exportFormat, setExportFormat] = useState('csv')
  const [includeUserDetails, setIncludeUserDetails] = useState(false)
  const [includeFeeBreakdown, setIncludeFeeBreakdown] = useState(true)

  // Date range options
  const dateRangeOptions: DropdownOption[] = [
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' },
  ]

  // Export format options
  const exportFormatOptions: DropdownOption[] = [
    { value: 'csv', label: 'CSV' },
    { value: 'xlsx', label: 'XLSX' },
    { value: 'pdf', label: 'PDF' },
  ]

  /**
   * Handle general settings input change with validation
   */
  const handleGeneralSettingChange = (field: string, value: string) => {
    // Validate numeric inputs
    if (value === '' || value === '-') {
      setGeneralSettings((prev) => ({
        ...prev,
        [field]: value,
      }))
      return
    }

    // Ensure only positive numbers
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue < 0) {
      return
    }

    // Set min values for specific fields
    if (field === 'transactionFee' && numValue > 100) {
      return // Transaction fee shouldn't exceed 100%
    }

    setGeneralSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  /**
   * Handle export transactions
   */
  const handleExportTransactions = () => {
    // Export logic here
    const exportData = {
      dateRange,
      exportFormat,
      includeUserDetails,
      includeFeeBreakdown,
    }
    
    console.log('Exporting transactions:', exportData)
    
    // In a real app, this would trigger an actual export/download
    const dateRangeLabel = dateRangeOptions.find((opt) => opt.value === dateRange)?.label || 'Selected Range'
    const format = exportFormat.toUpperCase()
    
    // Create a simple CSV/JSON structure for demo
    const exportContent = `Transaction Export\nDate Range: ${dateRangeLabel}\nFormat: ${format}\nInclude User Details: ${includeUserDetails ? 'Yes' : 'No'}\nInclude Fee Breakdown: ${includeFeeBreakdown ? 'Yes' : 'No'}\n\n[Transaction data would be here...]`
    
    // For demo purposes, create a download
    const blob = new Blob([exportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions_${dateRange}_${new Date().getTime()}.${exportFormat === 'csv' ? 'csv' : exportFormat === 'xlsx' ? 'xlsx' : 'pdf'}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    alert(`Exporting transactions in ${format} format for ${dateRangeLabel}`)
  }

  /**
   * Handle save settings with validation
   */
  const handleSaveSettings = () => {
    // Validate all settings before saving
    const settings = {
      generalSettings,
      autoApproveWithdrawals,
      requireKYCForWithdrawals,
      emailNotifications,
      smsNotifications,
    }

    // Validate numeric fields
    const numFields = [
      'minimumWalletBalance',
      'transactionFee',
      'maximumWithdrawalAmount',
      'minimumWithdrawalAmount',
      'dailyWithdrawalLimit',
      'withdrawalProcessingDays',
    ]

    for (const field of numFields) {
      const value = parseFloat(generalSettings[field as keyof typeof generalSettings])
      if (isNaN(value) || value < 0) {
        alert(`Please enter a valid positive number for ${field.replace(/([A-Z])/g, ' $1').trim()}`)
        return
      }
    }

    // Validate that minimum withdrawal is less than maximum withdrawal
    const minWithdrawal = parseFloat(generalSettings.minimumWithdrawalAmount)
    const maxWithdrawal = parseFloat(generalSettings.maximumWithdrawalAmount)
    if (minWithdrawal >= maxWithdrawal) {
      alert('Minimum withdrawal amount must be less than maximum withdrawal amount')
      return
    }

    // Validate that minimum wallet balance is reasonable
    const minWalletBalance = parseFloat(generalSettings.minimumWalletBalance)
    if (minWalletBalance < 0) {
      alert('Minimum wallet balance must be a positive number')
      return
    }

    // Validate transaction fee is reasonable (0-100%)
    const transactionFee = parseFloat(generalSettings.transactionFee)
    if (transactionFee < 0 || transactionFee > 100) {
      alert('Transaction fee must be between 0 and 100')
      return
    }

    console.log('Saving settings:', settings)
    
    // In a real app, this would save to backend via API call
    // Example: await saveWalletSettings(settings)
    
    // Show success message
    alert('Settings saved successfully!')
    
    // In a real app, you might want to show a toast notification or update UI state
  }

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    // Reset to default values
    setGeneralSettings({
      minimumWalletBalance: '10',
      transactionFee: '2.5',
      maximumWithdrawalAmount: '500',
      minimumWithdrawalAmount: '80',
      dailyWithdrawalLimit: '20000',
      withdrawalProcessingDays: '3',
    })
    setAutoApproveWithdrawals(true)
    setRequireKYCForWithdrawals(true)
    setEmailNotifications(true)
    setSmsNotifications(false)
    setDateRange('last-30-days')
    setExportFormat('csv')
    setIncludeUserDetails(false)
    setIncludeFeeBreakdown(true)
  }

  return (
    <div className="min-h-screenn px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Wallet</h1>
        <p className="mt-1 text-sm text-gray-600">Dashboard • Settings</p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* General Settings Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Minimum Wallet Balance */}
            <div>
              <label htmlFor="minimumWalletBalance" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Wallet Balance ($)
              </label>
              <input
                type="number"
                id="minimumWalletBalance"
                min="0"
                step="0.01"
                value={generalSettings.minimumWalletBalance}
                onChange={(e) => handleGeneralSettingChange('minimumWalletBalance', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#FF8C00] focus:outline-none focus:ring-1 focus:ring-[#FF8C00]"
              />
              <p className="mt-1 text-xs text-gray-500">Users cannot withdraw below this amount</p>
            </div>

            {/* Transaction Fee */}
            <div>
              <label htmlFor="transactionFee" className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Fee (%)
              </label>
              <input
                type="number"
                id="transactionFee"
                min="0"
                max="100"
                step="0.1"
                value={generalSettings.transactionFee}
                onChange={(e) => handleGeneralSettingChange('transactionFee', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#FF8C00] focus:outline-none focus:ring-1 focus:ring-[#FF8C00]"
              />
              <p className="mt-1 text-xs text-gray-500">Percentage fee charged on transactions</p>
            </div>

            {/* Maximum Withdrawal Amount */}
            <div>
              <label htmlFor="maximumWithdrawalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Withdrawal Amount ($)
              </label>
              <input
                type="number"
                id="maximumWithdrawalAmount"
                min="0"
                step="0.01"
                value={generalSettings.maximumWithdrawalAmount}
                onChange={(e) => handleGeneralSettingChange('maximumWithdrawalAmount', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#FF8C00] focus:outline-none focus:ring-1 focus:ring-[#FF8C00]"
              />
              <p className="mt-1 text-xs text-gray-500">Maximum amount users can withdraw at once</p>
            </div>

            {/* Minimum Withdrawal Amount */}
            <div>
              <label htmlFor="minimumWithdrawalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Withdrawal Amount ($)
              </label>
              <input
                type="number"
                id="minimumWithdrawalAmount"
                min="0"
                step="0.01"
                value={generalSettings.minimumWithdrawalAmount}
                onChange={(e) => handleGeneralSettingChange('minimumWithdrawalAmount', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#FF8C00] focus:outline-none focus:ring-1 focus:ring-[#FF8C00]"
              />
              <p className="mt-1 text-xs text-gray-500">Minimum amount required for withdrawal</p>
            </div>

            {/* Daily Withdrawal Limit */}
            <div>
              <label htmlFor="dailyWithdrawalLimit" className="block text-sm font-medium text-gray-700 mb-1">
                Daily Withdrawal Limit ($)
              </label>
              <input
                type="number"
                id="dailyWithdrawalLimit"
                min="0"
                step="0.01"
                value={generalSettings.dailyWithdrawalLimit}
                onChange={(e) => handleGeneralSettingChange('dailyWithdrawalLimit', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#FF8C00] focus:outline-none focus:ring-1 focus:ring-[#FF8C00]"
              />
              <p className="mt-1 text-xs text-gray-500">Maximum daily withdrawal per user</p>
            </div>

            {/* Withdrawal Processing Days */}
            <div>
              <label htmlFor="withdrawalProcessingDays" className="block text-sm font-medium text-gray-700 mb-1">
                Withdrawal Processing Days
              </label>
              <input
                type="number"
                id="withdrawalProcessingDays"
                min="0"
                max="30"
                step="1"
                value={generalSettings.withdrawalProcessingDays}
                onChange={(e) => handleGeneralSettingChange('withdrawalProcessingDays', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#FF8C00] focus:outline-none focus:ring-1 focus:ring-[#FF8C00]"
              />
              <p className="mt-1 text-xs text-gray-500">Business days to process withdrawals</p>
            </div>
            </div>
          </div>
        </div>

        {/* Approval Settings Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Settings</h2>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
            {/* Auto Approve Withdrawals */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">Auto Approve Withdrawals</h3>
                <p className="text-sm text-gray-600 mt-0.5">Automatically approve withdrawal requests under limits.</p>
              </div>
              <Toggle enabled={autoApproveWithdrawals} onChange={setAutoApproveWithdrawals} />
            </div>

            {/* Require KYC for Withdrawals */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">Require KYC for Withdrawals</h3>
                <p className="text-sm text-gray-600 mt-0.5">Users must complete KYC verification to withdraw.</p>
              </div>
              <Toggle enabled={requireKYCForWithdrawals} onChange={setRequireKYCForWithdrawals} />
            </div>
            </div>
          </div>
        </div>

        {/* Notification Settings Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600 mt-0.5">Send email notifications for wallet transactions.</p>
              </div>
              <Toggle enabled={emailNotifications} onChange={setEmailNotifications} />
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-600 mt-0.5">Send SMS notifications for important wallet events.</p>
              </div>
              <Toggle enabled={smsNotifications} onChange={setSmsNotifications} />
            </div>
            </div>
          </div>
        </div>

        {/* Export Transactions Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Transactions</h2>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Range */}
              <div>
                <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <Dropdown value={dateRange} options={dateRangeOptions} onChange={setDateRange} />
              </div>

              {/* Export Format */}
              <div>
                <label htmlFor="exportFormat" className="block text-sm font-medium text-gray-700 mb-1">
                  Export Format
                </label>
                <Dropdown value={exportFormat} options={exportFormatOptions} onChange={setExportFormat} />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUserDetails}
                  onChange={(e) => setIncludeUserDetails(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#FF8C00] focus:ring-[#FF8C00] cursor-pointer"
                />
                <span className="text-sm text-gray-700">Include User Details</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeFeeBreakdown}
                  onChange={(e) => setIncludeFeeBreakdown(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#FF8C00] focus:ring-[#FF8C00] cursor-pointer"
                />
                <span className="text-sm text-gray-700">Include Fee Breakdown</span>
              </label>
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleExportTransactions}
                className="rounded-lg bg-[#FF8C00] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E00] transition-colors cursor-pointer"
              >
                Export Transactions
              </button>
            </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 pb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 max-w-[200px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveSettings}
            className="flex-1 max-w-[200px] rounded-lg bg-[#FF8C00] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E00] transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

