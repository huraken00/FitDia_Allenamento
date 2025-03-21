const express = require("express");
const router = express.Router();
const { getAllSports } = require("../controllers/sport_controller");

router.get("/", getAllSports);

module.exports = router;
