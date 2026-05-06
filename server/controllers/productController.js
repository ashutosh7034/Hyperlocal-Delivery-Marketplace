const { Product, VendorProfile } = require('../models');
const cloudinary = require('../config/cloudinary');

/**
 * Get products by vendor
 */
const getProductsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID is required',
      });
    }

    const products = await Product.findAll({
      where: {
        vendor_id: vendorId,
        is_available: true,
      },
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get products for the authenticated vendor
 */
const getMyProducts = async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({
      where: { user_id: req.user.id },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found',
      });
    }

    const products = await Product.findAll({
      where: {
        vendor_id: vendor.id,
      },
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Create product (vendor)
 */
const createProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, price, mrp, unit, stock, category } = req.body;

    // Get vendor profile
    const vendor = await VendorProfile.findOne({
      where: { user_id: userId },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found',
      });
    }

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required',
      });
    }

    let imageUrl = null;

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'hyperlocal/products',
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: 'Image upload failed',
        });
      }
    }

    const product = await Product.create({
      vendor_id: vendor.id,
      name,
      description,
      price,
      mrp,
      unit,
      stock: stock || 0,
      category,
      image_url: imageUrl,
      is_available: true,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update product (vendor)
 */
const updateProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { name, description, price, mrp, unit, stock, category, is_available } =
      req.body;

    // Get vendor profile
    const vendor = await VendorProfile.findOne({
      where: { user_id: userId },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found',
      });
    }

    // Get product
    const product = await Product.findOne({
      where: {
        id: productId,
        vendor_id: vendor.id,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (mrp) product.mrp = mrp;
    if (unit) product.unit = unit;
    if (stock !== undefined) product.stock = stock;
    if (category) product.category = category;
    if (is_available !== undefined) product.is_available = is_available;

    // Handle image update
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'hyperlocal/products',
        });
        product.image_url = result.secure_url;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: 'Image upload failed',
        });
      }
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete product (vendor)
 */
const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Get vendor profile
    const vendor = await VendorProfile.findOne({
      where: { user_id: userId },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found',
      });
    }

    // Get and delete product
    const product = await Product.findOne({
      where: {
        id: productId,
        vendor_id: vendor.id,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete from Cloudinary if image exists
    if (product.image_url) {
      try {
        const publicId = product.image_url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`hyperlocal/products/${publicId}`);
      } catch (error) {
        console.error('Cloudinary deletion error:', error);
      }
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProductsByVendor,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
