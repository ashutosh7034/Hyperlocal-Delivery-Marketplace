import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, LoadingSpinner } from '../components/BaseComponents';
import { Sidebar } from '../components/Sidebar';
import { customerAPI, productAPI } from '../api/endpoints';
import { motion } from 'framer-motion';
import { ShoppingBag, MapPin, Heart, Activity, Store, Settings, TrendingUp, Search, Bell } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const buildSpendingTrend = (orders) => {
  const points = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setMonth(date.getMonth() - offset);
    points.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      name: date.toLocaleDateString(undefined, { month: 'short' }),
      spent: 0,
    });
  }

  orders.forEach((order) => {
    const date = new Date(order.createdAt || order.created_at);
    if (Number.isNaN(date.getTime())) {
      return;
    }

    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const point = points.find((entry) => entry.key === key);

    if (point) {
      point.spent += Number(order.total_amount || 0);
    }
  });

  return points.map(({ name, spent }) => ({ name, spent }));
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [nearbyVendors, setNearbyVendors] = useState([]);
  const [savedAddressesCount, setSavedAddressesCount] = useState(0);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    savedAddresses: 0,
    favoriteVendors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'customer') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const profileRes = await customerAPI.getProfile();
        setProfile(profileRes.data.data);

        const ordersRes = await customerAPI.getOrders();
        const orders = ordersRes.data.data || [];
        setRecentOrders(orders.slice(0, 5));

        const addressesRes = await customerAPI.getAddresses();
        const addresses = addressesRes.data.data || [];
        setSavedAddressesCount(addresses.length);

        const vendorsRes = await productAPI.getNearbyVendors();
        setNearbyVendors((vendorsRes.data.data || []).slice(0, 6));

        setStats((prev) => ({
          ...prev,
          totalOrders: orders.length,
          totalSpent: orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
          savedAddresses: addresses.length,
          favoriteVendors: new Set(orders.map((order) => order.vendor_id || order.vendor?.id).filter(Boolean)).size,
        }));
      } catch (error) {
        console.error('Failed to fetch customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate]);

  const spendingChartData = useMemo(() => buildSpendingTrend(recentOrders), [recentOrders]);

  const sidebarLinks = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: Activity },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Favorite Stores', path: '#', icon: Heart },
    { name: 'Saved Addresses', path: '#', icon: MapPin },
    { name: 'Settings', path: '#', icon: Settings },
  ];

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="flex bg-slate-50 dark:bg-dark-bg min-h-[calc(100vh-5rem)]">
      <Sidebar links={sidebarLinks} title={`Hi, ${user?.name?.split(' ')[0]}`} />
      
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Your Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Track your orders, spending, and favorite stores.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate('/vendors')} variant="primary" className="shadow-none">
                <Search size={18} className="mr-2" /> Explore Stores
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Orders', value: stats.totalOrders || '0', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Total Spent', value: `₹${stats.totalSpent || '0'}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Favorite Stores', value: stats.favoriteVendors || '0', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
              { label: 'Saved Addresses', value: savedAddressesCount || stats.savedAddresses || '0', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Spending Chart */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Spending Activity</h3>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={spendingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`₹${value}`, 'Spent']}
                      />
                      <Area type="monotone" dataKey="spent" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSpent)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Recent Orders */}
              <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h2>
                  <Button onClick={() => navigate('/orders')} variant="ghost" size="sm">View All</Button>
                </div>

                {recentOrders.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <ShoppingBag className="text-slate-500 dark:text-slate-400" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">Order #{order.id}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {new Date(order.createdAt || order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900 dark:text-white">₹{order.total_amount}</p>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize mt-1 ${
                            order.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : order.order_status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {order.order_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4">
                    <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No orders yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Discover amazing local stores and place your first order.</p>
                    <Button onClick={() => navigate('/vendors')} variant="primary">Start Shopping</Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Sidebar Area */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                    <Settings size={16} className="text-slate-400" />
                  </Button>
                </div>
                <div className="flex flex-col items-center text-center mt-2">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-orange-400 p-1 mb-4">
                    <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 grid place-items-center text-2xl font-black text-slate-900 dark:text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{user?.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{profile?.phone || 'Add phone number'}</p>
                </div>
              </Card>

              {/* Special Offer */}
              <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bell size={20} className="text-white" />
                  </div>
                  <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Offer</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Get 20% off</h3>
                <p className="text-indigo-100 text-sm mb-6">Use code <strong>LOCAL20</strong> on your next order from any nearby store.</p>
                <Button className="w-full bg-white text-indigo-600 hover:bg-slate-50">Shop Now</Button>
              </Card>

              {/* Nearby Stores Preview */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">Nearby Stores</h3>
                  <Button onClick={() => navigate('/vendors')} variant="ghost" size="sm" className="text-primary p-0 h-auto">View All</Button>
                </div>
                <div className="space-y-4">
                  {nearbyVendors.length > 0 ? (
                    nearbyVendors.slice(0, 3).map((vendor) => (
                      <div key={vendor.id} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <Store size={18} className="text-slate-500 dark:text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{vendor.shop_name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{vendor.city} • {vendor.delivery_radius_km}km</p>
                        </div>
                        <Button onClick={() => navigate(`/vendor/${vendor.id}`)} variant="outline" size="sm" className="h-8 text-xs px-2 shrink-0">
                          Visit
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No stores found nearby.</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
