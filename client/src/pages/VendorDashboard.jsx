import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, LoadingSpinner } from '../components/BaseComponents';
import { vendorAPI, productAPI } from '../api/endpoints';

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
        // Fetch vendor profile
        const vendorRes = await vendorAPI.getProfile();
        setVendor(vendorRes.data.data);

        // Fetch products
        const productsRes = await productAPI.getMyProducts();
        setProducts(productsRes.data.data || []);
        const ordersRes = await vendorAPI.getOrders();
        const orders = ordersRes.data.data || [];

        // Update stats
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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-160px)] surface-grid px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-[calc(100vh-160px)] surface-grid px-4 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-slate-600">Vendor profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-950">Vendor Dashboard</h1>
          <p className="mt-2 text-slate-600">{vendor.shop_name}</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm font-medium text-slate-600">Total Products</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalProducts}</p>
          </Card>
          <Card className="border border-slate-200 bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm font-medium text-slate-600">Active Orders</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.activeOrders}</p>
          </Card>
          <Card className="border border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm font-medium text-slate-600">Total Revenue</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">₹{stats.totalRevenue}</p>
          </Card>
          <Card className="border border-slate-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <p className="text-sm font-medium text-slate-600">Rating</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">⭐ {stats.rating}</p>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Store Info */}
          <div className="lg:col-span-2">
            <Card className="border border-slate-200 bg-white shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-slate-950">Store Information</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Shop Name</label>
                  <p className="mt-1 text-lg text-slate-900">{vendor.shop_name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Address</label>
                  <p className="mt-1 text-slate-900">
                    {vendor.address}, {vendor.city}, {vendor.state} - {vendor.pin_code}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Delivery Radius</label>
                    <p className="mt-1 text-slate-900">{vendor.delivery_radius_km} km</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Status</label>
                    <p className="mt-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 capitalize">
                        ✓ {vendor.approval_status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Products Section */}
            <Card className="border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-950">My Products</h2>
                <Button onClick={() => navigate('/vendor/products')} className="bg-primary text-white">Add Product</Button>
              </div>

              {products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-slate-600">
                    <thead className="border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Product</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Category</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Price</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Stock</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-900 font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-slate-600">{product.category}</td>
                          <td className="px-4 py-3 text-slate-900">₹{product.price}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => navigate('/vendor/products')} className="text-primary hover:underline text-sm font-medium">
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 mb-4">No products yet</p>
                  <Button onClick={() => navigate('/vendor/products')} className="bg-primary text-white">Add Your First Product</Button>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="border border-slate-200">
              <h3 className="font-bold text-slate-950 text-lg">Quick Actions</h3>
              <div className="mt-4 space-y-2">
                <Button onClick={() => navigate('/vendor/orders')} className="w-full justify-center text-sm bg-primary text-white">
                  View Orders
                </Button>
                <Button className="w-full justify-center text-sm bg-slate-100 text-slate-900">
                  Analytics
                </Button>
                <Button className="w-full justify-center text-sm bg-slate-100 text-slate-900">
                  Settings
                </Button>
              </div>
            </Card>

            <Card className="border border-slate-200 bg-blue-50">
              <h3 className="font-bold text-slate-950">Need Help?</h3>
              <p className="mt-2 text-sm text-slate-600">
                Read our vendor documentation to learn how to manage your store.
              </p>
              <Button className="mt-4 w-full bg-primary text-white text-sm">
                View Docs
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
