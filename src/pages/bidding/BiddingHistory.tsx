import { useState, useMemo } from 'react'
import FilterDropdown from '../../components/finance/FilterDropdown'
import SearchBar from '../../components/ui/SearchBar'

interface BidHistoryItem {
  id: string
  bidderName: string
  bidderEmail: string
  status: string
  date: string
  time: string
  amount: string
  isWinning?: boolean
}

// Sample bidding history data
const BIDDING_HISTORY_DATA: BidHistoryItem[] = [
  {
    id: '1',
    bidderName: 'Michael Johnson',
    bidderEmail: 'michael.j@email.com',
    status: 'Winning - Pending Payment',
    date: '15/02/2024',
    time: '14:30:00',
    amount: '$520',
    isWinning: true,
  },
  {
    id: '2',
    bidderName: 'Sarah Williams',
    bidderEmail: 'sarah.w@email.com',
    status: 'Ended',
    date: '10/02/2024',
    time: '19:30:00',
    amount: '$510',
  },
  {
    id: '3',
    bidderName: 'John Smith',
    bidderEmail: 'john.s@email.com',
    status: 'Ended',
    date: '12/02/2024',
    time: '10:15:00',
    amount: '$500',
  },
  {
    id: '4',
    bidderName: 'Emily Davis',
    bidderEmail: 'emily.d@email.com',
    status: 'Ended',
    date: '08/02/2024',
    time: '16:45:00',
    amount: '$490',
  },
  {
    id: '5',
    bidderName: 'David Brown',
    bidderEmail: 'david.b@email.com',
    status: 'Ended',
    date: '14/02/2024',
    time: '11:20:00',
    amount: '$480',
  },
  {
    id: '6',
    bidderName: 'Lisa Anderson',
    bidderEmail: 'lisa.a@email.com',
    status: 'Ended',
    date: '09/02/2024',
    time: '13:55:00',
    amount: '$470',
  },
  {
    id: '7',
    bidderName: 'Robert Taylor',
    bidderEmail: 'robert.t@email.com',
    status: 'Ended',
    date: '13/02/2024',
    time: '09:30:00',
    amount: '$460',
  },
  {
    id: '8',
    bidderName: 'Jessica Martinez',
    bidderEmail: 'jessica.m@email.com',
    status: 'Ended',
    date: '11/02/2024',
    time: '15:10:00',
    amount: '$450',
  },
]

/**
 * Bidding History page
 */
export default function BiddingHistory() {
  const [searchValue, setSearchValue] = useState('')
  const [sortBy, setSortBy] = useState('Sort')

  // Parse date from date string (e.g., "10/02/2024")
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  // Filter and sort bidding history
  const filteredHistory = useMemo(() => {
    let result = [...BIDDING_HISTORY_DATA]

    // Filter by search value
    if (searchValue.trim()) {
      const query = searchValue.toLowerCase()
      result = result.filter(
        (bid) =>
          bid.bidderName.toLowerCase().includes(query) ||
          bid.bidderEmail.toLowerCase().includes(query) ||
          bid.amount.toLowerCase().includes(query)
      )
    }

    // Sort by date and time
    if (sortBy === 'Newest First') {
      result.sort((a, b) => {
        const dateA = parseDate(a.date)
        const dateB = parseDate(b.date)
        const dateDiff = dateB.getTime() - dateA.getTime()
        
        if (dateDiff === 0) {
          // If dates are equal, sort by time (newest first)
          const timeA = a.time.split(':').map(Number)
          const timeB = b.time.split(':').map(Number)
          const timeASeconds = timeA[0] * 3600 + timeA[1] * 60 + (timeA[2] || 0)
          const timeBSeconds = timeB[0] * 3600 + timeB[1] * 60 + (timeB[2] || 0)
          return timeBSeconds - timeASeconds
        }
        return dateDiff
      })
    } else if (sortBy === 'Oldest First') {
      result.sort((a, b) => {
        const dateA = parseDate(a.date)
        const dateB = parseDate(b.date)
        const dateDiff = dateA.getTime() - dateB.getTime()
        
        if (dateDiff === 0) {
          // If dates are equal, sort by time (oldest first)
          const timeA = a.time.split(':').map(Number)
          const timeB = b.time.split(':').map(Number)
          const timeASeconds = timeA[0] * 3600 + timeA[1] * 60 + (timeA[2] || 0)
          const timeBSeconds = timeB[0] * 3600 + timeB[1] * 60 + (timeB[2] || 0)
          return timeASeconds - timeBSeconds
        }
        return dateDiff
      })
    }
    // If sortBy is 'Sort' or anything else, return unsorted (original order)

    return result
  }, [searchValue, sortBy])

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Bidding Products</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700">
            <span>Dashboard</span>
            <span className="mx-1">:</span>
            <span className="text-gray-900">Bidding History</span>
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            {/* Sort Dropdown */}
            <FilterDropdown
              label={sortBy}
              options={['Sort', 'Newest First', 'Oldest First']}
              onSelect={handleSortChange}
            />

            {/* Search Input */}
            <SearchBar
              placeholder="Search by Title"
              value={searchValue}
              onChange={handleSearchChange}
              className="min-w-[180px] sm:min-w-[200px]"
            />
          </div>
        </div>
      </div>

      {/* Bidding History Section */}
      <section className="rounded-xl bg-white shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Bidding History</h2>
          <p className="text-sm text-gray-600">{filteredHistory.length} total bids</p>
        </div>

        <div className="space-y-4 border border-gray-200 rounded-lg p-4">
          {filteredHistory.map((bid) => (
            <div
              key={bid.id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              {/* Profile Picture and Bidder Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{bid.bidderName}</p>
                  <p className="text-xs text-gray-500 truncate">{bid.bidderEmail}</p>
                </div>
              </div>

              {/* Date and Time - Middle */}
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 justify-center">
                <span className="text-sm text-gray-600 whitespace-nowrap leading-tight">Ended</span>
                <span className="text-sm text-gray-600 whitespace-nowrap leading-tight">{bid.date}, {bid.time}</span>
              </div>

              {/* Amount - Right */}
              <div className="flex flex-col gap-0.5 min-w-0 justify-center">
                <span className="text-sm text-gray-600 whitespace-nowrap leading-tight">Amount</span>
                <span className="text-sm font-medium text-gray-900 whitespace-nowrap leading-tight">{bid.amount}</span>
              </div>

              {/* Status Badge and Actions - Far Right */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {bid.isWinning ? (
                  <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                    {bid.status}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-green-50 text-green-700 whitespace-nowrap">
                    Bidding
                  </span>
                )}
                <button className="text-green-600 hover:text-green-700" aria-label="Approve">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-gray-600" aria-label="Reject">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

