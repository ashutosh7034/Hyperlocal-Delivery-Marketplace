-- HyperLocal India Delivery Marketplace - MySQL Schema

-- Create database
CREATE DATABASE IF NOT EXISTS hyperlocal_db;
USE hyperlocal_db;

-- Users table (foundation for all roles)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'vendor', 'customer') NOT NULL,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
);

-- Vendor profiles table
CREATE TABLE vendor_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  shop_name VARCHAR(150) NOT NULL,
  gstin VARCHAR(15),
  phone VARCHAR(15),
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pin_code VARCHAR(6) NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  delivery_radius_km DECIMAL(5, 2) DEFAULT 5.00,
  delivery_charge DECIMAL(10, 2) DEFAULT 30.00,
  min_order_amount DECIMAL(10, 2) DEFAULT 200.00,
  category VARCHAR(100),
  approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  logo_url VARCHAR(255),
  description TEXT,
  opening_time TIME,
  closing_time TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_approval_status (approval_status),
  INDEX idx_city (city),
  INDEX idx_coordinates (lat, lng),
  INDEX idx_delivery_radius (delivery_radius_km)
);

-- Customer profiles table
CREATE TABLE customer_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  phone VARCHAR(15),
  profile_picture_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Customer addresses table
CREATE TABLE customer_addresses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  label VARCHAR(50),
  full_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  pin_code VARCHAR(6) NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_coordinates (lat, lng),
  INDEX idx_is_default (is_default)
);

-- Products table
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vendor_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  mrp DECIMAL(10, 2),
  unit VARCHAR(50),
  stock INT DEFAULT 0,
  category VARCHAR(100),
  image_url VARCHAR(255),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_category (category),
  INDEX idx_is_available (is_available),
  FULLTEXT INDEX ft_search (name, description)
);

-- Carts table
CREATE TABLE carts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL UNIQUE,
  vendor_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (vendor_id) REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  INDEX idx_customer_id (customer_id),
  INDEX idx_vendor_id (vendor_id)
);

-- Cart items table
CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_cart_id (cart_id),
  INDEX idx_product_id (product_id)
);

-- Orders table
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id INT NOT NULL,
  vendor_id INT NOT NULL,
  delivery_address_id INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_charge DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('cod', 'upi', 'card') DEFAULT 'cod',
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  order_status ENUM('pending', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  estimated_delivery_time TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (vendor_id) REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (delivery_address_id) REFERENCES customer_addresses(id),
  INDEX idx_order_number (order_number),
  INDEX idx_customer_id (customer_id),
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_order_status (order_status),
  INDEX idx_created_at (created_at)
);

-- Order items table
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
);

-- Stored procedure for calculating distance using Haversine formula
DELIMITER $$

CREATE PROCEDURE CalculateVendorDistance(
  IN p_customer_lat DECIMAL(10, 8),
  IN p_customer_lng DECIMAL(11, 8),
  IN p_max_distance DECIMAL(5, 2)
)
BEGIN
  SELECT 
    vp.id,
    vp.user_id,
    vp.shop_name,
    vp.city,
    vp.phone,
    vp.delivery_radius_km,
    vp.delivery_charge,
    vp.logo_url,
    vp.lat,
    vp.lng,
    (6371 * ACOS(
      COS(RADIANS(p_customer_lat)) * 
      COS(RADIANS(vp.lat)) * 
      COS(RADIANS(vp.lng) - RADIANS(p_customer_lng)) + 
      SIN(RADIANS(p_customer_lat)) * 
      SIN(RADIANS(vp.lat))
    )) AS distance_km,
    u.name as owner_name,
    u.verified
  FROM vendor_profiles vp
  JOIN users u ON vp.user_id = u.id
  WHERE vp.approval_status = 'approved'
  AND u.status = 'active'
  HAVING distance_km <= vp.delivery_radius_km
  AND distance_km <= p_max_distance
  ORDER BY distance_km ASC;
END$$

DELIMITER ;
