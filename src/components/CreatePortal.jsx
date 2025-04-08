import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function CreatePortal() {
  const [loading, setLoading] = useState(false)
  const [portalName, setPortalName] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [adminId, setAdminId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get the current user's admin ID
    const getCurrentAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .from('admin')
          .select('adminid')
          .eq('email', user.email)
          .single()
        
        if (error) {
          console.error('Error fetching admin ID:', error)
          return
        }
        
        if (data) {
          setAdminId(data.adminid)
        }
      }
    }
    
    getCurrentAdmin()
  }, [])

  const handleCreatePortal = async (e) => {
    e.preventDefault()
    
    if (!adminId) {
      setError('You must be logged in as an admin to create a portal')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      // Insert into CRM_Portal table
      const { error: portalError } = await supabase
        .from('crm_portal')
        .insert([
          {
            portalname: portalName,
            administratorid: adminId
          }
        ])
      
      if (portalError) throw portalError
      
      setSuccess(true)
      setPortalName('')
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Create CRM Portal
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Set up a new CRM portal for your organization
          </p>
        </div>

        <form onSubmit={handleCreatePortal} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          {success && (
            <div className="rounded-md bg-green-50 p-3">
              <div className="text-sm text-green-700">
                Portal created successfully! Redirecting to dashboard...
              </div>
            </div>
          )}

          <div>
            <label htmlFor="portalName" className="block text-sm font-medium text-gray-700 mb-1">
              Portal Name
            </label>
            <input
              id="portalName"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              value={portalName}
              onChange={(e) => setPortalName(e.target.value)}
              placeholder="Enter portal name"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Creating...' : 'Create Portal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 