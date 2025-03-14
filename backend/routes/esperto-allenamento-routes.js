const express = require("express");
const { getEsperti, inserimentoEsperti } = require("../controllers/esperto-allenamento-controllers");

const router = express.Router();



router.get("/", getEsperti);
router.post("/",inserimentoEsperti);

module.exports = router;