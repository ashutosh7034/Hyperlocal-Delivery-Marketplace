import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, TrendingUp, Search, ShieldCheck, ChevronRight, Activity } from 'lucide-react';
import { Card, Button } from '../components/BaseComponents';
import SafeImage from '../components/SafeImage';
import { vendorAPI } from '../api/endpoints';
import { useLocation as useCustomerLocation } from '../hooks/useLocation';
import { useAuth } from '../hooks/useAuth';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400',
];

const HomePage = () => {
  const navigate = useNavigate();
  const { updateLocationByAddress } = useCustomerLocation();
  const { isAuthenticated } = useAuth();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [searchingLocation, setSearchingLocation] = useState(false);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        setLoadingVendors(true);
        const response = await vendorAPI.getNearbyVendors();

        setVendors(response.data.data || []);
      } catch (error) {
        setVendors([]);
      } finally {
        setLoadingVendors(false);
      }
    };

    loadVendors();
  }, []);

  const stats = useMemo(() => {
    const cities = new Set(vendors.map((vendor) => vendor.city).filter(Boolean));
    const avgRadius = vendors.length
      ? vendors.reduce((sum, vendor) => sum + Number(vendor.delivery_radius_km || 0), 0) / vendors.length
      : 0;

    return [
      { value: `${vendors.length || 0}+`, label: 'Local Stores' },
      { value: `${cities.size || 0}`, label: 'Cities Covered' },
      { value: `${avgRadius ? avgRadius.toFixed(1) : '0'} km`, label: 'Avg Delivery Radius' },
    ];
  }, [vendors]);

  const trendingVendors = useMemo(() => {
    return vendors.slice(0, 4).map((vendor, index) => ({
      id: vendor.id,
      name: vendor.shop_name,
      category: vendor.category || 'Local Store',
      distance: vendor.distance_km != null ? `${Number(vendor.distance_km).toFixed(1)} km` : `${vendor.city || 'Nearby'}`,
      rating: vendor.approval_status === 'approved' ? 4.8 : 4.5,
      image: vendor.logo_url || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    }));
  }, [vendors]);

  const handleLocationSearch = async (event) => {
    event.preventDefault();

    if (!deliveryAddress.trim()) {
      navigate('/vendors');
      return;
    }

    try {
      setSearchingLocation(true);
      await updateLocationByAddress(deliveryAddress.trim());
      navigate('/vendors');
    } catch (error) {
      navigate('/vendors');
    } finally {
      setSearchingLocation(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-dark-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/5 blur-3xl -z-10" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten" />
        <div className="absolute top-20 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Lightning fast local delivery
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                Craving it? <br/>
                <span className="text-gradient">We deliver it.</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-lg leading-relaxed">
                From fresh groceries to your favorite local restaurant meals, get everything delivered to your doorstep in minutes.
              </p>

              {/* Location Input */}
              <form onSubmit={handleLocationSearch} className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl shadow-primary/10 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center">
                  <MapPin className="absolute left-4 text-primary" size={20} />
                  <input 
                    type="text" 
                    placeholder="Enter your delivery address" 
                    value={deliveryAddress}
                    onChange={(event) => setDeliveryAddress(event.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 pl-12 pr-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto shadow-none">
                  {searchingLocation ? 'Searching...' : 'Search'}
                </Button>
              </form>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                {stats.map((stat, idx) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                  >
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                {loadingVendors
                  ? 'Loading nearby stores...'
                  : `Showing ${vendors.length} live stores near you.`}
              </p>
            </motion.div>

            {/* Right Content - Floating UI Elements */}
            <div className="relative lg:h-[600px] hidden md:block">
              {/* Main Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[450px] h-[550px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 z-10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=800" 
                  alt="Delivery package" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              </motion.div>

              {/* Floating Tracking Card */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-24 -left-12 z-20"
              >
                <Card className="p-4 w-64 glass-card dark:glass-card flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Activity size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live Tracking</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Arriving in 12 min</p>
                  </div>
                </Card>
              </motion.div>

              {/* Floating Review Card */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-32 -left-4 z-20"
              >
                <Card className="p-4 w-72 glass-card dark:glass-card">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-amber-400">
                      {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">5.0</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white italic">
                    "Fastest delivery I've ever experienced! The food was still piping hot."
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Vendors Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <TrendingUp size={20} />
                <span className="font-bold text-sm uppercase tracking-wider">Trending</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                Popular near you
              </h2>
            </div>
            <Link to="/vendors" className="hidden md:flex items-center gap-1 font-semibold text-primary hover:text-orange-600 transition group mt-4 md:mt-0">
              Explore all 
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingVendors.map((vendor, idx) => (
              <motion.div
                key={vendor.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link to={isAuthenticated ? `/vendor/${vendor.id}` : '/login'}>
                  <Card hover={true} className="h-full p-0 flex flex-col group cursor-pointer border-none shadow-md hover:shadow-xl dark:bg-slate-800">
                    <div className="relative h-48 overflow-hidden">
                      <SafeImage
                        src={vendor.image}
                        fallback={FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm dark:bg-slate-900/90 px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                        <Star size={14} className="text-amber-500" fill="currentColor" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{vendor.rating}</span>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{vendor.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{vendor.category}</p>
                      
                      <div className="mt-auto flex items-center justify-between text-sm font-medium pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <MapPin size={16} className="text-primary" />
                          {vendor.distance}
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Clock size={16} className="text-emerald-500" />
                          10-15 min
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" className="w-full">Explore all stores</Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50 dark:bg-dark-bg">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
              Lightning fast delivery, guaranteed.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              We've optimized every step of the process to get your order to you as quickly and securely as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/10 via-primary to-primary/10 -translate-y-1/2 z-0" />

            {[
              { icon: Search, title: "Discover", desc: "Find the best local stores and restaurants near you." },
              { icon: Clock, title: "Order", desc: "Place your order easily and track it in real-time." },
              { icon: ShieldCheck, title: "Receive", desc: "Get it delivered safely to your doorstep." }
            ].map((step, i) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-primary/10 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-6 text-primary">
                  <step.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 px-4">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10" />
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">
              Ready to experience the future <br className="hidden md:block"/> of local delivery?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-8">
                  Get Started Now
                </Button>
              </Link>
              <Link to="/vendors">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white dark:text-slate-300">
                  Browse Stores
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
