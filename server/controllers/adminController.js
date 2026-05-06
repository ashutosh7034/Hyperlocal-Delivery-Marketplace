const { VendorProfile, User, Order } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all pending vendor applications
 */
const getPendingVendors = async (req, res) => {
  try {
    const vendors = await VendorProfile.findAll({
      where: { approval_status: 'pending' },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all approved vendors
 */
const getAllVendors = async (req, res) => {
  try {
    const { status, city } = req.query;

    const query = {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'verified'] }],
      order: [['created_at', 'DESC']],
    };

    if (status) {
      query.where = { approval_status: status };
    }

    if (city) {
      if (!query.where) query.where = {};
      query.where.city = city;
    }

    const vendors = await VendorProfile.findAll(query);

    res.json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Approve vendor application
 */
const approveVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await VendorProfile.findByPk(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    vendor.approval_status = 'approved';
    await vendor.save();

    // Update user status to active
    const user = await User.findByPk(vendor.user_id);
    if (user) {
      user.status = 'active';
      await user.save();
    }

    res.json({
      success: true,
      message: 'Vendor approved successfully',
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Reject vendor application
 */
const rejectVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body;

    const vendor = await VendorProfile.findByPk(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    vendor.approval_status = 'rejected';
    await vendor.save();

    // Update user status
    const user = await User.findByPk(vendor.user_id);
    if (user) {
      user.status = 'suspended';
      await user.save();
    }

    res.json({
      success: true,
      message: 'Vendor rejected successfully',
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all orders (admin view)
 */
const getAllOrders = async (req, res) => {
  try {
    const { status, vendorId, customerId } = req.query;

    const query = {
      include: [
        { model: VendorProfile, as: 'vendor' },
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
      ],
      order: [['created_at', 'DESC']],
    };

    if (status) {
      query.where = { order_status: status };
    }

    if (vendorId) {
      if (!query.where) query.where = {};
      query.where.vendor_id = vendorId;
    }

    if (customerId) {
      if (!query.where) query.where = {};
      query.where.customer_id = customerId;
    }

    const orders = await Order.findAll(query);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalVendors = await VendorProfile.count({
      where: { approval_status: 'approved' },
    });

    const pendingVendors = await VendorProfile.count({
      where: { approval_status: 'pending' },
    });

    const totalCustomers = await User.count({
      where: { role: 'customer', status: 'active' },
    });

    const totalOrders = await Order.count();

    const deliveredOrders = await Order.count({
      where: { order_status: 'delivered' },
    });

    // Calculate total revenue (sum of all delivered orders)
    const { sum: totalRevenue } = await Order.findOne({
      attributes: [[require('sequelize').fn('sum', require('sequelize').col('total_amount')), 'sum']],
      where: { order_status: 'delivered' },
      raw: true,
    });

    // Orders by status
    const ordersByStatus = await Order.findAll({
      attributes: [
        'order_status',
        [require('sequelize').fn('count', require('sequelize').col('id')), 'count'],
      ],
      group: 'order_status',
      raw: true,
    });

    // Top vendors by order count
    const topVendors = await Order.findAll({
      attributes: [
        'vendor_id',
        [require('sequelize').fn('count', require('sequelize').col('Order.id')), 'order_count'],
      ],
      include: [
        {
          model: VendorProfile,
          as: 'vendor',
          attributes: ['id', 'shop_name'],
        },
      ],
      group: ['Order.vendor_id', 'vendor.id'],
      order: [[require('sequelize').literal('order_count'), 'DESC']],
      limit: 5,
      raw: true,
      subQuery: false,
    });

    res.json({
      success: true,
      data: {
        totalVendors,
        pendingVendors,
        totalCustomers,
        totalOrders,
        deliveredOrders,
        totalRevenue: totalRevenue || 0,
        ordersByStatus,
        topVendors,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getPendingVendors,
  getAllVendors,
  approveVendor,
  rejectVendor,
  getAllOrders,
  getDashboardStats,
};
