import type { RefundRequest } from '../types/refundRequest'
import { getUserDetails } from './mockUserDetails'

/**
 * Mock refund request data
 */
export const mockRefundRequests: Record<number, RefundRequest> = {
  1: {
    id: '1',
    userId: 1,
    bankDetails: {
      bankName: 'Chase Bank',
      accountHolderName: 'John Smith',
      accountNumber: '**** **** **** 5678',
      paymentMethod: 'Bank Transfer',
    },
    requestInfo: {
      requestedAmount: 2450.0,
      requestDate: 'March 15, 2024',
      status: 'pending',
      referenceId: 'WR-2024-001234',
    },
    adminNotes: '',
    transactionSlipUrl: '',
  },
}

/**
 * Get refund request by user ID
 */
export function getRefundRequest(userId: number): RefundRequest | null {
  // If user has refund request, return it
  if (mockRefundRequests[userId]) {
    return mockRefundRequests[userId]
  }
  
  // Otherwise, generate default refund request
  return generateDefaultRefundRequest(userId)
}

/**
 * Generate default refund request for a user
 */
function generateDefaultRefundRequest(userId: number): RefundRequest | null {
  const user = getUserDetails(userId)
  if (!user) return null

  return {
    id: String(userId),
    userId,
    bankDetails: {
      bankName: 'Chase Bank',
      accountHolderName: user.name,
      accountNumber: '**** **** **** 5678',
      paymentMethod: 'Bank Transfer',
    },
    requestInfo: {
      requestedAmount: user.walletBalance * 0.5,
      requestDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'pending',
      referenceId: `WR-2024-${String(userId).padStart(6, '0')}`,
    },
    adminNotes: '',
    transactionSlipUrl: '',
  }
}

/**
 * Update refund request status
 */
export function updateRefundStatus(userId: number, status: 'paid' | 'rejected'): void {
  if (mockRefundRequests[userId]) {
    mockRefundRequests[userId].requestInfo.status = status
  } else {
    const refundRequest = generateDefaultRefundRequest(userId)
    if (refundRequest) {
      mockRefundRequests[userId] = {
        ...refundRequest,
        requestInfo: {
          ...refundRequest.requestInfo,
          status,
        },
      }
    }
  }
}

/**
 * Update refund request admin notes
 */
export function updateRefundNotes(userId: number, notes: string): void {
  if (mockRefundRequests[userId]) {
    mockRefundRequests[userId].adminNotes = notes
  } else {
    const refundRequest = generateDefaultRefundRequest(userId)
    if (refundRequest) {
      mockRefundRequests[userId] = {
        ...refundRequest,
        adminNotes: notes,
      }
    }
  }
}

/**
 * Update transaction slip URL
 */
export function updateTransactionSlip(userId: number, url: string): void {
  if (mockRefundRequests[userId]) {
    mockRefundRequests[userId].transactionSlipUrl = url
  } else {
    const refundRequest = generateDefaultRefundRequest(userId)
    if (refundRequest) {
      mockRefundRequests[userId] = {
        ...refundRequest,
        transactionSlipUrl: url,
      }
    }
  }
}

