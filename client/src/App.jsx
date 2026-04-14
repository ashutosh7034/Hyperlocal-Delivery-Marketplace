import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';
import { Header, Footer } from './components/BaseComponents';
import './index.css';

// Import pages (these will be created based on requirements)
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';

/**
 * Main App Component
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              
              <main className="flex-grow">
                <Routes>
                  {/* Auth Routes */}
                  <Route path="/login" element={<div>Login Page (Coming Soon)</div>} />
                  <Route path="/register" element={<div>Register Page (Coming Soon)</div>} />
                  <Route path="/verify-email" element={<div>Email Verification (Coming Soon)</div>} />

                  {/* Customer Routes */}
                  <Route path="/" element={<div>Home Page (Coming Soon)</div>} />
                  <Route path="/vendor/:vendorId" element={<div>Vendor Details (Coming Soon)</div>} />
                  <Route path="/cart" element={<div>Shopping Cart (Coming Soon)</div>} />
                  <Route path="/orders" element={<div>My Orders (Coming Soon)</div>} />

                  {/* Vendor Routes */}
                  <Route path="/vendor/dashboard" element={<div>Vendor Dashboard (Coming Soon)</div>} />
                  <Route path="/vendor/products" element={<div>Product Management (Coming Soon)</div>} />
                  <Route path="/vendor/orders" element={<div>Vendor Orders (Coming Soon)</div>} />

                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<div>Admin Dashboard (Coming Soon)</div>} />
                  <Route path="/admin/vendors" element={<div>Vendor Management (Coming Soon)</div>} />
                  <Route path="/admin/orders" element={<div>Order Management (Coming Soon)</div>} />

                  {/* 404 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
