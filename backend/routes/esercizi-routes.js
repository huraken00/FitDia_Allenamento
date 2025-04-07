const express = require("express");
const router = express.Router();
const { 
  getAllEsercizi, 
  addEsercizio, 
  getEsercizioById, 
  updateEsercizio, 
  deleteEsercizio,
  getProgressiEsercizio
} = require("../controllers/esercizi-controllers");

// Rotta per ottenere tutti gli esercizi
router.get("/", getAllEsercizi);

// Rotta per ottenere un esercizio specifico
router.get("/:id", getEsercizioById);

// Rotta per aggiungere un nuovo esercizio
router.post("/", addEsercizio);

// Rotta per aggiornare un esercizio
router.put("/:id", updateEsercizio);

// Rotta per eliminare un esercizio
router.delete("/:id", deleteEsercizio);

// Rotta per i progressi di un esercizio (ora include anche userId)
router.get("/progressi-esercizio/:id/:userId", getProgressiEsercizio);

module.exports = router;
