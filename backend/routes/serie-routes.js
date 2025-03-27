const express = require("express");
const { getAllSerie } = require("../controllers/serie-controllers");

const router = express.Router();

// Recupera tutte le serie per un determinato allenamento
router.get("/:allenamentoId", getAllSerie);  // Cambiato in :allenamentoId per chiarezza

module.exports = router;
