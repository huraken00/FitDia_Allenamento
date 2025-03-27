const express = require("express");
const { getAllAllenamenti, createAllenamento } = require("../controllers/allenamento-controllers");

const router = express.Router();

// Recupera tutti gli allenamenti per un determinato utente
router.get("/:utenteId", getAllAllenamenti);  // Cambiato in :utenteId per chiarezza

// Crea un nuovo allenamento
router.post("/:utenteId", createAllenamento);

module.exports = router;

