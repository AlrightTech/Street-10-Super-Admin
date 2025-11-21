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
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...props}
        onChange={handleChange}
        className={`block w-full rounded-lg border ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:border-[#F7941D] focus:outline-none focus:ring-2 focus:ring-[#F7941D]/20 ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
      />
      {error && (
        <p id={`${props.id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

