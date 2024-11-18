const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/:schoolId", async (req, res, next) => {
  try {
    const school = await db.getSchool(req.params.schoolId);

    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    res.json(school);
  } catch (error) {
    console.error("Error fetching school:", error);
    next(error); // Pass the error to the global error handler
  }
});

module.exports = router;
