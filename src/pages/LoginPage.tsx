import { Navigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import LanguageSwitcher from '../components/LanguageSwitcher'
import HeroSection from '../components/HeroSection'
import LoginForm from '../components/LoginForm'
import Footer from '../components/Footer'
import Favicon from '../components/Favicon'
import { authApiService } from '../services/auth.api'

/**
 * Login page component with split-screen layout
 */
const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'https://st10.info'

export default function LoginPage() {
  // Redirect to dashboard if already authenticated as super-admin
  if (authApiService.isAuthenticated() && authApiService.isSuperAdmin()) {
    return <Navigate to="/dashboard" replace />
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Favicon />
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3">
          {/* Left: Logo + Language dropdown with circular flag */}
          <div className="flex items-center gap-4 md:gap-6">
            <BrandLogo size="sm" />
            <LanguageSwitcher />
          </div>

          {/* Right: Home button */}
          <a
            href={WEBSITE_URL}
            onClick={(e) => {
              e.preventDefault()
              window.location.href = WEBSITE_URL
            }}
            className="rounded-md bg-[#ee8e31] px-6 py-2.5 text-white font-semibold shadow transition hover:bg-[#d97d2a] cursor-pointer"
          >
            Home
          </a>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <main className="flex-1">
        <div className="grid max-w-7xl grid-cols-1 gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 md:items-center pr-4 sm:pr-6 md:pr-8">
          {/* Left Side - Hero Section with Carousel */}
          <div className="hidden md:block mt-2">
            <HeroSection />
          </div>

          {/* Right Side - Login Form */}
          <div className="flex items-center justify-center px-4 sm:px-6 md:px-10">
            <div className="w-full max-w-md rounded-2xl bg-white mt-6 sm:mt-8 md:mt-10 lg:mb-0 mb-6 sm:mb-8 md:mb-10 lg:mt-0 p-4 sm:p-6 md:p-8 shadow-lg">
              <LoginForm />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

