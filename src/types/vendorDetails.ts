import type { VendorStatus } from './vendors'

export interface VendorFinancialInfo {
  commissionRate: string
  accountStatus: string
  totalSales: string
  paymentRequest: string
}

export interface VendorPerformanceMetric {
  id: string
  label: string
  value: string
  icon: 'clipboard' | 'check' | 'x' | 'star'
}

export interface VendorDocument {
  id: string
  title: string
  status: string
  date: string
}

export interface VendorServiceItem {
  id: string
  name: string
  category: string
  price: string
  orders: string
  status: string
  description?: string
  image?: string
  badge?: string
  timeLeft?: string
}

export interface VendorDetailData {
  id: number
  status: VendorStatus
  avatar: string
  ownerName: string
  role: string
  email: string
  phone: string
  businessName: string
  vendorType: string
  address: string
  commissionRate: string
  financialInfo: VendorFinancialInfo
  performance: VendorPerformanceMetric[]
  documents: VendorDocument[]
  services: VendorServiceItem[]
}

