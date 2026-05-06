import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';
import { Header, Footer } from './components/BaseComponents';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BrowseVendorsPage from './pages/BrowseVendorsPage';
import VendorDetailPage from './pages/VendorDetailPage';
import OrdersPage from './pages/OrdersPage';
import VendorProductsPage from './pages/VendorProductsPage';
import VendorOrdersPage from './pages/VendorOrdersPage';
import AdminVendorsPage from './pages/AdminVendorsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

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
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/dashboard" element={<CustomerDashboard />} />
                  <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/verify-email" element={<HomePage />} />
                  <Route path="/vendors" element={<BrowseVendorsPage />} />
                  <Route path="/vendor/:vendorId" element={<VendorDetailPage />} />
                  <Route path="/cart" element={<HomePage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/vendor/products" element={<VendorProductsPage />} />
                  <Route path="/vendor/orders" element={<VendorOrdersPage />} />
                  <Route path="/admin/vendors" element={<AdminVendorsPage />} />
                  <Route path="/admin/orders" element={<AdminOrdersPage />} />
                  <Route path="*" element={<NotFoundPage />} />
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
