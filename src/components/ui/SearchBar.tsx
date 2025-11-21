/**
 * SearchBar component props
 */
export interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

/**
 * Search icon component
 */
const SearchIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

/**
 * Search bar component with icon
 */
export default function SearchBar({
  placeholder = 'Search',
  value = '',
  onChange,
  className = '',
}: SearchBarProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border 
        border-gray-300 bg-white py-2 pl-9 
        sm:pl-10 pr-3 sm:pr-4 text-sm outline-none 
        placeholder:text-gray-400 focus:border-[#FF8C00]
         focus:ring-1 focus:ring-[#FF8C00]"
      />
    </div>
  )
}

