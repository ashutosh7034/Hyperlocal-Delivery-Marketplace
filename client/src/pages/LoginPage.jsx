import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../api/endpoints';
import { Button, Card, Input, ErrorAlert } from '../components/BaseComponents';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Home } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: 'customer@demo.com', password: 'Demo@1234' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data.data;
      login(token, user);
      navigate('/', { replace: true });
    } catch (loginError) {
      const message = loginError.response?.data?.message || 'Unable to sign in right now.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex">
      {/* Left Form Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-[45%] relative z-10">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-12 text-slate-500 hover:text-primary transition group w-fit">
            <Home size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Please enter your details to sign in.
            </p>

            <form className="mt-8" onSubmit={handleSubmit}>
              <ErrorAlert message={error} onClose={() => setError('')} />
              
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
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-semibold text-primary hover:text-orange-600">
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                Sign in
                {!loading && <ArrowRight size={18} className="ml-2" />}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary hover:text-orange-600 hover:underline">
                Sign up
              </Link>
            </p>

            <Card className="mt-8 bg-slate-100 dark:bg-slate-800/50 border-none shadow-none">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Demo Accounts</p>
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex justify-between items-center"><span className="font-semibold text-slate-900 dark:text-white">Customer</span> <span>customer@demo.com</span></div>
                <div className="flex justify-between items-center"><span className="font-semibold text-slate-900 dark:text-white">Vendor</span> <span>vendor@demo.com</span></div>
                <div className="flex justify-between items-center"><span className="font-semibold text-slate-900 dark:text-white">Admin</span> <span>admin@demo.com</span></div>
                <p className="text-xs text-slate-500 text-center mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">Password for all: Demo@1234</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Right Image Section */}
      <div className="hidden lg:block relative w-full flex-1">
        <div className="absolute inset-0 h-full w-full object-cover">
          <img
            className="h-full w-full object-cover"
            src="https://mover.delivery/media/ncxb32h4/how-same-day-delivery-works-in-india.png"
            alt="Delicious food delivery"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-slate-900/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        </div>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Fastest delivery in town</h3>
          <p className="text-lg text-slate-200 max-w-lg leading-relaxed">
            Join thousands of users getting their favorite meals, groceries, and essentials delivered in under 15 minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;