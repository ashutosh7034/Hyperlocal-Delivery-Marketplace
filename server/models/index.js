const User = require('./User');
const VendorProfile = require('./VendorProfile');
const CustomerProfile = require('./CustomerProfile');
const CustomerAddress = require('./CustomerAddress');
const Product = require('./Product');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Invoice = require('./Invoice');

User.hasOne(VendorProfile, { foreignKey: 'user_id', as: 'vendorProfile' });
VendorProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(CustomerProfile, { foreignKey: 'user_id', as: 'customerProfile' });
CustomerProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(CustomerAddress, { foreignKey: 'user_id', as: 'addresses' });
CustomerAddress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

VendorProfile.hasMany(Product, { foreignKey: 'vendor_id', as: 'products' });
Product.belongsTo(VendorProfile, { foreignKey: 'vendor_id', as: 'vendor' });

User.hasOne(Cart, { foreignKey: 'customer_id', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });

Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });
Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

User.hasMany(Order, { foreignKey: 'customer_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });
VendorProfile.hasMany(Order, { foreignKey: 'vendor_id', as: 'orders' });
Order.belongsTo(VendorProfile, { foreignKey: 'vendor_id', as: 'vendor' });
CustomerAddress.hasMany(Order, { foreignKey: 'delivery_address_id', as: 'orders' });
Order.belongsTo(CustomerAddress, { foreignKey: 'delivery_address_id', as: 'deliveryAddress' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Invoice association
Order.hasOne(Invoice, { foreignKey: 'order_id', as: 'invoice' });
Invoice.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

module.exports = {
  User,
  VendorProfile,
  CustomerProfile,
  CustomerAddress,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Invoice,
};