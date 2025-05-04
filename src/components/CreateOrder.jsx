import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

const CreateOrder = () => {
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [portals, setPortals] = useState([])
  const [selectedPortal, setSelectedPortal] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
  }, [navigate])

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        navigate('/customer-login')
        return
      }
      fetchPortals()
    } catch (error) {
      console.error('Error checking auth status:', error)
      navigate('/customer-login')
    }
  }

  const fetchPortals = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_portal')
        .select('*')
        .order('portalname', { ascending: true })

      if (error) throw error
      setPortals(data || [])
    } catch (error) {
      console.error('Error fetching portals:', error)
      setError('Failed to fetch available portals')
    }
  }

  useEffect(() => {
    if (selectedPortal) fetchServices()
  }, [selectedPortal])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service')
        .select('serviceid, servicename, price')
        .order('servicename', { ascending: true })

      if (error) throw error

      // Validate and convert price to number
      const validatedServices = data.map(service => ({
        ...service,
        serviceid: String(service.serviceid),
        price: parseFloat(service.price) || 0
      }))

      setServices(validatedServices)
    } catch (error) {
      console.error('Error fetching services:', error)
      setError('Failed to fetch available services')
    }
  }

  const handleCreateOrder = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        setError('Please log in to create an order')
        navigate('/customer-login')
        return
      }

      const { data: customer, error: customerError } = await supabase
        .from('customer')
        .select('customerid')
        .eq('email', user.email)
        .single()

      if (customerError) throw customerError

      const selectedServiceData = services.find(s => s.serviceid === selectedService)
      if (!selectedServiceData) {
        console.error('Service not found:', { selectedService, availableServices: services })
        throw new Error('Selected service not found')
      }

      // Ensure price and quantity are valid numbers
      const price = parseFloat(selectedServiceData.price)
      const qty = parseInt(quantity)
      
      if (isNaN(price) || isNaN(qty)) {
        throw new Error('Invalid price or quantity')
      }

      const totalAmount = price * qty

      const { error } = await supabase
        .from('orders')
        .insert([
          {
            customerid: customer.customerid,
            serviceid: selectedService,
            quantity: qty,
            totalamount: totalAmount,
            status: 'pending',
            orderdate: new Date().toISOString()
          }
        ])

      if (error) throw error

      setSuccess('Order created successfully!')
      setTimeout(() => {
        navigate('/orders')
      }, 2000)
    } catch (error) {
      console.error('Error creating order:', error)
      setError(error.message || 'Failed to create order')
    }
  }

  const handleServiceChange = (e) => {
    const serviceId = e.target.value
    setSelectedService(serviceId)
  }

  const getSelectedService = () => {
    if (!selectedService || !services.length) return null
    return services.find(s => s.serviceid === selectedService)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create New Order
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Select a portal and service to place your order
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
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

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8">
          <form onSubmit={handleCreateOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Portal</label>
              <select
                value={selectedPortal}
                onChange={(e) => {
                  setSelectedPortal(e.target.value)
                  setSelectedService('')
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select a portal</option>
                {portals.map((portal) => (
                  <option key={portal.portalid} value={portal.portalid}>
                    {portal.portalname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Service</label>
              <select
                value={selectedService}
                onChange={handleServiceChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                disabled={!selectedPortal}
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.serviceid} value={service.serviceid}>
                    {service.servicename} - ${service.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {selectedService && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900">Order Summary</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Total Amount: ${(getSelectedService()?.price * quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!selectedService}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Create Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateOrder
