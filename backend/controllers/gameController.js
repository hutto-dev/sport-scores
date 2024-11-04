const db = require("../database/db");

// Get all games for a specific schedule
exports.getGames = async (req, res) => {
  const schoolId = req.params.schoolId; // Extract the schoolId from the URL
  try {
    const result = await db.query(
      `
      SELECT 
        game.game_id,
        home_school.name AS home_team_name,
        away_school.name AS away_team_name,
        game.date,
        game.time
      FROM 
        game
      JOIN 
        schedule AS home_schedule ON game.schedule_home_id = home_schedule.schedule_id
      JOIN 
        school AS home_school ON home_schedule.team_id = home_school.school_id
      JOIN 
        schedule AS away_schedule ON game.schedule_away_id = away_schedule.schedule_id
      JOIN 
        school AS away_school ON away_schedule.team_id = away_school.school_id
      WHERE 
        home_schedule.team_id IN (SELECT team_id FROM team WHERE school_id = $1)
        OR away_schedule.team_id IN (SELECT team_id FROM team WHERE school_id = $1)`,
      [schoolId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Report a game score
exports.reportScore = async (req, res) => {
  const { gameId, homeScore, awayScore } = req.body;

  // Validate gameId and scores
  const validScore = (score) => Number.isInteger(score) && score >= 0; // Only non-negative integers
  if (!gameId || !validScore(homeScore) || !validScore(awayScore)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    // Check if the game exists
    const game = await db.query(
      `SELECT home_team_id, away_team_id FROM game WHERE id = $1`,
      [gameId]
    );

    if (game.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Update the game score
    await db.query(
      `UPDATE game SET home_score = $1, away_score = $2 WHERE id = $3`,
      [homeScore, awayScore, gameId]
    );

    res.json({ message: "Score reported successfully!" });
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ error: "Failed to report score" });
  }
};
