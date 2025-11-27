import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from '../icons/Icons'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectDropdownProps {
  id?: string
  label?: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

export default function SelectDropdown({
  id,
  label,
  value,
  options,
  onChange,
  className = '',
  placeholder = 'Select an option',
  disabled = false,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get the label for the selected value
  const selectedOption = options.find((opt) => opt.value === value)
  const displayValue = selectedOption ? selectedOption.label : placeholder

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

  // Close dropdown on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          id={id}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full flex items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none transition-all ${
            disabled
              ? 'cursor-not-allowed opacity-50 bg-gray-50'
              : 'cursor-pointer hover:border-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]'
          } ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}
          aria-label={label || 'Select option'}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDownIcon
            className={`h-4 w-4 text-gray-500 transition-transform flex-shrink-0 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 w-full origin-top-left rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto">
            <div className="py-1" role="listbox">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors cursor-pointer ${
                    value === option.value
                      ? 'bg-[#F7931E] text-white'
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
        )}
      </div>
    </div>
  )
}
