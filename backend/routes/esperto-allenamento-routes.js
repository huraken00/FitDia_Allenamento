const express = require("express");
const { getEsperti, inserimentoEsperti, loginEsperto } = require("../controllers/esperto-allenamento-controllers");

const router = express.Router();



router.get("/", getEsperti);
router.post("/",inserimentoEsperti);
router.post("/login-esperto", loginEsperto);
module.exports = router;