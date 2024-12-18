const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const authenticateToken = require("../middlewares/authenticateToken");

// Route to get games for a specific school based on school ID (authenticated)
router.get(
  "/school/:schoolId/games",
  authenticateToken,
  gameController.getGamesByUser
);

// Route to report scores for a game (authenticated)
router.post("/report", authenticateToken, gameController.reportScore);

// Route to get games for a specific team (public)
router.get("/team/:teamId/games", gameController.getGamesByTeam);

module.exports = router;
