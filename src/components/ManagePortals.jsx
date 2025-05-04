import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'

export default function ManagePortals() {
  const [loading, setLoading] = useState(true)
  const [portals, setPortals] = useState([])
  const [error, setError] = useState(null)
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-full hover:bg-white/80 transition duration-200"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Manage CRM Portals</h1>
          </div>
          <Link 
            to="/create-portal" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Portal
          </Link>
        </div>

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

        {portals.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No portals yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first CRM portal.</p>
            <div className="mt-6">
              <Link 
                to="/create-portal" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Portal
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Portal Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portals.map((portal) => (
                    <tr key={portal.portalid} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                              <span className="text-white font-medium">{portal.portalname.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{portal.portalname}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(portal.createdat).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                        <Link 
                          to={`/portal/${portal.portalid}`} 
                          className="text-indigo-600 hover:text-indigo-900 transition duration-150"
                        >
                          View
                        </Link>
                        <Link 
                          to={`/edit-portal/${portal.portalid}`} 
                          className="text-indigo-600 hover:text-indigo-900 transition duration-150"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePortal(portal.portalid)}
                          className="text-red-600 hover:text-red-900 transition duration-150"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 