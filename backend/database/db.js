// from chat gpt now
const { Pool } = require("pg");

// Load environment variables
require("dotenv").config();

// Set up a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
