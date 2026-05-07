import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/BaseComponents';
import { productAPI, vendorAPI } from '../api/endpoints';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Info, ShoppingCart, Plus, Minus, Search, Filter } from 'lucide-react';

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
];

const VendorDetailPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Local cart state for demo purposes
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const [vendorsRes, productsRes] = await Promise.all([
          vendorAPI.getNearbyVendors(),
          productAPI.getByVendor(vendorId),
        ]);
        const selectedVendor = (vendorsRes.data.data || []).find((item) => String(item.id) === String(vendorId));
        setVendor(selectedVendor || { shop_name: 'Premium Store', category: 'General', address: 'Local area', city: 'City', rating: 4.8 });
        setProducts(productsRes.data.data || []);
      } catch (shopError) {
        setError(shopError.response?.data?.message || 'Unable to load this shop.');
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [vendorId]);

  const handleAddToCart = (product) => {
    setCart(prev => ({
      ...prev,
      [product.id]: {
        ...product,
        quantity: (prev[product.id]?.quantity || 0) + 1
      }
    }));
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId]?.quantity > 1) {
        newCart[productId].quantity -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const cartTotal = useMemo(() => {
    return Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const cartItemsCount = useMemo(() => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pb-20">
      {error ? (
        <div className="max-w-7xl mx-auto px-4 mt-8"><ErrorAlert message={error} onClose={() => setError('')} /></div>
      ) : null}

      {/* Store Cover Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="h-64 md:h-80 w-full relative">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920" 
            alt="Store Cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80" />
          
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-end gap-6">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl border-4 border-white dark:border-slate-900 bg-white shadow-xl overflow-hidden shrink-0 hidden sm:block">
                <img src="https://ui-avatars.com/api/?name=Vendor&background=ff6b35&color=fff&size=200" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl md:text-5xl font-black mb-2">{vendor?.shop_name || 'Vendor Shop'}</h1>
                <p className="text-slate-300 text-sm md:text-base max-w-2xl mb-4 line-clamp-2">
                  {vendor?.description || vendor?.category || 'Browse available products from this vendor.'}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    <Star size={16} className="text-amber-400 fill-amber-400" /> 
                    {vendor?.rating || '4.5'} (500+ ratings)
                  </span>
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    <Clock size={16} /> 25-35 min
                  </span>
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    <MapPin size={16} /> {vendor?.city || 'Local area'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* Products Section */}
          <div className="flex-1 w-full min-w-0">
            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-20 z-30">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search in store..." 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary text-sm transition-all"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                {['All', 'Bestsellers', 'Groceries', 'Snacks'].map((cat, i) => (
                  <button key={i} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${i === 0 ? 'bg-primary text-white shadow-glow' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="h-full p-4 flex flex-col group hover:shadow-xl transition-all duration-300 dark:bg-slate-900 border-transparent hover:border-primary/20">
                      <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                        <img 
                          src={PRODUCT_IMAGES[idx % PRODUCT_IMAGES.length]} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {product.stock <= 0 && (
                          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                            <span className="bg-white text-slate-900 font-bold px-4 py-2 rounded-full text-sm">Out of Stock</span>
                          </div>
                        )}
                        {product.mrp && product.price < product.mrp && (
                          <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2">{product.name}</h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{product.category || product.unit}</p>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div>
                            <span className="text-lg font-black text-slate-900 dark:text-white">₹{product.price}</span>
                            {product.mrp && <span className="text-xs text-slate-400 line-through ml-2">₹{product.mrp}</span>}
                          </div>
                          
                          {cart[product.id] ? (
                            <div className="flex items-center gap-3 bg-primary text-white rounded-full p-1 shadow-glow">
                              <button onClick={() => handleRemoveFromCart(product.id)} className="h-7 w-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                                <Minus size={14} />
                              </button>
                              <span className="font-bold text-sm min-w-[1ch] text-center">{cart[product.id].quantity}</span>
                              <button onClick={() => handleAddToCart(product)} className="h-7 w-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                                <Plus size={14} />
                              </button>
                            </div>
                          ) : (
                            <Button 
                              onClick={() => handleAddToCart(product)} 
                              disabled={product.stock <= 0} 
                              size="sm"
                              className="rounded-full px-4"
                            >
                              Add <Plus size={16} className="ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <Info size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products available</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  This vendor hasn't added any products to their store yet. Check back later!
                </p>
              </div>
            )}
          </div>

          {/* Sticky Cart Sidebar */}
          <div className="w-full lg:w-[350px] shrink-0 sticky top-20 z-20">
            <Card className="p-0 overflow-hidden shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShoppingCart size={18} className="text-primary" /> Your Cart
                </h3>
                <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {cartItemsCount} items
                </span>
              </div>
              
              <div className="p-4 max-h-[40vh] overflow-y-auto">
                {cartItemsCount > 0 ? (
                  <div className="space-y-4">
                    {Object.values(cart).map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-1">₹{item.price} x {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">₹{item.price * item.quantity}</p>
                          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            <button onClick={() => handleRemoveFromCart(item.id)} className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-700 shadow-sm text-slate-600 dark:text-slate-300">
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => handleAddToCart(item)} className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-700 shadow-sm text-slate-600 dark:text-slate-300">
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart size={24} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Your cart is empty</p>
                    <p className="text-xs text-slate-400 mt-1">Add items to get started</p>
                  </div>
                )}
              </div>

              {cartItemsCount > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Item Total</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Delivery Fee</span>
                    <span className="font-semibold text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white">To Pay</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">₹{cartTotal}</span>
                  </div>
                  <Button className="w-full shadow-glow" size="lg">
                    Checkout <ChevronRight size={18} className="ml-1" />
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailPage;
