import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/BaseComponents';
import { vendorAPI } from '../api/endpoints';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Store, Filter, Clock, ChevronRight } from 'lucide-react';
import { getVendorImage } from '../utils/imageHelpers';
import SafeImage from '../components/SafeImage';

const BrowseVendorsPage = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await vendorAPI.getNearbyVendors();
        setVendors(response.data.data || []);
      } catch (vendorError) {
        setError(vendorError.response?.data?.message || 'Unable to load vendors.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(v => 
    v.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Discover amazing <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">local stores</span> near you
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl">
              Get fresh groceries, daily essentials, and your favorite meals delivered to your doorstep in minutes.
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search for stores or categories..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <Button size="lg" className="px-8 whitespace-nowrap">
                Find Stores
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Store className="text-primary" /> 
            {searchTerm ? 'Search Results' : 'Nearby Stores'}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full ml-2">
              {filteredVendors.length}
            </span>
          </h2>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Filter size={16} className="mr-2" /> Filters
          </Button>
        </div>

        {error ? <ErrorAlert message={error} onClose={() => setError('')} /> : null}

        {filteredVendors.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/vendor/${vendor.id}`)}
              >
                <Card className="h-full p-0 overflow-hidden border-transparent shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-900">
                  <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <SafeImage
                      src={vendor.logo_url || getVendorImage(vendor.shop_name, vendor.category, index)}
                      fallback={getVendorImage(vendor.shop_name, vendor.category, index + 1)}
                      alt={vendor.shop_name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60" />
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-sm">
                        <Star size={12} className="text-amber-500 mr-1 fill-current" /> {vendor.rating || '4.5'}
                      </span>
                      <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        Open
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {vendor.shop_name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                      {vendor.category || 'Local Essentials'}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex flex-col gap-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <MapPin size={12} className="mr-1" /> Distance
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {vendor.delivery_radius_km} km
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <Clock size={12} className="mr-1" /> Delivery
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          15-25 min
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Min. Order: ₹{vendor.min_order_amount || 100}
                      </span>
                      <span className="text-primary text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                        Visit Store <ChevronRight size={16} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No stores found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              We couldn't find any stores matching your search. Try adjusting your filters or expanding your search area.
            </p>
            <Button onClick={() => setSearchTerm('')} variant="outline">
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseVendorsPage;
