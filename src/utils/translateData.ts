import { getTranslation, type TranslationKey } from './translations'

/**
 * Helper function to translate status values
 */
export function translateStatus(status: string, language: 'en' | 'ar'): string {
  const statusMap: Record<string, TranslationKey> = {
    'approved': 'statusApproved',
    'rejected': 'statusRejected',
    'pending': 'statusPending',
    'active': 'statusActive',
    'blocked': 'statusBlocked',
    'completed': 'statusCompleted',
    'Verified': 'statusVerified',
    'Pending': 'statusPending',
    'Active': 'statusActive',
    'Blocked': 'statusBlocked',
  }
  
  const key = statusMap[status]
  return key ? getTranslation(key, language) : status
}

/**
 * Helper function to translate labels
 */
export function translateLabel(label: string, language: 'en' | 'ar'): string {
  const labelMap: Record<string, TranslationKey> = {
    'Total Orders': 'totalOrders',
    'Completed Orders': 'completedOrders',
    'Canceled Orders': 'canceledOrders',
    'Average Rating': 'averageRating',
  }
  
  const key = labelMap[label]
  return key ? getTranslation(key, language) : label
}

/**
 * Helper function to translate titles
 */
export function translateTitle(title: string, language: 'en' | 'ar'): string {
  const titleMap: Record<string, TranslationKey> = {
    'Business License': 'businessLicense',
    'CNIC / Passport': 'cnicPassport',
  }
  
  const key = titleMap[title]
  return key ? getTranslation(key, language) : title
}

/**
 * Helper function to translate roles
 */
export function translateRole(role: string, language: 'en' | 'ar'): string {
  const roleMap: Record<string, TranslationKey> = {
    'Vendor': 'roleVendor',
    'Math': 'roleMath',
  }
  
  const key = roleMap[role]
  return key ? getTranslation(key, language) : role
}

/**
 * Helper function to translate categories
 */
export function translateCategory(category: string, language: 'en' | 'ar'): string {
  const categoryMap: Record<string, TranslationKey> = {
    'Car': 'categoryCar',
    'Hotel': 'categoryHotel',
  }
  
  const key = categoryMap[category]
  return key ? getTranslation(key, language) : category
}

/**
 * Helper function to translate service names
 */
export function translateServiceName(name: string, language: 'en' | 'ar'): string {
  const serviceMap: Record<string, TranslationKey> = {
    'Air': 'serviceAir',
    'Water': 'serviceWater',
  }
  
  const key = serviceMap[name]
  return key ? getTranslation(key, language) : name
}

/**
 * Helper function to translate service descriptions
 */
export function translateServiceDescription(description: string, language: 'en' | 'ar'): string {
  if (description === 'Premium air service for your vehicle.') {
    return getTranslation('serviceDescription', language)
  }
  return description
}

/**
 * Helper function to translate sidebar navigation labels
 */
export function translateSidebarLabel(label: string, language: 'en' | 'ar'): string {
  const sidebarMap: Record<string, TranslationKey> = {
    'Dashboard': 'sidebarDashboard',
    'Users': 'sidebarUsers',
    'Vendors': 'sidebarVendors',
    'Orders': 'sidebarOrders',
    'Finance': 'sidebarFinance',
    'Marketing': 'sidebarMarketing',
    'Analytics': 'sidebarAnalytics',
    'Main Control': 'sidebarMainControl',
    'Categories': 'sidebarCategories',
    'Products': 'sidebarProducts',
    'Wallet': 'sidebarWallet',
    'Settings': 'sidebarSettings',
    'Logout': 'sidebarLogout',
  }
  
  const key = sidebarMap[label]
  return key ? getTranslation(key, language) : label
}
