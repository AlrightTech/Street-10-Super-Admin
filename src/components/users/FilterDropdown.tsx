import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from '../icons/Icons'

/**
 * FilterDropdown component props
 */
export interface FilterDropdownProps {
  label: string
  options?: string[]
  onSelect?: (value: string) => void
  className?: string
}

/**
 * Filter dropdown component
 */
export default function FilterDropdown({
  label,
  options = [],
  onSelect,
  className = '',
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string>(label)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Update selected value when label prop changes
  useEffect(() => {
    setSelectedValue(label)
  }, [label])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    onSelect?.(value)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className={`relative w-full sm:w-auto ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between
         gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors whitespace-nowrap cursor-pointer w-full sm:w-auto"
        aria-label={`Filter by ${label}`}
        aria-expanded={isOpen}
      >
        <span>{selectedValue}</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>

      {isOpen && options.length > 0 && (
        <div className="absolute left-0 z-50 mt-2 w-48 origin-top-left rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          <div className="py-1" role="menu">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                role="menuitem"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

