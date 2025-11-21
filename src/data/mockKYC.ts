import type { KYCData } from '../types/kyc'

/**
 * Mock KYC data
 */
export const mockKYCData: Record<number, KYCData> = {
  1: {
    userId: 1,
    kycId: '#KYC-2024-156',
    kycType: 'individual',
    status: 'pending',
    submissionDate: 'December 15, 2024',
    submissionTime: '10:30 AM',
    referenceNumber: 'REF-SJ-20241215-001',
    documents: [
      {
        id: '1',
        name: 'cnic.jpg',
        title: 'CNIC',
        type: 'kyc-document',
        fileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        uploadedDate: 'Dec 15, 2024',
        iconColor: 'blue',
      },
      {
        id: '2',
        name: 'selfie_verification.jpg',
        title: 'Selfie Verification',
        type: 'selfie-verification',
        fileUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        uploadedDate: 'Dec 15, 2024',
        iconColor: 'green',
      },
      {
        id: '3',
        name: 'utility_bill.pdf',
        title: 'Document',
        type: 'document',
        fileUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&h=200&fit=crop',
        uploadedDate: 'Dec 15, 2024',
        iconColor: 'purple',
      },
    ],
    bankInfo: {
      iban: '466857646547afddsaf',
      swiftCode: '466857646547afddsaf',
      bankName: 'dfg454846',
      accountNumber: 'dfg454846',
      nameOnCard: 'Sarah Johnson',
      bankCountry: 'Qatar',
    },
    adminNotes: '',
    activityHistory: [
      {
        id: '1',
        event: 'Account Sign Up',
        description: 'User First Sign Up',
        date: 'Dec 15, 2024',
        time: '10:00 AM',
        icon: 'user',
      },
      {
        id: '2',
        event: 'Terms & Condition Acceptance',
        description: 'User T&C Accepted',
        date: 'Dec 15, 2024',
        time: '11:15 AM',
        icon: 'document',
      },
      {
        id: '3',
        event: 'KYC Documents Submitted',
        description: 'User submitted all required documents for individual KYC verification',
        date: 'Dec 15, 2024',
        time: '10:30 AM',
        icon: 'document',
      },
      {
        id: '4',
        event: 'KYC Under Review',
        description: 'Admin John Doe started reviewing the KYC submission',
        date: 'Dec 15, 2024',
        time: '11:15 AM',
        icon: 'eye',
      },
      {
        id: '5',
        event: 'Admin Note Added',
        description: 'Admin added verification notes for document quality review',
        date: 'Dec 15, 2024',
        time: '2:45 PM',
        icon: 'note',
      },
      {
        id: '6',
        event: 'Status: Pending Review',
        description: 'KYC is currently awaiting final admin approval',
        date: 'Current',
        time: '',
        icon: 'clock',
        isCurrent: true,
      },
    ],
  },
}

/**
 * Get KYC data by user ID
 */
export function getKYCData(userId: number): KYCData | null {
  // If user has KYC data, return it
  if (mockKYCData[userId]) {
    return mockKYCData[userId]
  }
  
  // Otherwise, generate default KYC data
  return generateDefaultKYCData(userId)
}

/**
 * Generate default KYC data for a user
 */
function generateDefaultKYCData(userId: number): KYCData | null {
  return {
    userId,
    kycId: `#KYC-2024-${userId.toString().padStart(3, '0')}`,
    kycType: 'individual',
    status: 'pending',
    submissionDate: 'December 15, 2024',
    submissionTime: '10:30 AM',
    referenceNumber: `REF-${userId}-20241215-001`,
    documents: [
      {
        id: '1',
        name: 'cnic.jpg',
        title: 'CNIC',
        type: 'kyc-document',
        fileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        uploadedDate: 'Dec 15, 2024',
        iconColor: 'blue',
      },
      {
        id: '2',
        name: 'selfie_verification.jpg',
        title: 'Selfie Verification',
        type: 'selfie-verification',
        fileUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        uploadedDate: 'Dec 15, 2024',
        iconColor: 'green',
      },
      {
        id: '3',
        name: 'utility_bill.pdf',
        title: 'Document',
        type: 'document',
        fileUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&h=200&fit=crop',
        uploadedDate: 'Dec 15, 2024',
        iconColor: 'purple',
      },
    ],
    bankInfo: {
      iban: '466857646547afddsaf',
      swiftCode: '466857646547afddsaf',
      bankName: 'dfg454846',
      accountNumber: 'dfg454846',
      nameOnCard: 'User Name',
      bankCountry: 'Qatar',
    },
    adminNotes: '',
    activityHistory: [
      {
        id: '1',
        event: 'Account Sign Up',
        description: 'User First Sign Up',
        date: 'Dec 15, 2024',
        time: '10:00 AM',
        icon: 'user',
      },
      {
        id: '2',
        event: 'KYC Documents Submitted',
        description: 'User submitted all required documents for individual KYC verification',
        date: 'Dec 15, 2024',
        time: '10:30 AM',
        icon: 'document',
      },
      {
        id: '3',
        event: 'Status: Pending Review',
        description: 'KYC is currently awaiting final admin approval',
        date: 'Current',
        time: '',
        icon: 'clock',
        isCurrent: true,
      },
    ],
  }
}

/**
 * Update KYC status
 */
export function updateKYCStatus(userId: number, status: 'approved' | 'rejected'): void {
  if (mockKYCData[userId]) {
    mockKYCData[userId].status = status
  } else {
    const kycData = generateDefaultKYCData(userId)
    if (kycData) {
      mockKYCData[userId] = {
        ...kycData,
        status,
      }
    }
  }
}

/**
 * Update KYC admin notes
 */
export function updateKYCNotes(userId: number, notes: string): void {
  if (mockKYCData[userId]) {
    mockKYCData[userId].adminNotes = notes
  } else {
    const kycData = generateDefaultKYCData(userId)
    if (kycData) {
      mockKYCData[userId] = {
        ...kycData,
        adminNotes: notes,
      }
    }
  }
}

