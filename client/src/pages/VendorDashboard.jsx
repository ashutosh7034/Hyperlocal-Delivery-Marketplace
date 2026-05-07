import React, { useState, useEffect } from 'react';
import { Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, LoadingSpinner } from '../components/BaseComponents';
import { Sidebar } from '../components/Sidebar';
import { vendorAPI, productAPI } from '../api/endpoints';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, DollarSign, Star, Activity, Settings, Plus, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Mon', sales: 40 },
  { name: 'Tue', sales: 30 },
  { name: 'Wed', sales: 20 },
  { name: 'Thu', sales: 27 },
  { name: 'Fri', sales: 18 },
  { name: 'Sat', sales: 23 },
  { name: 'Sun', sales: 34 },
];

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeOrders: 0,
    totalRevenue: 0,
    rating: 4.5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'vendor') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const vendorRes = await vendorAPI.getProfile();
        setVendor(vendorRes.data.data);

        const productsRes = await productAPI.getMyProducts();
        setProducts(productsRes.data.data || []);
        
        const ordersRes = await vendorAPI.getOrders();
        const orders = ordersRes.data.data || [];

        setStats((prev) => ({
          ...prev,
          totalProducts: productsRes.data.data?.length || 0,
          activeOrders: orders.filter((order) => !['delivered', 'cancelled'].includes(order.order_status)).length,
          totalRevenue: orders
            .filter((order) => order.order_status === 'delivered')
            .reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
        }));
      } catch (error) {
        console.error('Failed to fetch vendor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate]);

  const sidebarLinks = [
    { name: 'Dashboard', path: '/vendor/dashboard', icon: Activity },
    { name: 'Products', path: '/vendor/products', icon: Package },
    { name: 'Orders', path: '/vendor/orders', icon: ShoppingBag },
    { name: 'Analytics', path: '#', icon: TrendingUp },
    { name: 'Store Settings', path: '#', icon: Settings },
  ];

  if (loading) return <LoadingSpinner fullScreen />;

  if (!vendor) {
    return (
      <div className="flex bg-slate-50 dark:bg-dark-bg min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="text-center">
          <Store size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Store Profile Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Please complete your store setup to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 dark:bg-dark-bg min-h-[calc(100vh-5rem)]">
      <Sidebar links={sidebarLinks} title={vendor.shop_name} />
      
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">{vendor.shop_name}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize
                  ${vendor.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {vendor.approval_status}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {vendor.address}, {vendor.city} • {vendor.delivery_radius_km}km delivery radius
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate('/vendor/products')} variant="primary" className="shadow-none">
                <Plus size={18} className="mr-2" /> Add Product
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Revenue', value: `₹${stats.totalRevenue || '0'}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Active Orders', value: stats.activeOrders || '0', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Products Listed', value: stats.totalProducts || '0', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Store Rating', value: stats.rating, icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {stat.label === 'Store Rating' ? <span className="flex items-center gap-1">{stat.value} <Star size={16} fill="currentColor" className="text-amber-500 mb-1"/></span> : stat.value}
                      </h3>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Sales Chart */}
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Sales</h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip 
                      cursor={{fill: '#f1f5f9'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="sales" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Recent Orders or Actions */}
            <div className="space-y-6">
              <Card className="p-6 bg-slate-900 dark:bg-slate-800 text-white border-none shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">New Orders</h3>
                    <p className="text-slate-400 text-sm mt-1">Requires your attention</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                    <ShoppingBag size={20} className="text-primary" />
                  </div>
                </div>
                <p className="text-4xl font-black mb-6">{stats.activeOrders || 0}</p>
                <Button onClick={() => navigate('/vendor/orders')} variant="primary" className="w-full">
                  Process Orders
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Need Help?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Check out our vendor success guide to learn how to increase your store visibility and sales.
                </p>
                <Button variant="outline" className="w-full text-sm">
                  View Documentation
                </Button>
              </Card>
            </div>
          </div>

          {/* Products List Preview */}
          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Products</h2>
              <Button onClick={() => navigate('/vendor/products')} variant="ghost" size="sm">Manage All</Button>
            </div>

            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Product Name</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Stock</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {products.slice(0, 5).map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{product.name}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{product.category}</td>
                        <td className="px-6 py-4 text-slate-900 dark:text-white font-semibold">₹{product.price}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.stock > 10 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : product.stock > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button onClick={() => navigate('/vendor/products')} variant="ghost" size="sm" className="text-primary hover:text-orange-600 p-0">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={24} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No products yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Start adding products to your store to get orders.</p>
                <Button onClick={() => navigate('/vendor/products')} variant="primary">Add Your First Product</Button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
