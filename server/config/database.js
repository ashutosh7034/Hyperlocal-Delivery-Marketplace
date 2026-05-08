const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = (process.env.DB_DIALECT || 'mysql').toLowerCase();

if (dialect !== 'mysql') {
  throw new Error('Unsupported DB_DIALECT. This application is configured to use MySQL only.');
}

const commonOptions = {
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
};

const sequelize = new Sequelize(
  process.env.DB_NAME || 'hyperlocal_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    ...commonOptions,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
