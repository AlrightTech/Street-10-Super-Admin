/**
 * All Users (KYC) types
 */

import type { KYCStatus, KYCType } from './kyc'

/**
 * All Users (KYC User) interface
 */
export interface AllUser {
  id: number
  userName: string
  userDescription: string
  kycType: KYCType
  submissionDate: string
  status: KYCStatus
  avatar?: string
}

/**
 * KYC Summary Card interface
 */
export interface KYCSummaryCard {
  type: 'pending' | 'approved' | 'rejected' | 'total'
  count: number
  label: string
  icon: string
  iconColor: string
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
}

