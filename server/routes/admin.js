const express = require('express');
const {
  getPendingVendors,
  getAllVendors,
  approveVendor,
  rejectVendor,
  getAllOrders,
  getDashboardStats,
} = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Admin-only endpoints
router.get('/vendors/pending', verifyToken, requireRole(['admin']), getPendingVendors);
router.get('/vendors', verifyToken, requireRole(['admin']), getAllVendors);
router.put('/vendors/:vendorId/approve', verifyToken, requireRole(['admin']), approveVendor);
router.put('/vendors/:vendorId/reject', verifyToken, requireRole(['admin']), rejectVendor);
router.get('/orders', verifyToken, requireRole(['admin']), getAllOrders);
router.get('/stats', verifyToken, requireRole(['admin']), getDashboardStats);

module.exports = router;
