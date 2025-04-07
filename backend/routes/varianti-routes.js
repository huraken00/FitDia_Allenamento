const express = require("express");
const router = express.Router();
const { getAllVarianti, getVariantiByUtente, deleteVariante } = require("../controllers/varianteEsercizio-controllers");

router.get("/", getAllVarianti); // tutte le varianti
router.get("/utente/:userId", getVariantiByUtente); // varianti per utente
router.delete("/:id", deleteVariante); // elimina

module.exports = router;
