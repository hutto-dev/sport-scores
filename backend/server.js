// Load environment variables from .env file
require("dotenv").config(); // Ensure this is at the top

// Assigning express app
const express = require("express");

// Middleware
const bodyParser = require("body-parser");
const cors = require("cors");

// Assigning all Routes
const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const rankingRoutes = require("./routes/rankingRoutes");
const schoolRoutes = require("./routes/schoolRoutes"); // Add this line

// Start the app and listen for requests on the port
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON requests

// ADDED THIS CODE TO POP UP ON WEBSITE AT THE BEGINNING AND ON POSTMAN
app.get("/", (req, res) => {
  res.send("Working!");
});

// Load all routes
app.use("/users", userRoutes);
app.use("/games", gameRoutes);
app.use("/rankings", rankingRoutes);
app.use("/school", schoolRoutes); // Add this line

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start the server if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Running on port ${port}`));
}

module.exports = { app };
