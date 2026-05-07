import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
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

// New Pages
import CareersPage from './pages/CareersPage';
import RiderAppPage from './pages/RiderAppPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import FindStoresPage from './pages/FindStoresPage';

import './index.css';

/**
 * Main App Component
 */
function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-300">
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
                    
                    {/* New Routes */}
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/rider-app" element={<RiderAppPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/find-stores" element={<FindStoresPage />} />

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>

                <Footer />
              </div>
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
