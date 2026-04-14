const express = require('express');
const {
  getProductsByVendor,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { verifyToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public endpoint to get products by vendor
router.get('/', getProductsByVendor);

// Vendor-only endpoints
router.post(
  '/',
  verifyToken,
  requireRole(['vendor']),
  upload.single('image'),
  createProduct
);
router.put(
  '/:productId',
  verifyToken,
  requireRole(['vendor']),
  upload.single('image'),
  updateProduct
);
router.delete(
  '/:productId',
  verifyToken,
  requireRole(['vendor']),
  deleteProduct
);

module.exports = router;
