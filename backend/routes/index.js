// grabbing router out of express
const { Router } = require("express");

// assigning to get user routes
const userRoutes = require("./userRoutes");

// assigning to get csv routes
const csvRoutes = require("./csvRoutes");

// from CHATGPT...trying to hook up schedules
const scheduleRoutes = require("./scheduleRoutes");

const gameRoutes = require("./gameRoutes");

const scoreRoutes = require("./scoreRoutes");

const reportScoreRoutes = require("./reportScoreRoutes");

// using 'router' to run the router function and make specific routes
const router = Router();

// we inject all our user routes to listen for requests on '/user'
router.use("/user", userRoutes);
router.use("/files", csvRoutes);
router.use("/api", scheduleRoutes);
router.use("/api", gameRoutes);
router.use("/api", scoreRoutes);
router.use("/api", reportScoreRoutes);

module.exports = router;
