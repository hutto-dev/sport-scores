const { Router } = require("express");
const { getGame } = require("../controllers/gameController");

const router = Router();

router.get("/game", getGame);

module.exports = router;
