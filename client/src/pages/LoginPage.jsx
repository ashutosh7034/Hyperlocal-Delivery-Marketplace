import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../api/endpoints';
import { Button, Card, Input, ErrorAlert } from '../components/BaseComponents';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: 'customer@demo.com', password: 'Demo@1234' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    <section className="surface-grid min-h-[calc(100vh-160px)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Sign in</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Welcome back to HyperLocal India
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Use the demo account below to verify the sign-in flow locally or log in with a real account from the API.
          </p>

          <Card className="mt-8 border border-slate-200/80 bg-white/90">
            <p className="text-sm font-semibold text-slate-500">Demo accounts</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold">Customer:</span> customer@demo.com / Demo@1234</p>
              <p><span className="font-semibold">Vendor:</span> vendor@demo.com / Demo@1234</p>
              <p><span className="font-semibold">Admin:</span> admin@demo.com / Demo@1234</p>
            </div>
          </Card>
        </div>

        <Card className="border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/60">
          <h2 className="text-2xl font-bold text-slate-950">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">Enter your email and password to continue.</p>

          <form className="mt-6" onSubmit={handleSubmit}>
            {error ? <ErrorAlert message={error} onClose={() => setError('')} /> : null}
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              autoComplete="current-password"
            />

            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            New here?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </section>
  );
};

export default LoginPage;