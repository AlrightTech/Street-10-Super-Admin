import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from '../icons/Icons'

interface SelectDropdownProps {
  value: string
  options: { value: string; label: string }[]
  placeholder?: string
  onChange: (value: string) => void
  className?: string
}

export default function SelectDropdown({
  value,
  options,
  placeholder = 'Select...',
  onChange,
  className = '',
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const selectedOption = options.find((opt) => opt.value === value)
  const displayValue = selectedOption ? selectedOption.label : placeholder

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-lg bg-[#F3F5F6] px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E] transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>{displayValue}</span>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          {/* Dropdown Menu */}
          <div className="absolute z-50 mt-2 w-full origin-top rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto">
            <div className="py-1" role="listbox">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    value === option.value
                      ? 'bg-[#F3F5F6] text-[#F7931E] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

