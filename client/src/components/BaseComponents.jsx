import React from 'react';

/**
 * Header Component
 */
export const Header = () => {
  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">🚀 HyperLocal India</h1>
        </div>
        <ul className="flex space-x-6">
          <li><a href="/" className="text-gray-700 hover:text-primary">Home</a></li>
          <li><a href="/about" className="text-gray-700 hover:text-primary">About</a></li>
          <li><a href="/contact" className="text-gray-700 hover:text-primary">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

/**
 * Footer Component
 */
export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; 2024 HyperLocal India. All rights reserved.</p>
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

  return (
    <button
      className={`px-4 py-2 rounded font-semibold transition ${variants[variant]}`}
      {...props}
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
