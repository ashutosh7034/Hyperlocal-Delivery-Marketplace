const { CustomerProfile, User, CustomerAddress, Order, OrderItem, VendorProfile, Product } = require('../models');
const { geocodeAddress } = require('../services/googleMaps');

/**
 * Get customer profile
 */
const getCustomerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const customer = await CustomerProfile.findOne({
      where: { user_id: userId },
      include: [{ model: User, as: 'user', attributes: ['email', 'name'] }],
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found',
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get customer's saved addresses
 */
const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await CustomerAddress.findAll({
      where: { user_id: userId },
      order: [['is_default', 'DESC'], ['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get customer orders
 */
const getCustomerOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { customer_id: userId },
      include: [
        { model: VendorProfile, as: 'vendor' },
        { model: CustomerAddress, as: 'deliveryAddress' },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'image_url'],
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
 * Add new customer address
 */
const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { label, full_address, city, pin_code, is_default } = req.body;

    // Validate required fields
    if (!full_address || !city || !pin_code) {
      return res.status(400).json({
        success: false,
        message: 'Address, city, and pin code are required',
      });
    }

    // Validate pin code
    if (!/^\d{6}$/.test(pin_code)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pin code. Must be 6 digits',
      });
    }

    // Geocode the address
    let geocodeResult;
    try {
      const fullAddressStr = `${full_address}, ${city}, ${pin_code}, India`;
      geocodeResult = await geocodeAddress(fullAddressStr);
    } catch (geocodeError) {
      return res.status(400).json({
        success: false,
        message: 'Unable to geocode address. Please verify the address.',
      });
    }

    // If this is the first address or explicitly set as default, make it default
    let setAsDefault = is_default || false;
    const existingAddresses = await CustomerAddress.findAll({
      where: { user_id: userId },
    });

    if (existingAddresses.length === 0) {
      setAsDefault = true;
    }

    // If setting as default, update other addresses
    if (setAsDefault) {
      await CustomerAddress.update(
        { is_default: false },
        { where: { user_id: userId } }
      );
    }

    // Create new address
    const address = await CustomerAddress.create({
      user_id: userId,
      label: label || 'Home',
      full_address,
      city,
      pin_code,
      lat: geocodeResult.lat,
      lng: geocodeResult.lng,
      is_default: setAsDefault,
    });

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update customer address
 */
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { label, full_address, city, pin_code, is_default } = req.body;

    // Find address
    const address = await CustomerAddress.findOne({
      where: {
        id: addressId,
        user_id: userId,
      },
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // Update fields
    if (label) address.label = label;
    if (full_address) address.full_address = full_address;
    if (city) address.city = city;
    if (pin_code) address.pin_code = pin_code;

    // If setting as default, update other addresses
    if (is_default) {
      await CustomerAddress.update(
        { is_default: false },
        { where: { user_id: userId } }
      );
      address.is_default = true;
    }

    // Geocode if address changed
    if (full_address || city || pin_code) {
      try {
        const fullAddressStr = `${address.full_address}, ${address.city}, ${address.pin_code}, India`;
        const geocodeResult = await geocodeAddress(fullAddressStr);
        address.lat = geocodeResult.lat;
        address.lng = geocodeResult.lng;
      } catch (geocodeError) {
        return res.status(400).json({
          success: false,
          message: 'Unable to geocode address',
        });
      }
    }

    await address.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete customer address
 */
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const address = await CustomerAddress.findOne({
      where: {
        id: addressId,
        user_id: userId,
      },
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // If deleting default address, set another as default
    if (address.is_default) {
      const nextAddress = await CustomerAddress.findOne({
        where: { user_id: userId, id: { [require('sequelize').Op.ne]: addressId } },
        order: [['created_at', 'DESC']],
      });

      if (nextAddress) {
        nextAddress.is_default = true;
        await nextAddress.save();
      }
    }

    await address.destroy();

    res.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Create an order (checkout) - supports COD for now
 */
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vendor_id, delivery_address_id, items = [], notes = '', payment_method = 'cod' } = req.body;

    if (!vendor_id || !delivery_address_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'vendor_id, delivery_address_id and items are required' });
    }

    // Load vendor and address
    const vendor = await VendorProfile.findOne({ where: { id: vendor_id, approval_status: 'approved' } });
    const address = await CustomerAddress.findOne({ where: { id: delivery_address_id, user_id: userId } });

    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found or not approved' });
    if (!address) return res.status(404).json({ success: false, message: 'Delivery address not found' });

    // Calculate subtotal based on products
    let subtotal = 0;
    const orderItems = [];

    for (const it of items) {
      const product = await Product.findOne({ where: { id: it.product_id, vendor_id: vendor.id } });
      if (!product) return res.status(400).json({ success: false, message: `Product ${it.product_id} not found for this vendor` });
      const quantity = Number(it.quantity) || 1;
      const price = Number(product.price || 0);
      subtotal += price * quantity;
      orderItems.push({ product, quantity, price });
    }

    const delivery_charge = Number(vendor.delivery_charge || 0);
    const discount_amount = 0;
    const total_amount = subtotal + delivery_charge - discount_amount;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now().toString().slice(5)}`;

    const order = await Order.create({
      order_number: orderNumber,
      customer_id: userId,
      vendor_id: vendor.id,
      delivery_address_id: address.id,
      subtotal,
      delivery_charge,
      discount_amount,
      total_amount,
      payment_method: payment_method === 'cod' ? 'cod' : 'cod',
      payment_status: payment_method === 'cod' ? 'pending' : 'pending',
      order_status: 'pending',
      notes,
    });

    // Create order items
    for (const oi of orderItems) {
      await OrderItem.create({ order_id: order.id, product_id: oi.product.id, quantity: oi.quantity, price: oi.price, subtotal: oi.quantity * oi.price });
    }

    // Generate invoice
    const invoiceNumber = `INV-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${order.id}`;
    const invoiceData = {
      invoice_number: invoiceNumber,
      order_number: order.order_number,
      date: new Date(),
      customer: { id: userId },
      vendor: { id: vendor.id, shop_name: vendor.shop_name, address: vendor.address },
      items: orderItems.map((oi) => ({ name: oi.product.name, qty: oi.quantity, price: oi.price, subtotal: oi.quantity * oi.price })),
      subtotal,
      delivery_charge,
      discount_amount,
      total_amount,
    };

    const { Invoice } = require('../models');
    await Invoice.create({ order_id: order.id, invoice_number: invoiceNumber, data: JSON.stringify(invoiceData) });

    res.status(201).json({ success: true, message: 'Order created', data: { order, invoice: invoiceData } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCustomerProfile,
  getAddresses,
  getCustomerOrders,
  addAddress,
  updateAddress,
  deleteAddress,
  createOrder,
};
