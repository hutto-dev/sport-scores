const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const authenticateToken = require("../middlewares/authenticateToken");

// Route to get games for a specific schedule
router.get("/:scheduleId/games", authenticateToken, gameController.getGames);

// Route to report scores for a game
router.post("/report", authenticateToken, gameController.reportScore);

// Route to get games for a specific school based on school ID
router.get(
  "/school/:schoolId/games",
  authenticateToken,
  gameController.getGames
);

module.exports = router;
