import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/BaseComponents';
import { adminAPI } from '../api/endpoints';

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    const loadOrders = async () => {
      try {
        const response = await adminAPI.getOrders();
        setOrders(response.data.data || []);
      } catch (ordersError) {
        setError(ordersError.response?.data?.message || 'Unable to load orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, navigate, user]);

  if (loading) {
    return <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12"><LoadingSpinner /></div>;
  }

  return (
    <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">All Orders</h1>
            <p className="mt-2 text-slate-600">Monitor marketplace orders across all vendors.</p>
          </div>
          <Button onClick={() => navigate('/admin/dashboard')} className="bg-slate-100 text-slate-900">Dashboard</Button>
        </div>

        {error ? <ErrorAlert message={error} onClose={() => setError('')} /> : null}

        <Card className="border border-slate-200 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-950">{order.order_number || `Order #${order.id}`}</p>
                      <p className="text-xs text-slate-500">{new Date(order.createdAt || order.created_at).toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3">{order.customer?.name || 'Unknown'}</td>
                    <td className="px-4 py-3">{order.vendor?.shop_name || 'Unknown'}</td>
                    <td className="px-4 py-3 font-semibold text-slate-950">Rs. {order.total_amount}</td>
                    <td className="px-4 py-3 capitalize">{order.payment_status}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                        {order.order_status?.replaceAll('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 ? <p className="py-8 text-center text-slate-500">No orders found.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
