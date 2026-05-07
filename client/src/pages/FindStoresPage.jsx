import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Clock, Navigation, LocateFixed, ShoppingCart, Utensils, Pill, Store, ArrowUpDown } from 'lucide-react';
import { Card, Button } from '../components/BaseComponents';

// Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock vendor data with expanded fields
const INITIAL_VENDORS = [
  { id: 1, name: 'Fresh Mart Grocery', category: 'Groceries', rating: 4.8, distance: 1.2, lat: 12.9716, lng: 77.5946, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', coverImg: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', deliveryTime: '15-20 min', isOpen: true },
  { id: 2, name: 'Spicy Kitchen', category: 'Restaurant', rating: 4.9, distance: 0.8, lat: 12.9756, lng: 77.5906, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', coverImg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', deliveryTime: '30-40 min', isOpen: true },
  { id: 3, name: 'Green Pharmacy', category: 'Medicines', rating: 4.7, distance: 2.1, lat: 12.9696, lng: 77.6016, img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400', coverImg: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800', deliveryTime: '10-15 min', isOpen: false },
  { id: 4, name: 'Daily Essentials', category: 'Convenience', rating: 4.5, distance: 1.5, lat: 12.9786, lng: 77.5846, img: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400', coverImg: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800', deliveryTime: '5-10 min', isOpen: true },
];

const CATEGORIES = [
  { name: 'All', icon: Store },
  { name: 'Groceries', icon: ShoppingCart },
  { name: 'Restaurant', icon: Utensils },
  { name: 'Medicines', icon: Pill },
  { name: 'Convenience', icon: Store }
];

// Custom DivIcon for beautiful animated map markers
const createCustomIcon = (category, isActive) => {
  const emoji = category === 'Groceries' ? '🛒' : category === 'Restaurant' ? '🍔' : category === 'Medicines' ? '💊' : '🏪';
  const html = `
    <div class="relative group cursor-pointer transition-transform duration-300 ${isActive ? 'scale-125 z-50' : 'hover:scale-110 z-40'}">
      <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${isActive ? 'bg-primary text-white ring-4 ring-primary/30' : 'bg-white text-slate-700'}">
        <span class="text-lg">${emoji}</span>
      </div>
      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-sm ${isActive ? 'bg-primary' : 'bg-white'} rotate-45"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-leaflet-icon bg-transparent border-none',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -45]
  });
};

// Map View Controller
function ChangeMapView({ coords, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, zoom || map.getZoom(), {
        animate: true,
        duration: 1
      });
    }
  }, [coords, zoom, map]);
  return null;
}

// Haversine distance calculator
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1); // Distance in km
};

// Skeleton Loader Component
const StoreSkeleton = () => (
  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
    <div className="flex gap-3">
      <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const FindStoresPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const [activeVendorId, setActiveVendorId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  
  // Default center (Bangalore)
  const defaultCenter = [12.9716, 77.5946];
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(14);
  
  const listRef = useRef(null);
  const cardRefs = useRef({});

  // Simulate network delay for skeletons
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, sortBy]);

  // Handle User Location
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = [latitude, longitude];
          setUserLocation(newLocation);
          setMapCenter(newLocation);
          setMapZoom(15);
          
          // Recalculate distances for mock vendors
          const updatedVendors = INITIAL_VENDORS.map(v => ({
            ...v,
            distance: parseFloat(calculateDistance(latitude, longitude, v.lat, v.lng))
          }));
          setVendors(updatedVendors);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get your location. Please check browser permissions.");
          setIsLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const filteredAndSortedVendors = useMemo(() => {
    let result = vendors.filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || vendor.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'Distance') {
      result = result.sort((a, b) => a.distance - b.distance);
    } else {
      // Default recommended sorting (highest rating first)
      result = result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [vendors, searchTerm, selectedCategory, sortBy]);

  const handleVendorSelect = (vendor) => {
    setActiveVendorId(vendor.id);
    setMapCenter([vendor.lat, vendor.lng]);
    setMapZoom(16);
    
    // Scroll to card
    if (cardRefs.current[vendor.id]) {
      cardRefs.current[vendor.id].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] bg-slate-50 dark:bg-dark-bg">
      <div className="flex-1 flex flex-col md:flex-row h-full relative">
        
        {/* Sidebar/List View */}
        <div className="w-full md:w-[400px] lg:w-[450px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col h-[calc(100vh-5rem)] z-20 shadow-2xl relative">
          <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50 space-y-5">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="text-primary" /> Find Stores
              </h1>
              <button 
                onClick={handleLocateMe}
                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors"
                title="Use Current Location"
              >
                <LocateFixed size={18} />
              </button>
            </div>
            
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search for stores or restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 dark:text-white placeholder:text-slate-500 shadow-inner"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                      isSelected 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Icon size={14} className={isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {isLoading ? 'Searching...' : `${filteredAndSortedVendors.length} stores nearby`}
              </span>
              <button 
                onClick={() => setSortBy(sortBy === 'Recommended' ? 'Distance' : 'Recommended')}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowUpDown size={14} />
                {sortBy}
              </button>
            </div>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar scroll-smooth">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {[1, 2, 3].map(i => <StoreSkeleton key={i} />)}
                </motion.div>
              ) : filteredAndSortedVendors.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 px-4"
                >
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store className="text-slate-400" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No stores found</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Try adjusting your filters or search area.</p>
                </motion.div>
              ) : (
                filteredAndSortedVendors.map((vendor, idx) => (
                  <motion.div
                    key={vendor.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                    ref={el => cardRefs.current[vendor.id] = el}
                    onClick={() => handleVendorSelect(vendor)}
                  >
                    <Card className={`p-3 cursor-pointer transition-all duration-300 border-2 overflow-hidden relative group ${
                      activeVendorId === vendor.id 
                        ? 'border-primary shadow-xl shadow-primary/10 bg-primary/[0.02] dark:bg-primary/[0.05] scale-[1.02]' 
                        : 'border-transparent hover:border-primary/20 hover:shadow-md'
                    }`}>
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm">
                          <img src={vendor.img} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          {!vendor.isOpen && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                              <span className="text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-white/30 rounded">Closed</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold text-slate-900 dark:text-white truncate text-base pr-2">{vendor.name}</h3>
                              <div className="flex items-center gap-1 text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded shadow-sm shrink-0">
                                <Star size={10} fill="currentColor" /> {vendor.rating}
                              </div>
                            </div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">{vendor.category}</p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                            <span className="flex items-center gap-1.5"><Navigation size={12} className="text-primary"/> {vendor.distance} km</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-amber-500"/> {vendor.deliveryTime}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1 relative h-[50vh] md:h-auto z-0 overflow-hidden bg-slate-100 dark:bg-slate-900">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            scrollWheelZoom={true}
            className="w-full h-full"
            zoomControl={false}
          >
            {/* Standard Light Tiles - CSS handles dark mode */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="map-tiles transition-all duration-700"
            />
            <ChangeMapView coords={mapCenter} zoom={mapZoom} />
            
            {userLocation && (
              <Marker 
                position={userLocation}
                icon={L.divIcon({
                  html: `<div class="relative flex items-center justify-center w-8 h-8"><div class="absolute w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div><div class="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg z-10"></div></div>`,
                  className: 'user-location-marker bg-transparent border-none',
                  iconSize: [32, 32],
                  iconAnchor: [16, 16]
                })}
              />
            )}

            {filteredAndSortedVendors.map(vendor => (
              <Marker 
                key={vendor.id} 
                position={[vendor.lat, vendor.lng]}
                icon={createCustomIcon(vendor.category, activeVendorId === vendor.id)}
                eventHandlers={{
                  click: () => handleVendorSelect(vendor),
                }}
              >
                <Popup className="premium-popup" closeButton={false} offset={[0, -20]}>
                  <div className="w-[240px] bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
                    <div className="relative h-28">
                      <img src={vendor.coverImg} alt={vendor.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      {!vendor.isOpen && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-white/20 rounded">
                          Closed Now
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="font-bold text-lg leading-tight mb-1 truncate shadow-black drop-shadow-md">{vendor.name}</h3>
                        <p className="text-xs text-white/80 font-medium drop-shadow-md">{vendor.category}</p>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-3 text-xs font-semibold">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <Navigation size={12} className="text-primary"/> {vendor.distance} km
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <Clock size={12} className="text-amber-500"/> {vendor.deliveryTime}
                        </div>
                        <div className="flex items-center gap-1 text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                          <Star size={10} fill="currentColor" /> {vendor.rating}
                        </div>
                      </div>
                      <Button size="sm" variant="primary" className="w-full text-xs py-2 shadow-md hover:shadow-lg transition-shadow">
                        {vendor.isOpen ? 'Order Now' : 'View Store'}
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Glassmorphism gradient overlays */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/20 to-transparent dark:from-slate-900/50 pointer-events-none z-10 hidden md:block"></div>
          
          <style>{`
            /* Deep, Rich Dark Mode Map Filters */
            .dark .map-tiles {
              filter: invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.9) grayscale(0.2) sepia(0.1);
            }
            .leaflet-container {
              background: #f8fafc;
              font-family: inherit;
            }
            .dark .leaflet-container {
              background: #0f172a;
            }
            
            /* Clean up default popup styles for premium look */
            .leaflet-popup-content-wrapper {
              padding: 0;
              border-radius: 0.75rem;
              background: transparent;
              box-shadow: none;
            }
            .leaflet-popup-content {
              margin: 0;
              width: auto !important;
            }
            .leaflet-popup-tip-container {
              display: none; /* Hide default triangle */
            }
            
            /* Ensure smooth animation for markers */
            .custom-leaflet-icon {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default FindStoresPage;

