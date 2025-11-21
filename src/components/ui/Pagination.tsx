interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = (isMobile: boolean = false) => {
    const pages: (number | string)[] = []
    
    if (isMobile) {
      // Mobile: Show fewer pages (current page, first, last, and nearby pages)
      if (totalPages <= 5) {
        // Show all pages if 5 or fewer on mobile
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
    } else {
      // Desktop: Show all pages if 8 or fewer
      if (totalPages <= 8) {
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
    }
    
    return pages
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
      >
        <span className="hidden sm:inline">&lt; Back</span>
        <span className="sm:hidden">&lt;</span>
      </button>
      
      {/* Mobile pagination */}
      <div className="flex items-center gap-0.5 sm:hidden">
        {getPageNumbers(true).map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-mobile-${index}`} className="px-1 text-gray-500 text-xs">
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
              onClick={() => onPageChange(pageNum)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors min-w-[32px] ${
                isActive
                  ? 'bg-[#6B46C1] text-white'
                  : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          )
        })}
      </div>
      
      {/* Desktop pagination */}
      <div className="hidden sm:flex items-center gap-1">
        {getPageNumbers(false).map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-desktop-${index}`} className="px-2 text-gray-500">
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
              onClick={() => onPageChange(pageNum)}
              className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#6B46C1] text-white'
                  : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          )
        })}
      </div>
      
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
      >
        <span className="hidden sm:inline">Next &gt;</span>
        <span className="sm:hidden">&gt;</span>
      </button>
    </div>
  )
}

