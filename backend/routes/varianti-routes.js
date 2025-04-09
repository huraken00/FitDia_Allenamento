const express = require("express");
const router = express.Router();
const { getAllVarianti, getVariantiByUtente,inserisciVariante ,validaVariante } = require("../controllers/varianteEsercizio-controllers");

router.get("/", getAllVarianti); // tutte le varianti
router.get("/utente/:userId", getVariantiByUtente); // varianti per utente
router.post("/", inserisciVariante);
router.put("/:id/valida",validaVariante);


  

module.exports = router;
