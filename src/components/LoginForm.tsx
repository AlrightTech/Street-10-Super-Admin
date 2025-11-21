import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TextField from './ui/TextField'
import PasswordField from './ui/PasswordField'
import Button from './ui/Button'
import { useTranslation } from '../hooks/useTranslation'

/**
 * Login form state type
 */
export interface LoginFormState {
  email: string
  password: string
}

/**
 * Login form errors type
 */
export interface LoginFormErrors {
  email?: string
  password?: string
}

/**
 * LoginForm component with typed form handling
 */
export default function LoginForm() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [formData, setFormData] = useState<LoginFormState>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Basic validation
    const newErrors: LoginFormErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('emailInvalid')
    }

    if (!formData.password.trim()) {
      newErrors.password = t('passwordRequired')
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordMinLength')
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    try {
      // In a real app, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Navigate to dashboard on success
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ password: t('invalidCredentials') })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <TextField
        id="email"
        type="email"
        label={t('email')}
        placeholder={t('enterEmail')}
        value={formData.email}
        onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
        error={errors.email}
        required
        autoComplete="email"
        aria-required="true"
      />

      <PasswordField
        id="password"
        label={t('password')}
        placeholder={t('enterPassword')}
        value={formData.password}
        onChange={(value) => setFormData((prev) => ({ ...prev, password: value }))}
        error={errors.password}
        required
        autoComplete="current-password"
        aria-required="true"
      />

      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t('loggingIn') : t('login')}
      </Button>

      <div className="text-center text-sm text-gray-600">
        <span>{t('forgetPassword')} </span>
        <Link
          to="/reset-password"
          className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
        >
          {t('reset')}
        </Link>
      </div>
    </form>
  )
}

