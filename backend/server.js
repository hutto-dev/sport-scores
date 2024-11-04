// Load environment variables from .env file
require("dotenv").config(); // Ensure this is at the top

// Assigning express app (require is a node.js function used to load modules)
const express = require("express");

// Assigning body-parser that helps break down code into readable JSON
const bodyParser = require("body-parser");

// Assigning cors which is used to enable CORS
const cors = require("cors");

// Assigning all Routes
const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const rankingRoutes = require("./routes/rankingRoutes");

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

// Define the /games/:schoolId/games route
app.get("/games/:schoolId/games", (req, res) => {
  const schoolId = req.params.schoolId; // Get schoolId from the route parameter

  // Placeholder response for testing
  res.json({ message: `Games for school ID ${schoolId}` });
});

// Load all routes
app.use("/users", userRoutes);
app.use("/games", gameRoutes);
app.use("/rankings", rankingRoutes);

// Start the server if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Running on port ${port}`));
}

module.exports = { app };
