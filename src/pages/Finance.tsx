import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FinanceSummaryCard from '../components/finance/FinanceSummaryCard'
import VendorUsersToggle from '../components/finance/VendorUsersToggle'
import FinanceFilterTabs, { type FinanceFilterKey } from '../components/finance/FinanceFilterTabs'
import VendorPayoutTable, { type VendorPayout } from '../components/finance/VendorPayoutTable'
import UserTransactionsTable from '../components/finance/UserTransactionsTable'
import VendorTransactionDetail from '../components/finance/VendorTransactionDetail'
import UserTransactionDetail from '../components/finance/UserTransactionDetail'
import FilterDropdown from '../components/finance/FilterDropdown'
import type { FinanceActionType } from '../components/finance/FinanceActionMenu'
import SearchBar from '../components/ui/SearchBar'
import { DollarSignIcon, WalletIcon, ShoppingCartIcon, ExportIcon, BarChart3Icon, CalendarIcon } from '../components/icons/Icons'
import type { FinanceStatus } from '../components/finance/FinanceStatusBadge'

export interface FinanceTransaction {
  id: string
  transactionId: string
  user: string
  orderId: string
  amountPaid: string
  commission: string
  paymentMethod: string
  status: FinanceStatus
  orderDate: string
}

export interface UserTransaction {
  id: string
  transactionId: string
  userName: string
  userEmail: string
  type: 'credit' | 'debit'
  amount: string
  paymentMethod: string
  date: string
  status: 'pending' | 'completed' | 'failed'
}

// Mock data for vendor payouts
const MOCK_VENDOR_PAYOUTS: VendorPayout[] = [
  { id: 1, name: 'Touseef Ahmed', businessName: 'ABC Mart', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'active', totalPayout: '$11,250', paymentStatus: 'paid' },
  { id: 2, name: 'Qasim Muneer', businessName: 'Fresh Foods', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'pending', totalPayout: '$11,250', paymentStatus: 'pending' },
  { id: 3, name: 'Yasir Hafeez', businessName: 'TechWorld', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'active', totalPayout: '$11,250', paymentStatus: 'paid' },
  { id: 4, name: 'Junaid Akhtar Butt', businessName: 'Fashion Hub', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'blocked', totalPayout: '$11,250', paymentStatus: 'unpaid' },
  { id: 5, name: 'Tariq Iqbal', businessName: 'GreenGrocers', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'active', totalPayout: '$11,250', paymentStatus: 'paid' },
  { id: 6, name: 'Muhammed Saeed', businessName: 'ABC Mart', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'pending', totalPayout: '$11,250', paymentStatus: 'pending' },
  { id: 7, name: 'Abdurrehman', businessName: 'Fresh Foods', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'active', totalPayout: '$11,250', paymentStatus: 'paid' },
  { id: 8, name: 'Yasir Hafeez', businessName: 'TechWorld', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'blocked', totalPayout: '$11,250', paymentStatus: 'unpaid' },
  { id: 9, name: 'Touseef Ahmed', businessName: 'Fashion Hub', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'active', totalPayout: '$11,250', paymentStatus: 'paid' },
  { id: 10, name: 'Qasim Muneer', businessName: 'GreenGrocers', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'pending', totalPayout: '$11,250', paymentStatus: 'pending' },
  { id: 11, name: 'Yasir Hafeez', businessName: 'ABC Mart', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'active', totalPayout: '$11,250', paymentStatus: 'pending' },
  { id: 12, name: 'Junaid Akhtar Butt', businessName: 'Fresh Foods', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'active', totalPayout: '$11,250', paymentStatus: 'paid' },
  { id: 13, name: 'Tariq Iqbal', businessName: 'TechWorld', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'blocked', totalPayout: '$11,250', paymentStatus: 'unpaid' },
  { id: 14, name: 'Muhammed Saeed', businessName: 'Fashion Hub', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'active', totalPayout: '$11,250', paymentStatus: 'paid' },
  { id: 15, name: 'Abdurrehman', businessName: 'GreenGrocers', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'pending', totalPayout: '$11,250', paymentStatus: 'unpaid' },
  { id: 16, name: 'Yasir Hafeez', businessName: 'ABC Mart', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'active', totalPayout: '$11,250', paymentStatus: 'paid' },
  { id: 17, name: 'Touseef Ahmed', businessName: 'Fresh Foods', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'pending', totalPayout: '$11,250', paymentStatus: 'pending' },
  { id: 18, name: 'Qasim Muneer', businessName: 'TechWorld', totalSales: '$12,500', commissionRate: '10%', totalCommission: '$1,250', status: 'active', totalPayout: '$11,250', paymentStatus: 'unpaid' },
]

// Mock data for user transactions
const MOCK_USER_TRANSACTIONS: UserTransaction[] = [
  { id: '1', transactionId: 'TXN-2024-001', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Bank Transfer', date: '2024-01-20', status: 'pending' },
  { id: '2', transactionId: 'TXN-2024-001', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'debit', amount: '$150.00', paymentMethod: 'Wallet Balance', date: '2024-01-20', status: 'completed' },
  { id: '3', transactionId: 'TXN-2024-001', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Credit Card', date: '2024-01-20', status: 'pending' },
  { id: '4', transactionId: 'TXN-2024-001', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'debit', amount: '$150.00', paymentMethod: 'Wallet Balance', date: '2024-01-20', status: 'failed' },
  { id: '5', transactionId: 'TXN-2024-001', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Bank Transfer', date: '2024-01-20', status: 'completed' },
  { id: '6', transactionId: 'TXN-2024-002', userName: 'Sarah Williams', userEmail: 'sarahw@email.com', type: 'credit', amount: '$200.00', paymentMethod: 'Credit Card', date: '2024-01-21', status: 'completed' },
  { id: '7', transactionId: 'TXN-2024-003', userName: 'David Brown', userEmail: 'davidb@email.com', type: 'debit', amount: '$175.00', paymentMethod: 'Wallet Balance', date: '2024-01-22', status: 'pending' },
  { id: '8', transactionId: 'TXN-2024-004', userName: 'Emily Davis', userEmail: 'emilyd@email.com', type: 'credit', amount: '$125.00', paymentMethod: 'Bank Transfer', date: '2024-01-23', status: 'failed' },
  { id: '9', transactionId: 'TXN-2024-005', userName: 'James Wilson', userEmail: 'jamesw@email.com', type: 'credit', amount: '$300.00', paymentMethod: 'Credit Card', date: '2024-01-24', status: 'completed' },
  { id: '10', transactionId: 'TXN-2024-006', userName: 'Lisa Anderson', userEmail: 'lisaa@email.com', type: 'debit', amount: '$100.00', paymentMethod: 'Wallet Balance', date: '2024-01-25', status: 'pending' },
  { id: '11', transactionId: 'TXN-2024-007', userName: 'Robert Taylor', userEmail: 'robertt@email.com', type: 'credit', amount: '$250.00', paymentMethod: 'Bank Transfer', date: '2024-01-26', status: 'completed' },
  { id: '12', transactionId: 'TXN-2024-008', userName: 'Jennifer Martinez', userEmail: 'jenniferm@email.com', type: 'debit', amount: '$180.00', paymentMethod: 'Credit Card', date: '2024-01-27', status: 'failed' },
  { id: '13', transactionId: 'TXN-2024-009', userName: 'Christopher Lee', userEmail: 'christopherl@email.com', type: 'credit', amount: '$220.00', paymentMethod: 'Wallet Balance', date: '2024-01-28', status: 'completed' },
  { id: '14', transactionId: 'TXN-2024-010', userName: 'Amanda White', userEmail: 'amandaw@email.com', type: 'credit', amount: '$190.00', paymentMethod: 'Bank Transfer', date: '2024-01-29', status: 'pending' },
  { id: '15', transactionId: 'TXN-2024-011', userName: 'Daniel Harris', userEmail: 'danielh@email.com', type: 'debit', amount: '$160.00', paymentMethod: 'Credit Card', date: '2024-01-30', status: 'completed' },
  { id: '16', transactionId: 'TXN-2024-012', userName: 'Jessica Clark', userEmail: 'jessicac@email.com', type: 'credit', amount: '$140.00', paymentMethod: 'Wallet Balance', date: '2024-02-01', status: 'failed' },
  { id: '17', transactionId: 'TXN-2024-013', userName: 'Matthew Lewis', userEmail: 'matthewl@email.com', type: 'credit', amount: '$270.00', paymentMethod: 'Bank Transfer', date: '2024-02-02', status: 'completed' },
  { id: '18', transactionId: 'TXN-2024-014', userName: 'Ashley Walker', userEmail: 'ashleyw@email.com', type: 'debit', amount: '$130.00', paymentMethod: 'Credit Card', date: '2024-02-03', status: 'pending' },
  { id: '19', transactionId: 'TXN-2024-015', userName: 'Ryan Hall', userEmail: 'ryanh@email.com', type: 'credit', amount: '$210.00', paymentMethod: 'Wallet Balance', date: '2024-02-04', status: 'completed' },
  { id: '20', transactionId: 'TXN-2024-016', userName: 'Nicole Young', userEmail: 'nicoley@email.com', type: 'debit', amount: '$165.00', paymentMethod: 'Bank Transfer', date: '2024-02-05', status: 'failed' },
  { id: '21', transactionId: 'TXN-2024-017', userName: 'Kevin King', userEmail: 'kevink@email.com', type: 'credit', amount: '$240.00', paymentMethod: 'Credit Card', date: '2024-02-06', status: 'completed' },
  { id: '22', transactionId: 'TXN-2024-018', userName: 'Michelle Wright', userEmail: 'michellew@email.com', type: 'credit', amount: '$155.00', paymentMethod: 'Wallet Balance', date: '2024-02-07', status: 'pending' },
  { id: '23', transactionId: 'TXN-2024-019', userName: 'Brandon Lopez', userEmail: 'brandonl@email.com', type: 'debit', amount: '$185.00', paymentMethod: 'Bank Transfer', date: '2024-02-08', status: 'completed' },
  { id: '24', transactionId: 'TXN-2024-020', userName: 'Stephanie Hill', userEmail: 'stephanieh@email.com', type: 'credit', amount: '$195.00', paymentMethod: 'Credit Card', date: '2024-02-09', status: 'failed' },
  { id: '25', transactionId: 'TXN-2024-021', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Bank Transfer', date: '2024-01-20', status: 'completed' },
  { id: '26', transactionId: 'TXN-2024-022', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'debit', amount: '$150.00', paymentMethod: 'Wallet Balance', date: '2024-01-20', status: 'completed' },
  { id: '27', transactionId: 'TXN-2024-023', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Credit Card', date: '2024-01-20', status: 'pending' },
  { id: '28', transactionId: 'TXN-2024-024', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'debit', amount: '$150.00', paymentMethod: 'Wallet Balance', date: '2024-01-20', status: 'failed' },
  { id: '29', transactionId: 'TXN-2024-025', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Bank Transfer', date: '2024-01-20', status: 'completed' },
  { id: '30', transactionId: 'TXN-2024-026', userName: 'Sarah Williams', userEmail: 'sarahw@email.com', type: 'credit', amount: '$200.00', paymentMethod: 'Credit Card', date: '2024-01-21', status: 'completed' },
  { id: '31', transactionId: 'TXN-2024-027', userName: 'David Brown', userEmail: 'davidb@email.com', type: 'debit', amount: '$175.00', paymentMethod: 'Wallet Balance', date: '2024-01-22', status: 'pending' },
  { id: '32', transactionId: 'TXN-2024-028', userName: 'Emily Davis', userEmail: 'emilyd@email.com', type: 'credit', amount: '$125.00', paymentMethod: 'Bank Transfer', date: '2024-01-23', status: 'failed' },
  { id: '33', transactionId: 'TXN-2024-029', userName: 'James Wilson', userEmail: 'jamesw@email.com', type: 'credit', amount: '$300.00', paymentMethod: 'Credit Card', date: '2024-01-24', status: 'completed' },
  { id: '34', transactionId: 'TXN-2024-030', userName: 'Lisa Anderson', userEmail: 'lisaa@email.com', type: 'debit', amount: '$100.00', paymentMethod: 'Wallet Balance', date: '2024-01-25', status: 'pending' },
  { id: '35', transactionId: 'TXN-2024-031', userName: 'Robert Taylor', userEmail: 'robertt@email.com', type: 'credit', amount: '$250.00', paymentMethod: 'Bank Transfer', date: '2024-01-26', status: 'completed' },
  { id: '36', transactionId: 'TXN-2024-032', userName: 'Jennifer Martinez', userEmail: 'jenniferm@email.com', type: 'debit', amount: '$180.00', paymentMethod: 'Credit Card', date: '2024-01-27', status: 'failed' },
  { id: '37', transactionId: 'TXN-2024-033', userName: 'Christopher Lee', userEmail: 'christopherl@email.com', type: 'credit', amount: '$220.00', paymentMethod: 'Wallet Balance', date: '2024-01-28', status: 'completed' },
  { id: '38', transactionId: 'TXN-2024-034', userName: 'Amanda White', userEmail: 'amandaw@email.com', type: 'credit', amount: '$190.00', paymentMethod: 'Bank Transfer', date: '2024-01-29', status: 'pending' },
  { id: '39', transactionId: 'TXN-2024-035', userName: 'Daniel Harris', userEmail: 'danielh@email.com', type: 'debit', amount: '$160.00', paymentMethod: 'Credit Card', date: '2024-01-30', status: 'completed' },
  { id: '40', transactionId: 'TXN-2024-036', userName: 'Jessica Clark', userEmail: 'jessicac@email.com', type: 'credit', amount: '$140.00', paymentMethod: 'Wallet Balance', date: '2024-02-01', status: 'failed' },
  { id: '41', transactionId: 'TXN-2024-037', userName: 'Matthew Lewis', userEmail: 'matthewl@email.com', type: 'credit', amount: '$270.00', paymentMethod: 'Bank Transfer', date: '2024-02-02', status: 'completed' },
  { id: '42', transactionId: 'TXN-2024-038', userName: 'Ashley Walker', userEmail: 'ashleyw@email.com', type: 'debit', amount: '$130.00', paymentMethod: 'Credit Card', date: '2024-02-03', status: 'pending' },
  { id: '43', transactionId: 'TXN-2024-039', userName: 'Ryan Hall', userEmail: 'ryanh@email.com', type: 'credit', amount: '$210.00', paymentMethod: 'Wallet Balance', date: '2024-02-04', status: 'completed' },
  { id: '44', transactionId: 'TXN-2024-040', userName: 'Nicole Young', userEmail: 'nicoley@email.com', type: 'debit', amount: '$165.00', paymentMethod: 'Bank Transfer', date: '2024-02-05', status: 'failed' },
  { id: '45', transactionId: 'TXN-2024-041', userName: 'Kevin King', userEmail: 'kevink@email.com', type: 'credit', amount: '$240.00', paymentMethod: 'Credit Card', date: '2024-02-06', status: 'completed' },
  { id: '46', transactionId: 'TXN-2024-042', userName: 'Michelle Wright', userEmail: 'michellew@email.com', type: 'credit', amount: '$155.00', paymentMethod: 'Wallet Balance', date: '2024-02-07', status: 'pending' },
  { id: '47', transactionId: 'TXN-2024-043', userName: 'Brandon Lopez', userEmail: 'brandonl@email.com', type: 'debit', amount: '$185.00', paymentMethod: 'Bank Transfer', date: '2024-02-08', status: 'completed' },
  { id: '48', transactionId: 'TXN-2024-044', userName: 'Stephanie Hill', userEmail: 'stephanieh@email.com', type: 'credit', amount: '$195.00', paymentMethod: 'Credit Card', date: '2024-02-09', status: 'failed' },
  { id: '49', transactionId: 'TXN-2024-045', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Bank Transfer', date: '2024-01-20', status: 'completed' },
  { id: '50', transactionId: 'TXN-2024-046', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'debit', amount: '$150.00', paymentMethod: 'Wallet Balance', date: '2024-01-20', status: 'completed' },
  { id: '51', transactionId: 'TXN-2024-047', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Credit Card', date: '2024-01-20', status: 'pending' },
  { id: '52', transactionId: 'TXN-2024-048', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'debit', amount: '$150.00', paymentMethod: 'Wallet Balance', date: '2024-01-20', status: 'failed' },
  { id: '53', transactionId: 'TXN-2024-049', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Bank Transfer', date: '2024-01-20', status: 'completed' },
  { id: '54', transactionId: 'TXN-2024-050', userName: 'Sarah Williams', userEmail: 'sarahw@email.com', type: 'credit', amount: '$200.00', paymentMethod: 'Credit Card', date: '2024-01-21', status: 'completed' },
  { id: '55', transactionId: 'TXN-2024-051', userName: 'David Brown', userEmail: 'davidb@email.com', type: 'debit', amount: '$175.00', paymentMethod: 'Wallet Balance', date: '2024-01-22', status: 'pending' },
  { id: '56', transactionId: 'TXN-2024-052', userName: 'Emily Davis', userEmail: 'emilyd@email.com', type: 'credit', amount: '$125.00', paymentMethod: 'Bank Transfer', date: '2024-01-23', status: 'failed' },
  { id: '57', transactionId: 'TXN-2024-053', userName: 'James Wilson', userEmail: 'jamesw@email.com', type: 'credit', amount: '$300.00', paymentMethod: 'Credit Card', date: '2024-01-24', status: 'completed' },
  { id: '58', transactionId: 'TXN-2024-054', userName: 'Lisa Anderson', userEmail: 'lisaa@email.com', type: 'debit', amount: '$100.00', paymentMethod: 'Wallet Balance', date: '2024-01-25', status: 'pending' },
  { id: '59', transactionId: 'TXN-2024-055', userName: 'Robert Taylor', userEmail: 'robertt@email.com', type: 'credit', amount: '$250.00', paymentMethod: 'Bank Transfer', date: '2024-01-26', status: 'completed' },
  { id: '60', transactionId: 'TXN-2024-056', userName: 'Jennifer Martinez', userEmail: 'jenniferm@email.com', type: 'debit', amount: '$180.00', paymentMethod: 'Credit Card', date: '2024-01-27', status: 'failed' },
  { id: '61', transactionId: 'TXN-2024-057', userName: 'Christopher Lee', userEmail: 'christopherl@email.com', type: 'credit', amount: '$220.00', paymentMethod: 'Wallet Balance', date: '2024-01-28', status: 'completed' },
  { id: '62', transactionId: 'TXN-2024-058', userName: 'Amanda White', userEmail: 'amandaw@email.com', type: 'credit', amount: '$190.00', paymentMethod: 'Bank Transfer', date: '2024-01-29', status: 'pending' },
  { id: '63', transactionId: 'TXN-2024-059', userName: 'Daniel Harris', userEmail: 'danielh@email.com', type: 'debit', amount: '$160.00', paymentMethod: 'Credit Card', date: '2024-01-30', status: 'completed' },
  { id: '64', transactionId: 'TXN-2024-060', userName: 'Jessica Clark', userEmail: 'jessicac@email.com', type: 'credit', amount: '$140.00', paymentMethod: 'Wallet Balance', date: '2024-02-01', status: 'failed' },
  { id: '65', transactionId: 'TXN-2024-061', userName: 'Matthew Lewis', userEmail: 'matthewl@email.com', type: 'credit', amount: '$270.00', paymentMethod: 'Bank Transfer', date: '2024-02-02', status: 'completed' },
  { id: '66', transactionId: 'TXN-2024-062', userName: 'Ashley Walker', userEmail: 'ashleyw@email.com', type: 'debit', amount: '$130.00', paymentMethod: 'Credit Card', date: '2024-02-03', status: 'pending' },
  { id: '67', transactionId: 'TXN-2024-063', userName: 'Ryan Hall', userEmail: 'ryanh@email.com', type: 'credit', amount: '$210.00', paymentMethod: 'Wallet Balance', date: '2024-02-04', status: 'completed' },
  { id: '68', transactionId: 'TXN-2024-064', userName: 'Nicole Young', userEmail: 'nicoley@email.com', type: 'debit', amount: '$165.00', paymentMethod: 'Bank Transfer', date: '2024-02-05', status: 'failed' },
  { id: '69', transactionId: 'TXN-2024-065', userName: 'Kevin King', userEmail: 'kevink@email.com', type: 'credit', amount: '$240.00', paymentMethod: 'Credit Card', date: '2024-02-06', status: 'completed' },
  { id: '70', transactionId: 'TXN-2024-066', userName: 'Michelle Wright', userEmail: 'michellew@email.com', type: 'credit', amount: '$155.00', paymentMethod: 'Wallet Balance', date: '2024-02-07', status: 'pending' },
  { id: '71', transactionId: 'TXN-2024-067', userName: 'Brandon Lopez', userEmail: 'brandonl@email.com', type: 'debit', amount: '$185.00', paymentMethod: 'Bank Transfer', date: '2024-02-08', status: 'completed' },
  { id: '72', transactionId: 'TXN-2024-068', userName: 'Stephanie Hill', userEmail: 'stephanieh@email.com', type: 'credit', amount: '$195.00', paymentMethod: 'Credit Card', date: '2024-02-09', status: 'failed' },
  { id: '73', transactionId: 'TXN-2024-069', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Bank Transfer', date: '2024-01-20', status: 'completed' },
  { id: '74', transactionId: 'TXN-2024-070', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'debit', amount: '$150.00', paymentMethod: 'Wallet Balance', date: '2024-01-20', status: 'completed' },
  { id: '75', transactionId: 'TXN-2024-071', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Credit Card', date: '2024-01-20', status: 'pending' },
  { id: '76', transactionId: 'TXN-2024-072', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'debit', amount: '$150.00', paymentMethod: 'Wallet Balance', date: '2024-01-20', status: 'failed' },
  { id: '77', transactionId: 'TXN-2024-073', userName: 'Michael Johnson', userEmail: 'michaelj@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Bank Transfer', date: '2024-01-20', status: 'completed' },
  { id: '78', transactionId: 'TXN-2024-074', userName: 'Sarah Williams', userEmail: 'sarahw@email.com', type: 'credit', amount: '$200.00', paymentMethod: 'Credit Card', date: '2024-01-21', status: 'completed' },
  { id: '79', transactionId: 'TXN-2024-075', userName: 'David Brown', userEmail: 'davidb@email.com', type: 'debit', amount: '$175.00', paymentMethod: 'Wallet Balance', date: '2024-01-22', status: 'pending' },
  { id: '80', transactionId: 'TXN-2024-076', userName: 'Emily Davis', userEmail: 'emilyd@email.com', type: 'credit', amount: '$125.00', paymentMethod: 'Bank Transfer', date: '2024-01-23', status: 'failed' },
  { id: '81', transactionId: 'TXN-2024-077', userName: 'James Wilson', userEmail: 'jamesw@email.com', type: 'credit', amount: '$300.00', paymentMethod: 'Credit Card', date: '2024-01-24', status: 'completed' },
  { id: '82', transactionId: 'TXN-2024-078', userName: 'Lisa Anderson', userEmail: 'lisaa@email.com', type: 'debit', amount: '$100.00', paymentMethod: 'Wallet Balance', date: '2024-01-25', status: 'pending' },
  { id: '83', transactionId: 'TXN-2024-079', userName: 'Robert Taylor', userEmail: 'robertt@email.com', type: 'credit', amount: '$250.00', paymentMethod: 'Bank Transfer', date: '2024-01-26', status: 'completed' },
]

const PAGE_SIZE = 10

const FILTER_OPTIONS: { key: FinanceFilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'refunded', label: 'Refunded' },
  { key: 'paid', label: 'Paid' },
  { key: 'pending', label: 'Pending' },
]

const USER_FILTER_OPTIONS: { key: FinanceFilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
  { key: 'failed', label: 'Failed' },
]


const STATUS_BADGE_CLASS: Record<FinanceFilterKey, { active: string; inactive: string }> = {
  all: {
    active: 'bg-[#4C50A2] text-white',
    inactive: 'bg-[#4C50A2] text-white',
  },
  refunded: {
    active: 'bg-[#FFE4DE] text-[#B71D18]',
    inactive: 'bg-[#FFE4DE] text-[#B71D18]',
  },
  paid: {
    active: 'bg-[#DCF6E5] text-[#118D57]',
    inactive: 'bg-[#DCF6E5] text-[#118D57]',
  },
  pending: {
    active: 'bg-[#FFF2D6] text-[#B76E00]',
    inactive: 'bg-[#FFF2D6] text-[#B76E00]',
  },
  completed: {
    active: 'bg-[#DCF6E5] text-[#118D57]',
    inactive: 'bg-[#DCF6E5] text-[#118D57]',
  },
  failed: {
    active: 'bg-[#FFE4DE] text-[#B71D18]',
    inactive: 'bg-[#FFE4DE] text-[#B71D18]',
  },
}

/**
 * Finance page component
 */
export default function Finance() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'vendor' | 'users'>('vendor')
  const [activeFilter, setActiveFilter] = useState<FinanceFilterKey>('all')
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('Sort By Date')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [viewingTransaction, setViewingTransaction] = useState<FinanceTransaction | null>(null)
  const [viewingUserTransaction, setViewingUserTransaction] = useState<UserTransaction | null>(null)

  const filterTabsWithCounts = useMemo(
    () => {
      if (activeTab === 'vendor') {
        return FILTER_OPTIONS.map((tab) => ({
          ...tab,
          count:
            tab.key === 'all'
              ? MOCK_VENDOR_PAYOUTS.length
              : MOCK_VENDOR_PAYOUTS.filter((p) => {
                  if (tab.key === 'refunded') return p.paymentStatus === 'unpaid'
                  if (tab.key === 'paid') return p.paymentStatus === 'paid'
                  if (tab.key === 'pending') return p.paymentStatus === 'pending'
                  return false
                }).length,
          badgeClassName: STATUS_BADGE_CLASS[tab.key],
        }))
      } else {
        return USER_FILTER_OPTIONS.map((tab) => ({
          ...tab,
          count:
            tab.key === 'all'
              ? MOCK_USER_TRANSACTIONS.length
              : MOCK_USER_TRANSACTIONS.filter((t) => {
                  if (tab.key === 'completed') return t.status === 'completed'
                  if (tab.key === 'pending') return t.status === 'pending'
                  if (tab.key === 'failed') return t.status === 'failed'
                  return false
                }).length,
          badgeClassName: STATUS_BADGE_CLASS[tab.key],
        }))
      }
    },
    [activeTab],
  )

  const filteredVendorPayouts = useMemo(() => {
    let result = [...MOCK_VENDOR_PAYOUTS]

    if (activeFilter !== 'all') {
      result = result.filter((payout) => {
        if (activeFilter === 'refunded') return payout.paymentStatus === 'unpaid'
        if (activeFilter === 'paid') return payout.paymentStatus === 'paid'
        if (activeFilter === 'pending') return payout.paymentStatus === 'pending'
        return false
      })
    }

    if (searchValue.trim()) {
      const query = searchValue.toLowerCase()
      result = result.filter(
        (payout) =>
          payout.name.toLowerCase().includes(query) ||
          payout.businessName.toLowerCase().includes(query),
      )
    }

    return result
  }, [activeFilter, searchValue, activeTab])

  const filteredUserTransactions = useMemo(() => {
    let result = [...MOCK_USER_TRANSACTIONS]

    // Apply status filter from dropdown
    if (statusFilter !== 'All Status') {
      const statusMap: Record<string, 'completed' | 'pending' | 'failed'> = {
        'Completed': 'completed',
        'Pending': 'pending',
        'Failed': 'failed',
      }
      const status = statusMap[statusFilter]
      if (status) {
        result = result.filter((transaction) => transaction.status === status)
      }
    }

    // Apply tab filter
    if (activeFilter !== 'all') {
      result = result.filter((transaction) => {
        if (activeFilter === 'completed') return transaction.status === 'completed'
        if (activeFilter === 'pending') return transaction.status === 'pending'
        if (activeFilter === 'failed') return transaction.status === 'failed'
        return false
      })
    }

    if (searchValue.trim()) {
      const query = searchValue.toLowerCase()
      result = result.filter(
        (transaction) =>
          transaction.transactionId.toLowerCase().includes(query) ||
          transaction.userName.toLowerCase().includes(query) ||
          transaction.userEmail.toLowerCase().includes(query),
      )
    }

    return result
  }, [activeFilter, searchValue, activeTab, statusFilter])

  const vendorTotalPages = Math.max(1, Math.ceil(filteredVendorPayouts.length / PAGE_SIZE))
  const userTotalPages = Math.max(1, Math.ceil(filteredUserTransactions.length / PAGE_SIZE))
  const totalPages = activeTab === 'vendor' ? vendorTotalPages : userTotalPages

  const paginatedVendorPayouts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredVendorPayouts.slice(start, start + PAGE_SIZE)
  }, [filteredVendorPayouts, currentPage])

  const paginatedUserTransactions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredUserTransactions.slice(start, start + PAGE_SIZE)
  }, [filteredUserTransactions, currentPage])

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 8) {
      // Show all pages if 8 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const handleFilterChange = (filterKey: FinanceFilterKey) => {
    setActiveFilter(filterKey)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleVendorPayoutAction = (payout: VendorPayout, action: FinanceActionType) => {
    if (action === 'view') {
      const vendorName = payout.name.toLowerCase().replace(/\s+/g, '-')
      navigate(`/finance/vendor/${vendorName}`)
    } else {
      console.log(`Action "${action}" selected for payout ${payout.id}`)
    }
  }

  const handleTransactionAction = (transaction: FinanceTransaction | UserTransaction, action: FinanceActionType) => {
    if (action === 'view') {
      if ('orderId' in transaction) {
        // Vendor transaction - navigate to vendor finance detail page
        const vendorName = (transaction as FinanceTransaction).user.toLowerCase().replace(/\s+/g, '-')
        navigate(`/finance/vendor/${vendorName}`)
      } else {
        // User transaction - navigate to user finance detail page
        const userTransaction = transaction as UserTransaction
        const userId = userTransaction.userName.toLowerCase().replace(/\s+/g, '-')
        navigate(`/finance/user/${userId}`)
      }
    } else {
      // Placeholder callback for other actions
      // eslint-disable-next-line no-console
      console.log(`Action "${action}" selected for transaction ${transaction.transactionId}`)
    }
  }


  // Summary card data
  const summaryCards = [
    {
      icon: <DollarSignIcon className="h-6 w-6 text-white" />,
      title: 'Total Revenue',
      value: '$122,531',
      subtext: '442 Transactions',
      iconBgColor: 'bg-sky-400',
    },
    {
      icon: <BarChart3Icon className="h-6 w-6 text-white" />,
      title: 'Commission',
      value: '$145.87',
      subtext: '197 Transactions',
      iconBgColor: 'bg-green-300',
    },
    {
      icon: <WalletIcon className="h-6 w-6 text-white" />,
      title: 'Vendor Payouts Pending',
      value: '$1,65,531',
      subtext: '321 Transactions',
      iconBgColor: 'bg-green-500',
    },
    {
      icon: <ShoppingCartIcon className="h-6 w-6 text-white" />,
      title: 'Refunds Processed',
      value: '$1,23,531',
      subtext: '32 Transactions',
      iconBgColor: 'bg-sky-400',
    },
  ]

  // If viewing vendor transaction detail, show detail view
  if (viewingTransaction && activeTab === 'users') {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Finance</h1>
          <p className="text-sm text-gray-600 mt-1">Dashboard - Finance</p>
        </div>
        <VendorTransactionDetail
          transaction={viewingTransaction}
          onClose={() => setViewingTransaction(null)}
          onActionSelect={handleTransactionAction}
        />
      </div>
    )
  }

  // If viewing user transaction detail, show detail view
  if (viewingUserTransaction && activeTab === 'vendor') {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Finance</h1>
          <p className="text-sm text-gray-600 mt-1">Dashboard - Finance</p>
        </div>
        <UserTransactionDetail
          transaction={viewingUserTransaction}
          onClose={() => setViewingUserTransaction(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Finance</h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Dashboard - Finance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-md transition-colors">
        {summaryCards.map((card, index) => (
          <div key={index} className={index > 0 ? 'lg:border-l lg:border-gray-200 lg:pl-4' : ''}>
            <FinanceSummaryCard
              icon={card.icon}
              title={card.title}
              value={card.value}
              subtext={card.subtext}
              iconBgColor={card.iconBgColor}
            />
          </div>
        ))}
      </div>

      {/* Vendor/Users Toggle */}
      <div className="mt-4 sm:mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg pt-1 px-1 pb-0 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <VendorUsersToggle 
              activeTab={activeTab} 
              onTabChange={(tab) => {
                setActiveTab(tab)
                setCurrentPage(1)
                setSearchValue('')
              }} 
            />
            <button
              type="button"
              onClick={() => navigate('/finance/all-transactions')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer w-full sm:w-auto"
            >
              See All Transaction History
            </button>
          </div>
        </div>
      </div>

      {/* User Filters - Only show when Vendor tab is active, on second line, right-aligned */}
      {activeTab === 'vendor' && (
        <div className="mt-3 sm:mt-4 flex justify-end">
          <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
            <FilterDropdown
              label={sortBy}
              options={['Sort By Date', 'Newest First', 'Oldest First']}
              onSelect={(value) => setSortBy(value)}
              icon={<CalendarIcon className="h-4 w-4" />}
            />
            <FilterDropdown
              label={statusFilter}
              options={['All Status', 'Completed', 'Pending', 'Failed']}
              onSelect={(value) => setStatusFilter(value)}
            />
            <SearchBar
              placeholder="Transaction ID"
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full sm:min-w-[220px] sm:min-w-[240px]"
            />
          </div>
        </div>
      )}

      {/* Transactions Section - Vendor View (shows FinanceTable) */}
      {activeTab === 'vendor' && (
        <>
          {/* Transactions Heading */}
          <div className="mt-4 sm:mt-6 mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">All Transactions</h2>
          </div>

          <section className="rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-colors">
            {/* Filters and Controls */}
            <header className="flex flex-col gap-3
             md:flex-row md:items-center md:justify-between 
             border-b border-gray-100 dark:border-gray-700 px-3 sm:px-4">
              <div className="flex items-center flex-shrink-0 overflow-x-auto overflow-y-hidden">
                <FinanceFilterTabs 
                  tabs={filterTabsWithCounts} 
                  activeTab={activeFilter} 
                  onTabChange={handleFilterChange} 
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 flex-shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-gray-200 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap cursor-pointer w-full sm:w-auto"
                >
                  Export
                  <ExportIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <SearchBar
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="w-full sm:min-w-[180px] sm:min-w-[200px]"
                />
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap cursor-pointer w-full sm:w-auto"
                >
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 01.8 1.6l-4.2 5.6a2 2 0 00-.4 1.2v5.6a1 1 0 01-1.447.894L12 16.618l-2.753 1.676A1 1 0 017.8 16.4v-5.6a2 2 0 00-.4-1.2L3.2 5.6A1 1 0 013 4z"
                    />
                  </svg>
                  Filter
                </button>
              </div>
            </header>

            {/* Table */}
            <div>
              <VendorPayoutTable
                payouts={paginatedVendorPayouts}
                startIndex={(currentPage - 1) * PAGE_SIZE}
                onActionSelect={handleVendorPayoutAction}
                onRowClick={(payout) => {
                  const vendorName = payout.name.toLowerCase().replace(/\s+/g, '-')
                  navigate(`/finance/vendor/${vendorName}`)
                }}
              />
            </div>

            {/* Pagination */}
            <footer className="flex flex-col sm:flex-row justify-end items-center gap-2 sm:gap-3 border-t border-gray-100 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <div className="flex items-center gap-1 sm:gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer rounded-lg border border-gray-200 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back
                </button>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-xs sm:text-sm text-gray-500">
                          ...
                        </span>
                      )
                    }
                    
                    const pageNum = page as number
                    const isActive = pageNum === currentPage
                    
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                          isActive
                            ? 'bg-[#4C50A2] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer rounded-lg border border-gray-200 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </footer>
          </section>
        </>
      )}

      {/* Transactions Section - Users View (shows FinanceTable) */}
      {activeTab === 'users' && (
        <>
          {/* Transactions Heading */}
          <div className="mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">All Transactions</h2>
          </div>

          <section className="rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-colors">
            {/* Filters and Controls */}
            <header className="flex flex-col gap-3 md:flex-row
             md:items-center md:justify-between border-b border-gray-100 dark:border-gray-700 
             px-3 sm:px-4">
              <div className="flex items-center flex-shrink-0 overflow-x-auto overflow-y-hidden">
                <FinanceFilterTabs tabs={filterTabsWithCounts} activeTab={activeFilter} onTabChange={handleFilterChange} />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 flex-shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-gray-200 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap cursor-pointer w-full sm:w-auto"
                >
                  Export
                  <ExportIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <SearchBar
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="w-full sm:min-w-[180px] sm:min-w-[200px]"
                />
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap cursor-pointer w-full sm:w-auto"
                >
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 01.8 1.6l-4.2 5.6a2 2 0 00-.4 1.2v5.6a1 1 0 01-1.447.894L12 16.618l-2.753 1.676A1 1 0 017.8 16.4v-5.6a2 2 0 00-.4-1.2L3.2 5.6A1 1 0 013 4z"
                    />
                  </svg>
                  Filter
                </button>
              </div>
            </header>

            {/* Table */}
            <div className="py-4">
              <UserTransactionsTable
                transactions={paginatedUserTransactions}
                startIndex={(currentPage - 1) * PAGE_SIZE}
                onActionSelect={handleTransactionAction}
              />
            </div>

            {/* Pagination */}
            <footer className="flex flex-col sm:flex-row justify-end items-center gap-2 sm:gap-3 border-t border-gray-100 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <div className="flex items-center gap-1 sm:gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer rounded-lg border border-gray-200 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back
                </button>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-xs sm:text-sm text-gray-500">
                          ...
                        </span>
                      )
                    }
                    
                    const pageNum = page as number
                    const isActive = pageNum === currentPage
                    
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                          isActive
                            ? 'bg-[#4C50A2] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer rounded-lg border border-gray-200 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </footer>
          </section>
        </>
      )}
    </div>
  )
}
