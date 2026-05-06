const express = require('express');
const {
  getCustomerProfile,
  getAddresses,
  getCustomerOrders,
  addAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/customerController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Customer-only endpoints
router.get('/profile', verifyToken, requireRole(['customer']), getCustomerProfile);
router.get('/addresses', verifyToken, requireRole(['customer']), getAddresses);
router.get('/orders', verifyToken, requireRole(['customer']), getCustomerOrders);
router.post('/addresses', verifyToken, requireRole(['customer']), addAddress);
router.put('/addresses/:addressId', verifyToken, requireRole(['customer']), updateAddress);
router.delete('/addresses/:addressId', verifyToken, requireRole(['customer']), deleteAddress);

module.exports = router;
