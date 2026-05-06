import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Header Component
 */
export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-xl shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-2xl font-black tracking-tight text-primary">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-xl">🚀</span>
          HyperLocal India
        </Link>
        <div className="flex items-center gap-3 text-sm font-medium sm:gap-6">
          <Link to="/" className="text-slate-700 transition hover:text-primary">Home</Link>
          <Link to="/about" className="text-slate-700 transition hover:text-primary">About</Link>
          <Link to="/contact" className="text-slate-700 transition hover:text-primary">Contact</Link>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-2 transition hover:border-primary hover:bg-primary/5"
              >
                <div className="h-6 w-6 rounded-full bg-primary/10 grid place-items-center text-xs font-bold text-primary">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-700">{user.name?.split(' ')[0]}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg py-1">
                  <div className="px-4 py-2 border-b border-slate-200">
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-primary/20 bg-white px-4 py-2 text-primary transition hover:border-primary hover:bg-primary hover:text-white"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

/**
 * Footer Component
 */
export const Footer = () => {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-lg font-semibold text-white">HyperLocal India</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            A hyperlocal marketplace for customers, vendors, and admins who need a clean, fast delivery workflow.
          </p>
        </div>
        <div className="text-sm text-slate-300">
          <p className="font-semibold text-white">Platform</p>
          <ul className="mt-3 space-y-2">
            <li>Nearby vendor discovery</li>
            <li>Inventory and order management</li>
            <li>Role-based dashboard access</li>
          </ul>
        </div>
        <div className="text-sm text-slate-300">
          <p className="font-semibold text-white">Status</p>
          <p className="mt-3">Frontend and backend are now wired to boot locally.</p>
          <p className="mt-2 text-xs text-slate-400">&copy; 2026 HyperLocal India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

/**
 * Loading Spinner
 */
export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

/**
 * Error Alert
 */
export const ErrorAlert = ({ message, onClose }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      <span className="block sm:inline">{message}</span>
      <button
        onClick={onClose}
        className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-700 font-bold"
      >
        ×
      </button>
    </div>
  );
};

/**
 * Success Alert
 */
export const SuccessAlert = ({ message, onClose }) => {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
      <span className="block sm:inline">{message}</span>
      <button
        onClick={onClose}
        className="absolute top-0 bottom-0 right-0 px-4 py-3 text-green-700 font-bold"
      >
        ×
      </button>
    </div>
  );
};

/**
 * Button Component
 */
export const Button = ({ children, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-orange-600',
    secondary: 'bg-secondary text-white hover:bg-blue-900',
    outline: 'border-2 border-primary text-primary hover:bg-orange-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const { className = '', ...buttonProps } = props;

  return (
    <button
      className={`px-4 py-2 rounded font-semibold transition ${variants[variant]} ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

/**
 * Input Component
 */
export const Input = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-gray-700 font-semibold mb-2">{label}</label>}
      <input
        className={`w-full px-3 py-2 border rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:border-primary`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

/**
 * Card Component
 */
export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {children}
    </div>
  );
};
