/**
 * KYC types
 */

export type KYCStatus = 'pending' | 'approved' | 'rejected' | 'under-review'
export type KYCType = 'individual' | 'business'

export interface KYCDocument {
  id: string
  name: string
  title: string
  type: 'kyc-document' | 'selfie-verification' | 'document'
  fileUrl: string
  uploadedDate: string
  iconColor?: 'blue' | 'green' | 'purple'
}

export interface BankInfo {
  iban: string
  swiftCode: string
  bankName: string
  accountNumber: string
  nameOnCard: string
  bankCountry: string
}

export interface ActivityHistoryItem {
  id: string
  event: string
  description: string
  date: string
  time: string
  icon: 'user' | 'document' | 'eye' | 'note' | 'clock' | 'check' | 'x'
  isCurrent?: boolean
}

export interface KYCData {
  userId: number
  kycId?: string
  kycType: KYCType
  status: KYCStatus
  submissionDate: string
  submissionTime: string
  referenceNumber: string
  documents: KYCDocument[]
  bankInfo: BankInfo
  adminNotes?: string
  activityHistory: ActivityHistoryItem[]
}

