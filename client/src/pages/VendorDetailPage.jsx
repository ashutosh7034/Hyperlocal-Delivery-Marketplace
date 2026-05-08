import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/BaseComponents';
import { customerAPI, productAPI, vendorAPI } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Info, ShoppingCart, Plus, Minus, Search, CheckCircle } from 'lucide-react';
import { getProductImage, getVendorImage } from '../utils/imageHelpers';

const VendorDetailPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local cart state for demo purposes
  const [cart, setCart] = useState({});

  // Checkout state
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const [vendorRes, productsRes] = await Promise.all([
          vendorAPI.getById(vendorId),
          productAPI.getByVendor(vendorId),
        ]);

        setVendor(vendorRes.data.data || null);
        setProducts(productsRes.data.data || vendorRes.data.data?.products || []);
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

  const handleCheckout = async () => {
    setError('');

    if (!isAuthenticated || user?.role !== 'customer') {
      navigate('/login', { state: { from: `/vendors/${vendorId}` } });
      return;
    }

    if (cartItemsCount === 0) {
      setError('Your cart is empty.');
      return;
    }

    setPlacingOrder(true);
    try {
      const addressesRes = await customerAPI.getAddresses();
      const addresses = addressesRes.data.data || [];
      const defaultAddress = addresses.find((a) => a.is_default) || addresses[0];

      if (!defaultAddress) {
        setError('Please add a delivery address in your profile before checking out.');
        setPlacingOrder(false);
        return;
      }

      const items = Object.values(cart).map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const res = await customerAPI.createOrder({
        vendor_id: Number(vendorId),
        delivery_address_id: defaultAddress.id,
        items,
        payment_method: 'cod',
      });

      const placedOrder = res.data?.data?.order;
      setOrderSuccess(placedOrder);
      setCart({});
    } catch (checkoutError) {
      setError(checkoutError.response?.data?.message || 'Unable to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const searchableText = [product.name, product.category, product.description, product.unit]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  const categoryOptions = useMemo(() => {
    const productCategories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
    return ['All', ...productCategories.slice(0, 4)];
  }, [products]);

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
            src={vendor?.cover_url || getVendorImage(vendor?.shop_name, vendor?.category, 1)}
            alt="Store Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80" />
          
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-end gap-6">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl border-4 border-white dark:border-slate-900 bg-white shadow-xl overflow-hidden shrink-0 hidden sm:block">
                <img src={getVendorImage(vendor?.shop_name, vendor?.category, 0)} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl md:text-5xl font-black mb-2">{vendor?.shop_name || 'Vendor Shop'}</h1>
                <p className="text-slate-300 text-sm md:text-base max-w-2xl mb-4 line-clamp-2">
                  {vendor?.description || vendor?.category || 'Browse available products from this vendor.'}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    <Star size={16} className="text-amber-400 fill-amber-400" /> 
                    {vendor?.rating || '4.5'}
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary text-sm transition-all"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-primary text-white shadow-glow' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="h-full p-4 flex flex-col group hover:shadow-xl transition-all duration-300 dark:bg-slate-900 border-transparent hover:border-primary/20">
                      <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                        <img 
                          src={product.image_url || getProductImage(product.name, product.category, idx)} 
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
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {searchTerm || selectedCategory !== 'All' ? 'No matching products' : 'No products available'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {searchTerm || selectedCategory !== 'All'
                    ? 'Try searching by the exact product name, category, or ingredient.'
                    : "This vendor hasn't added any products to their store yet. Check back later!"}
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
                  <Button
                    className="w-full shadow-glow"
                    size="lg"
                    onClick={handleCheckout}
                    isLoading={placingOrder}
                    disabled={placingOrder}
                  >
                    Checkout <ChevronRight size={18} className="ml-1" />
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 text-center"
          >
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Order Placed!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {orderSuccess.order_number ? `Your order ${orderSuccess.order_number} has been placed.` : 'Your order has been placed.'}
              {' '}You will be notified when it is on the way.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setOrderSuccess(null)}>
                Continue shopping
              </Button>
              <Button className="flex-1" onClick={() => navigate('/orders')}>
                View orders
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VendorDetailPage;
