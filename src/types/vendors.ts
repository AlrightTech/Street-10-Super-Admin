/**
 * Vendor types
 */

export type VendorStatus = 'pending' | 'approved' | 'rejected'

export interface Vendor {
  id: number
  ownerName: string
  businessName: string
  status: VendorStatus
  avatar?: string
}

