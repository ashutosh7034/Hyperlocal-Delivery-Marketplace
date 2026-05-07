import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, LoadingSpinner } from '../components/BaseComponents';
import { Sidebar } from '../components/Sidebar';
import { adminAPI } from '../api/endpoints';
import { motion } from 'framer-motion';
import { Users, Store, ShoppingBag, DollarSign, Activity, Settings, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Mon', revenue: 4000, orders: 240 },
  { name: 'Tue', revenue: 3000, orders: 139 },
  { name: 'Wed', revenue: 2000, orders: 980 },
  { name: 'Thu', revenue: 2780, orders: 390 },
  { name: 'Fri', revenue: 1890, orders: 480 },
  { name: 'Sat', revenue: 2390, orders: 380 },
  { name: 'Sun', revenue: 3490, orders: 430 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
  });
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const statsRes = await adminAPI.getStats();
        setStats((prev) => ({
          ...prev,
          ...(statsRes.data.data || {}),
          pendingApprovals: statsRes.data.data?.pendingVendors || 0,
        }));

        const vendorsRes = await adminAPI.getVendors();
        setVendors(vendorsRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate]);

  const sidebarLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: Activity },
    { name: 'Vendors', path: '/admin/vendors', icon: Store },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Users', path: '#', icon: Users },
    { name: 'Reports', path: '#', icon: FileText },
    { name: 'Settings', path: '#', icon: Settings },
  ];

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="flex bg-slate-50 dark:bg-dark-bg min-h-[calc(100vh-5rem)]">
      <Sidebar links={sidebarLinks} title="Admin Portal" />
      
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Overview</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor your platform's performance and activity.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-white dark:bg-slate-800">Download Report</Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Revenue', value: `₹${stats.totalRevenue || '45,231'}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Active Orders', value: stats.totalOrders || '1,204', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Registered Vendors', value: stats.totalVendors || '84', icon: Store, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Total Customers', value: stats.totalCustomers || '2,492', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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
            {/* Revenue Chart */}
            <Card className="lg:col-span-2 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Analytics</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ff6b35" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Quick Actions & Pending Approvals */}
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-primary to-orange-500 text-white border-none shadow-glow">
                <h3 className="text-lg font-bold mb-2">Pending Vendor Approvals</h3>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-black">{stats.pendingApprovals || 3}</p>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary transition-colors text-xs py-1.5 px-3">
                    Review Now
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400">API Gateway</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Operational
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Database</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Operational
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Payment Gateway</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Operational
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Vendors Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Vendors</h2>
              <Button onClick={() => navigate('/admin/vendors')} variant="ghost" size="sm">View All</Button>
            </div>

            {vendors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400 rounded-lg">
                    <tr>
                      <th className="px-6 py-4 font-semibold rounded-tl-lg">Shop Name</th>
                      <th className="px-6 py-4 font-semibold">Owner</th>
                      <th className="px-6 py-4 font-semibold">City</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold rounded-tr-lg text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {vendors.slice(0, 5).map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{vendor.shop_name}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{vendor.user?.name || vendor.owner_name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{vendor.city}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                            vendor.approval_status === 'approved'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : vendor.approval_status === 'pending'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          }`}>
                            {vendor.approval_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button onClick={() => navigate('/admin/vendors')} variant="ghost" size="sm" className="text-primary hover:text-orange-600 p-0">
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <Store size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">No vendors onboarded yet</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
