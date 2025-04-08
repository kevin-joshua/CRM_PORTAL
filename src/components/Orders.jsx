import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

const Orders = () => {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError('Please log in to view your orders')
          setTimeout(() => navigate('/login'), 2000)
          return
        }

        const { data: customerData, error: customerError } = await supabase
          .from('customer')
          .select('customerid')
          .eq('email', user.email)
          .single()

        if (customerError) throw customerError

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            orderid,
            orderdate,
            status,
            totalamount,
            employeeid
          `)
          .eq('customerid', customerData.customerid)
          .order('orderdate', { ascending: false })

        if (ordersError) throw ordersError

        setOrders(ordersData)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [navigate])



  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="max-w-md mx-auto">
              <div className="flex items-center space-x-5">
                <div className="block pl-2 font-semibold text-xl text-red-600">
                  {error}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <button onClick={() => navigate('/create-order')}>Create Order</button>
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
                {orders.length === 0 ? (
                  <p>You haven't placed any orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.orderid} className="border rounded-lg p-4 ">
                        <div className="flex flex-col justify-between items-start">
                          <div >
                            <h3 className="font-semibold">Order #{order.orderid}</h3>
                            <p className="text-sm text-gray-600">Order Date: {new Date(order.orderdate).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">Rs.{order.totalamount}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                           
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders 