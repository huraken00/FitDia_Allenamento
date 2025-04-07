const express = require('express');
const router = express.Router();
const { inserisciVariante, getVariantiByUtente } = require('../controllers/varianteEsercizio-controllers');

// Definisci le tue rotte
router.post("/", inserisciVariante);
router.get("/utente/:userId", getVariantiByUtente);

module.exports = router;
