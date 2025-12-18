import type { VendorStatus } from './vendors'

export interface VendorDocument {
  id: string
  name: string
  statusLabel: string
  verifiedDate: string
  icon: string
  // Optional fields for real file handling
  url?: string
  fileName?: string
}

export interface VendorContactInfo {
  email: string
  phone: string
}

export interface VendorBusinessInfo {
  businessName: string
  vendorType: string
  address: string
  contactPerson: string
}

export interface VendorRequestDetail {
  id: number
  ownerName: string
  avatar?: string
  contact: VendorContactInfo
  business: VendorBusinessInfo
  documents: VendorDocument[]
  businessDescription: string
  status: VendorStatus
}

