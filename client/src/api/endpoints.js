import apiInstance from './instance';

/**
 * Auth API calls
 */
export const authAPI = {
  register: (data) => apiInstance.post('/auth/register', data),
  login: (data) => apiInstance.post('/auth/login', data),
  verifyEmail: (token) => apiInstance.get(`/auth/verify/${token}`),
  getCurrentUser: () => apiInstance.get('/auth/current-user'),
};

/**
 * Vendor API calls
 */
export const vendorAPI = {
  register: (data) => apiInstance.post('/vendors/register', data),
  getProfile: () => apiInstance.get('/vendors/profile'),
  updateProfile: (data) => apiInstance.put('/vendors/profile', data),
  getNearbyVendors: (lat, lng, radius) =>
    apiInstance.get('/vendors/nearby', { params: { lat, lng, radius } }),
  getOrders: (status) =>
    apiInstance.get('/vendors/orders', { params: { status } }),
  updateOrderStatus: (orderId, status) =>
    apiInstance.put(`/vendors/orders/${orderId}/status`, { order_status: status }),
};

/**
 * Product API calls
 */
export const productAPI = {
  getByVendor: (vendorId) =>
    apiInstance.get('/products', { params: { vendorId } }),
  create: (data) => apiInstance.post('/products', data),
  update: (productId, data) => apiInstance.put(`/products/${productId}`, data),
  delete: (productId) => apiInstance.delete(`/products/${productId}`),
};

/**
 * Cart API calls (placeholder - to be implemented)
 */
export const cartAPI = {
  add: (data) => apiInstance.post('/cart/add', data),
  getCart: () => apiInstance.get('/cart'),
  removeItem: (itemId) => apiInstance.delete(`/cart/items/${itemId}`),
};

/**
 * Order API calls (placeholder - to be implemented)
 */
export const orderAPI = {
  create: (data) => apiInstance.post('/orders', data),
  getOrders: () => apiInstance.get('/orders'),
  getOrderDetails: (orderId) => apiInstance.get(`/orders/${orderId}`),
};

export default {
  auth: authAPI,
  vendor: vendorAPI,
  product: productAPI,
  cart: cartAPI,
  order: orderAPI,
};
