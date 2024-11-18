/* ///// WORKS /////

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
  const userId = req.userId; // Get userId from the authenticated user
  const isSuperAdmin = req.isSuperAdmin; // Assuming you're adding a super_admin check

  // Validate gameId and scores
  const validScore = (score) => Number.isInteger(score) && score >= 0;
  if (!gameId || !validScore(homeScore) || !validScore(awayScore)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    // Check if the game exists
    const game = await db.query(
      `SELECT home_team_id, away_team_id, score_home, score_away FROM game WHERE game_id = $1`, // Ensure primary key is correct
      [gameId]
    );

    if (game.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Check if scores already exist (don't allow resubmission unless super_admin)
    const existingScores = game.rows[0];
    if (
      existingScores.score_home !== null &&
      existingScores.score_away !== null
    ) {
      if (!isSuperAdmin) {
        return res.status(400).json({
          error:
            "Scores already reported. If there is an error in the score, please fill out a question form.",
        });
      }
    }

    // Ensure the scores are integers
    const homeScoreInt = parseInt(homeScore, 10);
    const awayScoreInt = parseInt(awayScore, 10);

    // Update the game score
    const updateResult = await db.query(
      `UPDATE game SET score_away = $1, score_home = $2 WHERE game_id = $3`,
      [homeScoreInt, awayScoreInt, gameId]
    );

    // Log the result of the update query
    console.log("Update Result:", updateResult); // This will log the result

    if (updateResult.rowCount > 0) {
      res.json({ message: "Score reported successfully!" });
    } else {
      res
        .status(500)
        .json({ error: "Failed to update score or no rows were affected." });
    }
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ error: "Failed to report score" });
  }
}; */

const db = require("../database/db");

/**
 * Get all games for a specific school by user (using school ID)
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.getGamesByUser = async (req, res) => {
  const { schoolId } = req.params;
  const userId = req.userId;

  try {
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
        g.home_school_id = $1::int OR g.away_school_id = $1::int
      ORDER BY g.date, g.time;
      `,
      [schoolId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No games found for this school" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching games by school:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Report a game score
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.reportScore = async (req, res) => {
  const { gameId, homeScore, awayScore } = req.body;
  const userId = req.userId;
  const isSuperAdmin = req.isSuperAdmin;

  if (
    !gameId ||
    !Number.isInteger(homeScore) ||
    !Number.isInteger(awayScore) ||
    homeScore < 0 ||
    awayScore < 0
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    // Check if game exists
    const game = await db.query(`SELECT * FROM game WHERE game_id = $1`, [
      gameId,
    ]);
    if (game.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    const existingGame = game.rows[0];
    if (
      existingGame.score_home !== null &&
      existingGame.score_away !== null &&
      !isSuperAdmin
    ) {
      return res
        .status(400)
        .json({ error: "Scores already reported. Contact admin for changes." });
    }

    await db.query(
      `UPDATE game SET score_home = $1, score_away = $2 WHERE game_id = $3`,
      [homeScore, awayScore, gameId]
    );

    res.json({ message: "Score reported successfully!" });
  } catch (error) {
    console.error("Error reporting score:", error);
    res.status(500).json({ error: "Failed to report score" });
  }
};

/**
 * Get all games for a specific team (using team ID)
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.getGamesByTeam = async (req, res) => {
  const { teamId } = req.params;

  try {
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
        g.home_team_id = $1::int OR g.away_team_id = $1::int
      ORDER BY g.date, g.time;
      `,
      [teamId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No games found for this team" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching games by team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
