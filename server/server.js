const express = require('express');
require('dotenv').config();

// Validate environment variables FIRST, before importing anything else
const { validateEnvironment, logEnvironmentStatus } = require('./config/envValidator');
validateEnvironment();

const sequelize = require('./config/database');
const cors = require('./config/cors');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
const bcrypt = require('bcryptjs');

// Routes
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendor');
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customer');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_PORT_ATTEMPTS = 10;
const SHOULD_SEED_DEMO_DATA = process.env.SEED_DEMO_DATA === 'true';

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

const PRODUCT_TAG_MAP = {
  'fresh milk 1l': 'milk,bottle,dairy',
  'brown bread': 'brownbread,bread,loaf',
  'banana bunch': 'banana,fruit,bunch',
  'tomatoes': 'tomato,vegetable,red',
  'onions': 'onion,vegetable',
  'vitamin c 500mg': 'vitamin,tablet,medicine',
  'pain relief gel': 'gel,medicine,tube',
  'cough syrup': 'syrup,medicine,bottle',
  'first aid kit': 'firstaid,bandage,medicine',
  'plain dosa': 'dosa,southindian,food',
  'samosa pack': 'samosa,snack,indian',
  'masala chai': 'chai,tea,indian',
  'idli pack': 'idli,southindian,food',
  'garlic chutney': 'chutney,sauce,green',
  'croissant': 'croissant,pastry,bakery',
  'chocolate cake': 'chocolatecake,cake,dessert',
  'multigrain bread': 'multigrain,bread,loaf',
  'cookies pack': 'cookies,biscuit,snack',
  'doughnut': 'doughnut,donut,pastry',
  'organic rice 1kg': 'rice,grain,basmati',
  'organic dal': 'dal,lentil,indian',
  'honey raw': 'honey,jar,golden',
  'almonds': 'almonds,nuts,dryfruit',
  'coconut oil': 'coconutoil,oil,bottle',
  'margherita pizza': 'margherita,pizza,cheese',
  'pepperoni pizza': 'pepperoni,pizza',
  'garlic bread': 'garlicbread,bread,baked',
  'coke': 'cocacola,cola,drink',
  'chocolate brownie': 'brownie,chocolate,dessert',
  'biryani': 'biryani,rice,indian',
  'butter chicken': 'butterchicken,curry,indian',
  'naan bread': 'naan,bread,indian',
  'raita': 'raita,yogurt,indian',
  'gulab jamun': 'gulabjamun,sweet,indian',
  'laddu box': 'laddu,sweet,indian',
  'barfi': 'barfi,sweet,indian',
  'birthday cake': 'birthdaycake,cake,celebration',
  'jalebi': 'jalebi,sweet,indian',
  'kheer pack': 'kheer,sweet,pudding',
  'protein powder': 'protein,powder,fitness',
  'bcaas': 'supplement,fitness,powder',
  'green tea': 'greentea,tea',
  'multivitamin': 'multivitamin,vitamin,tablet',
  'yoga mat': 'yogamat,yoga,fitness',
  'instant noodles': 'noodles,instant,asian',
  'biscuits pack': 'biscuit,cookie,snack',
  'chips': 'chips,potato,snack',
  'chocolate bar': 'chocolatebar,chocolate,sweet',
  'ice cream': 'icecream,dessert,cone',
};

const VENDOR_TAG_MAP = {
  'demo fresh mart': 'grocery,supermarket,store',
  'fresh daily mart': 'grocery,vegetable,market',
  'supreme pharmacy': 'pharmacy,drugstore,medicine',
  'chai & samosa corner': 'tea,chai,indianfood',
  'happy bakery': 'bakery,bread,pastry',
  'green valley organic': 'organic,vegetable,farm',
  'quick pizza palace': 'pizza,restaurant,italian',
  'spice kitchen restaurant': 'indianfood,restaurant,curry',
  'sweet tooth confectionery': 'sweets,desserts,bakery',
  'fitness & wellness hub': 'fitness,gym,wellness',
  'metro convenience store': 'store,convenience,shop',
};

const CATEGORY_TAG_FALLBACK = {
  dairy: 'dairy,milk',
  bakery: 'bakery,bread',
  fruits: 'fruit,fresh',
  vegetables: 'vegetable,fresh',
  supplements: 'supplement,fitness',
  'pain relief': 'medicine,pharmacy',
  'cough syrup': 'medicine,syrup',
  'first aid': 'firstaid,medicine',
  'south indian': 'southindian,food',
  snacks: 'snack,food',
  beverages: 'drink,beverage',
  condiments: 'sauce,condiment',
  pastry: 'pastry,bakery',
  cake: 'cake,dessert',
  bread: 'bread,bakery',
  cookies: 'cookies,snack',
  grains: 'grain,rice',
  pulses: 'lentil,dal',
  honey: 'honey,jar',
  'dry fruits': 'dryfruits,nuts',
  oils: 'oil,bottle',
  pizza: 'pizza,italian',
  sides: 'side,food',
  dessert: 'dessert,sweet',
  'main course': 'curry,indianfood',
  'side dish': 'side,food',
  sweets: 'sweet,indian',
  vitamins: 'vitamin,tablet',
  tea: 'tea,leaf',
  'fitness gear': 'fitness,gear',
  noodles: 'noodles,asian',
  confectionery: 'chocolate,sweet',
  frozen: 'icecream,frozen',
};

const slugifyImageKey = (text) =>
  (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const hashSeed = (text) => {
  let hash = 0;
  const str = text || 'fallback';
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
};

const buildLoremflickrUrl = (tags, seedKey, width = 800, height = 600) => {
  const safeTags = tags && tags.trim() ? tags.trim() : 'food';
  const lock = hashSeed(seedKey || safeTags);
  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(safeTags)}?lock=${lock}`;
};

const resolveImageTags = (name, category, exactMap) => {
  const slugName = slugifyImageKey(name);
  if (slugName && exactMap[slugName]) return exactMap[slugName];

  const slugCategory = slugifyImageKey(category);
  if (slugCategory && CATEGORY_TAG_FALLBACK[slugCategory]) return CATEGORY_TAG_FALLBACK[slugCategory];

  const tokens = `${slugName} ${slugCategory}`.split(/\s+/).filter(Boolean).slice(0, 3);
  return tokens.length ? tokens.join(',') : 'food';
};

const getProductImageUrl = (name, category) => {
  const tags = resolveImageTags(name, category, PRODUCT_TAG_MAP);
  return buildLoremflickrUrl(tags, `product:${name || ''}:${category || ''}`);
};

const getVendorImageUrl = (shopName, category) => {
  const tags = resolveImageTags(shopName, category, VENDOR_TAG_MAP);
  return buildLoremflickrUrl(tags, `vendor:${shopName || ''}:${category || ''}`, 1600, 900);
};

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
        const existingVendorProfile = await VendorProfile.findOne({ where: { user_id: createdUser.id } });
        const vendorValues = {
          shop_name: 'Demo Fresh Mart',
          address: '123 Linking Road, Bandra',
          city: 'Mumbai',
          state: 'Maharashtra',
          pin_code: '400050',
          lat: 19.0596,
          lng: 72.8295,
          approval_status: 'approved',
          delivery_radius_km: 5,
          delivery_charge: 25,
          min_order_amount: 150,
          category: 'Groceries',
          phone: '9000000001',
          description: 'Fresh local essentials for the neighborhood.',
          logo_url: getVendorImageUrl('Demo Fresh Mart', 'Groceries'),
        };

        if (existingVendorProfile) {
          await existingVendorProfile.update(vendorValues);
        } else {
          await VendorProfile.create({
            user_id: createdUser.id,
            ...vendorValues,
          });
        }
      }
    }
  }
};

const seedDemoMarketplaceData = async () => {
  const customerUser = await User.findOne({ where: { email: 'customer@demo.com' } });

  if (!customerUser) {
    return;
  }

  const customerAddressCount = await CustomerAddress.count({ where: { user_id: customerUser.id } });

  if (customerAddressCount === 0) {
    await CustomerAddress.create({
      user_id: customerUser.id,
      label: 'Home',
      full_address: '123 Marine Drive, Worli, Mumbai',
      city: 'Mumbai',
      pin_code: '400018',
      lat: 19.0116,
      lng: 72.8192,
      is_default: true,
    });
  }

  // Create 10 realistic vendors if they don't exist
  const vendorsList = [
    {
      shop_name: 'Fresh Daily Mart',
      gstin: '27AABCP5055K1Z1',
      phone: '9876543210',
      address: '123 Linking Road, Bandra',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin_code: '400050',
      lat: 19.0596,
      lng: 72.8295,
      delivery_radius_km: 5,
      category: 'Grocery',
      description: 'Fresh groceries and daily essentials delivered fast',
      opening_time: '06:00',
      closing_time: '23:00',
      products: [
        { name: 'Fresh Milk 1L', description: 'Daily fresh dairy milk', price: 58, mrp: 60, unit: '1 L', stock: 50, category: 'Dairy' },
        { name: 'Brown Bread', description: 'Whole wheat bread loaf', price: 42, mrp: 45, unit: '1 pack', stock: 35, category: 'Bakery' },
        { name: 'Banana Bunch', description: 'Farm-fresh bananas', price: 36, mrp: 40, unit: '6 pcs', stock: 40, category: 'Fruits' },
        { name: 'Tomatoes', description: 'Fresh red tomatoes', price: 45, mrp: 50, unit: '1 kg', stock: 60, category: 'Vegetables' },
        { name: 'Onions', description: 'Regular cooking onions', price: 25, mrp: 30, unit: '1 kg', stock: 80, category: 'Vegetables' },
      ],
    },
    {
      shop_name: 'Supreme Pharmacy',
      gstin: '27AABCT1234K1Z5',
      phone: '9876543211',
      address: '456 Linking Road, Fort',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin_code: '400001',
      lat: 18.9271,
      lng: 72.8264,
      delivery_radius_km: 3,
      category: 'Pharmacy',
      description: 'All medicines and health products available',
      opening_time: '08:00',
      closing_time: '22:00',
      products: [
        { name: 'Vitamin C 500mg', description: 'Immune booster tablets', price: 120, mrp: 150, unit: '10 tabs', stock: 100, category: 'Supplements' },
        { name: 'Pain Relief Gel', description: 'Quick relief pain gel', price: 89, mrp: 100, unit: '30g', stock: 45, category: 'Pain Relief' },
        { name: 'Cough Syrup', description: 'Relief from cough and cold', price: 95, mrp: 110, unit: '100ml', stock: 60, category: 'Cough Syrup' },
        { name: 'First Aid Kit', description: 'Complete first aid kit', price: 299, mrp: 350, unit: '1 set', stock: 20, category: 'First Aid' },
      ],
    },
    {
      shop_name: 'Chai & Samosa Corner',
      gstin: '27AABCR5678K1Z2',
      phone: '9876543212',
      address: '789 Phoenix Mills, Andheri',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin_code: '400069',
      lat: 19.1136,
      lng: 72.8697,
      delivery_radius_km: 4,
      category: 'Food & Beverage',
      description: 'Traditional Indian snacks and chai',
      opening_time: '07:00',
      closing_time: '21:00',
      products: [
        { name: 'Plain Dosa', description: 'Crispy dosa with sambar', price: 50, mrp: 60, unit: '1 piece', stock: 100, category: 'South Indian' },
        { name: 'Samosa Pack', description: '5 pieces of hot samosa', price: 40, mrp: 50, unit: '5 pcs', stock: 80, category: 'Snacks' },
        { name: 'Masala Chai', description: 'Strong masala chai', price: 20, mrp: 25, unit: '1 cup', stock: 150, category: 'Beverages' },
        { name: 'Idli Pack', description: '4 pieces soft idli', price: 35, mrp: 40, unit: '4 pcs', stock: 70, category: 'South Indian' },
        { name: 'Garlic Chutney', description: 'Homemade garlic chutney', price: 30, mrp: 35, unit: '100g', stock: 50, category: 'Condiments' },
      ],
    },
    {
      shop_name: 'Happy Bakery',
      gstin: '27AABCB9101K1Z3',
      phone: '9876543213',
      address: '321 Dadar East Market',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin_code: '400014',
      lat: 19.0176,
      lng: 72.8479,
      delivery_radius_km: 3,
      category: 'Bakery',
      description: 'Fresh baked items daily',
      opening_time: '06:00',
      closing_time: '21:00',
      products: [
        { name: 'Croissant', description: 'Butter croissant', price: 60, mrp: 75, unit: '1 piece', stock: 40, category: 'Pastry' },
        { name: 'Chocolate Cake', description: 'Fresh chocolate cake slice', price: 80, mrp: 100, unit: '1 slice', stock: 30, category: 'Cake' },
        { name: 'Multigrain Bread', description: 'Healthy multigrain loaf', price: 55, mrp: 65, unit: '1 loaf', stock: 25, category: 'Bread' },
        { name: 'Cookies Pack', description: 'Assorted cookies', price: 100, mrp: 120, unit: '250g', stock: 50, category: 'Cookies' },
        { name: 'Doughnut', description: 'Glazed doughnut', price: 45, mrp: 55, unit: '1 piece', stock: 60, category: 'Pastry' },
      ],
    },
    {
      shop_name: 'Green Valley Organic',
      gstin: '27AABCG1121K1Z4',
      phone: '9876543214',
      address: '654 Powai, Lake Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin_code: '400076',
      lat: 19.1136,
      lng: 72.9027,
      delivery_radius_km: 4,
      category: 'Organic Store',
      description: '100% organic and pesticide-free products',
      opening_time: '07:00',
      closing_time: '22:00',
      products: [
        { name: 'Organic Rice 1kg', description: 'Premium organic basmati rice', price: 180, mrp: 200, unit: '1 kg', stock: 45, category: 'Grains' },
        { name: 'Organic Dal', description: 'Moong dal organically grown', price: 150, mrp: 175, unit: '1 kg', stock: 40, category: 'Pulses' },
        { name: 'Honey Raw', description: 'Pure raw honey', price: 250, mrp: 300, unit: '500g', stock: 25, category: 'Honey' },
        { name: 'Almonds', description: 'Dry roasted almonds', price: 350, mrp: 400, unit: '250g', stock: 30, category: 'Dry Fruits' },
        { name: 'Coconut Oil', description: 'Cold pressed coconut oil', price: 280, mrp: 320, unit: '500ml', stock: 35, category: 'Oils' },
      ],
    },
    {
      shop_name: 'Quick Pizza Palace',
      gstin: '27AABCP1314K1Z6',
      phone: '9876543215',
      address: '987 Malad West, Highway',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin_code: '400064',
      lat: 19.1849,
      lng: 72.8449,
      delivery_radius_km: 5,
      category: 'Restaurant',
      description: 'Hot and fresh pizzas delivered in 30 mins',
      opening_time: '11:00',
      closing_time: '23:00',
      products: [
        { name: 'Margherita Pizza', description: 'Classic cheese pizza', price: 199, mrp: 250, unit: '1 medium', stock: 50, category: 'Pizza' },
        { name: 'Pepperoni Pizza', description: 'Loaded with pepperoni', price: 249, mrp: 300, unit: '1 medium', stock: 45, category: 'Pizza' },
        { name: 'Garlic Bread', description: 'Crispy garlic bread', price: 99, mrp: 120, unit: '1 order', stock: 60, category: 'Sides' },
        { name: 'Coke', description: 'Cold carbonated drink', price: 50, mrp: 60, unit: '250ml', stock: 100, category: 'Beverages' },
        { name: 'Chocolate Brownie', description: 'Rich chocolate brownie', price: 129, mrp: 150, unit: '1 piece', stock: 40, category: 'Dessert' },
      ],
    },
    {
      shop_name: 'Spice Kitchen Restaurant',
      gstin: '27AABCS1516K1Z7',
      phone: '9876543216',
      address: '147 Thane West, Station Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin_code: '400602',
      lat: 19.2183,
      lng: 72.9781,
      delivery_radius_km: 3,
      category: 'Restaurant',
      description: 'Authentic Indian cuisine with North and South specialties',
      opening_time: '10:00',
      closing_time: '23:30',
      products: [
        { name: 'Biryani', description: 'Fragrant basmati biryani with meat', price: 180, mrp: 220, unit: '1 plate', stock: 60, category: 'Main Course' },
        { name: 'Butter Chicken', description: 'Creamy butter chicken curry', price: 220, mrp: 280, unit: '1 plate', stock: 50, category: 'Main Course' },
        { name: 'Naan Bread', description: 'Butter naan bread', price: 30, mrp: 40, unit: '1 piece', stock: 100, category: 'Bread' },
        { name: 'Raita', description: 'Yogurt side dish', price: 40, mrp: 50, unit: '1 bowl', stock: 80, category: 'Side Dish' },
        { name: 'Gulab Jamun', description: 'Sweet gulab jamun dessert', price: 60, mrp: 75, unit: '2 pieces', stock: 70, category: 'Dessert' },
      ],
    },
    {
      shop_name: 'Sweet Tooth Confectionery',
      gstin: '27AABCST1718K1Z8',
      phone: '9876543217',
      address: '258 Dombivali East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin_code: '421201',
      lat: 19.1136,
      lng: 73.0789,
      delivery_radius_km: 3,
      category: 'Sweets & Bakery',
      description: 'Fresh sweets and cakes made daily',
      opening_time: '08:00',
      closing_time: '21:00',
      products: [
        { name: 'Laddu Box', description: 'Assorted sweet laddus', price: 150, mrp: 200, unit: '500g', stock: 40, category: 'Sweets' },
        { name: 'Barfi', description: 'Traditional milk barfi', price: 180, mrp: 220, unit: '500g', stock: 35, category: 'Sweets' },
        { name: 'Birthday Cake', description: 'Custom cake order', price: 600, mrp: 750, unit: '1 kg', stock: 10, category: 'Cake' },
        { name: 'Jalebi', description: 'Sweet crispy jalebi', price: 100, mrp: 130, unit: '250g', stock: 50, category: 'Sweets' },
        { name: 'Kheer Pack', description: 'Rice pudding pack', price: 80, mrp: 100, unit: '250g', stock: 30, category: 'Sweets' },
      ],
    },
    {
      shop_name: 'Fitness & Wellness Hub',
      gstin: '27AABCFW1920K1Z9',
      phone: '9876543218',
      address: '369 Navi Mumbai, Vashi',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin_code: '400703',
      lat: 19.0821,
      lng: 73.0061,
      delivery_radius_km: 4,
      category: 'Health & Wellness',
      description: 'Organic supplements and fitness products',
      opening_time: '07:00',
      closing_time: '22:00',
      products: [
        { name: 'Protein Powder', description: 'Whey protein powder vanilla', price: 899, mrp: 1200, unit: '1 kg', stock: 25, category: 'Supplements' },
        { name: 'BCAAs', description: 'Branched chain amino acids', price: 649, mrp: 850, unit: '250g', stock: 20, category: 'Supplements' },
        { name: 'Green Tea', description: 'Organic green tea bags', price: 120, mrp: 150, unit: '25 bags', stock: 50, category: 'Tea' },
        { name: 'Multivitamin', description: 'Daily multivitamin tablets', price: 299, mrp: 400, unit: '30 tabs', stock: 40, category: 'Vitamins' },
        { name: 'Yoga Mat', description: 'Non-slip yoga mat', price: 399, mrp: 500, unit: '1 piece', stock: 15, category: 'Fitness Gear' },
      ],
    },
    {
      shop_name: 'Metro Convenience Store',
      gstin: '27AABCM2122K1Z0',
      phone: '9876543219',
      address: '741 Santacruz East, Airport Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin_code: '400055',
      lat: 19.0735,
      lng: 72.8560,
      delivery_radius_km: 4,
      category: 'General Store',
      description: 'Everything you need in one place',
      opening_time: '06:00',
      closing_time: '23:30',
      products: [
        { name: 'Instant Noodles', description: 'Quick instant noodles pack', price: 15, mrp: 20, unit: '1 pack', stock: 200, category: 'Noodles' },
        { name: 'Biscuits Pack', description: 'Assorted biscuits', price: 80, mrp: 100, unit: '500g', stock: 100, category: 'Snacks' },
        { name: 'Chips', description: 'Spicy potato chips', price: 40, mrp: 50, unit: '50g', stock: 150, category: 'Snacks' },
        { name: 'Chocolate Bar', description: 'Premium chocolate bar', price: 50, mrp: 65, unit: '1 piece', stock: 120, category: 'Confectionery' },
        { name: 'Ice Cream', description: 'Vanilla ice cream cup', price: 60, mrp: 80, unit: '100ml', stock: 80, category: 'Frozen' },
      ],
    },
  ];

  for (const vendorData of vendorsList) {
    const { products, ...vendorInfo } = vendorData;
    const vendorEmail = `${vendorInfo.shop_name.toLowerCase().replace(/\s+/g, '')}@vendor.com`;

    // Check if vendor already exists
    const existingVendor = await VendorProfile.findOne({
      where: { shop_name: vendorInfo.shop_name },
    });

    if (existingVendor) {
      await existingVendor.update({
        ...vendorInfo,
        logo_url: getVendorImageUrl(vendorInfo.shop_name, vendorInfo.category),
        approval_status: 'approved',
        delivery_charge: 25,
        min_order_amount: 50,
      });
      continue; // Skip if vendor already exists
    }

    // Check if vendor user already exists
    const existingUser = await User.findOne({
      where: { email: vendorEmail },
    });

    if (existingUser) {
      continue; // Skip if user already exists
    }

    // Create vendor user
    const vendorUser = await User.create({
      email: vendorEmail,
      name: vendorInfo.shop_name,
      password: await bcrypt.hash('Vendor@1234', 10),
      role: 'vendor',
      verified: true,
      status: 'active',
    });

    // Create vendor profile
    const vendorProfile = await VendorProfile.create({
      user_id: vendorUser.id,
      shop_name: vendorInfo.shop_name,
      gstin: vendorInfo.gstin,
      phone: vendorInfo.phone,
      address: vendorInfo.address,
      city: vendorInfo.city,
      state: vendorInfo.state,
      pin_code: vendorInfo.pin_code,
      lat: vendorInfo.lat,
      lng: vendorInfo.lng,
      delivery_radius_km: vendorInfo.delivery_radius_km,
      category: vendorInfo.category,
      description: vendorInfo.description,
      opening_time: vendorInfo.opening_time,
      closing_time: vendorInfo.closing_time,
      logo_url: getVendorImageUrl(vendorInfo.shop_name, vendorInfo.category),
      approval_status: 'approved',
      delivery_charge: 25,
      min_order_amount: 50,
    });

    // Create products for vendor
    for (const productData of products) {
      await Product.create({
        vendor_id: vendorProfile.id,
        ...productData,
        image_url: getProductImageUrl(productData.name, productData.category),
        is_available: true,
      });
    }
  }

  // Create sample orders with the demo customer
  if (customerUser) {
    const customerAddress = await CustomerAddress.findOne({
      where: { user_id: customerUser.id },
    });
  
      const backfillMarketplaceMedia = async () => {
        const vendors = await VendorProfile.findAll();

        for (const vendor of vendors) {
          const nextValues = {
            logo_url: getVendorImageUrl(vendor.shop_name, vendor.category),
          };

          if (vendor.user_id) {
            const linkedUser = await User.findByPk(vendor.user_id);

            if (linkedUser?.email === 'vendor@demo.com' && vendor.city !== 'Mumbai') {
              nextValues.city = 'Mumbai';
              nextValues.state = 'Maharashtra';
              nextValues.address = '123 Linking Road, Bandra';
              nextValues.pin_code = '400050';
              nextValues.lat = 19.0596;
              nextValues.lng = 72.8295;
              nextValues.approval_status = 'approved';
            }
          }

          await vendor.update(nextValues);
        }

        const products = await Product.findAll();

        for (const product of products) {
          await product.update({ image_url: getProductImageUrl(product.name, product.category) });
        }
      };
  
      await backfillMarketplaceMedia();

    // Get first few vendors and create orders
    const vendors = await VendorProfile.findAll({ limit: 3 });

    for (let i = 0; i < vendors.length; i++) {
      const vendor = vendors[i];
      const existingOrder = await Order.findOne({
        where: { order_number: `ORD-${2024 + i}` },
      });

      if (!existingOrder && customerAddress) {
        const products = await Product.findAll({
          where: { vendor_id: vendor.id },
          limit: 2,
        });

        if (products.length > 0) {
          const order = await Order.create({
            order_number: `ORD-${2024 + i}`,
            customer_id: customerUser.id,
            vendor_id: vendor.id,
            delivery_address_id: customerAddress.id,
            subtotal: 250 + i * 50,
            delivery_charge: 25,
            discount_amount: 10,
            total_amount: 265 + i * 50,
            payment_method: i % 2 === 0 ? 'cod' : 'upi',
            payment_status: 'completed',
            order_status: i === 0 ? 'delivered' : 'out_for_delivery',
            notes: 'Please ring doorbell',
            estimated_delivery_time: '00:30:00',
          });

          for (const product of products) {
            await OrderItem.create({
              order_id: order.id,
              product_id: product.id,
              quantity: 1,
              price: product.price,
              subtotal: product.price,
            });
          }
        }
      }
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

    // Log environment configuration
    logEnvironmentStatus();

    // Sync models with database
    await sequelize.sync();
    console.log('✓ Database models synced');

    if (SHOULD_SEED_DEMO_DATA) {
      await seedDemoUsers();
      await seedDemoMarketplaceData();
      console.log('✓ Demo users ready');
    } else {
      console.log('✓ Demo data seeding skipped');
    }

    // Start server
    const serverInstance = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║  HyperLocal India - Delivery Marketplace   ║
║  Server running on port ${PORT}                ║
╚════════════════════════════════════════════╝
      `);
    });

    serverInstance.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        const altPort = Number(PORT) + 1;
        console.warn(`Port ${PORT} in use, attempting ${altPort}`);
        const altServer = app.listen(altPort, () => console.log(`Server running on port ${altPort}`));
        altServer.on('error', (altErr) => {
          if (altErr && altErr.code === 'EADDRINUSE') {
            console.error(`Port ${altPort} is also in use. Stop the existing server process or set PORT to a free port in server/.env.`);
            process.exit(1);
          }

          console.error('Failed to start server:', altErr);
          process.exit(1);
        });
      }
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
