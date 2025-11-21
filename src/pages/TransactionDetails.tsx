import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mockWalletTransactions } from '../data/mockWallet'
import type { WalletTransaction, TransactionLog } from '../types/wallet'

/**
 * Transaction Details Page Component
 */
export default function TransactionDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState<WalletTransaction | null>(null)

  useEffect(() => {
    if (id) {
      // Find transaction by id
      const found = mockWalletTransactions.find((t) => t.id === id)
      if (found) {
        // Enrich with detailed information
        const detailedTransaction: WalletTransaction = {
          ...found,
          linkedOrderId: 'ORD-3004-456',
          linkedAuctionId: undefined,
          paymentStatus: '',
          paymentMethodDetails: {
            paymentType: found.paymentMethod || 'Bank Transfer',
            bankName: found.paymentMethod === 'Bank Transfer' ? 'Chase Bank' : undefined,
            accountNumber: found.paymentMethod === 'Bank Transfer' ? '****1234' : undefined,
            routingNumber: found.paymentMethod === 'Bank Transfer' ? '021000021' : undefined,
            cardLast4: found.paymentMethod === 'Credit Card' || found.paymentMethod === 'Debit Card' ? '1234' : undefined,
            cardBrand: found.paymentMethod === 'Credit Card' || found.paymentMethod === 'Debit Card' ? 'Visa' : undefined,
          },
          userInfo: {
            userId: 'USR-001',
            userName: found.userName || 'Sarah Johnson',
            userEmail: found.userEmail || 'sarah.johnson@email.com',
            userPhone: '+1 (058) 811-23-4567',
            userAvatar: undefined,
            currentWalletBalance: '$1245.50',
          },
          timeline: {
            created: '2024-01-20 14:25:00',
            processed: '2024-01-20 14:30:00',
            completed: found.status === 'completed' ? '2024-01-20 14:32:00' : undefined,
            failed: found.status === 'failed' ? '2024-01-20 14:32:00' : undefined,
          },
          logs: [
            {
              id: '1',
              message: 'Transaction initiated by System',
              timestamp: '2024-01-20 14:25:00',
              actor: 'System',
            },
            {
              id: '2',
              message: 'Payment verification started by System',
              timestamp: '2024-01-20 14:25:00',
              actor: 'System',
            },
            {
              id: '3',
              message: 'Payment verified successfully by Payment Gateway',
              timestamp: '2024-01-20 14:25:00',
              actor: 'Payment Gateway',
            },
          ],
        }
        setTransaction(detailedTransaction)
      }
    }
  }, [id])

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Transaction Not Found</h2>
          <p className="text-gray-600 mb-4">The transaction you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/wallet/all-transactions')}
            className="px-4 py-2 bg-[#FF8C00] text-white rounded-lg hover:bg-[#E67E00] transition-colors cursor-pointer"
          >
            Back to All Transactions
          </button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'credit' ? 'text-[#FF8C00]' : 'text-red-600'
  }

  return (
    <div className="max-w-screen w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Wallet</h1>
            <p className="text-sm text-gray-600 mt-1">Dashboard • All Transactions</p>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-2">Transaction Details</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                // Handle refund document
                console.log('Refund Document clicked')
              }}
              className="px-3 sm:px-4 py-2 bg-[#FF8C00] text-white rounded-lg hover:bg-[#E67E00] transition-colors text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer"
            >
              Refund Document
            </button>
            <button
              type="button"
              onClick={() => {
                // Handle refund transaction
                console.log('Refund Transaction clicked')
              }}
              className="px-3 sm:px-4 py-2 bg-[#FF8C00] text-white rounded-lg hover:bg-[#E67E00] transition-colors text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer"
            >
              Refund Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Summary Card - Full Width */}
      <div className="mb-4 sm:mb-6 rounded-lg border border-gray-200 bg-white p-3 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Transaction Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Section */}
          <div className="pr-0 sm:pr-6 border-r-0 sm:border-r border-gray-200 pb-4 sm:pb-0 border-b sm:border-b-0 border-gray-200">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{transaction.amount}</p>
              </div>
              <div>
                <p className={`text-sm font-medium ${getTypeColor(transaction.type)} capitalize`}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </p>
              </div>
              <div>
                <p className={`text-sm font-medium ${getStatusColor(transaction.status)} capitalize`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                <p className="text-sm font-bold text-gray-900 font-mono break-all">{transaction.transactionId}</p>
              </div>
            </div>
            {/* Payment Status - aligned with Linked Auction */}
            <div className="mt-3 sm:mt-0">
              <p className="text-sm text-gray-600 mb-1">Payment Status</p>
              <p className="text-sm text-gray-900">{transaction.paymentStatus || ''}</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="pl-0 sm:pl-6 pt-4 sm:pt-0">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                <p className="text-sm font-bold text-gray-900 font-mono break-all">{transaction.transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Linked Order</p>
                {transaction.linkedOrderId ? (
                  <button
                    onClick={() => {
                      // Navigate to order details
                      console.log('Navigate to order:', transaction.linkedOrderId)
                    }}
                    className="text-sm font-medium text-blue-600 underline hover:no-underline break-all text-left cursor-pointer"
                  >
                    {transaction.linkedOrderId}
                  </button>
                ) : (
                  <p className="text-sm text-gray-900">None</p>
                )}
              </div>
            </div>
            {/* Linked Auction - aligned with Payment Status */}
            <div className="mt-4 sm:mt-4">
              <p className="text-sm text-gray-600 mb-1">Linked Auction</p>
              {transaction.linkedAuctionId ? (
                <button
                  onClick={() => {
                    // Navigate to auction details
                    console.log('Navigate to auction:', transaction.linkedAuctionId)
                  }}
                  className="text-sm font-medium text-blue-600 underline hover:no-underline break-all text-left cursor-pointer"
                >
                  {transaction.linkedAuctionId}
                </button>
              ) : (
                <p className="text-sm text-gray-900">None</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Information Cards - All Stacked Vertically */}
      <div className="space-y-4 sm:space-y-6">
        {/* User Information Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">User Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Section - Profile Picture and Contact Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {transaction.userInfo?.userAvatar ? (
                  <img
                    src={transaction.userInfo.userAvatar}
                    alt={transaction.userInfo.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base sm:text-lg font-semibold text-gray-600">
                    {transaction.userInfo?.userName?.charAt(0) || transaction.userName.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-0.5 sm:space-y-1 min-w-0 text-center sm:text-left w-full sm:w-auto">
                <p className="text-sm font-medium text-gray-900 break-words">{transaction.userInfo?.userName || transaction.userName}</p>
                <p className="text-sm text-gray-900 break-all">{transaction.userInfo?.userEmail || transaction.userEmail}</p>
                {transaction.userInfo?.userPhone && (
                  <p className="text-sm text-gray-900 break-all">{transaction.userInfo.userPhone}</p>
                )}
              </div>
            </div>

            {/* Right Section - Wallet Balance and User ID */}
            <div className="space-y-2 mt-4 sm:mt-0 text-center sm:text-left">
              {transaction.userInfo?.currentWalletBalance && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Current Wallet Balance</p>
                  <p className="text-sm font-medium text-green-600">{transaction.userInfo.currentWalletBalance}</p>
                </div>
              )}
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">User ID</p>
                {transaction.userInfo?.userId ? (
                  <button
                    onClick={() => {
                      // Navigate to user details
                      console.log('Navigate to user:', transaction.userInfo?.userId)
                    }}
                    className="text-sm font-medium text-blue-600 hover:underline break-all sm:text-left cursor-pointer"
                  >
                    {transaction.userInfo.userId}
                  </button>
                ) : (
                  <p className="text-sm text-gray-900">-</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Card - Below User Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Payment Method</h3>
          <div className="space-y-3 sm:space-y-4">
            {/* Payment Type - Full Width */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Type</p>
              <p className="text-sm font-bold text-gray-900 break-words">
                {transaction.paymentMethodDetails?.paymentType || transaction.paymentMethod}
              </p>
            </div>
            
            {/* Bank Details - Three Column Grid */}
            {(transaction.paymentMethodDetails?.bankName || 
              transaction.paymentMethodDetails?.accountNumber || 
              transaction.paymentMethodDetails?.routingNumber) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 sm:gap-6">
                {transaction.paymentMethodDetails?.bankName && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bank Name</p>
                    <p className="text-sm font-bold text-gray-900 break-words">{transaction.paymentMethodDetails.bankName}</p>
                  </div>
                )}
                {transaction.paymentMethodDetails?.accountNumber && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Account Number</p>
                    <p className="text-sm font-bold text-gray-900 break-all">{transaction.paymentMethodDetails.accountNumber}</p>
                  </div>
                )}
                {transaction.paymentMethodDetails?.routingNumber && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Routing Number</p>
                    <p className="text-sm font-bold text-gray-900 break-all">{transaction.paymentMethodDetails.routingNumber}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Card Details (if applicable) */}
            {(transaction.paymentMethodDetails?.cardLast4 || transaction.paymentMethodDetails?.cardBrand) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 sm:gap-6">
                {transaction.paymentMethodDetails?.cardLast4 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Card Number</p>
                    <p className="text-sm font-bold text-gray-900 break-all">****{transaction.paymentMethodDetails.cardLast4}</p>
                  </div>
                )}
                {transaction.paymentMethodDetails?.cardBrand && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Card Brand</p>
                    <p className="text-sm font-bold text-gray-900 break-words">{transaction.paymentMethodDetails.cardBrand}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Transaction Timeline Card - Below Payment Method */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Transaction Timeline</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 sm:gap-6">
            {transaction.timeline?.created && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Created</p>
                <p className="text-sm font-medium text-gray-900 break-all">{transaction.timeline.created}</p>
              </div>
            )}
            {transaction.timeline?.processed && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Processed</p>
                <p className="text-sm font-medium text-gray-900 break-all">{transaction.timeline.processed}</p>
              </div>
            )}
            {transaction.timeline?.completed && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-sm font-medium text-gray-900 break-all">{transaction.timeline.completed}</p>
              </div>
            )}
            {transaction.timeline?.failed && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Failed</p>
                <p className="text-sm font-medium text-red-600 break-all">{transaction.timeline.failed}</p>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Logs Card - Below Transaction Timeline */}
        {transaction.logs && transaction.logs.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Transaction Logs</h3>
            <div className="space-y-3">
              {transaction.logs.map((log: TransactionLog) => (
                <div key={log.id} className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 break-words">{log.message}</p>
                    {log.actor && <p className="text-xs text-gray-500 mt-1">by {log.actor}</p>}
                  </div>
                  <p className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">{log.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

