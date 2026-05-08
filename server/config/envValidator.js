require('dotenv').config();

/**
 * Validate that all required environment variables are set
 * Throws an error if critical variables are missing
 */
const validateEnvironment = () => {
  const errors = [];
  const warnings = [];

  // Critical variables that must be set
  const required = [
    'JWT_SECRET',
    'DB_DIALECT',
    'GOOGLE_MAPS_API_KEY',
    'SMTP_USER',
    'SMTP_PASS',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  // Optional variables with warnings
  const optional = ['FRONTEND_URL'];

  const dialect = (process.env.DB_DIALECT || '').toLowerCase();

  // Check required variables
  required.forEach((varName) => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  if (dialect && dialect !== 'mysql') {
    errors.push('DB_DIALECT must be mysql. SQLite is not supported in this project.');
  }

  ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'].forEach((varName) => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable for MySQL: ${varName}`);
    }
  });

  // Check optional variables
  optional.forEach((varName) => {
    if (!process.env[varName]) {
      warnings.push(
        `Optional environment variable not set: ${varName} (using default fallback)`
      );
    }
  });

  // Throw error if any required variables are missing
  if (errors.length > 0) {
    console.error('\n❌ ENVIRONMENT CONFIGURATION ERROR\n');
    errors.forEach((error) => console.error(`  • ${error}`));
    console.error(
      '\nPlease check your .env file and ensure all required variables are set.'
    );
    console.error(
      'See .env.example for reference or README.md for setup instructions.\n'
    );
    process.exit(1);
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn('\n⚠️  ENVIRONMENT WARNINGS\n');
    warnings.forEach((warning) => console.warn(`  • ${warning}`));
  }

  return true;
};

/**
 * Log environment configuration status
 */
const logEnvironmentStatus = () => {
  console.log('\n✅ ENVIRONMENT CONFIGURATION STATUS\n');
  console.log(`  Database: MYSQL at ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log(
    `  Google Maps API: ${process.env.GOOGLE_MAPS_API_KEY ? '✓ Configured' : '✗ Not configured'}`
  );
  console.log(
    `  Email Service: ${process.env.SMTP_USER ? '✓ Configured' : '✗ Not configured'}`
  );
  console.log(
    `  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? '✓ Configured' : '✗ Not configured'}`
  );
  console.log(
    `  Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`
  );
  console.log(
    `  Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? '✓ Configured' : '✗ Not configured'}`
  );
  console.log(
    `  Facebook OAuth: ${process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET ? '✓ Configured' : '✗ Not configured'}`
  );
  console.log(
    `  GitHub OAuth: ${process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? '✓ Configured' : '✗ Not configured'}`
  );
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}\n`);
};

module.exports = {
  validateEnvironment,
  logEnvironmentStatus,
};
