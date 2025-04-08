const express = require("express");
const { getEsperti, inserimentoEsperti, loginEsperto,updateEsperto } = require("../controllers/esperto-allenamento-controllers");

const router = express.Router();



router.get("/", getEsperti);
router.post("/",inserimentoEsperti);
router.post("/login-esperto", loginEsperto);
router.put("/:eid",updateEsperto);
module.exports = router;