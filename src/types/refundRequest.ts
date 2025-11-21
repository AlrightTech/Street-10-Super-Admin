/**
 * Refund request types
 */

export type RefundStatus = 'pending' | 'paid' | 'rejected'

export interface BankDetails {
  bankName: string
  accountHolderName: string
  accountNumber: string
  paymentMethod: string
}

export interface RefundRequestInfo {
  requestedAmount: number
  requestDate: string
  status: RefundStatus
  referenceId: string
}

export interface RefundRequest {
  id: string
  userId: number
  bankDetails: BankDetails
  requestInfo: RefundRequestInfo
  adminNotes?: string
  transactionSlipUrl?: string
}

