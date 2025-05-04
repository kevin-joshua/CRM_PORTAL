import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

const AccountSettings = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userType, setUserType] = useState(null)
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    address: ''
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError('Please log in to access account settings')
          setTimeout(() => navigate('/login'), 2000)
          return
        }

        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin')
          .select('adminid, username, email, phone')
          .eq('email', user.email)
          .maybeSingle()

        if (adminError) {
          console.error('Error fetching admin data:', adminError)
          throw adminError
        }

        if (adminData) {
          setUserType('admin')
          setUserData({
            username: adminData.username || '',
            
            email: adminData.email || '',
            phone: adminData.phone || '',
            
          })
          setLoading(false)
          return
        }

        // Check if user is customer
        const { data: customerData, error: customerError } = await supabase
          .from('customer')
          .select('customerid, firstname, lastname, email, phonenumber, address')
          .eq('email', user.email)
          .maybeSingle()

        if (customerError) {
          console.error('Error fetching customer data:', customerError)
          throw customerError
        }

        if (customerData) {
          setUserType('customer')
          setUserData({
            firstName: customerData.firstname || '',
            lastName: customerData.lastname || '',
            email: customerData.email || '',
            phone: customerData.phonenumber || '',
            address: customerData.address || ''
          })
        } else {
          setError('User profile not found')
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error)
        setError(error.message || 'Failed to fetch user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const tableName = userType === 'admin' ? 'admin' : 'customer'
      const updateData = {
        firstname: userData.firstName,
        lastname: userData.lastName,
        ...(userType === 'admin' 
          ? { phone: userData.phone }
          : { phonenumber: userData.phone }
        ),
        address: userData.address
      }

      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('email', user.email)

      if (error) throw error

      setSuccess('Profile updated successfully')
      setTimeout(() => navigate('/dashboard'), 1100)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
          
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">{success}</h3>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
           
            <div>
              <button
                type="submit"
                disabled={saving}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${
                  saving ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings 