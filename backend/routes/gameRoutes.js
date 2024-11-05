const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController"); // Path to controller
const authenticateToken = require("../middlewares/authenticateToken"); // Path to authentication middleware

// Route to get games for a specific school based on school ID
router.get(
  "/school/:schoolId/games",
  authenticateToken,
  gameController.getGamesByUser
);

// Route to report scores for a game
router.post("/report", authenticateToken, gameController.reportScore);

module.exports = router;
