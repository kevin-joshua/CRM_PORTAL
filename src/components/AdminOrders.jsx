import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const [portals, setPortals] = useState([]);
  const [selectedPortal, setSelectedPortal] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [markingOrderId, setMarkingOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortals = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('crm_portal')
          .select('portalid, portalname')
          .order('portalname', { ascending: true });
        if (error) throw error;
        setPortals(data || []);
      } catch {
        setError('Failed to fetch portals');
      } finally {
        setLoading(false);
      }
    };
    fetchPortals();
  }, []);

  useEffect(() => {
    if (!selectedPortal) return;
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            orderid,
            orderdate,
            status,
            totalamount,
            quantity,
            employeeid,
            serviceid,
            service:serviceid ( servicename, portalid )
          `)
          .order('orderdate', { ascending: false });
        if (error) throw error;
        const filtered = (data || []).filter(
          order => order.service && String(order.service.portalid) === String(selectedPortal)
        );
        setOrders(filtered);
      } catch {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [selectedPortal]);

  const handleMarkComplete = async (orderid) => {
    setMarkingOrderId(orderid);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('orderid', orderid);
      if (error) throw error;
      setOrders((prev) => prev.map(order => order.orderid === orderid ? { ...order, status: 'delivered' } : order));
    } catch {
      alert('Failed to update order status.');
    } finally {
      setMarkingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
  <h1 className="text-2xl sm:text-3xl font-extrabold text-center sm:text-left text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight flex-1">
    Orders by Portal
  </h1>
  <button
    onClick={() => navigate('/dashboard')}
    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 transition"
  >
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    Back to Dashboard
  </button>
</div>

        <div className="mb-10 flex justify-center">
        <div className="relative bg-white shadow-lg rounded-2xl px-6 py-5 w-full max-w-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-4">
  <label className="text-base font-semibold text-gray-800 sm:mr-4 mb-1 sm:mb-0 whitespace-nowrap">
    Select Portal
  </label>
  <div className="relative w-full sm:flex-1">
    <select
      value={selectedPortal}
      onChange={e => setSelectedPortal(e.target.value)}
      className="block w-full appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-base shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out hover:border-indigo-400 cursor-pointer"
    >
      <option value="">-- Select a portal --</option>
      {portals.map(portal => (
        <option key={portal.portalid} value={portal.portalid}>
          {portal.portalname}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </div>
</div>

        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg font-medium">Loading...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-300 text-red-800 text-sm font-medium">
            {error}
          </div>
        )}

        {selectedPortal && !loading && orders.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-10 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a3 3 0 013-3h7m0 0l-3 3m3-3l-3-3" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">No orders found for this portal.</h3>
          </div>
        )}

        {orders.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((order, index) => (
              <div
                key={order.orderid}
                className={`bg-white border border-gray-200 rounded-xl shadow hover:shadow-xl transition cursor-pointer ${order.status === 'pending' ? 'hover:border-yellow-400' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">Order #{index + 1}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2"><strong>Service:</strong> {order.service?.servicename || 'Unknown Service'}</p>
                  <p className="text-sm text-gray-600 mb-2"><strong>Quantity:</strong> {order.quantity}</p>
                  <p className="text-sm text-gray-600 mb-2"><strong>Date:</strong> {new Date(order.orderdate).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}</p>
                  <p className="text-sm font-semibold text-green-700 mb-2"><strong>Total:</strong> ₹ {order.totalamount.toFixed(2)}</p>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleMarkComplete(order.orderid)}
                      disabled={markingOrderId === order.orderid}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {markingOrderId === order.orderid ? 'Marking...' : 'Mark as Complete'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
