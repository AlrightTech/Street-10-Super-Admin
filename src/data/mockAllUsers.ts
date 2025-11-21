import type { AllUser } from '../types/allUsers'

/**
 * Mock All Users (KYC) data
 */
export const mockAllUsers: AllUser[] = [
  {
    id: 1,
    userName: 'Touseef Ahmed',
    userDescription: 'Electronic',
    kycType: 'individual',
    submissionDate: '15/01/2024',
    status: 'approved',
  },
  {
    id: 2,
    userName: 'Smart Watch Pro',
    userDescription: 'Collectibles',
    kycType: 'business',
    submissionDate: '14/01/2024',
    status: 'approved',
  },
  {
    id: 3,
    userName: 'John Smith',
    userDescription: 'Electronics',
    kycType: 'individual',
    submissionDate: '13/01/2024',
    status: 'pending',
  },
  {
    id: 4,
    userName: 'Tech Solutions Ltd',
    userDescription: 'Business',
    kycType: 'business',
    submissionDate: '12/01/2024',
    status: 'approved',
  },
  {
    id: 5,
    userName: 'Sarah Johnson',
    userDescription: 'Personal',
    kycType: 'individual',
    submissionDate: '11/01/2024',
    status: 'rejected',
  },
  {
    id: 6,
    userName: 'Global Trading Co',
    userDescription: 'Business',
    kycType: 'business',
    submissionDate: '10/01/2024',
    status: 'pending',
  },
  {
    id: 7,
    userName: 'Michael Brown',
    userDescription: 'Electronics',
    kycType: 'individual',
    submissionDate: '09/01/2024',
    status: 'approved',
  },
  {
    id: 8,
    userName: 'Digital Services Inc',
    userDescription: 'Business',
    kycType: 'business',
    submissionDate: '08/01/2024',
    status: 'rejected',
  },
  {
    id: 9,
    userName: 'Emily Davis',
    userDescription: 'Personal',
    kycType: 'individual',
    submissionDate: '07/01/2024',
    status: 'pending',
  },
  {
    id: 10,
    userName: 'Premium Goods LLC',
    userDescription: 'Business',
    kycType: 'business',
    submissionDate: '06/01/2024',
    status: 'approved',
  },
  {
    id: 11,
    userName: 'David Wilson',
    userDescription: 'Electronics',
    kycType: 'individual',
    submissionDate: '05/01/2024',
    status: 'rejected',
  },
  {
    id: 12,
    userName: 'Innovation Hub',
    userDescription: 'Business',
    kycType: 'business',
    submissionDate: '04/01/2024',
    status: 'pending',
  },
]

/**
 * Get KYC summary counts
 * Based on reference image: Pending: 248, Approved: 3000, Rejected: 559, Total: 200
 */
export function getKYCSummary() {
  // Using reference image values for display
  // In production, these would come from actual data
  return {
    pending: 248,
    approved: 3000,
    rejected: 559,
    total: 200, // Total KYCs shown in reference
  }
}

