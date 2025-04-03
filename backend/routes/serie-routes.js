const express = require("express");
const { getAllSerie, createSerie, getPropEsercizio } = require("../controllers/serie-controllers");

const router = express.Router();

// Recupera tutte le serie per un determinato allenamento
router.get("/:allenamentoId", getAllSerie);

// Crea una nuova serie associata a un allenamento
router.post("/", createSerie); 

// Recupera parametri e sport per un esercizio
router.get("/esercizio/:id_esercizio", getPropEsercizio);

module.exports = router;
