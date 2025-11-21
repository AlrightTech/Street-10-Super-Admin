import { useState, type ChangeEvent, type InputHTMLAttributes } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { EyeIcon, EyeOffIcon } from '../icons/Icons'

/**
 * PasswordField component props
 */
export interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label: string
  error?: string
  onChange: (value: string) => void
}

/**
 * Reusable PasswordField component with show/hide toggle
 */
export default function PasswordField({
  label,
  error,
  onChange,
  className = '',
  ...props
}: PasswordFieldProps) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="space-y-1">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          onChange={handleChange}
          className={`block w-full rounded-lg border ${
            error ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 pr-12 text-sm placeholder:text-gray-400 focus:border-[#F7941D] focus:outline-none focus:ring-2 focus:ring-[#F7941D]/20 ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
          aria-label={showPassword ? t('hidePassword') : t('showPassword')}
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && (
        <p id={`${props.id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

