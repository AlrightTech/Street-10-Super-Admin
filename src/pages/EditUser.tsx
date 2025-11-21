import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getUserDetails, updateUserDetails } from '../data/mockUserDetails'
import type { UserDetails } from '../types/userDetails'

/**
 * Edit User page component
 */
export default function EditUser() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interests: '',
    password: '******',
    phone: '',
    address: '',
  })
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)
      // Try to get user from location state first
      if (location.state?.user) {
        // If it's UserDetails, use it directly
        if ('phone' in location.state.user && 'interests' in location.state.user) {
          const user = location.state.user as UserDetails
          setUserDetails(user)
          setFormData({
            name: user.name,
            email: user.email,
            interests: user.interests.join(', ') || '',
            password: '******',
            phone: user.phone,
            address: 'Street #12, Kohat, Qatar', // Default or from user data
          })
          setIsActive(user.status === 'active')
        } else {
          // If it's User type, fetch UserDetails
          const userId = location.state.user.id
          const userData = getUserDetails(userId)
          if (userData) {
            setUserDetails(userData)
            setFormData({
              name: userData.name,
              email: userData.email,
              interests: userData.interests.join(', ') || '',
              password: '******',
              phone: userData.phone,
              address: 'Street #12, Kohat, Qatar',
            })
            setIsActive(userData.status === 'active')
          }
        }
      } else if (id) {
        // If not in state, fetch by ID from mock data
        const userId = parseInt(id, 10)
        const userData = getUserDetails(userId)
        if (userData) {
          setUserDetails(userData)
          setFormData({
            name: userData.name,
            email: userData.email,
            interests: userData.interests.join(', ') || '',
            password: '******',
            phone: userData.phone,
            address: 'Street #12, Kohat, Qatar',
          })
          setIsActive(userData.status === 'active')
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [location.state, id])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (!userDetails) return
    
    // Parse interests from comma-separated string
    const interestsArray = formData.interests.split(',').map((i) => i.trim()).filter(Boolean)
    
    // Update user data in mock store
    updateUserDetails(userDetails.id, {
      name: formData.name,
      email: formData.email,
      interests: interestsArray.length > 0 ? interestsArray : ['Cars'],
      phone: formData.phone,
      status: isActive ? 'active' : 'blocked',
      accountStatus: isActive ? 'verified' : 'unverified',
    })
    
    // Navigate back to user details with updated data
    navigate(`/users/${userDetails.id}`, { 
      state: { 
        user: {
          ...userDetails,
          name: formData.name,
          email: formData.email,
          interests: interestsArray.length > 0 ? interestsArray : ['Cars'],
          phone: formData.phone,
          status: isActive ? 'active' : 'blocked',
          accountStatus: isActive ? 'verified' : 'unverified',
        }
      } 
    })
  }

  const handleCancel = () => {
    navigate(`/users/${userDetails?.id || id}`)
  }

  const handleBlock = () => {
    if (!userDetails) return
    
    // Update user status to blocked in mock store
    updateUserDetails(userDetails.id, {
      status: 'blocked',
      accountStatus: 'unverified',
    })
    
    // Navigate back to user details with updated data
    navigate(`/users/${userDetails.id}`, {
      state: {
        user: {
          ...userDetails,
          status: 'blocked',
          accountStatus: 'unverified',
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading user data...</p>
      </div>
    )
  }

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">User not found</p>
      </div>
    )
  }

  const inputClassName =
    'w-full rounded-lg border border-gray-200 bg-white px-4 py-2 pr-12 text-sm text-gray-900 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]'

  const renderEditIcon = () => (
    <svg
      className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  )

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="px-6 pt-4 pb-2">
        <h1 className="text-lg font-semibold text-gray-900 text-center">Edit User</h1>
      </div>

      <div className="px-6 pt-4 pb-6">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={inputClassName}
              />
              {renderEditIcon()}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Interests</label>
            <div className="relative">
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                className={inputClassName}
              />
              {renderEditIcon()}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={inputClassName}
              />
              {renderEditIcon()}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={inputClassName}
              />
              {renderEditIcon()}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={inputClassName}
              />
              {renderEditIcon()}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
            <div className="relative">
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={inputClassName}
              />
              {renderEditIcon()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#F39C12] focus:ring-offset-2 ${
                isActive ? 'bg-[#F39C12]' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={isActive}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">Activate/Deactivate</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleBlock}
              className="w-full sm:w-auto rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors cursor-pointer"
            >
              Block User
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E22] transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

