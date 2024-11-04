const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const gameRoutes = require("./gameRoutes");
const rankingRoutes = require("./rankingRoutes");

router.use("/users", userRoutes);
router.use("/games", gameRoutes);
router.use("/rankings", rankingRoutes);

module.exports = router;
