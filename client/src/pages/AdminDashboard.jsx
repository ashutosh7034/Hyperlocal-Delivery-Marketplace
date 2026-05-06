import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, LoadingSpinner } from '../components/BaseComponents';
import { adminAPI } from '../api/endpoints';

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
        // Fetch admin stats
        const statsRes = await adminAPI.getStats();
        setStats((prev) => ({
          ...prev,
          ...(statsRes.data.data || {}),
          pendingApprovals: statsRes.data.data?.pendingVendors || 0,
        }));

        // Fetch vendors list
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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-160px)] surface-grid px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-950">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">Platform management and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm font-medium text-slate-600">Total Vendors</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalVendors}</p>
          </Card>
          <Card className="border border-slate-200 bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm font-medium text-slate-600">Total Customers</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalCustomers}</p>
          </Card>
          <Card className="border border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm font-medium text-slate-600">Total Orders</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalOrders}</p>
          </Card>
          <Card className="border border-slate-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <p className="text-sm font-medium text-slate-600">Total Revenue</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">₹{stats.totalRevenue}</p>
          </Card>
          <Card className="border border-slate-200 bg-gradient-to-br from-red-50 to-red-100">
            <p className="text-sm font-medium text-slate-600">Pending Approvals</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.pendingApprovals}</p>
          </Card>
        </div>

        {/* Vendors Management */}
        <Card className="border border-slate-200 bg-white shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-950">Vendors Management</h2>
            <Button onClick={() => navigate('/admin/vendors')} className="bg-primary text-white">Manage Vendors</Button>
          </div>

          {vendors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Shop Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Owner</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">City</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Rating</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {vendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-900 font-medium">{vendor.shop_name}</td>
                      <td className="px-4 py-3 text-slate-600">{vendor.user?.name || vendor.owner_name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-slate-600">{vendor.city}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          vendor.approval_status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : vendor.approval_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {vendor.approval_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-900">⭐ {vendor.rating || 4.5}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => navigate('/admin/vendors')} className="text-primary hover:underline text-sm font-medium">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">No vendors yet</p>
            </div>
          )}
        </Card>

        {/* System Info */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border border-slate-200 bg-white shadow-lg">
            <h2 className="text-lg font-bold text-slate-950">System Status</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">API Status</span>
                <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                  ✓ Operational
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Database</span>
                <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                  ✓ Connected
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Storage</span>
                <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                  ✓ Available
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Last Updated</span>
                <span className="text-slate-900">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <Card className="border border-slate-200 bg-white shadow-lg">
            <h2 className="text-lg font-bold text-slate-950">Quick Actions</h2>
            <div className="mt-4 space-y-2">
              <Button onClick={() => navigate('/admin/orders')} className="w-full justify-center text-sm bg-primary text-white">
                View All Orders
              </Button>
              <Button className="w-full justify-center text-sm bg-slate-100 text-slate-900">
                System Settings
              </Button>
              <Button className="w-full justify-center text-sm bg-slate-100 text-slate-900">
                Download Reports
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
