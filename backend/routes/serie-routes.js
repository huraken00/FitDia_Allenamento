const express = require("express");
const { getAllSerie, createSerie } = require("../controllers/serie-controllers");

const router = express.Router();

// Recupera tutte le serie per un determinato allenamento
router.get("/:allenamentoId", getAllSerie);

// Crea una nuova serie associata a un allenamento
router.post("/", createSerie);  // ✅ CORRETTO: POST per creare una serie

module.exports = router;
