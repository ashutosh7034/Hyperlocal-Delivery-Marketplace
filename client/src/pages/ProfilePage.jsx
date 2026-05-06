import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, LoadingSpinner } from '../components/BaseComponents';
import { authAPI } from '../api/endpoints';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        setProfile(response.data.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-160px)] surface-grid px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-160px)] surface-grid px-4 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-slate-600">Profile not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-950">My Profile</h1>
          <p className="mt-2 text-slate-600">Manage your account and preferences</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">{user?.name}</h2>
                  <p className="text-sm text-slate-500 capitalize">
                    {user?.role} {user?.verified && '✓'}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <p className="mt-1 text-lg text-slate-900">{user?.email}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Account Status</label>
                  <p className="mt-1 flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
                    <span className="text-slate-900 capitalize">{profile?.status || 'active'}</span>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Member Since</label>
                  <p className="mt-1 text-slate-900">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Email Verified</label>
                  <p className="mt-1">
                    {user?.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                        Pending verification
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-3 border-t border-slate-200 pt-6">
                <Button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-slate-100 text-slate-900 hover:bg-slate-200"
                >
                  Back to Home
                </Button>
                <Button onClick={handleLogout} className="flex-1 bg-red-500 hover:bg-red-600">
                  Logout
                </Button>
              </div>
            </Card>
          </div>

          {/* Role-Based Info Sidebar */}
          <div className="space-y-6">
            {/* Role Badge */}
            <Card className="border border-slate-200 bg-gradient-to-br from-primary/5 to-primary/10">
              <h3 className="font-semibold text-slate-950">Account Type</h3>
              <p className="mt-2 text-2xl font-bold capitalize text-primary">{user?.role}</p>
              <p className="mt-3 text-sm text-slate-600">
                {user?.role === 'customer' && 'Browse and purchase from nearby vendors'}
                {user?.role === 'vendor' && 'Manage products and orders, reach customers'}
                {user?.role === 'admin' && 'Oversee platform, manage vendors and orders'}
              </p>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-slate-200">
              <h3 className="font-semibold text-slate-950 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {user?.role === 'customer' && (
                  <>
                    <Button 
                      onClick={() => navigate('/dashboard')}
                      className="w-full justify-center text-sm bg-primary text-white"
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      onClick={() => navigate('/vendors')}
                      className="w-full justify-center text-sm bg-slate-100 text-slate-900"
                    >
                      Browse Vendors
                    </Button>
                    <Button
                      onClick={() => navigate('/orders')}
                      className="w-full justify-center text-sm bg-slate-100 text-slate-900"
                    >
                      My Orders
                    </Button>
                  </>
                )}
                {user?.role === 'vendor' && (
                  <>
                    <Button 
                      onClick={() => navigate('/vendor/dashboard')}
                      className="w-full justify-center text-sm bg-primary text-white"
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      onClick={() => navigate('/vendor/products')}
                      className="w-full justify-center text-sm bg-slate-100 text-slate-900"
                    >
                      My Products
                    </Button>
                    <Button
                      onClick={() => navigate('/vendor/orders')}
                      className="w-full justify-center text-sm bg-slate-100 text-slate-900"
                    >
                      Orders
                    </Button>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <Button 
                      onClick={() => navigate('/admin/dashboard')}
                      className="w-full justify-center text-sm bg-primary text-white"
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      onClick={() => navigate('/admin/vendors')}
                      className="w-full justify-center text-sm bg-slate-100 text-slate-900"
                    >
                      Manage Vendors
                    </Button>
                    <Button
                      onClick={() => navigate('/admin/orders')}
                      className="w-full justify-center text-sm bg-slate-100 text-slate-900"
                    >
                      View Orders
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
