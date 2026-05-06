import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../api/endpoints';
import { Button, Card, ErrorAlert, Input } from '../components/BaseComponents';

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
      await authAPI.register(formData);
      const loginResponse = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });
      const { token, user } = loginResponse.data.data;
      login(token, user);
      navigate('/', { replace: true });
    } catch (registerError) {
      const message = registerError.response?.data?.message || 'Unable to register right now.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="surface-grid min-h-[calc(100vh-160px)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Create account</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Join the marketplace in a few steps
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Customer and vendor accounts are ready for local development, and new signups are auto-verified so you can test the full flow immediately.
          </p>
        </div>

        <Card className="border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/60">
          <h2 className="text-2xl font-bold text-slate-950">Register</h2>
          <p className="mt-2 text-sm text-slate-500">Create a customer or vendor account.</p>

          <form className="mt-6" onSubmit={handleSubmit}>
            {error ? <ErrorAlert message={error} onClose={() => setError('')} /> : null}
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              autoComplete="name"
            />
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
              placeholder="Create a password"
              autoComplete="new-password"
            />

            <div className="mb-4">
              <label className="mb-2 block font-semibold text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
              >
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </section>
  );
};

export default RegisterPage;
