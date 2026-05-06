import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/BaseComponents';
import { customerAPI } from '../api/endpoints';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'customer') {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await customerAPI.getOrders();
        setOrders(response.data.data || []);
      } catch (ordersError) {
        setError(ordersError.response?.data?.message || 'Unable to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate, user]);

  if (loading) {
    return <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12"><LoadingSpinner /></div>;
  }

  return (
    <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">My Orders</h1>
            <p className="mt-2 text-slate-600">Track your marketplace orders.</p>
          </div>
          <Button onClick={() => navigate('/vendors')} className="bg-primary text-white">Browse Vendors</Button>
        </div>

        {error ? <ErrorAlert message={error} onClose={() => setError('')} /> : null}

        <div className="space-y-5">
          {orders.map((order) => (
            <Card key={order.id} className="border border-slate-200 bg-white shadow-lg">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">{order.order_number || `Order #${order.id}`}</h2>
                  <p className="mt-1 text-sm text-slate-500">{order.vendor?.shop_name || 'Vendor'} - {new Date(order.createdAt || order.created_at).toLocaleString()}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-2xl font-bold text-slate-950">Rs. {order.total_amount}</p>
                  <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                    {order.order_status}
                  </span>
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

export default OrdersPage;
