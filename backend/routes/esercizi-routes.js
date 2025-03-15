const express = require("express");
const router = express.Router();
const { getAllEsercizi, addEsercizio } = require("../controllers/esercizi-controllers");

// Rotta per ottenere tutti gli esercizi
router.get("/", getAllEsercizi);

// Rotta per aggiungere un nuovo esercizio
router.post("/", addEsercizio);

module.exports = router;
