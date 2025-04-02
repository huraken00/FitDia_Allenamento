const express = require("express");
const { getParametriEsercizi } = require("../controllers/esercizioParametro-controllers");

const router = express.Router();

router.get("/:id_esercizio", getParametriEsercizi);

module.exports = router;