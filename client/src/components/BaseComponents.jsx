import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, LogOut, User, Menu, X, Rocket, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind Classes */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Theme Toggle Component
 */
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </motion.button>
  );
};

/**
 * Header Component
 */
export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 glass dark:glass">
      <nav className="container mx-auto flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-primary to-orange-400 text-white shadow-glow"
          >
            <Rocket size={24} />
          </motion.div>
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Hyper<span className="text-primary">Local</span>
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-primary",
                  location.pathname === link.path ? "text-primary dark:text-primary" : "text-slate-600 dark:text-slate-300"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {isAuthenticated && user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 transition shadow-sm hover:border-primary/50"
                >
                  <div className="h-7 w-7 rounded-full bg-primary/10 dark:bg-primary/20 grid place-items-center text-sm font-bold text-primary">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={16} className="text-slate-400" />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{user.role}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        >
                          <User size={16} />
                          My Profile
                        </Link>
                        <Link
                          to={user.role === 'customer' ? '/dashboard' : `/${user.role}/dashboard`}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        >
                          <Rocket size={16} />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition mt-1"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition">
                  Sign in
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-700 dark:text-slate-200">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-semibold text-slate-800 dark:text-slate-200"
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign in</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

/**
 * Footer Component
 */
export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="container py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-white">
                <Rocket size={18} />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">HyperLocal</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              The fastest way to get anything delivered from your favorite local stores. Premium delivery experience.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-slate-500 hover:text-primary dark:text-slate-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-500 hover:text-primary dark:text-slate-400 transition">Contact</Link></li>
              <li><Link to="/careers" className="text-sm text-slate-500 hover:text-primary dark:text-slate-400 transition">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/vendors" className="text-sm text-slate-500 hover:text-primary dark:text-slate-400 transition">Browse Stores</Link></li>
              <li><Link to="/register" className="text-sm text-slate-500 hover:text-primary dark:text-slate-400 transition">Become a Partner</Link></li>
              <li><Link to="/rider-app" className="text-sm text-slate-500 hover:text-primary dark:text-slate-400 transition">Rider App</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-sm text-slate-500 hover:text-primary dark:text-slate-400 transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm text-slate-500 hover:text-primary dark:text-slate-400 transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} HyperLocal India. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary hover:bg-primary/10 transition cursor-pointer">
              X
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary hover:bg-primary/10 transition cursor-pointer">
              IN
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

/**
 * Loading Spinner
 */
export const LoadingSpinner = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-primary dark:border-slate-700 dark:border-t-primary"
      />
      <p className="text-sm font-medium text-slate-500 animate-pulse">Loading amazing things...</p>
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">{content}</div>;
  }

  return <div className="py-12 flex justify-center">{content}</div>;
};

/**
 * Error Alert
 */
export const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6 flex items-start gap-3 rounded-xl bg-rose-50 p-4 text-rose-800 border border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/50"
    >
      <div className="mt-0.5">⚠️</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      {onClose && (
        <button onClick={onClose} className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-200">
          <X size={18} />
        </button>
      )}
    </motion.div>
  );
};

/**
 * Success Alert
 */
export const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50"
    >
      <div className="mt-0.5">✅</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      {onClose && (
        <button onClick={onClose} className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-200">
          <X size={18} />
        </button>
      )}
    </motion.div>
  );
};

/**
 * Premium Button Component
 */
export const Button = React.forwardRef(({ children, variant = 'primary', size = 'md', className, isLoading, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white shadow-lg shadow-slate-900/20",
    outline: "border-2 border-slate-200 dark:border-slate-700 bg-transparent hover:border-primary hover:text-primary dark:text-slate-200 dark:hover:border-primary dark:hover:text-primary",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
    danger: "bg-rose-500 text-white shadow-lg shadow-rose-500/25 hover:bg-rose-600",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      ref={ref}
      whileHover={!props.disabled && !isLoading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!props.disabled && !isLoading ? { scale: 0.98 } : {}}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Please wait...</span>
        </div>
      ) : children}
    </motion.button>
  );
});
Button.displayName = 'Button';

/**
 * Premium Input Component
 */
export const Input = React.forwardRef(({ label, error, icon: Icon, className, ...props }, ref) => {
  return (
    <div className={cn("mb-5 w-full", className)}>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white",
            Icon ? "pl-11" : "",
            error 
              ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500" 
              : "border-slate-200 focus:border-primary focus:ring-primary/20 dark:border-slate-700"
          )}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-sm text-rose-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});
Input.displayName = 'Input';

/**
 * Premium Card Component
 */
export const Card = ({ children, className = '', hover = true, ...props }) => {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover ? {
    whileHover: { y: -4, transition: { duration: 0.2 } }
  } : {};

  return (
    <Component
      className={cn(
        "rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden",
        hover && "hover:shadow-lg transition-shadow duration-300",
        className
      )}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
};
