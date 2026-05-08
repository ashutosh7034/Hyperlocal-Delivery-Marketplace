const express = require('express');
const {
  getVendorProfile,
  registerVendor,
  updateVendorProfile,
  getNearbyVendors,
  getVendorById,
  getVendorOrders,
  updateOrderStatus,
} = require('../controllers/vendorController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Store discovery is public; opening a store requires login.
router.get('/nearby', getNearbyVendors);

// Vendor-only endpoints

router.get('/profile', verifyToken, requireRole(['vendor']), getVendorProfile);
router.post('/register', verifyToken, requireRole(['vendor']), registerVendor);
router.put(
  '/profile',
  verifyToken,
  requireRole(['vendor']),
  updateVendorProfile
);
router.get('/orders', verifyToken, requireRole(['vendor']), getVendorOrders);
router.put(
  '/orders/:orderId/status',
  verifyToken,
  requireRole(['vendor']),
  updateOrderStatus
);

router.get('/:vendorId', verifyToken, getVendorById);

module.exports = router;
