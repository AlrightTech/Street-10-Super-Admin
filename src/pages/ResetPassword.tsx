import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import TextField from '../components/ui/TextField'
import Button from '../components/ui/Button'
import BrandLogo from '../components/BrandLogo'

/**
 * Reset password form state type
 */
interface ResetPasswordFormState {
  email: string
}

/**
 * Reset password page component
 */
export default function ResetPassword() {
  const [formData, setFormData] = useState<ResetPasswordFormState>({
    email: '',
  })
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (!formData.email.trim()) {
      setError('Email is required')
      setIsSubmitting(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSuccess(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <BrandLogo size="lg" className="justify-center" />
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-gray-600">Enter your email to receive a password reset link</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
          {isSuccess ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Email Sent!</h2>
              <p className="mt-2 text-gray-600">
                We've sent a password reset link to <strong>{formData.email}</strong>
              </p>
              <Link to="/" className="mt-6 inline-block">
                <Button variant="primary" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <TextField
                id="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
                error={error}
                required
                autoComplete="email"
                aria-required="true"
              />

              <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center text-sm">
                <Link
                  to="/"
                  className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

