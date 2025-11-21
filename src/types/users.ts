/**
 * User type definitions
 */

/**
 * User status type
 */
export type UserStatus = 'active' | 'pending' | 'blocked'

/**
 * User interface
 */
export interface User {
  id: number
  name: string
  email: string
  role: string
  totalPurchase: number
  status: UserStatus
  joinDate: string
  avatar?: string // Optional profile image URL
}

