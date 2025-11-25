import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from '../icons/Icons'

interface FilterDropdownProps {
  label: string
  options: string[]
  onSelect?: (value: string) => void
  className?: string
  icon?: React.ReactNode
  hideArrow?: boolean
}

export default function FilterDropdown({ label, options = [], onSelect, className = '', icon, hideArrow = false }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string>(label)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Sync selectedValue with label prop when it changes
  useEffect(() => {
    setSelectedValue(label)
  }, [label])

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
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border 
        border-gray-200 bg-white px-2 py-2.5 text-xs font-medium
         text-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
        aria-label={`Filter by ${label}`}
        aria-expanded={isOpen}
      >
        <span>{selectedValue}</span>
        {icon && <span className="text-gray-500">{icon}</span>}
        {!hideArrow && <ChevronDownIcon className="h-4 w-4 text-gray-500" />}
      </button>

      {isOpen && options.length > 0 && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="py-1" role="menu">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`block w-full px-4 py-2 text-left text-sm transition-colors cursor-pointer ${
                  selectedValue === option
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
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

