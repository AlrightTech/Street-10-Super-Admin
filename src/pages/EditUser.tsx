import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { usersApi } from '../services/users.api'
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
  const [userUuid, setUserUuid] = useState<string | null>(null) // Store UUID for API calls
  
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
      let userIdToFetch: string | null = null
      
      try {
        let userData: UserDetails | null = null
        
        // Try to get user from location state first
        if (location.state?.user) {
          userData = location.state.user as UserDetails
          // Still need to get UUID for API calls
          if (id) {
            userIdToFetch = id
            // Check if it's numeric and convert
            const isNumericId = !id.includes("-") && /^\d+$/.test(id)
            if (isNumericId) {
              try {
                const usersResult = await usersApi.getAll({
                  page: 1,
                  limit: 1000,
                })
                if (usersResult.data && usersResult.data.length > 0) {
                  const userIdMap = new Map<number, string>()
                  usersResult.data.forEach((user: any) => {
                    try {
                      if (user.id && typeof user.id === "string") {
                        const numericId =
                          parseInt(user.id.replace(/-/g, "").substring(0, 10), 16) %
                          1000000
                        userIdMap.set(numericId, user.id)
                      }
                    } catch (e) {
                      console.error("Error converting user ID:", user.id, e)
                    }
                  })
                  const numericId = parseInt(id)
                  const uuid = userIdMap.get(numericId)
                  if (uuid) {
                    userIdToFetch = uuid
                    console.log(`Successfully converted numeric ID ${id} to UUID: ${uuid}`)
                  }
                }
              } catch (error) {
                console.error("Error converting numeric ID to UUID:", error)
              }
            }
            setUserUuid(userIdToFetch)
          } else {
            setUserUuid(id || null)
          }
          setLoading(false)
          return
        } else if (id) {
          // Check if id is a numeric ID (not a UUID)
          userIdToFetch = id
          const isNumericId = !id.includes("-") && /^\d+$/.test(id)
          
          console.log("Processing user ID:", { id, isNumericId })
          
          if (isNumericId) {
            // This is a numeric ID, we need to convert it to UUID
            console.log("Numeric ID detected, fetching users list to find UUID...", id)
            
            try {
              const usersResult = await usersApi.getAll({
                page: 1,
                limit: 1000,
              })
              console.log("Fetched users for mapping:", usersResult.data?.length || 0)
              
              if (!usersResult.data || usersResult.data.length === 0) {
                throw new Error("No users found in the system")
              }
              
              const userIdMap = new Map<number, string>()
              usersResult.data.forEach((user: any) => {
                try {
                  if (user.id && typeof user.id === "string") {
                    const numericId =
                      parseInt(user.id.replace(/-/g, "").substring(0, 10), 16) %
                      1000000
                    userIdMap.set(numericId, user.id)
                  }
                } catch (e) {
                  console.error("Error converting user ID:", user.id, e)
                }
              })
              
              console.log("User ID map built with", userIdMap.size, "entries")
              
              const numericId = parseInt(id)
              const uuid = userIdMap.get(numericId)
              
              if (!uuid) {
                console.error(`User with numeric ID ${id} not found in mapping.`)
                throw new Error(`User with ID ${id} not found. The user may not exist or the ID mapping failed.`)
              }
              
              userIdToFetch = uuid
              console.log(`Successfully converted numeric ID ${id} to UUID: ${uuid}`)
            } catch (error: any) {
              console.error("Error converting numeric ID to UUID:", error)
              throw new Error(`Failed to convert user ID: ${error?.message || "Unknown error"}`)
            }
          } else {
            // It's already a UUID, use it directly
            console.log("Using UUID directly:", userIdToFetch)
          }
          
          // Verify we have a UUID to fetch
          if (!userIdToFetch) {
            throw new Error("Invalid user ID format")
          }
          
          // Store the UUID for later use
          setUserUuid(userIdToFetch)
          
          // Fetch from API using UUID
          console.log("Fetching user with UUID:", userIdToFetch)
          const apiUser = await usersApi.getById(userIdToFetch)
          // Transform to frontend format
          userData = {
            id: parseInt(apiUser.user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000,
            name: apiUser.user.email.split('@')[0],
            email: apiUser.user.email,
            phone: apiUser.user.phone || '',
            avatar: '',
            role: apiUser.user.role,
            accountStatus: apiUser.user.status === 'active' ? 'verified' : 'unverified',
            status: apiUser.user.status === 'active' ? 'active' : 'blocked',
            ordersMade: apiUser.stats?.ordersCount || 0,
            biddingWins: apiUser.stats?.bidsWon || 0,
            totalSpent: parseFloat(apiUser.stats?.totalSpent?.toString() || '0') / 100,
            totalRefunds: 0,
            pendingRefunds: 0,
            netSpending: parseFloat(apiUser.stats?.totalSpent?.toString() || '0') / 100,
            walletBalance: parseFloat(apiUser.user.wallet?.availableMinor?.toString() || '0') / 100,
            walletLimit: 10000,
            interests: [],
            interestsImage: '',
            biddings: [],
            orders: [],
          }
        }

        if (userData) {
          setUserDetails(userData)
          setFormData({
            name: userData.name,
            email: userData.email,
            interests: userData.interests?.join(', ') || '',
            password: '******',
            phone: userData.phone,
            address: 'Street #12, Kohat, Qatar',
          })
          setIsActive(userData.status === 'active')
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [location.state, id])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!userDetails || !userUuid) return
    
    // Basic validation
    if (!formData.email || !formData.email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }
    
    if (formData.phone && formData.phone.length > 0 && formData.phone.length < 10) {
      alert('Please enter a valid phone number')
      return
    }
    
    try {
      // Prepare update data - only include fields that can be updated
      const updateData: any = {}
      
      if (formData.email !== userDetails.email) {
        updateData.email = formData.email
      }
      
      if (formData.phone !== userDetails.phone) {
        updateData.phone = formData.phone || null
      }
      
      const newStatus = isActive ? 'active' : 'blocked'
      if (newStatus !== userDetails.status) {
        updateData.status = newStatus
      }
      
      // Only make API call if there are changes
      if (Object.keys(updateData).length > 0) {
        await usersApi.update(userUuid, updateData)
        
        // Show success message
        alert('User updated successfully!')
        
        // Navigate back to user details with updated data
        navigate(`/users/${userUuid}`, { 
          state: { 
            user: {
              ...userDetails,
              email: formData.email,
              phone: formData.phone,
              status: newStatus,
            }
          } 
        })
      } else {
        // No changes made
        alert('No changes to save')
      }
    } catch (error: any) {
      console.error('Error updating user:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update user. Please try again.'
      alert(`Error: ${errorMessage}`)
    }
  }

  const handleCancel = () => {
    navigate(`/users/${userUuid || userDetails?.id || id}`)
  }

  const handleBlock = async () => {
    if (!userDetails || !userUuid) return
    
    try {
      await usersApi.toggleBlock(userUuid, true)
      navigate(`/users/${userUuid}`)
    } catch (error) {
      console.error('Error blocking user:', error)
      alert('Failed to block user. Please try again.')
    }
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

