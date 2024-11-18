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

  getSchool: async (schoolId) => {
    const queryText = "SELECT * FROM school WHERE school_id = $1";
    const result = await pool.query(queryText, [schoolId]);
    return result.rows[0]; // Returns the first (and should be the only) matching school
  },
};
