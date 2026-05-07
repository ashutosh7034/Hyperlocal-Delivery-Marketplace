const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomerProfile = sequelize.define(
  'CustomerProfile',
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
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    profile_picture_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'customer_profiles',
    timestamps: true,
  }
);

module.exports = CustomerProfile;
