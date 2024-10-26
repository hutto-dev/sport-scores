// 1st tempt at hooking up schedules
const { Router } = require("express");
const { getBasketballSchedule } = require("../controllers/scheduleController");

const router = Router();

router.get("/schedule", getBasketballSchedule);

module.exports = router;
