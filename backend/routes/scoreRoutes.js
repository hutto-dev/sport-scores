// scoreRoutes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/report", authenticateToken, (req, res) => {
  // This is where your code to handle score reporting goes
  res.json({ message: "Score reported successfully" });
});

module.exports = router;
