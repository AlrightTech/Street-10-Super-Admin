import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import LanguageSwitcher from '../components/LanguageSwitcher'
import HeroSection from '../components/HeroSection'
import LoginForm from '../components/LoginForm'
import Footer from '../components/Footer'
import Button from '../components/ui/Button'
import { useTranslation } from '../hooks/useTranslation'

/**
 * Login page component with split-screen layout
 */
export default function LoginPage() {
  const { t } = useTranslation()
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header>
        <div className="flex items-center justify-between bg-white px-3 sm:px-4 md:px-6 py-2 sm:py-3">
          <BrandLogo size="sm" />
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Link to="/">
              <Button variant="primary" className="hidden sm:inline-flex px-6 md:px-10 text-xs sm:text-sm">
                {t('home')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <main className="flex-1">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 md:items-center px-3 sm:px-4 md:px-0">
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

