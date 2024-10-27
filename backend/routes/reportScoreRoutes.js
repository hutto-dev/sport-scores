// routes/scores.js
const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Route to report a score
router.post("/report", async (req, res) => {
  const { gameId, homeScore, awayScore } = req.body;

  try {
    await db.query(
      `UPDATE game SET home_score = $1, away_score = $2 WHERE id = $3`,
      [homeScore, awayScore, gameId]
    );

    res.json({ message: "Score reported successfully!" });
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ error: "Failed to report score" });
  }
});

// Route to get all games for a specific school
router.get("/:schoolId/games", async (req, res) => {
  const schoolId = req.params.schoolId;

  try {
    const result = await db.query(
      `SELECT 
    game.id AS game_id,
    home_school.name AS home_team_name,
    away_school.name AS away_team_name,
    game.schedule_id
    FROM 
    game
    JOIN 
    teams AS home_team ON game.home_team_id = home_team.teams_id
    JOIN 
    school AS home_school ON home_team.school_id = home_school.school_id
    JOIN 
    teams AS away_team ON game.away_team_id = away_team.teams_id
    JOIN 
    school AS away_school ON away_team.school_id = away_school.school_id
    WHERE 
    home_school.school_id = $1 OR away_school.school_id = $1;

    `,
      [schoolId]
    );

    res.json(result.rows); // Send the result back as JSON
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
