import { useState, useEffect } from 'react'
import { PencilIcon, TrashIcon } from '../components/icons/Icons'
import { mainControlApi, type LogosData, type ContactData, type FooterFeature } from '../services/main-control.api'

/**
 * Main Control page component
 */
/**
 * Contact Information interfaces
 */
interface ContactDetail {
  id: string
  label: string
  value: string
}

interface SocialMediaLink {
  id: string
  name: string
  icon: string
  url: string
}

interface TermsCondition {
  id: string
  title: string
  content: string
}

export default function MainControl() {
  const [activeFilter, setActiveFilter] = useState('logs-control')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState<'website' | 'app' | 'favicon' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Logos state
  const [logos, setLogos] = useState<LogosData>({
    websiteLogo: null,
    appLogo: null,
    favicon: null,
  })

  // Contact Information state
  const [phoneNumbers, setPhoneNumbers] = useState<ContactDetail[]>([])
  const [emailAddress, setEmailAddress] = useState<ContactDetail>({
    id: 'email',
    label: 'Email Address',
    value: '',
  })
  const [address, setAddress] = useState<ContactDetail>({
    id: 'address',
    label: 'Address',
    value: '',
  })
  const [footerOneFeatures, setFooterOneFeatures] = useState<FooterFeature[]>([])
  const [footerTwoFeatures, setFooterTwoFeatures] = useState<FooterFeature[]>([])
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>([])

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [editingType, setEditingType] = useState<'phone' | 'email' | 'address' | 'footerOneTitle' | 'footerOneLink' | 'footerTwoTitle' | 'footerTwoLink' | 'social' | 'socialIcon' | 'socialName' | 'terms' | 'privacy' | 'help' | 'about' | null>(null)

  // Terms & Conditions state
  const [termsConditions, setTermsConditions] = useState<TermsCondition[]>([
    {
      id: '1',
      title: 'Acceptance of Terms',
      content: 'By accessing and using the Tabeer website www.tabeer.com you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this site.',
    },
    {
      id: '2',
      title: 'Description of Service',
      content: 'Tabeer is an educational and career development platform that offers users access to curated information, tools, and guidance to support their academic and professional growth. Our services include access to scholarship opportunities, career counseling resources, and personalized mentorship. While general access to the platform and its informational content may be free, certain services are offered on a paid basis. These premium services include one-on-one mentorship sessions with registered experts, document review services for scholarship or job applications, and tailored guidance related to higher education and professional development. Users are responsible for any applicable fees associated with these services and Tabeer contains text and banner links to other sites. Tabeer does not exercise control over the information, products, services or policies of third party companies accessible through our site. This Privacy Policy applies solely to the information collected by this site.',
    },
    {
      id: '3',
      title: 'User Conduct',
      content: 'You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service: - In any way that violates any applicable federal, state, local, or international law or regulation. - To impersonate or attempt to impersonate Tabeer, a Tabeer employee, another user, or any other person or entity.',
    },
    {
      id: '4',
      title: 'Revenue Sharing Policy',
      content: 'Earnings generated through the platform are subject to a revenue-sharing model, where Mentor receives 70% and Tabeer retains 30%.',
    },
    {
      id: '5',
      title: 'Intellectual Property Rights',
      content: 'The Service and its original content, features, and functionality are and will remain the exclusive property of Tabeer and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.',
    },
    {
      id: '6',
      title: 'Termination',
      content: 'We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. - You are strictly prohibited from using any automated tools or manual methods (like bots, scrapers, or deep-links) to access, copy, or monitor any part of the site or its content. Attempting to bypass the site\'s navigation or access restricted areas, systems, or servers—through hacking, password mining, or any unauthorized means—is also not allowed. Tabeer reserves the right to block such activities. - You are not allowed to test or try to break the website\'s security. That includes probing or scanning for weaknesses or trying to bypass security measures. - You cannot attempt to access or uncover information about other users. This includes tracking, hacking, or trying to find out your personal details or account information. - You\'re only allowed to access and use your own information—using the site to obtain others\' private data in any way is strictly prohibited.',
    },
    {
      id: '7',
      title: 'Limitation of Liability',
      content: 'In no event shall Tabeer, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use or inability to use the Service. All unauthorized access to or use of our servers and/or any personal information stored therein.',
    },
    {
      id: '8',
      title: 'Changes to Terms',
      content: 'Tabeer reserves the right, at its sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.',
    },
    {
      id: '9',
      title: 'Contact Us',
      content: 'If you have any questions about these Terms, please contact us at info@Street10.com.',
    },
  ])

  // Privacy Policy state
  const [privacyPolicy, setPrivacyPolicy] = useState<TermsCondition[]>([
    {
      id: '1',
      title: 'Introduction',
      content: 'Welcome to Tabeeer. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you visit our website [www.tabeeer.com] and use our services.',
    },
    {
      id: '2',
      title: 'Information We Collect',
      content: 'Personal Information: When you register on our site, subscribe to our newsletter, or fill out a form, we may collect personal details such as your name, email address, phone number, and educational background.\n\nNon-Personal Information: We may collect non-personal data such as browser type, operating system, and IP address to improve our website\'s functionality and user experience.',
    },
    {
      id: '3',
      title: 'Contact Us',
      content: 'If you have any questions regarding this Privacy Policy, please contact us at [info@Street10.com].',
    },
  ])

  // Help Center state
  const [helpCenter, setHelpCenter] = useState<TermsCondition[]>([
    {
      id: '1',
      title: 'Introduction',
      content: 'This Help Center provides information about how we collect, use, and protect your information when you use our services. We are committed to ensuring your privacy and data security.',
    },
    {
      id: '2',
      title: 'Information We Collect',
      content: 'Personal Information: When you register on our site, subscribe to our newsletter, or fill out a form, we may collect personal details such as your name, email address, phone number, and account information.\n\nUsage Data: We may collect information about how you access and use our service, including your browser type, device information, pages visited, time spent on pages, and other usage statistics.\n\nOptional Information: We may collect additional information you provide through forms, surveys, or feedback submissions.',
    },
    {
      id: '3',
      title: 'How We Use Your Information',
      content: 'We use the information we collect to:\n- Provide and improve our services\n- Send you updates, newsletters, and promotional materials\n- Respond to your customer service requests\n- Analyze site traffic and user behavior to enhance user experience\n- Detect and prevent fraud or abuse',
    },
    {
      id: '4',
      title: 'Data Protection',
      content: 'We implement appropriate security measures to protect your personal information. Access to your data is restricted to authorized personnel only. We strive to ensure 100% secure transmission of your data.',
    },
    {
      id: '5',
      title: 'Cookies',
      content: 'We use cookies to enhance your user experience, track your preferences, and analyze site performance. You can choose to disable cookies through your browser settings, though this may affect some functionality of our site.',
    },
    {
      id: '6',
      title: 'Third-Party Services',
      content: 'Our site may contain links to third-party services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.',
    },
    {
      id: '7',
      title: 'Contact Us',
      content: 'If you have any questions about this Help Center or our practices, please contact us at info@Street10.com.',
    },
  ])

  // About Us state
  const [aboutUs, setAboutUs] = useState<TermsCondition[]>([
    {
      id: '1',
      title: 'Introduction',
      content: 'This About Us provides information about how we collect, use, and protect your information when you use our services. We are committed to ensuring your privacy and data security.',
    },
    {
      id: '2',
      title: 'Information We Collect',
      content: 'Personal Information: When you register on our site, subscribe to our newsletter, or fill out a form, we may collect personal details such as your name, email address, phone number, and account information.\n\nUsage Data: We may collect information about how you access and use our service, including your browser type, device information, pages visited, time spent on pages, and other usage statistics.\n\nOptional Information: We may collect additional information you provide through forms, surveys, or feedback submissions.',
    },
    {
      id: '3',
      title: 'How We Use Your Information',
      content: 'We use the information we collect to:\n- Provide and improve our services\n- Send you updates, newsletters, and promotional materials\n- Respond to your customer service requests\n- Analyze site traffic and user behavior to enhance user experience\n- Detect and prevent fraud or abuse',
    },
    {
      id: '4',
      title: 'Data Protection',
      content: 'We implement appropriate security measures to protect your personal information. Access to your data is restricted to authorized personnel only. We strive to ensure 100% secure transmission of your data.',
    },
    {
      id: '5',
      title: 'Cookies',
      content: 'We use cookies to enhance your user experience, track your preferences, and analyze site performance. You can choose to disable cookies through your browser settings, though this may affect some functionality of our site.',
    },
    {
      id: '6',
      title: 'Third-Party Services',
      content: 'Our site may contain links to third-party services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.',
    },
    {
      id: '7',
      title: 'Contact Us',
      content: 'If you have any questions about this About Us or our practices, please contact us at info@Street10.com.',
    },
  ])

  // Load all settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const allSettings = await mainControlApi.getAll()

        // Set logos
        if (allSettings.logos) {
          setLogos(allSettings.logos)
        }

        // Set contact information
        if (allSettings.contact) {
          setPhoneNumbers(allSettings.contact.phoneNumbers || [])
          setEmailAddress(allSettings.contact.email || { id: 'email', label: 'Email Address', value: '' })
          setAddress(allSettings.contact.address || { id: 'address', label: 'Address', value: '' })
          setFooterOneFeatures(allSettings.contact.footerOneFeatures || [])
          setFooterTwoFeatures(allSettings.contact.footerTwoFeatures || [])
          setSocialMediaLinks(allSettings.contact.socialMediaLinks || [])
        }

        // Set terms & conditions
        if (allSettings.terms?.sections) {
          setTermsConditions(allSettings.terms.sections)
        }

        // Set privacy policy
        if (allSettings.privacy?.sections) {
          setPrivacyPolicy(allSettings.privacy.sections)
        }

        // Set help center
        if (allSettings.help?.sections) {
          setHelpCenter(allSettings.help.sections)
        }

        // Set about us
        if (allSettings.about?.sections) {
          setAboutUs(allSettings.about.sections)
        }
      } catch (err: any) {
        console.error('Failed to load settings:', err)
        setError(err.response?.data?.message || 'Failed to load settings')
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // File upload handler for logos
  const handleLogoUpload = async (type: 'website' | 'app' | 'favicon', file: File) => {
    try {
      setUploadingLogo(type)
      setError(null)
      
      // Convert file to base64 or data URL
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const dataUrl = reader.result as string
          // For now, we'll use the data URL directly
          // In production, you'd upload to a cloud storage service and get a URL
          const updated = await mainControlApi.uploadLogo(type, dataUrl)
          setLogos(updated)
          setSuccessMessage(`${type === 'website' ? 'Website' : type === 'app' ? 'App' : 'Favicon'} logo uploaded successfully`)
        } catch (err: any) {
          console.error('Failed to upload logo:', err)
          setError(err.response?.data?.message || 'Failed to upload logo')
        } finally {
          setUploadingLogo(null)
        }
      }
      reader.onerror = () => {
        setError('Failed to read file')
        setUploadingLogo(null)
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      console.error('Failed to upload logo:', err)
      setError(err.response?.data?.message || 'Failed to upload logo')
      setUploadingLogo(null)
    }
  }


  // Save contact information handler
  const handleSaveContact = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const contact: ContactData = {
        phoneNumbers,
        email: emailAddress,
        address,
        footerOneFeatures,
        footerTwoFeatures,
        socialMediaLinks,
      }
      const updated = await mainControlApi.updateContact(contact)
      setPhoneNumbers(updated.phoneNumbers || [])
      setEmailAddress(updated.email || { id: 'email', label: 'Email Address', value: '' })
      setAddress(updated.address || { id: 'address', label: 'Address', value: '' })
      setFooterOneFeatures(updated.footerOneFeatures || [])
      setFooterTwoFeatures(updated.footerTwoFeatures || [])
      setSocialMediaLinks(updated.socialMediaLinks || [])
      setSuccessMessage('Contact information updated successfully')
    } catch (err: any) {
      console.error('Failed to save contact:', err)
      setError(err.response?.data?.message || 'Failed to save contact information')
    } finally {
      setIsLoading(false)
    }
  }

  // Save terms & conditions handler
  const handleSaveTerms = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const updated = await mainControlApi.updateTerms(termsConditions)
      setTermsConditions(updated.sections || [])
      setSuccessMessage('Terms & Conditions updated successfully')
    } catch (err: any) {
      console.error('Failed to save terms:', err)
      setError(err.response?.data?.message || 'Failed to save terms & conditions')
    } finally {
      setIsLoading(false)
    }
  }

  // Save privacy policy handler
  const handleSavePrivacy = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const updated = await mainControlApi.updatePrivacy(privacyPolicy)
      setPrivacyPolicy(updated.sections || [])
      setSuccessMessage('Privacy Policy updated successfully')
    } catch (err: any) {
      console.error('Failed to save privacy:', err)
      setError(err.response?.data?.message || 'Failed to save privacy policy')
    } finally {
      setIsLoading(false)
    }
  }

  // Save help center handler
  const handleSaveHelp = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const updated = await mainControlApi.updateHelp(helpCenter)
      setHelpCenter(updated.sections || [])
      setSuccessMessage('Help Center updated successfully')
    } catch (err: any) {
      console.error('Failed to save help:', err)
      setError(err.response?.data?.message || 'Failed to save help center')
    } finally {
      setIsLoading(false)
    }
  }

  // Save about us handler
  const handleSaveAbout = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const updated = await mainControlApi.updateAbout(aboutUs)
      setAboutUs(updated.sections || [])
      setSuccessMessage('About Us updated successfully')
    } catch (err: any) {
      console.error('Failed to save about:', err)
      setError(err.response?.data?.message || 'Failed to save about us')
    } finally {
      setIsLoading(false)
    }
  }

  const filters = [
    { id: 'logs-control', label: 'Logos Control' },
    { id: 'contact-information', label: 'Contact Information' },
    { id: 'terms-conditions', label: 'Terms & Conditions' },
    { id: 'privacy-policy', label: 'Privacy Policy' },
    { id: 'help-center', label: 'Help Center' },
    { id: 'about-us', label: 'About Us' },
  ]

  const renderContent = () => {
    switch (activeFilter) {
      case 'logs-control':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Website Logo Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="rounded-lg bg-blue-100 p-2 sm:p-3 flex-shrink-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg  font-semibold text-gray-900 mb-0.5">Website Logo</h3>
                  <p className="text-xs   text-gray-600 break-words">
                    (recommended size: 250×80px, PNG/SVG)</p>
                </div>
              </div>
              
              {/* Preview Section */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Preview</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-4 bg-gray-50 flex items-center justify-center" style={{ minHeight: '100px' }}>
                  {logos.websiteLogo ? (
                    <img 
                      src={logos.websiteLogo} 
                      alt="Website Logo" 
                      className="max-h-16 sm:max-h-20 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <p className="text-xs text-gray-400">No logo uploaded</p>
                  )}
                </div>
              </div>

              {/* Change Logo Section */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Change logo</label>
                <input
                  type="file"
                  id="website-logo-upload"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingLogo === 'website'}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleLogoUpload('website', file)
                    }
                  }}
                />
                <label
                  htmlFor="website-logo-upload"
                  className={`border-2 border-dashed rounded-lg p-4 sm:p-8 bg-gray-50 flex flex-col items-center justify-center transition-colors ${
                    uploadingLogo === 'website' 
                      ? 'border-gray-400 cursor-wait opacity-50' 
                      : 'border-gray-300 cursor-pointer hover:border-gray-400'
                  }`}
                  style={{ minHeight: '120px' }}
                >
                  {uploadingLogo === 'website' ? (
                    <>
                      <div className="h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-2 border-gray-300 border-t-[#F7931E] mb-2"></div>
                      <p className="text-xs sm:text-sm text-gray-600 text-center px-2">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <svg className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-xs sm:text-sm text-gray-600 text-center px-2">Drag and drop your logo here or click to browse</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* App Logo Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="rounded-lg bg-green-100 p-2 sm:p-3 flex-shrink-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5">App Logo</h3>
                  <p className="text-xs text-gray-600 break-words">(recommended size: 250×80px, PNG/SVG)</p>
                </div>
              </div>
              
              {/* Preview Section */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Preview</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-4 bg-gray-50 flex items-center justify-center" style={{ minHeight: '100px' }}>
                  {logos.appLogo ? (
                    <img 
                      src={logos.appLogo} 
                      alt="App Logo" 
                      className="max-h-16 sm:max-h-20 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <p className="text-xs text-gray-400">No logo uploaded</p>
                  )}
                </div>
              </div>

              {/* Change Logo Section */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Change logo</label>
                <input
                  type="file"
                  id="app-logo-upload"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingLogo === 'app'}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleLogoUpload('app', file)
                    }
                  }}
                />
                <label
                  htmlFor="app-logo-upload"
                  className={`border-2 border-dashed rounded-lg p-4 sm:p-8 bg-gray-50 flex flex-col items-center justify-center transition-colors ${
                    uploadingLogo === 'app' 
                      ? 'border-gray-400 cursor-wait opacity-50' 
                      : 'border-gray-300 cursor-pointer hover:border-gray-400'
                  }`}
                  style={{ minHeight: '120px' }}
                >
                  {uploadingLogo === 'app' ? (
                    <>
                      <div className="h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-2 border-gray-300 border-t-[#F7931E] mb-2"></div>
                      <p className="text-xs sm:text-sm text-gray-600 text-center px-2">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <svg className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-xs sm:text-sm text-gray-600 text-center px-2">Drag and drop your logo here or click to browse</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Favicon Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="rounded-lg bg-purple-100 p-2 sm:p-3 flex-shrink-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h16v4H4V4zm0 6h16v10H4V10z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5">Favicon</h3>
                  <p className="text-xs  text-gray-600 break-words">(recommended size: 32x32, PNG)</p>
                </div>
              </div>
              
              {/* Preview Section */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Preview</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-4 bg-gray-50 flex items-center justify-center" style={{ minHeight: '100px' }}>
                  {logos.favicon ? (
                    <img 
                      src={logos.favicon} 
                      alt="Favicon" 
                      className="max-h-16 sm:max-h-20 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <p className="text-xs text-gray-400">No favicon uploaded</p>
                  )}
                </div>
              </div>

              {/* Change Logo Section */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Change logo</label>
                <input
                  type="file"
                  id="favicon-upload"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingLogo === 'favicon'}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleLogoUpload('favicon', file)
                    }
                  }}
                />
                <label
                  htmlFor="favicon-upload"
                  className={`border-2 border-dashed rounded-lg p-4 sm:p-8 bg-gray-50 flex flex-col items-center justify-center transition-colors ${
                    uploadingLogo === 'favicon' 
                      ? 'border-gray-400 cursor-wait opacity-50' 
                      : 'border-gray-300 cursor-pointer hover:border-gray-400'
                  }`}
                  style={{ minHeight: '120px' }}
                >
                  {uploadingLogo === 'favicon' ? (
                    <>
                      <div className="h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-2 border-gray-300 border-t-[#F7931E] mb-2"></div>
                      <p className="text-xs sm:text-sm text-gray-600 text-center px-2">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <svg className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-xs sm:text-sm text-gray-600 text-center px-2">Drag and drop your logo here or click to browse</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        )
      case 'contact-information':
        const handleEdit = (id: string, value: string, type: 'phone' | 'email' | 'address' | 'footerOneTitle' | 'footerOneLink' | 'footerTwoTitle' | 'footerTwoLink' | 'social' | 'socialName' | 'socialIcon') => {
          setEditingId(id)
          setEditingValue(value)
          setEditingType(type)
        }

        const handleSave = () => {
          if (!editingId || !editingType) return

          switch (editingType) {
            case 'phone':
              setPhoneNumbers((prev) =>
                prev.map((item) => (item.id === editingId ? { ...item, value: editingValue } : item))
              )
              break
            case 'email':
              setEmailAddress({ ...emailAddress, value: editingValue })
              break
            case 'address':
              setAddress({ ...address, value: editingValue })
              break
            case 'footerOneTitle':
              setFooterOneFeatures((prev) =>
                prev.map((item) => (item.id === editingId ? { ...item, title: editingValue } : item))
              )
              break
            case 'footerOneLink':
              setFooterOneFeatures((prev) =>
                prev.map((item) => (item.id === editingId ? { ...item, link: editingValue } : item))
              )
              break
            case 'footerTwoTitle':
              setFooterTwoFeatures((prev) =>
                prev.map((item) => (item.id === editingId ? { ...item, title: editingValue } : item))
              )
              break
            case 'footerTwoLink':
              setFooterTwoFeatures((prev) =>
                prev.map((item) => (item.id === editingId ? { ...item, link: editingValue } : item))
              )
              break
            case 'social':
              setSocialMediaLinks((prev) =>
                prev.map((item) => (item.id === editingId ? { ...item, url: editingValue } : item))
              )
              break
            case 'socialName':
              setSocialMediaLinks((prev) =>
                prev.map((item) => (item.id === editingId ? { ...item, name: editingValue } : item))
              )
              break
            case 'socialIcon':
              setSocialMediaLinks((prev) =>
                prev.map((item) => (item.id === editingId ? { ...item, icon: editingValue } : item))
              )
              break
          }
          setEditingId(null)
          setEditingValue('')
          setEditingType(null)
        }

        const handleCancel = () => {
          setEditingId(null)
          setEditingValue('')
          setEditingType(null)
        }

        const handleAddPhone = () => {
          const newId = String(phoneNumbers.length + 1)
          setPhoneNumbers([...phoneNumbers, { id: newId, label: `${phoneNumbers.length + 1} Phone Number`, value: '' }])
        }

        const handleAddFooterOne = () => {
          const newId = String(Date.now())
          setFooterOneFeatures([...footerOneFeatures, { id: newId, title: '', link: '' }])
        }

        const handleAddFooterTwo = () => {
          const newId = String(Date.now())
          setFooterTwoFeatures([...footerTwoFeatures, { id: newId, title: '', link: '' }])
        }

        const handleDeleteFooterOne = (id: string) => {
          setFooterOneFeatures((prev) => prev.filter((item) => item.id !== id))
        }

        const handleDeleteFooterTwo = (id: string) => {
          setFooterTwoFeatures((prev) => prev.filter((item) => item.id !== id))
        }

        const handleAddSocial = () => {
          const newId = String(socialMediaLinks.length + 1)
          setSocialMediaLinks([...socialMediaLinks, { id: newId, name: 'New Social', icon: '', url: '' }])
        }

        const handleDeleteSocial = (id: string) => {
          setSocialMediaLinks((prev) => prev.filter((item) => item.id !== id))
        }

        const handleSocialIconUpload = async (id: string, file: File) => {
          try {
            setIsLoading(true)
            setError(null)
            const reader = new FileReader()
            reader.onloadend = () => {
              const dataUrl = reader.result as string
              setSocialMediaLinks((prev) =>
                prev.map((item) => (item.id === id ? { ...item, icon: dataUrl } : item))
              )
              setIsLoading(false)
            }
            reader.onerror = () => {
              setError('Failed to read file')
              setIsLoading(false)
            }
            reader.readAsDataURL(file)
          } catch (err: any) {
            console.error('Failed to upload icon:', err)
            setError(err.response?.data?.message || 'Failed to upload icon')
            setIsLoading(false)
          }
        }

        return (
          <div className="space-y-6">
            {/* Contact Details */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Contact Details</h4>
              <div className="space-y-4">
                {phoneNumbers.map((phone) => (
                  <div key={phone.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{phone.label}</label>
                    {editingId === phone.id && editingType === 'phone' ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20"
                          autoFocus
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-700 cursor-pointer"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-700 cursor-pointer"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          value={phone.value}
                          readOnly
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 cursor-default"
                        />
                        <button
                          onClick={() => handleEdit(phone.id, phone.value, 'phone')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddPhone}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Another Phone Number</span>
                </button>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{emailAddress.label}</label>
                  {editingId === emailAddress.id && editingType === 'email' ? (
                    <div className="relative">
                      <input
                        type="email"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20"
                        autoFocus
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-700 cursor-pointer"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="email"
                        value={emailAddress.value}
                        readOnly
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 cursor-default"
                      />
                      <button
                        onClick={() => handleEdit(emailAddress.id, emailAddress.value, 'email')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{address.label}</label>
                  {editingId === address.id && editingType === 'address' ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20"
                        autoFocus
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-700 cursor-pointer"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        value={address.value}
                        readOnly
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 cursor-default"
                      />
                      <button
                        onClick={() => handleEdit(address.id, address.value, 'address')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer One Features */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Footer One Features</h4>
              <div className="space-y-4">
                {footerOneFeatures.map((feature) => (
                  <div key={feature.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        {/* Title */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                          {editingId === feature.id && editingType === 'footerOneTitle' ? (
                            <div className="relative">
                              <input
                                type="text"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20"
                                autoFocus
                              />
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button
                                  onClick={handleSave}
                                  className="text-green-600 hover:text-green-700 cursor-pointer"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="text-red-600 hover:text-red-700 cursor-pointer"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type="text"
                                value={feature.title}
                                readOnly
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 cursor-default"
                              />
                              <button
                                onClick={() => handleEdit(feature.id, feature.title, 'footerOneTitle')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Link */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Link</label>
                          {editingId === feature.id && editingType === 'footerOneLink' ? (
                            <div className="relative">
                              <input
                                type="url"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20"
                                placeholder="https://"
                                autoFocus
                              />
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button
                                  onClick={handleSave}
                                  className="text-green-600 hover:text-green-700 cursor-pointer"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="text-red-600 hover:text-red-700 cursor-pointer"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type="url"
                                value={feature.link}
                                readOnly
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 cursor-default"
                              />
                              <button
                                onClick={() => handleEdit(feature.id, feature.link, 'footerOneLink')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="flex-shrink-0 pt-6">
                        <button
                          onClick={() => handleDeleteFooterOne(feature.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <TrashIcon className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleAddFooterOne}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Another Link</span>
                </button>
              </div>
            </div>

            {/* Footer Two Features */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Footer Two Features</h4>
              <div className="space-y-4">
                {footerTwoFeatures.map((feature) => (
                  <div key={feature.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        {/* Title */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                          {editingId === feature.id && editingType === 'footerTwoTitle' ? (
                            <div className="relative">
                              <input
                                type="text"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20"
                                autoFocus
                              />
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button
                                  onClick={handleSave}
                                  className="text-green-600 hover:text-green-700 cursor-pointer"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="text-red-600 hover:text-red-700 cursor-pointer"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type="text"
                                value={feature.title}
                                readOnly
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 cursor-default"
                              />
                              <button
                                onClick={() => handleEdit(feature.id, feature.title, 'footerTwoTitle')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Link */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Link</label>
                          {editingId === feature.id && editingType === 'footerTwoLink' ? (
                            <div className="relative">
                              <input
                                type="url"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20"
                                placeholder="https://"
                                autoFocus
                              />
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button
                                  onClick={handleSave}
                                  className="text-green-600 hover:text-green-700 cursor-pointer"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="text-red-600 hover:text-red-700 cursor-pointer"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type="url"
                                value={feature.link}
                                readOnly
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 cursor-default"
                              />
                              <button
                                onClick={() => handleEdit(feature.id, feature.link, 'footerTwoLink')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="flex-shrink-0 pt-6">
                        <button
                          onClick={() => handleDeleteFooterTwo(feature.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <TrashIcon className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleAddFooterTwo}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Another Link</span>
                </button>
              </div>
            </div>

            {/* Footer Social Media Links */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Social Media Links</h4>
              <div className="space-y-4">
                {socialMediaLinks.map((link) => (
                  <div key={link.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      {/* Icon Preview/Upload */}
                      <div className="flex-shrink-0">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Icon</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50 flex items-center justify-center" style={{ minHeight: '60px', minWidth: '60px' }}>
                          {link.icon ? (
                            <img 
                              src={link.icon} 
                              alt="Social Icon" 
                              className="max-h-12 max-w-12 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <p className="text-xs text-gray-400">No icon</p>
                          )}
                        </div>
                        <input
                          type="file"
                          id={`social-icon-${link.id}`}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleSocialIconUpload(link.id, file)
                            }
                          }}
                        />
                        <label
                          htmlFor={`social-icon-${link.id}`}
                          className="mt-1 block text-xs text-blue-600 hover:text-blue-700 cursor-pointer text-center"
                        >
                          Upload Icon
                        </label>
                      </div>

                      {/* Name and URL */}
                      <div className="flex-1 space-y-3">
                        {/* Name */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                          {editingId === link.id && editingType === 'socialName' ? (
                            <div className="relative">
                              <input
                                type="text"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20"
                                autoFocus
                              />
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button
                                  onClick={handleSave}
                                  className="text-green-600 hover:text-green-700 cursor-pointer"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="text-red-600 hover:text-red-700 cursor-pointer"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type="text"
                                value={link.name}
                                readOnly
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 cursor-default"
                              />
                              <button
                                onClick={() => handleEdit(link.id, link.name, 'socialName')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* URL */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">URL</label>
                          {editingId === link.id && editingType === 'social' ? (
                            <div className="relative">
                              <input
                                type="url"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20"
                                placeholder="https://"
                                autoFocus
                              />
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button
                                  onClick={handleSave}
                                  className="text-green-600 hover:text-green-700 cursor-pointer"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="text-red-600 hover:text-red-700 cursor-pointer"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type="url"
                                value={link.url}
                                readOnly
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 cursor-default"
                              />
                              <button
                                onClick={() => handleEdit(link.id, link.url, 'social')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="flex-shrink-0 pt-6">
                        <button
                          onClick={() => handleDeleteSocial(link.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <TrashIcon className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleAddSocial}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Social Media Link</span>
                </button>
              </div>
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-center sm:justify-end pt-4">
              <button
                onClick={handleSaveContact}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#F7931E] text-white rounded-lg text-sm font-medium hover:bg-[#e8851a] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )
      case 'terms-conditions':
        const handleEditTerms = (id: string, content: string) => {
          setEditingId(id)
          setEditingValue(content)
          setEditingType('terms')
        }

        const handleSaveSingleTerm = () => {
          if (!editingId || !editingType || editingType !== 'terms') return

          setTermsConditions((prev) =>
            prev.map((item) => (item.id === editingId ? { ...item, content: editingValue } : item))
          )
          setEditingId(null)
          setEditingValue('')
          setEditingType(null)
        }

        const handleCancelTerms = () => {
          setEditingId(null)
          setEditingValue('')
          setEditingType(null)
        }

        const handleAddTerm = () => {
          const newId = String(Date.now())
          setTermsConditions([...termsConditions, { id: newId, title: 'New Section', content: '' }])
        }

        const handleDeleteTerm = (id: string) => {
          setTermsConditions((prev) => prev.filter((item) => item.id !== id))
        }

        return (
          <div className="space-y-6">
            <h3 className="text-center text-lg sm:text-xl font-semibold text-gray-900">Terms & Conditions</h3>
            <div className="space-y-6">
              {termsConditions.map((term, index) => (
                <div key={term.id}>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-sm sm:text-base font-semibold text-gray-900 flex-shrink-0">{index + 1}.</span>
                    <div className="flex-1">
                      {editingId === term.id && editingType === 'terms' ? (
                        <div className="mb-2">
                          <input
                            type="text"
                            value={term.title}
                            onChange={(e) => {
                              setTermsConditions((prev) =>
                                prev.map((item) => (item.id === term.id ? { ...item, title: e.target.value } : item))
                              )
                            }}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 mb-2"
                            placeholder="Section Title"
                          />
                        </div>
                      ) : (
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">{term.title}</h4>
                      )}
                      {editingId === term.id && editingType === 'terms' ? (
                        <div className="relative">
                          <textarea
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 min-h-[100px] resize-y"
                            autoFocus
                          />
                          <div className="absolute right-2 top-2 flex items-center gap-1">
                            <button
                              onClick={handleSaveSingleTerm}
                              className="text-green-600 hover:text-green-700 cursor-pointer"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={handleCancelTerms}
                              className="text-red-600 hover:text-red-700 cursor-pointer"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative pr-8">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{term.content}</p>
                          <div className="absolute right-0 top-0 flex items-center gap-2">
                            <button
                              onClick={() => handleEditTerms(term.id, term.content)}
                              className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTerm(term.id)}
                              className="text-red-400 hover:text-red-600 cursor-pointer"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Button */}
            <div className="flex justify-start pt-2">
              <button
                onClick={handleAddTerm}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Section</span>
              </button>
            </div>

            {/* Save Button */}
            <div className="flex justify-center sm:justify-end pt-4">
              <button
                onClick={handleSaveTerms}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#F7931E] text-white rounded-lg text-sm font-medium hover:bg-[#e8851a] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )
      case 'privacy-policy':
        const handleEditPrivacy = (id: string, content: string) => {
          setEditingId(id)
          setEditingValue(content)
          setEditingType('privacy')
        }

        const handleSaveSinglePrivacy = () => {
          if (!editingId || !editingType || editingType !== 'privacy') return

          setPrivacyPolicy((prev) =>
            prev.map((item) => (item.id === editingId ? { ...item, content: editingValue } : item))
          )
          setEditingId(null)
          setEditingValue('')
          setEditingType(null)
        }

        const handleCancelPrivacy = () => {
          setEditingId(null)
          setEditingValue('')
          setEditingType(null)
        }

        const handleAddPrivacy = () => {
          const newId = String(Date.now())
          setPrivacyPolicy([...privacyPolicy, { id: newId, title: 'New Section', content: '' }])
        }

        const handleDeletePrivacy = (id: string) => {
          setPrivacyPolicy((prev) => prev.filter((item) => item.id !== id))
        }

        return (
          <div className="space-y-6">
            <h3 className="text-center text-lg sm:text-xl font-semibold text-gray-900">Privacy Policy</h3>
            <div className="space-y-6">
              {privacyPolicy.map((policy, index) => (
                <div key={policy.id}>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-sm sm:text-base font-semibold text-gray-900 flex-shrink-0">{index + 1}.</span>
                    <div className="flex-1">
                      {editingId === policy.id && editingType === 'privacy' ? (
                        <div className="mb-2">
                          <input
                            type="text"
                            value={policy.title}
                            onChange={(e) => {
                              setPrivacyPolicy((prev) =>
                                prev.map((item) => (item.id === policy.id ? { ...item, title: e.target.value } : item))
                              )
                            }}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 mb-2"
                            placeholder="Section Title"
                          />
                        </div>
                      ) : (
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">{policy.title}</h4>
                      )}
                      {editingId === policy.id && editingType === 'privacy' ? (
                        <div className="relative">
                          <textarea
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 min-h-[100px] resize-y"
                            autoFocus
                          />
                          <div className="absolute right-2 top-2 flex items-center gap-1">
                            <button
                              onClick={handleSaveSinglePrivacy}
                              className="text-green-600 hover:text-green-700 cursor-pointer"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={handleCancelPrivacy}
                              className="text-red-600 hover:text-red-700 cursor-pointer"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative pr-8">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{policy.content}</p>
                          <div className="absolute right-0 top-0 flex items-center gap-2">
                            <button
                              onClick={() => handleEditPrivacy(policy.id, policy.content)}
                              className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeletePrivacy(policy.id)}
                              className="text-red-400 hover:text-red-600 cursor-pointer"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Button */}
            <div className="flex justify-start pt-2">
              <button
                onClick={handleAddPrivacy}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Section</span>
              </button>
            </div>

            {/* Save Button */}
            <div className="flex justify-center sm:justify-end pt-4">
              <button
                onClick={handleSavePrivacy}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#F7931E] text-white rounded-lg text-sm font-medium hover:bg-[#e8851a] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )
      case 'help-center':
        const handleEditHelp = (id: string, content: string) => {
          setEditingId(id)
          setEditingValue(content)
          setEditingType('help')
        }

        const handleSaveSingleHelp = () => {
          if (!editingId || !editingType || editingType !== 'help') return

          setHelpCenter((prev) =>
            prev.map((item) => (item.id === editingId ? { ...item, content: editingValue } : item))
          )
          setEditingId(null)
          setEditingValue('')
          setEditingType(null)
        }

        const handleCancelHelp = () => {
          setEditingId(null)
          setEditingValue('')
          setEditingType(null)
        }

        const handleAddHelp = () => {
          const newId = String(Date.now())
          setHelpCenter([...helpCenter, { id: newId, title: 'New Section', content: '' }])
        }

        const handleDeleteHelp = (id: string) => {
          setHelpCenter((prev) => prev.filter((item) => item.id !== id))
        }

        return (
          <div className="space-y-6">
            <h3 className="text-center text-lg sm:text-xl font-semibold text-gray-900">Help Center</h3>
            <div className="space-y-6">
              {helpCenter.map((help, index) => (
                <div key={help.id}>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-sm sm:text-base font-semibold text-gray-900 flex-shrink-0">{index + 1}.</span>
                    <div className="flex-1">
                      {editingId === help.id && editingType === 'help' ? (
                        <div className="mb-2">
                          <input
                            type="text"
                            value={help.title}
                            onChange={(e) => {
                              setHelpCenter((prev) =>
                                prev.map((item) => (item.id === help.id ? { ...item, title: e.target.value } : item))
                              )
                            }}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 mb-2"
                            placeholder="Section Title"
                          />
                        </div>
                      ) : (
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">{help.title}</h4>
                      )}
                      {editingId === help.id && editingType === 'help' ? (
                        <div className="relative">
                          <textarea
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 min-h-[100px] resize-y"
                            autoFocus
                          />
                          <div className="absolute right-2 top-2 flex items-center gap-1">
                            <button
                              onClick={handleSaveSingleHelp}
                              className="text-green-600 hover:text-green-700 cursor-pointer"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={handleCancelHelp}
                              className="text-red-600 hover:text-red-700 cursor-pointer"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative pr-8">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{help.content}</p>
                          <div className="absolute right-0 top-0 flex items-center gap-2">
                            <button
                              onClick={() => handleEditHelp(help.id, help.content)}
                              className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteHelp(help.id)}
                              className="text-red-400 hover:text-red-600 cursor-pointer"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Button */}
            <div className="flex justify-start pt-2">
              <button
                onClick={handleAddHelp}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Section</span>
              </button>
            </div>

            {/* Save Button */}
            <div className="flex justify-center sm:justify-end pt-4">
              <button
                onClick={handleSaveHelp}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#F7931E] text-white rounded-lg text-sm font-medium hover:bg-[#e8851a] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )
      case 'about-us':
        const handleEditAbout = (id: string, content: string) => {
          setEditingId(id)
          setEditingValue(content)
          setEditingType('about')
        }

        const handleSaveSingleAbout = () => {
          if (!editingId || !editingType || editingType !== 'about') return

          setAboutUs((prev) =>
            prev.map((item) => (item.id === editingId ? { ...item, content: editingValue } : item))
          )
          setEditingId(null)
          setEditingValue('')
          setEditingType(null)
        }

        const handleCancelAbout = () => {
          setEditingId(null)
          setEditingValue('')
          setEditingType(null)
        }

        const handleAddAbout = () => {
          const newId = String(Date.now())
          setAboutUs([...aboutUs, { id: newId, title: 'New Section', content: '' }])
        }

        const handleDeleteAbout = (id: string) => {
          setAboutUs((prev) => prev.filter((item) => item.id !== id))
        }

        return (
          <div className="space-y-6">
            <h3 className="text-center text-lg sm:text-xl font-semibold text-gray-900">About Us</h3>
            <div className="space-y-6">
              {aboutUs.map((about, index) => (
                <div key={about.id}>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-sm sm:text-base font-semibold text-gray-900 flex-shrink-0">{index + 1}.</span>
                    <div className="flex-1">
                      {editingId === about.id && editingType === 'about' ? (
                        <div className="mb-2">
                          <input
                            type="text"
                            value={about.title}
                            onChange={(e) => {
                              setAboutUs((prev) =>
                                prev.map((item) => (item.id === about.id ? { ...item, title: e.target.value } : item))
                              )
                            }}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 mb-2"
                            placeholder="Section Title"
                          />
                        </div>
                      ) : (
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">{about.title}</h4>
                      )}
                      {editingId === about.id && editingType === 'about' ? (
                        <div className="relative">
                          <textarea
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-sm text-gray-900 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 min-h-[100px] resize-y"
                            autoFocus
                          />
                          <div className="absolute right-2 top-2 flex items-center gap-1">
                            <button
                              onClick={handleSaveSingleAbout}
                              className="text-green-600 hover:text-green-700 cursor-pointer"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={handleCancelAbout}
                              className="text-red-600 hover:text-red-700 cursor-pointer"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative pr-8">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{about.content}</p>
                          <div className="absolute right-0 top-0 flex items-center gap-2">
                            <button
                              onClick={() => handleEditAbout(about.id, about.content)}
                              className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAbout(about.id)}
                              className="text-red-400 hover:text-red-600 cursor-pointer"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Button */}
            <div className="flex justify-start pt-2">
              <button
                onClick={handleAddAbout}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Section</span>
              </button>
            </div>

            {/* Save Button */}
            <div className="flex justify-center sm:justify-end pt-4">
              <button
                onClick={handleSaveAbout}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#F7931E] text-white rounded-lg text-sm font-medium hover:bg-[#e8851a] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="mb-4 sm:mb-6">
      {/* Header */}
      <div className="mb-3 sm:mb-6">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Main Control</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Dashboard • Main Control</p>
      </div>

      {/* Filters/Tabs */}
      <div className="mb-4 sm:mb-6">
        <div className="flex gap-1 sm:gap-2 border-b border-gray-200 overflow-x-auto scrollbar-hide -mx-3 sm:mx-0 px-3 sm:px-0">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 sm:px-4 py-2.5 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeFilter === filter.id
                  ? 'border-[#F7931E] text-[#F7931E]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* Content Area */}
      <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-6 shadow-sm">
        {isLoading && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#F7931E]"></div>
            <span>Loading...</span>
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  )
}
