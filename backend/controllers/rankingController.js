const db = require("../database/db");

// Get rankings for all teams
exports.getRankings = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        team.name AS team_name,
        COUNT(CASE WHEN game.home_score > game.away_score THEN 1 END) AS wins,
        COUNT(CASE WHEN game.home_score < game.away_score THEN 1 END) AS losses
      FROM 
        teams AS team
      LEFT JOIN 
        game ON team.team_id = game.home_team_id OR team.team_id = game.away_team_id
      GROUP BY 
        team.name
      ORDER BY 
        wins DESC;`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
