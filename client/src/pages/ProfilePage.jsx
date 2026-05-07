import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, LoadingSpinner } from '../components/BaseComponents';
import { authAPI } from '../api/endpoints';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, ShieldCheck, LogOut, Settings, CreditCard, MapPin, Bell, Activity } from 'lucide-react';

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

  if (loading) return <LoadingSpinner fullScreen />;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <User size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Profile not available</p>
        </div>
      </div>
    );
  }

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'vendor') return '/vendor/dashboard';
    return '/customer/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pb-20">
      {/* Header Banner */}
      <div className="h-48 bg-gradient-to-r from-primary via-orange-500 to-rose-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden relative">
                {user?.verified && (
                  <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-500 p-2 rounded-full hidden sm:block" title="Verified Account">
                    <ShieldCheck size={24} />
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-8 border-b border-slate-100 dark:border-slate-800 -mt-16 sm:-mt-12 mb-8 px-4 sm:px-8">
                  <div className="h-32 w-32 rounded-3xl bg-white dark:bg-slate-900 shadow-lg p-2 shrink-0">
                    <div className="h-full w-full rounded-2xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-5xl font-black text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{user?.name}</h1>
                    <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                      <span className="capitalize bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {user?.role} Account
                      </span>
                      {user?.verified && <span className="text-emerald-500 text-sm font-semibold flex items-center"><ShieldCheck size={14} className="mr-1" /> Verified</span>}
                    </p>
                  </div>
                  <div className="hidden sm:flex gap-3">
                    <Button onClick={() => navigate(getDashboardPath())} variant="outline">Dashboard</Button>
                  </div>
                </div>

                <div className="px-4 sm:px-8 pb-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <User size={20} className="text-primary" /> Personal Information
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Email Address</p>
                        <p className="font-semibold text-slate-900 dark:text-white break-all">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="h-10 w-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Member Since</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Activity size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Account Status</p>
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white capitalize">{profile?.status || 'Active'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="grid sm:grid-cols-3 gap-4">
                <Button onClick={() => navigate('/')} className="w-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 shadow-sm" size="lg">
                  Home
                </Button>
                <Button onClick={() => navigate(getDashboardPath())} className="w-full sm:hidden" variant="primary" size="lg">
                  Dashboard
                </Button>
                <Button onClick={handleLogout} className="w-full sm:col-start-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-500/10 dark:hover:bg-red-500/20 border-none" size="lg">
                  <LogOut size={18} className="mr-2" /> Logout
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar / Preferences */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-none shadow-xl bg-white dark:bg-slate-900 p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings size={18} className="text-primary" /> Settings
                  </h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                        <MapPin size={16} />
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Saved Addresses</span>
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                        <CreditCard size={16} />
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Payment Methods</span>
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                        <Bell size={16} />
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Notifications</span>
                    </div>
                  </button>
                </div>
              </Card>
            </motion.div>

            {/* Role Info Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-none shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
                    <ShieldCheck size={20} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-white">Account Type</h3>
                </div>
                <div className="mb-4">
                  <span className="text-sm text-slate-400">Current Role</span>
                  <p className="text-2xl font-black text-white capitalize">{user?.role}</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {user?.role === 'customer' && 'You have access to browse vendors, place orders, and track your deliveries.'}
                  {user?.role === 'vendor' && 'You have tools to manage your products, process orders, and view sales analytics.'}
                  {user?.role === 'admin' && 'You have full administrative access to manage users, vendors, and platform settings.'}
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
