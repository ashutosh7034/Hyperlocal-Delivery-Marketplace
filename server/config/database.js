const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = (process.env.DB_DIALECT || 'sqlite').toLowerCase();

const commonOptions = {
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
};

const sequelize =
  dialect === 'mysql'
    ? new Sequelize(
        process.env.DB_NAME || 'hyperlocal_db',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
          ...commonOptions,
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 3307,
          dialect: 'mysql',
          pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000,
          },
        }
      )
    : new Sequelize({
        ...commonOptions,
        dialect: 'sqlite',
        storage:
          process.env.DB_STORAGE || path.join(__dirname, '..', 'hyperlocal.sqlite'),
      });

module.exports = sequelize;
