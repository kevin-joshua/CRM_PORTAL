import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link, useParams } from 'react-router-dom'

export default function ViewPortal() {
  const [loading, setLoading] = useState(true)
  const [portal, setPortal] = useState(null)
  const [error, setError] = useState(null)
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
          // Fetch portal details
          const { data: portalData, error: portalError } = await supabase
            .from('crm_portal')
            .select('*')
            .eq('portalid', portalId)
            .single()
          
          if (portalError) {
            console.error('Error fetching portal details:', portalError)
            setError('Failed to fetch portal details')
            setLoading(false)
            return
          }
          
          if (portalData) {
            setPortal(portalData)
            
            // Check if the current user is the administrator of this portal
            if (portalData.administratorid !== adminData.adminid) {
              setError('You do not have permission to view this portal')
            }
          } else {
            setError('Portal not found')
          }
        } else {
          setError('You must be logged in as an admin to view portals')
        }
      } else {
        setError('You must be logged in to view portals')
      }
      
      setLoading(false)
    }
    
    getPortalDetails()
  }, [portalId])

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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="text-sm text-red-700">{error}</div>
        </div>
        <div className="mt-4">
          <Link 
            to="/manage-portals" 
            className="text-indigo-600 hover:text-indigo-900"
          >
            &larr; Back to Manage Portals
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to="/manage-portals" 
          className="text-indigo-600 hover:text-indigo-900"
        >
          &larr; Back to Manage Portals
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{portal.portalname}</h1>
            <div className="flex space-x-2">
              <Link 
                to={`/edit-portal/${portal.portalid}`} 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Portal
              </Link>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Portal Details</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Portal ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{portal.portalid}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(portal.createdat).toLocaleDateString()}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Administrator ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{portal.administratorid}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Portal Statistics</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">No statistics available yet.</p>
                <p className="text-sm text-gray-500 mt-2">
                  This section will display statistics about your CRM portal once you start using it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 