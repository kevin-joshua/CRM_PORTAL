import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link } from 'react-router-dom'

export default function ManagePortals() {
  const [loading, setLoading] = useState(true)
  const [portals, setPortals] = useState([])
  const [error, setError] = useState(null)
  const [adminId, setAdminId] = useState(null)

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
          setError('Failed to fetch admin information')
          setLoading(false)
          return
        }
        
        if (data) {
          setAdminId(data.adminid)
          fetchPortals(data.adminid)
        } else {
          setError('You must be logged in as an admin to view portals')
          setLoading(false)
        }
      } else {
        setError('You must be logged in to view portals')
        setLoading(false)
      }
    }
    
    getCurrentAdmin()
  }, [])

  const fetchPortals = async (adminId) => {
    try {
      const { data, error } = await supabase
        .from('crm_portal')
        .select('*')
        .eq('administratorid', adminId)
      
      if (error) throw error
      
      setPortals(data || [])
    } catch (error) {
      console.error('Error fetching portals:', error)
      setError('Failed to fetch portals')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePortal = async (portalId) => {
    if (!confirm('Are you sure you want to delete this portal? This action cannot be undone.')) {
      return
    }
    
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('crm_portal')
        .delete()
        .eq('portalid', portalId)
      
      if (error) throw error
      
      // Refresh the portals list
      fetchPortals(adminId)
    } catch (error) {
      console.error('Error deleting portal:', error)
      setError('Failed to delete portal')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage CRM Portals</h1>
        <Link 
          to="/create-portal" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create New Portal
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {portals.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">You don't have any CRM portals yet.</p>
          <Link 
            to="/create-portal" 
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Your First Portal
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Portal Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portals.map((portal) => (
                <tr key={portal.portalid}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{portal.portalname}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(portal.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      to={`/portal/${portal.portalid}`} 
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      View
                    </Link>
                    <Link 
                      to={`/edit-portal/${portal.portalid}`} 
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeletePortal(portal.portalid)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 