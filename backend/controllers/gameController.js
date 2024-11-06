const db = require("../database/db");

// Get all games for a specific school by user
exports.getGamesByUser = async (req, res) => {
  const { schoolId } = req.params; // Extract schoolId from the URL
  const userId = req.userId; // Get userId from the authenticated user

  try {
    // Query games where the user's school_id matches either home_school_id or away_school_id
    const result = await db.query(
      `
      SELECT
      g.game_id,
      COALESCE(at.name, 'Unknown Team') AS away_team_name,
      COALESCE(ht.name, 'Unknown Team') AS home_team_name,
      g.date,
       g.time,
       g.location,
      COALESCE(g.score_home, 0) AS home_score,
      COALESCE(g.score_away, 0) AS away_score
      FROM 
       game g
    LEFT JOIN 
      team at ON g.away_team_id = at.team_id
      LEFT JOIN 
      team ht ON g.home_team_id = ht.team_id
    WHERE 
  g.home_school_id = $1::int OR g.away_school_id = $1::int;

      `,
      [schoolId]
    );

    // Check if games are found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No games found for this school" });
    }

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
  const validScore = (score) => Number.isInteger(score) && score >= 0;
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
