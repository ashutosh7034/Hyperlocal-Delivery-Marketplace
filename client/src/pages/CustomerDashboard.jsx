import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, LoadingSpinner } from '../components/BaseComponents';
import { customerAPI, productAPI } from '../api/endpoints';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [nearbyVendors, setNearbyVendors] = useState([]);
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
        // Fetch customer profile
        const profileRes = await customerAPI.getProfile();
        setProfile(profileRes.data.data);

        // Fetch recent orders
        const ordersRes = await customerAPI.getOrders();
        setRecentOrders((ordersRes.data.data || []).slice(0, 5));

        // Fetch nearby vendors
        const vendorsRes = await productAPI.getNearbyVendors();
        setNearbyVendors((vendorsRes.data.data || []).slice(0, 6));

        // Update stats
        const orders = ordersRes.data.data || [];
        setStats((prev) => ({
          ...prev,
          totalOrders: orders.length,
          totalSpent: orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
          savedAddresses: 1,
        }));
      } catch (error) {
        console.error('Failed to fetch customer data:', error);
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
          <h1 className="text-4xl font-bold text-slate-950">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="mt-2 text-slate-600">Your hyperlocal marketplace dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm font-medium text-slate-600">Total Orders</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalOrders}</p>
          </Card>
          <Card className="border border-slate-200 bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm font-medium text-slate-600">Total Spent</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">₹{stats.totalSpent}</p>
          </Card>
          <Card className="border border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm font-medium text-slate-600">Saved Addresses</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.savedAddresses}</p>
          </Card>
          <Card className="border border-slate-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <p className="text-sm font-medium text-slate-600">Favorite Vendors</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.favoriteVendors}</p>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Orders */}
            <Card className="border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-950">Recent Orders</h2>
                <Button onClick={() => navigate('/orders')} className="bg-primary text-white text-sm">View All</Button>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <div>
                        <p className="font-semibold text-slate-900">Order #{order.id}</p>
                        <p className="text-sm text-slate-600">
                          {new Date(order.createdAt || order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">₹{order.total_amount}</p>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize mt-1 ${
                          order.order_status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.order_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {order.order_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">No orders yet</p>
                  <Button onClick={() => navigate('/vendors')} className="bg-primary text-white">Start Shopping</Button>
                </div>
              )}
            </Card>

            {/* Nearby Vendors */}
            <Card className="border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-950">Nearby Vendors</h2>
                <Button onClick={() => navigate('/vendors')} className="bg-primary text-white text-sm">View All</Button>
              </div>

              {nearbyVendors.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {nearbyVendors.map((vendor) => (
                    <div key={vendor.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-lg transition">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">{vendor.shop_name}</h3>
                        <span className="text-sm font-medium text-yellow-600">⭐ {vendor.rating || 4.5}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{vendor.city}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{vendor.delivery_radius_km}km radius</span>
                        <Button onClick={() => navigate(`/vendor/${vendor.id}`)} className="bg-primary text-white text-xs">View Shop</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">No vendors nearby yet</p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center text-lg font-bold text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                  <p className="text-xs text-slate-500">{profile?.phone || 'No phone saved'}</p>
                </div>
              </div>
              <Button className="w-full bg-slate-100 text-slate-900 text-sm">Edit Profile</Button>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-slate-200">
              <h3 className="font-semibold text-slate-950 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button onClick={() => navigate('/vendors')} className="w-full justify-center text-sm bg-primary text-white">
                  Browse Vendors
                </Button>
                <Button className="w-full justify-center text-sm bg-slate-100 text-slate-900">
                  My Addresses
                </Button>
                <Button className="w-full justify-center text-sm bg-slate-100 text-slate-900">
                  Payment Methods
                </Button>
                <Button className="w-full justify-center text-sm bg-slate-100 text-slate-900">
                  Settings
                </Button>
              </div>
            </Card>

            {/* Promotions */}
            <Card className="border border-slate-200 bg-gradient-to-br from-purple-50 to-blue-50">
              <h3 className="font-semibold text-slate-950 mb-2">Special Offer</h3>
              <p className="text-sm text-slate-600 mb-3">Get 20% off on your next order!</p>
              <Button className="w-full bg-primary text-white text-sm">Claim Offer</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
