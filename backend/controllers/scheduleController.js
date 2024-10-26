// 2nd edit attempt hooking up schedules

const db = require("../database/db");

const getBasketballSchedule = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM schedule");
    res.status(200).send(result.rows);
  } catch (error) {
    console.error("Database query error:", error); // Log the full error to console
    res.status(500).send({ error: "Database error", details: error.message });
  }
};

module.exports = { getBasketballSchedule };
