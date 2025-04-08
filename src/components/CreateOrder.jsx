import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

const CreateOrder = () => {
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()
  const [portals, setPortals] = useState([])
  const [selectedPortal, setSelectedPortal] = useState('')

  useEffect(() => {
    if (user) {
      fetchCustomerPortal()
      fetchPortals()
    }
  }, [user])

  const fetchPortals = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_portal')
        .select('portalid, portalname')
        .order('portalname')

      if (error) throw error
      setPortals(data || [])
    } catch (error) {
      console.error('Error fetching portals:', error)
      setError('Failed to fetch available portals')
    }
  }

  const fetchCustomerPortal = async () => {
    try {
      const { data: customer, error: customerError } = await supabase
        .from('customer')
        .select('portalid')
        .eq('userid', user.id)
        .single()

      if (customerError) throw customerError
      setSelectedPortal(customer.portalid)
    } catch (error) {
      console.error('Error fetching customer portal:', error)
      setError('Failed to fetch customer portal information')
    }
  }

  useEffect(() => {
    if (selectedPortal) {
      fetchServices()
    }
  }, [selectedPortal])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service')
        .select('*')
        .eq('portalid', selectedPortal)
        .eq('isactive', true)

      if (error) throw error
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
      setError('Failed to fetch available services')
    }
  }

  const handleCreateOrder = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const { data: customer, error: customerError } = await supabase
        .from('customer')
        .select('customerid')
        .eq('email', user.email)
        .single()

      if (customerError) throw customerError

      const selectedServiceData = services.find(s => s.serviceid === selectedService)
      const totalAmount = selectedServiceData.price * quantity

      const { error } = await supabase
        .from('order')
        .insert([
          {
            customerid: customer.customerid,
            serviceid: selectedService,
            quantity: quantity,
            totalamount: totalAmount,
            status: 'pending'
          }
        ])

      if (error) throw error

      setSuccess('Order created successfully!')
      setSelectedService('')
      setQuantity(1)
    } catch (error) {
      console.error('Error creating order:', error)
      setError('Failed to create order')
    }
  }

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value)
  }

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value) || 1)
  }

  const handlePortalChange = (e) => {
    setSelectedPortal(e.target.value)
    setSelectedService('')
  }

 
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-4">Create New Order</h2>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    {success}
                  </div>
                )}
                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Portal</label>
                    <select
                      value={selectedPortal}
                      onChange={handlePortalChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                      onChange={handleQuantityChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <p className="mt-1 text-lg font-semibold">
                      ${selectedService ? (services.find(s => s.serviceid === selectedService).price * quantity).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!selectedService}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateOrder 