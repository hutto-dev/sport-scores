// WORKS
/* const db = require("../database/db");

const getGame = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM game");
    res.status(200).send(result.rows);
  } catch (error) {
    console.error("Database query error:", error); // Log the full error to console
    res.status(500).send({ error: "Database error", details: error.message });
  }
};

module.exports = { getGame }; */

const db = require("../database/db");

const getGame = async (req, res) => {
  try {
    const result = await db.query(`SELECT 
        game.id AS game_id,
        home_school.name AS home_team_name,
        away_school.name AS away_team_name
        FROM 
        game
        JOIN 
        teams AS home_team ON game.home_team_id = home_team.teams_id
        JOIN 
        school AS home_school ON home_team.school_id = home_school.school_id
        JOIN 
        teams AS away_team ON game.away_team_id = away_team.teams_id
        JOIN 
        school AS away_school ON away_team.school_id = away_school.school_id`);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error("Database query error:", error); // Log the full error to console
    res.status(500).send({ error: "Database error", details: error.message });
  }
};

module.exports = { getGame };
