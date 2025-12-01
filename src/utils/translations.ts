/**
 * Translation keys and their values for English and Arabic
 * Note: UI layout remains unchanged - only text is translated
 */
export const translations = {
  en: {
    // TopBar
    search: 'Search',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    
    // Login Page
    home: 'Home',
    heroTitle: 'Manage Users, Orders & Services',
    heroTitle2: 'Streamline Your Business Operations',
    heroTitle3: 'Powerful Admin Dashboard',
    
    // Login Form
    email: 'Email',
    enterEmail: 'Enter Email',
    password: 'Password',
    enterPassword: 'Enter Password',
    login: 'Login',
    loggingIn: 'Logging in...',
    forgetPassword: 'Forget Password?',
    reset: 'Reset',
    showPassword: 'Show',
    hidePassword: 'Hide',
    
    // Validation messages
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email address',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters',
    invalidCredentials: 'Invalid credentials. Please try again.',
    
    // Static Data - Status
    statusApproved: 'Approved',
    statusRejected: 'Rejected',
    statusPending: 'Pending',
    statusActive: 'Active',
    statusBlocked: 'Blocked',
    statusCompleted: 'Completed',
    statusVerified: 'Verified',
    
    // Static Data - Labels
    totalOrders: 'Total Orders',
    completedOrders: 'Completed Orders',
    canceledOrders: 'Canceled Orders',
    averageRating: 'Average Rating',
    
    // Static Data - Titles
    businessLicense: 'Business License',
    cnicPassport: 'CNIC / Passport',
    
    // Static Data - Roles
    roleVendor: 'Vendor',
    roleMath: 'Math',
    
    // Static Data - Categories
    categoryCar: 'Car',
    categoryHotel: 'Hotel',
    
    // Static Data - Services
    serviceAir: 'Air',
    serviceWater: 'Water',
    serviceDescription: 'Premium air service for your vehicle.',
    
    // Sidebar Navigation
    sidebarDashboard: 'Dashboard',
    sidebarUsers: 'Users',
    sidebarVendors: 'Vendors',
    sidebarOrders: 'Orders',
    sidebarFinance: 'Finance',
    sidebarMarketing: 'Marketing',
    sidebarAnalytics: 'Analytics',
    sidebarMainControl: 'Main Control',
    sidebarCategories: 'Categories',
    sidebarProducts: 'Products',
    sidebarWallet: 'Wallet',
    sidebarSettings: 'Settings',
    sidebarLogout: 'Logout',
    
    // Footer
    footerBrand: 'Street10 mazad',
    footerSocialMessage: 'Join us social platform to stay updated',
  },
  ar: {
    // TopBar
    search: 'بحث',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    
    // Login Page
    home: 'الرئيسية',
    heroTitle: 'إدارة المستخدمين والطلبات والخدمات',
    heroTitle2: 'تبسيط عمليات عملك',
    heroTitle3: 'لوحة تحكم إدارية قوية',
    
    // Login Form
    email: 'البريد الإلكتروني',
    enterEmail: 'أدخل البريد الإلكتروني',
    password: 'كلمة المرور',
    enterPassword: 'أدخل كلمة المرور',
    login: 'تسجيل الدخول',
    loggingIn: 'جاري تسجيل الدخول...',
    forgetPassword: 'نسيت كلمة المرور؟',
    reset: 'إعادة تعيين',
    showPassword: 'إظهار',
    hidePassword: 'إخفاء',
    
    // Validation messages
    emailRequired: 'البريد الإلكتروني مطلوب',
    emailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صالح',
    passwordRequired: 'كلمة المرور مطلوبة',
    passwordMinLength: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    invalidCredentials: 'بيانات اعتماد غير صحيحة. يرجى المحاولة مرة أخرى.',
    
    // Static Data - Status
    statusApproved: 'موافق عليه',
    statusRejected: 'مرفوض',
    statusPending: 'قيد الانتظار',
    statusActive: 'نشط',
    statusBlocked: 'محظور',
    statusCompleted: 'مكتمل',
    statusVerified: 'متحقق',
    
    // Static Data - Labels
    totalOrders: 'إجمالي الطلبات',
    completedOrders: 'الطلبات المكتملة',
    canceledOrders: 'الطلبات الملغاة',
    averageRating: 'التقييم المتوسط',
    
    // Static Data - Titles
    businessLicense: 'رخصة العمل',
    cnicPassport: 'الهوية / جواز السفر',
    
    // Static Data - Roles
    roleVendor: 'بائع',
    roleMath: 'رياضيات',
    
    // Static Data - Categories
    categoryCar: 'سيارة',
    categoryHotel: 'فندق',
    
    // Static Data - Services
    serviceAir: 'هواء',
    serviceWater: 'ماء',
    serviceDescription: 'خدمة هواء متميزة لسيارتك.',
    
    // Sidebar Navigation
    sidebarDashboard: 'لوحة التحكم',
    sidebarUsers: 'المستخدمون',
    sidebarVendors: 'البائعون',
    sidebarOrders: 'الطلبات',
    sidebarFinance: 'المالية',
    sidebarMarketing: 'التسويق',
    sidebarAnalytics: 'التحليلات',
    sidebarMainControl: 'التحكم الرئيسي',
    sidebarCategories: 'الفئات',
    sidebarProducts: 'المنتجات',
    sidebarWallet: 'المحفظة',
    sidebarSettings: 'الإعدادات',
    sidebarLogout: 'تسجيل الخروج',
    
    // Footer
    footerBrand: 'ستريت 10 مزاد',
    footerSocialMessage: 'انضم إلينا على منصات التواصل الاجتماعي للبقاء على اطلاع',
  },
} as const

/**
 * Translation key type
 */
export type TranslationKey = keyof typeof translations.en

/**
 * Get translation for a given key and language
 */
export function getTranslation(key: TranslationKey, language: 'en' | 'ar'): string {
  return translations[language][key] || translations.en[key] || key
}

