const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VendorProfile = sequelize.define(
  'VendorProfile',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    shop_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    gstin: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    pin_code: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    delivery_radius_km: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 5.0,
    },
    delivery_charge: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 30.0,
    },
    min_order_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 200.0,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    approval_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    logo_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    opening_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    closing_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  },
  {
    tableName: 'vendor_profiles',
    timestamps: true,
  }
);

module.exports = VendorProfile;
