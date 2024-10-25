const express = require("express");
const cors = require("cors"); // Importing CORS
const { Pool } = require("pg"); // Import PostgreSQL client

// Initialize Express app
const app = express();

// Use CORS middleware
app.use(cors());

// Set up your PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Make sure to set your connection string in environment variables
});

// Define your route to get a game by ID
app.get("/api/game/:id", async (req, res) => {
  const gameId = req.params.id;

  try {
    console.log("Fetching game with ID:", gameId); // Log the ID being fetched
    const result = await pool.query("SELECT * FROM game WHERE id = $1", [
      gameId,
    ]);

    console.log("Query result:", result); // Log the query result

    const game = result.rows[0];

    if (!game) {
      console.log("No game found with ID:", gameId); // Log if no game is found
      return res.status(404).json({ message: "Game not found" });
    }

    res.json(game);
  } catch (error) {
    console.error("Error fetching game:", error); // Log the error
    res.status(500).json({ message: "Server error", error: error.message }); // Include error message in response
  }
});

// Start your server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
