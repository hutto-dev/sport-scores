const db = require("../database/db");

const getGame = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM game");
    res.status(200).send(result.rows);
  } catch (error) {
    console.error("Database query error:", error); // Log the full error to console
    res.status(500).send({ error: "Database error", details: error.message });
  }
};

module.exports = { getGame };
