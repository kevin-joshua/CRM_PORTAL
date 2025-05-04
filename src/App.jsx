import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import Login from './components/Login'
import SignUp from './components/SignUp'
import CreatePortal from './components/CreatePortal'
import ManagePortals from './components/ManagePortals'
import EditPortal from './components/EditPortal'
import ViewPortal from './components/ViewPortal'
import Dashboard from './components/Dashboard'
import CustomerLogin from './components/CustomerLogin'
import CustomerSignUp from './components/CustomerSignUp'
import CustomerDashboard from './components/CustomerDashboard'
import ViewService from './components/ViewService'
import Services from './components/Services'
import CreateService from './components/CreateService'
import EditService from './components/EditService'
import DeleteService from './components/DeleteService'
import Orders from './components/Orders'
import CreateOrder from './components/CreateOrder'
import EditOrder from './components/EditOrder'
import DeleteOrder from './components/DeleteOrder'
import AccountSettings from './components/AccountSettings'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState(null)
  const [userTypeLoading, setUserTypeLoading] = useState(false)

  useEffect(() => {
    // Get the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const checkUserType = async () => {
      if (session && !userTypeLoading) {
        setUserTypeLoading(true)
        try {
          // Check if user is an admin
          const { data: adminData, error: adminError } = await supabase
            .from('admin')
            .select('adminid')
            .eq('email', session.user.email)
            .limit(1)
            .maybeSingle()

          if (adminError) {
            console.error('Error checking admin status:', adminError)
            throw adminError
          }

          // Check if user is a customer
          const { data: customerData, error: customerError } = await supabase
            .from('customer')
            .select('customerid')
            .eq('email', session.user.email)
            .limit(1)
            .maybeSingle()

          if (customerError) {
            console.error('Error checking customer status:', customerError)
            throw customerError
          }

          if (adminData) {
            setUserType('admin')
          } else if (customerData) {
            setUserType('customer')
          } else {
            setUserType('unknown')
          }
        } catch (error) {
          console.error('Error checking user type:', error)
          setUserType('unknown')
        } finally {
          setUserTypeLoading(false)
        }
      } else if (!session) {
        setUserType(null)
      }
    }

    checkUserType()
  }, [session])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-portal" element={<CreatePortal />} />
        <Route path="/manage-portals" element={<ManagePortals />} />
        <Route path="/edit-portal/:portalId" element={<EditPortal />} />
        <Route path="/portal/:portalId" element={<ViewPortal />} />
        
        {/* Service management routes */}
        <Route path="/services" element={<Services />} />
        <Route path="/create-service" element={<CreateService />} />
        <Route path="/edit-service/:serviceId" element={<EditService />} />
        <Route path="/delete-service/:serviceId" element={<DeleteService />} />
        <Route path="/view-service/:serviceId" element={<ViewService />} />
        
        {/* Order management routes */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/create-order" element={<CreateOrder />} />
        <Route path="/edit-order/:orderId" element={<EditOrder />} />
        <Route path="/delete-order/:orderId" element={<DeleteOrder />} />
        
        {/* Customer routes */}
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/customer-signup" element={<CustomerSignUp />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        
        {/* Account settings */}
        <Route path="/account-settings" element={<AccountSettings />} />
        
        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}

export default App
