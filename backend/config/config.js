const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/scalable-api',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, 
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};
