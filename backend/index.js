const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize the PostgreSQL connection
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://sport-scores_owner:1Iopa8VFzWhc@ep-withered-darkness-a5lviylm-pooler.us-east-2.aws.neon.tech/sport-scores?sslmode=require";
const pool = new Pool({ connectionString });

// Middleware
app.use(cors());
app.use(express.json());

// Route to get game by ID
app.get("/api/game/:id", async (req, res) => {
  const gameId = req.params.id;
  try {
    // Change 'games' to 'game'
    const result = await pool.query("SELECT * FROM game WHERE id = $1", [
      gameId,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Game not found" });
    }
  } catch (error) {
    console.error("Error fetching game:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
