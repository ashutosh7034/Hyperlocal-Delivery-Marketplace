const {
  VendorProfile,
  User,
  Product,
  CustomerAddress,
  Order,
  OrderItem,
} = require('../models');
const { geocodeAddress, haversineDistance } = require('../services/googleMaps');
const { Op, sequelize } = require('sequelize');

/**
 * Get vendor profile
 */
const getVendorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const vendor = await VendorProfile.findOne({
      where: { user_id: userId },
      include: [{ model: User, as: 'user', attributes: ['email', 'name'] }],
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found',
      });
    }

    res.json({
      success: true,
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
 * Register vendor (create vendorProfile)
 */
const registerVendor = async (req, res) => {
  try {
    const {
      shop_name,
      gstin,
      phone,
      address,
      city,
      state,
      pin_code,
      delivery_radius_km,
      delivery_charge,
      min_order_amount,
      category,
    } = req.body;

    // Validate required fields
    if (!shop_name || !address || !city || !state || !pin_code) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Validate pin code (6 digits)
    if (!/^\d{6}$/.test(pin_code)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pin code. Must be 6 digits',
      });
    }

    // Validate GSTIN if provided (15 char alphanumeric)
    if (gstin && !/^[A-Z0-9]{15}$/.test(gstin)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GSTIN format',
      });
    }

    // Geocode the address to get lat/lng
    let geocodeResult;
    try {
      const fullAddress = `${address}, ${city}, ${state}, ${pin_code}, India`;
      geocodeResult = await geocodeAddress(fullAddress);
    } catch (geocodeError) {
      return res.status(400).json({
        success: false,
        message: 'Unable to geocode address. Please verify the address.',
      });
    }

    // Create vendor profile
    const vendor = await VendorProfile.create({
      user_id: req.user.id,
      shop_name,
      gstin,
      phone,
      address,
      city,
      state,
      pin_code,
      lat: geocodeResult.lat,
      lng: geocodeResult.lng,
      delivery_radius_km: delivery_radius_km || 5,
      delivery_charge: delivery_charge || 30,
      min_order_amount: min_order_amount || 200,
      category,
      approval_status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Vendor registration submitted. Awaiting admin approval.',
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
 * Update vendor profile
 */
const updateVendorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      delivery_radius_km,
      delivery_charge,
      min_order_amount,
      phone,
      description,
      opening_time,
      closing_time,
    } = req.body;

    const vendor = await VendorProfile.findOne({
      where: { user_id: userId },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found',
      });
    }

    // Update fields
    if (delivery_radius_km) vendor.delivery_radius_km = delivery_radius_km;
    if (delivery_charge) vendor.delivery_charge = delivery_charge;
    if (min_order_amount) vendor.min_order_amount = min_order_amount;
    if (phone) vendor.phone = phone;
    if (description) vendor.description = description;
    if (opening_time) vendor.opening_time = opening_time;
    if (closing_time) vendor.closing_time = closing_time;

    await vendor.save();

    res.json({
      success: true,
      message: 'Vendor profile updated successfully',
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
 * Get nearby vendors for a customer
 * Uses Haversine formula to calculate distance
 */
const getNearbyVendors = async (req, res) => {
  try {
    const { lat, lng, radius = 30 } = req.query;

    // Fetch all approved active vendors
    const vendors = await VendorProfile.findAll({
      where: {
        approval_status: 'approved',
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'verified'],
          where: { status: 'active' },
        },
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!lat || !lng) {
      return res.json({
        success: true,
        data: vendors.map((vendor) => ({
          ...vendor.toJSON(),
          distance_km: null,
          isDeliverable: true,
        })),
        count: vendors.length,
      });
    }

    const customerLat = parseFloat(lat);
    const customerLng = parseFloat(lng);

    // Calculate distance for each vendor using Haversine formula
    const vendorsWithDistance = vendors
      .map((vendor) => {
        const distance = parseFloat(
          haversineDistance(customerLat, customerLng, vendor.lat, vendor.lng)
        );

        return {
          ...vendor.toJSON(),
          distance_km: distance,
          isDeliverable: distance <= vendor.delivery_radius_km,
        };
      })
      .filter((vendor) => vendor.isDeliverable && vendor.distance_km <= radius)
      .sort((a, b) => a.distance_km - b.distance_km);

    res.json({
      success: true,
      data: vendorsWithDistance,
      count: vendorsWithDistance.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get vendor's orders
 */
const getVendorOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const vendor = await VendorProfile.findOne({
      where: { user_id: userId },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found',
      });
    }

    const orders = await Order.findAll({
      where: {
        vendor_id: vendor.id,
        ...(status ? { order_status: status } : {}),
      },
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: CustomerAddress,
          as: 'deliveryAddress',
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'image_url'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

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
 * Update order status (vendor)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { order_status } = req.body;

    // Verify vendor owns this order
    const vendor = await VendorProfile.findOne({
      where: { user_id: userId },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found',
      });
    }

    const order = await Order.findOne({
      where: {
        id: orderId,
        vendor_id: vendor.id,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.order_status = order_status;
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getVendorProfile,
  registerVendor,
  updateVendorProfile,
  getNearbyVendors,
  getVendorOrders,
  updateOrderStatus,
};
