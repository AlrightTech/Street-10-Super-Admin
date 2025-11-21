/**
 * Wallet transaction status types
 */
export type TransactionStatus = 'pending' | 'completed' | 'failed'

/**
 * Transaction type
 */
export type TransactionType = 'credit' | 'debit'

/**
 * Payment method types
 */
export type PaymentMethod = 'Bank Transfer' | 'Wallet Balance' | 'Credit Card' | 'Debit Card'

/**
 * Transaction log entry
 */
export interface TransactionLog {
  id: string
  message: string
  timestamp: string
  actor?: string
}

/**
 * Transaction timeline events
 */
export interface TransactionTimeline {
  created?: string
  processed?: string
  completed?: string
  failed?: string
}

/**
 * Payment method details
 */
export interface PaymentMethodDetails {
  paymentType: PaymentMethod
  bankName?: string
  accountNumber?: string
  routingNumber?: string
  cardLast4?: string
  cardBrand?: string
}

/**
 * User information for transaction
 */
export interface TransactionUserInfo {
  userId: string
  userName: string
  userEmail: string
  userPhone?: string
  userAvatar?: string
  currentWalletBalance?: string
}

/**
 * Wallet transaction interface
 */
export interface WalletTransaction {
  id: string
  transactionId: string
  userName: string
  userEmail: string
  type: TransactionType
  amount: string
  paymentMethod: PaymentMethod
  date: string
  status: TransactionStatus
  // Detailed fields for transaction details page
  linkedOrderId?: string
  linkedAuctionId?: string
  paymentStatus?: string
  paymentMethodDetails?: PaymentMethodDetails
  userInfo?: TransactionUserInfo
  timeline?: TransactionTimeline
  logs?: TransactionLog[]
}

/**
 * Wallet metrics interface
 */
export interface WalletMetrics {
  totalBalance: string
  totalTransactions: number
  pendingWithdrawals: string
  pendingWithdrawalsCount: number
  successRate: string
  successRatePendingCount: number
}

/**
 * User wallet status types
 */
export type UserWalletStatus = 'active' | 'frozen'

/**
 * User wallet interface
 */
export interface UserWallet {
  id: string
  userId: string
  userName: string
  userEmail: string
  balance: string
  lastTransaction: string
  status: UserWalletStatus
}

/**
 * User wallet metrics interface
 */
export interface UserWalletMetrics {
  totalUsers: number
  activeWallets: number
  frozenWallets: number
  totalBalance: string
}

/**
 * Withdrawal request status types
 */
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'hold' | 'active'

/**
 * Withdrawal metrics interface
 */
export interface WithdrawalMetrics {
  totalRequests: number
  pending: number
  processingFees: string
  totalBalance: string
}

/**
 * Withdrawal request interface
 */
export interface WithdrawalRequest {
  id: string
  requestId: string
  userId: string
  userName: string
  userEmail: string
  amount: string
  fee: string
  netAmount: string
  paymentMethod: string
  bankName?: string
  requestDate: string
  status: WithdrawalStatus
}

