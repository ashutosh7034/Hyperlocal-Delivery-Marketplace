import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/BaseComponents';
import { customerAPI } from '../api/endpoints';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Truck, CheckCircle, Clock, ChevronRight, Store, MapPin } from 'lucide-react';

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
        // Add mock data if empty for demo purposes
        const data = response.data.data || [];
        if (data.length === 0) {
          setOrders([
            {
              id: '1',
              order_number: 'ORD-2026-001',
              total_amount: 850,
              order_status: 'out_for_delivery',
              created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              vendor: { shop_name: 'Fresh Mart Grocery' },
              items: [{ id: 1, quantity: 2, subtotal: 500, product: { name: 'Organic Milk' } }, { id: 2, quantity: 1, subtotal: 350, product: { name: 'Whole Wheat Bread' } }]
            },
            {
              id: '2',
              order_number: 'ORD-2026-002',
              total_amount: 1200,
              order_status: 'delivered',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
              vendor: { shop_name: 'Spice Route Restaurant' },
              items: [{ id: 3, quantity: 1, subtotal: 1200, product: { name: 'Family Combo Meal' } }]
            }
          ]);
        } else {
          setOrders(data);
        }
      } catch (ordersError) {
        setError(ordersError.response?.data?.message || 'Unable to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate, user]);

  if (loading) return <LoadingSpinner fullScreen />;

  const getStatusInfo = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Order Placed', step: 1 };
      case 'accepted': return { icon: Store, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Preparing', step: 2 };
      case 'out_for_delivery': return { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'On the Way', step: 3 };
      case 'delivered': return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Delivered', step: 4 };
      default: return { icon: Package, color: 'text-slate-500', bg: 'bg-slate-100', label: status || 'Processing', step: 1 };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <ShoppingBag className="text-primary" size={32} /> My Orders
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Track and manage your recent purchases.</p>
          </div>
          <Button onClick={() => navigate('/vendors')} variant="primary" className="shadow-none">
            Browse Stores
          </Button>
        </div>

        {error && <ErrorAlert message={error} onClose={() => setError('')} />}

        <div className="space-y-6">
          {orders.map((order, index) => {
            const statusInfo = getStatusInfo(order.order_status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden p-0 shadow-lg hover:shadow-xl transition-shadow">
                  {/* Order Header */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${statusInfo.bg} ${statusInfo.color}`}>
                        <StatusIcon size={24} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                          {order.order_number || `Order #${order.id}`}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Store size={14} /> {order.vendor?.shop_name || 'Vendor'} • 
                          {new Date(order.createdAt || order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-left md:text-right w-full md:w-auto">
                      <p className="text-2xl font-black text-slate-900 dark:text-white">₹{order.total_amount}</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 mt-1 rounded-full text-xs font-bold ${statusInfo.bg} ${statusInfo.color}`}>
                        <span className="relative flex h-2 w-2">
                          {statusInfo.step < 4 && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusInfo.color.replace('text-', 'bg-')}`}></span>}
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${statusInfo.color.replace('text-', 'bg-')}`}></span>
                        </span>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Dynamic Order Timeline */}
                    <div className="mb-8 pt-4">
                      <div className="relative">
                        {/* Connecting Line Background */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 rounded-full hidden sm:block"></div>
                        {/* Active Line Progress */}
                        <div 
                          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000 hidden sm:block"
                          style={{ width: `${((statusInfo.step - 1) / 3) * 100}%` }}
                        ></div>
                        
                        <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-6 sm:gap-0">
                          {/* Step 1: Placed */}
                          <div className="flex sm:flex-col items-center gap-4 sm:gap-2 text-center group">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 transition-colors duration-500 ${statusInfo.step >= 1 ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                              <CheckCircle size={14} />
                            </div>
                            <span className={`text-xs font-bold ${statusInfo.step >= 1 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Order Placed</span>
                          </div>
                          
                          {/* Step 2: Preparing */}
                          <div className="flex sm:flex-col items-center gap-4 sm:gap-2 text-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 transition-colors duration-500 ${statusInfo.step >= 2 ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                              <Store size={14} />
                            </div>
                            <span className={`text-xs font-bold ${statusInfo.step >= 2 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Preparing</span>
                          </div>
                          
                          {/* Step 3: Out for Delivery */}
                          <div className="flex sm:flex-col items-center gap-4 sm:gap-2 text-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 transition-colors duration-500 ${statusInfo.step >= 3 ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                              <Truck size={14} />
                            </div>
                            <span className={`text-xs font-bold ${statusInfo.step >= 3 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>On the Way</span>
                          </div>
                          
                          {/* Step 4: Delivered */}
                          <div className="flex sm:flex-col items-center gap-4 sm:gap-2 text-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 transition-colors duration-500 ${statusInfo.step >= 4 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                              <MapPin size={14} />
                            </div>
                            <span className={`text-xs font-bold ${statusInfo.step >= 4 ? 'text-emerald-500' : 'text-slate-400'}`}>Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {(order.items || []).map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-200/50 dark:border-slate-700/50 pb-2 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              <span className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
                                {item.quantity}x
                              </span>
                              <span className="text-slate-700 dark:text-slate-300 font-medium">{item.product?.name || 'Product'}</span>
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">₹{item.subtotal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {orders.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No orders found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                You haven't placed any orders yet. Discover amazing local stores and get your favorite items delivered!
              </p>
              <Button onClick={() => navigate('/vendors')} variant="primary" size="lg">
                Start Shopping
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
