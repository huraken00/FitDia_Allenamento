const express = require("express");
const router = express.Router();
const { 
  getAllEsercizi, 
  addEsercizio, 
  getEsercizioById, 
  updateEsercizio, 
  softDeleteEsercizio,
  getProgressiEsercizio,
  getEserciziUtente,
  getParametriById
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
router.delete("/:id", softDeleteEsercizio);

router.get("/esercizi-utente/:userId", getEserciziUtente);

// Rotta per i progressi di un esercizio (ora include anche userId)
router.get("/progressi-esercizio/:id/:userId",getProgressiEsercizio);

//Rotta per restituire i parametri
router.get("/parametri/:id" ,getParametriById)




module.exports = router;
