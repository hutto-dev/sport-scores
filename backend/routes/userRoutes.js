const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/login", userController.loginUser); // Ensure this is correct

module.exports = router;
