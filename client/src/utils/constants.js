/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

/**
 * Format currency for Indian Rupees
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Validate Indian pin code (6 digits)
 */
export const isValidPinCode = (pinCode) => {
  return /^\d{6}$/.test(pinCode);
};

/**
 * Validate GSTIN (15 character alphanumeric)
 */
export const isValidGSTIN = (gstin) => {
  return /^[A-Z0-9]{15}$/.test(gstin);
};

/**
 * Validate Indian phone number (+91 prefix)
 */
export const isValidPhoneNumber = (phone) => {
  return /^(\+91)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
};

/**
 * Format phone number with +91 prefix
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return phone;
};

/**
 * Indian states list
 */
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

/**
 * Popular Indian cities
 */
export const POPULAR_CITIES = [
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Chandigarh',
  'Indore',
  'Kochi',
  'Visakhapatnam',
  'Meerut',
  'Nagpur',
  'Bhopal',
  'Coimbatore',
  'Vadodara',
  'Ghaziabad',
];

/**
 * Product unit options
 */
export const PRODUCT_UNITS = [
  'kg',
  'g',
  'litre',
  'ml',
  'piece',
  'dozen',
  'pack',
];

/**
 * Product categories
 */
export const PRODUCT_CATEGORIES = [
  'Grocery',
  'Food & Beverages',
  'Pharmacy',
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Beauty & Personal Care',
  'Toys & Games',
  'Books',
  'Dairy',
];

/**
 * Vendor categories
 */
export const VENDOR_CATEGORIES = [
  'Grocery',
  'Restaurant',
  'Pharmacy',
  'Electronics',
  'Fashion',
  'Home Supplies',
  'Beauty',
];
