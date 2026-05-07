import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/BaseComponents';
import { vendorAPI } from '../api/endpoints';

const statuses = ['pending', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const VendorOrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadOrders = async () => {
    const response = await vendorAPI.getOrders();
    setOrders(response.data.data || []);
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'vendor') {
      navigate('/login');
      return;
    }

    loadOrders()
      .catch((ordersError) => setError(ordersError.response?.data?.message || 'Unable to load orders.'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate, user]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    setError('');
    setSuccess('');

    try {
      await vendorAPI.updateOrderStatus(orderId, status);
      setSuccess('Order status updated.');
      await loadOrders();
    } catch (statusError) {
      setError(statusError.response?.data?.message || 'Unable to update order.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12"><LoadingSpinner /></div>;
  }

  return (
    <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">Vendor Orders</h1>
            <p className="mt-2 text-slate-600">Review orders and update fulfillment status.</p>
          </div>
          <Button onClick={() => navigate('/vendor/dashboard')} className="bg-slate-100 text-slate-900">Dashboard</Button>
        </div>

        {error ? <ErrorAlert message={error} onClose={() => setError('')} /> : null}
        {success ? <SuccessAlert message={success} onClose={() => setSuccess('')} /> : null}

        <div className="space-y-5">
          {orders.map((order) => (
            <Card key={order.id} className="border border-slate-200 bg-white shadow-lg">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">{order.order_number || `Order #${order.id}`}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {order.customer?.name || 'Customer'} - {new Date(order.createdAt || order.created_at).toLocaleString()}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{order.deliveryAddress?.full_address || 'No delivery address'}</p>
                </div>
                <div className="min-w-[220px]">
                  <p className="mb-2 text-2xl font-bold text-slate-950">Rs. {order.total_amount}</p>
                  <select
                    value={order.order_status}
                    disabled={updatingId === order.id}
                    onChange={(event) => handleStatusChange(order.id, event.target.value)}
                    className="w-full rounded border border-slate-300 px-3 py-2 capitalize focus:border-primary focus:outline-none"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-5 divide-y divide-slate-100">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="flex justify-between py-3 text-sm">
                    <span className="text-slate-700">{item.product?.name || 'Product'} x {item.quantity}</span>
                    <span className="font-semibold text-slate-950">Rs. {item.subtotal}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {orders.length === 0 ? (
            <Card className="border border-slate-200 text-center">
              <p className="text-slate-600">No orders yet.</p>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VendorOrdersPage;
