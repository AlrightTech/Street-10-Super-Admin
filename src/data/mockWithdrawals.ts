import type { WithdrawalMetrics, WithdrawalRequest, WithdrawalStatus } from '../types/wallet'

export const mockWithdrawalMetrics: WithdrawalMetrics = {
  totalRequests: 6,
  pending: 5,
  processingFees: '$26.50',
  totalBalance: '$6,453.3',
}

export const mockWithdrawalRequests: WithdrawalRequest[] = [
  {
    id: '1',
    requestId: 'WDR-2024-001',
    userId: 'user-001',
    userName: 'Michael Johnson',
    userEmail: 'michael.j@email.com',
    amount: '$500.00',
    fee: '$5.00',
    netAmount: '$495.00',
    paymentMethod: 'Bank Transfer',
    bankName: 'Chase Bank',
    requestDate: '2024-01-20',
    status: 'pending',
  },
  {
    id: '2',
    requestId: 'WDR-2024-002',
    userId: 'user-002',
    userName: 'Sarah Williams',
    userEmail: 'sarah.w@email.com',
    amount: '$750.00',
    fee: '$7.50',
    netAmount: '$742.50',
    paymentMethod: 'Bank Transfer',
    bankName: 'Wells Fargo',
    requestDate: '2024-01-19',
    status: 'approved',
  },
  {
    id: '3',
    requestId: 'WDR-2024-003',
    userId: 'user-003',
    userName: 'David Brown',
    userEmail: 'david.b@email.com',
    amount: '$300.00',
    fee: '$3.00',
    netAmount: '$297.00',
    paymentMethod: 'Bank Transfer',
    bankName: 'Bank of America',
    requestDate: '2024-01-18',
    status: 'active',
  },
  {
    id: '4',
    requestId: 'WDR-2024-004',
    userId: 'user-004',
    userName: 'Emily Davis',
    userEmail: 'emily.d@email.com',
    amount: '$1,000.00',
    fee: '$10.00',
    netAmount: '$990.00',
    paymentMethod: 'Bank Transfer',
    bankName: 'Citibank',
    requestDate: '2024-01-17',
    status: 'rejected',
  },
  {
    id: '5',
    requestId: 'WDR-2024-005',
    userId: 'user-005',
    userName: 'James Miller',
    userEmail: 'james.m@email.com',
    amount: '$250.00',
    fee: '$2.50',
    netAmount: '$247.50',
    paymentMethod: 'Bank Transfer',
    bankName: 'US Bank',
    requestDate: '2024-01-16',
    status: 'hold',
  },
  {
    id: '6',
    requestId: 'WDR-2024-006',
    userId: 'user-006',
    userName: 'Lisa Anderson',
    userEmail: 'lisa.a@email.com',
    amount: '$600.00',
    fee: '$6.00',
    netAmount: '$594.00',
    paymentMethod: 'Bank Transfer',
    bankName: 'PNC Bank',
    requestDate: '2024-01-15',
    status: 'approved',
  },
  // Generate more to reach 83 total
  ...Array.from({ length: 77 }, (_, i) => {
    const statuses: WithdrawalStatus[] = ['pending', 'approved', 'rejected', 'hold', 'active']
    const banks = ['Chase Bank', 'Wells Fargo', 'Bank of America', 'Citibank', 'US Bank', 'PNC Bank', 'TD Bank', 'Capital One']
    const num = i + 7
    const date = new Date(2024, 0, 20 - Math.floor(i / 4))
    const status = statuses[i % statuses.length]
    const amount = (Math.floor(Math.random() * 1000) + 100).toFixed(2)
    const fee = (parseFloat(amount) * 0.01).toFixed(2)
    const netAmount = (parseFloat(amount) - parseFloat(fee)).toFixed(2)
    
    return {
      id: String(num),
      requestId: `WDR-2024-${String(num).padStart(3, '0')}`,
      userId: `user-${String(num).padStart(3, '0')}`,
      userName: `User ${num}`,
      userEmail: `user${num}@email.com`,
      amount: `$${amount}`,
      fee: `$${fee}`,
      netAmount: `$${netAmount}`,
      paymentMethod: 'Bank Transfer',
      bankName: banks[i % banks.length],
      requestDate: date.toISOString().split('T')[0],
      status,
    } as WithdrawalRequest
  }),
]
