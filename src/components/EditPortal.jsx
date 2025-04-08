import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditPortal() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [portalName, setPortalName] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [adminId, setAdminId] = useState(null)
  const navigate = useNavigate()
  const { portalId } = useParams()

  useEffect(() => {
    // Get the current user's admin ID and portal details
    const getPortalDetails = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: adminData, error: adminError } = await supabase
          .from('admin')
          .select('adminid')
          .eq('email', user.email)
          .single()
        
        if (adminError) {
          console.error('Error fetching admin ID:', adminError)
          setError('Failed to fetch admin information')
          setLoading(false)
          return
        }
        
        if (adminData) {
          setAdminId(adminData.adminid)
          
          // Fetch portal details
          const { data: portalData, error: portalError } = await supabase
            .from('crm_portal')
            .select('*')
            .eq('portalid', portalId)
            .eq('administratorid', adminData.adminid)
            .single()
          
          if (portalError) {
            console.error('Error fetching portal details:', portalError)
            setError('Failed to fetch portal details')
            setLoading(false)
            return
          }
          
          if (portalData) {
            setPortalName(portalData.portalname)
          } else {
            setError('Portal not found or you do not have permission to edit it')
          }
        } else {
          setError('You must be logged in as an admin to edit portals')
        }
      } else {
        setError('You must be logged in to edit portals')
      }
      
      setLoading(false)
    }
    
    getPortalDetails()
  }, [portalId])

  const handleUpdatePortal = async (e) => {
    e.preventDefault()
    
    if (!adminId) {
      setError('You must be logged in as an admin to update a portal')
      return
    }
    
    try {
      setSaving(true)
      setError(null)
      
      // Update the CRM_Portal table
      const { error: portalError } = await supabase
        .from('crm_portal')
        .update({ portalname: portalName })
        .eq('portalid', portalId)
        .eq('administratorid', adminId)
      
      if (portalError) throw portalError
      
      setSuccess(true)
      
      // Redirect to manage portals page after 2 seconds
      setTimeout(() => {
        navigate('/manage-portals')
      }, 2000)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portal details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Edit CRM Portal
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Update your portal information
          </p>
        </div>

        <form onSubmit={handleUpdatePortal} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          {success && (
            <div className="rounded-md bg-green-50 p-3">
              <div className="text-sm text-green-700">
                Portal updated successfully! Redirecting...
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

          <div className="pt-2 flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/manage-portals')}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 