import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../api/endpoints';
import { Button, ErrorAlert, Input } from '../components/BaseComponents';
import SocialLogin from '../components/SocialLogin';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Home, Store } from 'lucide-react';
import clsx from 'clsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.register(formData);
      const loginResponse = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });
      const { token, user } = loginResponse.data.data;
      login(token, user);
      const dashboardPath =
        user.role === 'admin'
          ? '/admin/dashboard'
          : user.role === 'vendor'
          ? '/vendor/dashboard'
          : '/customer/dashboard';

      navigate(dashboardPath, { replace: true });
    } catch (registerError) {
      const message = registerError.response?.data?.message || 'Unable to register right now.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex flex-row-reverse">
      {/* Right Form Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-[45%] relative z-10 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800">
        <div className="mx-auto w-full max-w-sm lg:max-w-md py-12">
          <Link to="/" className="flex items-center gap-2 mb-10 text-slate-500 hover:text-primary transition group w-fit">
            <Home size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Join the marketplace in just a few clicks.
            </p>

            <form className="mt-8" onSubmit={handleSubmit}>
              <ErrorAlert message={error} onClose={() => setError('')} />
              
              <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  I want to join as a
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('customer')}
                    className={clsx(
                      "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                      formData.role === 'customer' 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:text-slate-300"
                    )}
                  >
                    <User size={24} className="mb-2" />
                    <span className="text-sm font-semibold">Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('vendor')}
                    className={clsx(
                      "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                      formData.role === 'vendor' 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:text-slate-300"
                    )}
                  >
                    <Store size={24} className="mb-2" />
                    <span className="text-sm font-semibold">Store Owner</span>
                  </button>
                </div>
              </div>

              <Input
                label="Full Name"
                name="name"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                placeholder={formData.role === 'vendor' ? "Business or Store Name" : "John Doe"}
                autoComplete="name"
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                autoComplete="new-password"
                required
              />

              <Button type="submit" className="w-full mt-4" size="lg" isLoading={loading}>
                Create Account
                {!loading && <ArrowRight size={18} className="ml-2" />}
              </Button>
            </form>

            <SocialLogin onError={setError} />

            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-orange-600 hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Left Image Section */}
      <div className="hidden lg:block relative w-full flex-1">
        <div className="absolute inset-0 h-full w-full object-cover">
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920"
            alt="Local marketplace"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-slate-900/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        </div>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Empowering local commerce</h3>
          <p className="text-lg text-slate-200 max-w-lg leading-relaxed">
            Whether you want to shop from nearby stores or bring your local business online, HyperLocal is the platform for you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
