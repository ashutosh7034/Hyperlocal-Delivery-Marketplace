const express = require('express');
const sequelize = require('./config/database');
const cors = require('./config/cors');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendor');
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customer');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);

// Create uploads folder if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static('uploads'));

// Import models for association
const { User, CustomerProfile, VendorProfile, CustomerAddress, Product, Order, OrderItem } = require('./models');

const seedDemoUsers = async () => {
  const demoUsers = [
    {
      email: 'customer@demo.com',
      name: 'Demo Customer',
      password: 'Demo@1234',
      role: 'customer',
      verified: true,
      status: 'active',
    },
    {
      email: 'vendor@demo.com',
      name: 'Demo Vendor',
      password: 'Demo@1234',
      role: 'vendor',
      verified: true,
      status: 'active',
    },
    {
      email: 'admin@demo.com',
      name: 'Demo Admin',
      password: 'Demo@1234',
      role: 'admin',
      verified: true,
      status: 'active',
    },
  ];

  for (const demoUser of demoUsers) {
    const existingUser = await User.findOne({ where: { email: demoUser.email } });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(demoUser.password, 10);
      const createdUser = await User.create({
        name: demoUser.name,
        email: demoUser.email,
        password: hashedPassword,
        role: demoUser.role,
        verified: demoUser.verified,
        status: demoUser.status,
      });

      if (demoUser.role === 'customer') {
        await CustomerProfile.create({ user_id: createdUser.id });
      }

      if (demoUser.role === 'vendor') {
        await VendorProfile.create({
          user_id: createdUser.id,
          shop_name: 'Demo Fresh Mart',
          address: 'MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pin_code: '560001',
          lat: 12.9716,
          lng: 77.5946,
          approval_status: 'approved',
          delivery_radius_km: 5,
          delivery_charge: 25,
          min_order_amount: 150,
          category: 'Groceries',
          phone: '9000000001',
          description: 'Fresh local essentials for the neighborhood.',
        });
      }
    }
  }
};

const seedDemoMarketplaceData = async () => {
  const customerUser = await User.findOne({ where: { email: 'customer@demo.com' } });
  const vendorUser = await User.findOne({ where: { email: 'vendor@demo.com' } });

  if (!customerUser || !vendorUser) {
    return;
  }

  const vendorProfile = await VendorProfile.findOne({ where: { user_id: vendorUser.id } });
  const customerAddressCount = await CustomerAddress.count({ where: { user_id: customerUser.id } });

  if (customerAddressCount === 0) {
    await CustomerAddress.create({
      user_id: customerUser.id,
      label: 'Home',
      full_address: '24 Brigade Road',
      city: 'Bengaluru',
      pin_code: '560001',
      lat: 12.9716,
      lng: 77.5946,
      is_default: true,
    });
  }

  if (!vendorProfile) {
    return;
  }

  const demoProducts = [
    {
      name: 'Fresh Milk 1L',
      description: 'Daily fresh dairy milk',
      price: 58,
      mrp: 60,
      unit: '1 L',
      stock: 40,
      category: 'Dairy',
    },
    {
      name: 'Brown Bread',
      description: 'Soft whole wheat bread loaf',
      price: 42,
      mrp: 45,
      unit: '1 pack',
      stock: 25,
      category: 'Bakery',
    },
    {
      name: 'Banana Bunch',
      description: 'Farm-fresh bananas',
      price: 36,
      mrp: 40,
      unit: '6 pcs',
      stock: 30,
      category: 'Fruits',
    },
  ];

  for (const productSeed of demoProducts) {
    const existingProduct = await Product.findOne({
      where: {
        vendor_id: vendorProfile.id,
        name: productSeed.name,
      },
    });

    if (!existingProduct) {
      await Product.create({
        vendor_id: vendorProfile.id,
        ...productSeed,
        is_available: true,
      });
    }
  }

  let existingOrder = await Order.findOne({ where: { order_number: 'ORD-1001' } });

  if (!existingOrder) {
    const deliveryAddress = await CustomerAddress.findOne({
      where: { user_id: customerUser.id },
      order: [['is_default', 'DESC']],
    });

    const milkProduct = await Product.findOne({
      where: { vendor_id: vendorProfile.id, name: 'Fresh Milk 1L' },
    });

    if (deliveryAddress && milkProduct) {
      existingOrder = await Order.create({
        order_number: 'ORD-1001',
        customer_id: customerUser.id,
        vendor_id: vendorProfile.id,
        delivery_address_id: deliveryAddress.id,
        subtotal: 116,
        delivery_charge: 25,
        discount_amount: 10,
        total_amount: 131,
        payment_method: 'cod',
        payment_status: 'completed',
        order_status: 'delivered',
        notes: 'Leave at the door',
        estimated_delivery_time: '00:30:00',
      });
    }
  }

  const milkProduct = await Product.findOne({
    where: { vendor_id: vendorProfile.id, name: 'Fresh Milk 1L' },
  });

  if (existingOrder && milkProduct) {
    const existingItem = await OrderItem.findOne({
      where: {
        order_id: existingOrder.id,
        product_id: milkProduct.id,
      },
    });

    if (!existingItem) {
      await OrderItem.create({
        order_id: existingOrder.id,
        product_id: milkProduct.id,
        quantity: 2,
        price: 58,
        subtotal: 116,
      });
    }
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Error handler middleware
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Sync models with database
    if (process.env.NODE_ENV === 'development') {
      // Use alter in development to update tables
      await sequelize.sync({ alter: false });
      console.log('✓ Database models synced');
    }

    await seedDemoUsers();
    await seedDemoMarketplaceData();
    console.log('✓ Demo users ready');

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║  HyperLocal India - Delivery Marketplace   ║
║  Server running on port ${PORT}                ║
╚════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
