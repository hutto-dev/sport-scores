// grabbing router out of express
const { Router } = require("express");

// assigning to get user routes
const userRoutes = require("./userRoutes");

// assigning to get csv routes
const csvRoutes = require("./csvRoutes");

// using 'router' to run the router function and make specific routes
const router = Router();

// we inject all our user routes to listen for requests on '/user'
router.use("/user", userRoutes);
router.use("/files", csvRoutes);

module.exports = router;
