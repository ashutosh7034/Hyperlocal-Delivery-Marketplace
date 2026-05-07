const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define(
  'Cart',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'carts',
    timestamps: true,
  }
);

module.exports = Cart;
