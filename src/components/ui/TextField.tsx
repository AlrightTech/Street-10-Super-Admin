import { type ChangeEvent, type InputHTMLAttributes } from 'react'

/**
 * TextField component props
 */
export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  error?: string
  onChange: (value: string) => void
}

/**
 * Reusable TextField component with label and error handling
 */
export default function TextField({
  label,
  error,
  onChange,
  className = '',
  ...props
}: TextFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="space-y-1">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        {...props}
        onChange={handleChange}
        className={`block w-full rounded-lg border ${
          error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:border-[#F7941D] focus:outline-none focus:ring-2 focus:ring-[#F7941D]/20 ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
      />
      {error && (
        <p id={`${props.id}-error`} className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

