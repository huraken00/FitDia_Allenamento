const express = require("express");
const { getEsperti, inserimentoEsperti, loginEsperto,updateEsperto,getEspertoById,eliminaEsperto } = require("../controllers/esperto-allenamento-controllers");

const router = express.Router();

router.get("/", getEsperti);
router.post("/",inserimentoEsperti);
router.post("/login-esperto", loginEsperto);
router.put("/:eid",updateEsperto);
router.get("/:eid",getEspertoById);
router.delete("/:eid",eliminaEsperto);

module.exports = router;