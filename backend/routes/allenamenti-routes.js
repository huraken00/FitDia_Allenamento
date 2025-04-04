const express = require("express");
const { getAllAllenamenti, createAllenamento, deleteAllenamento, getAllenamentoDettagli,aggiornaAllenamento } = require("../controllers/allenamento-controllers");

const router = express.Router();

// Recupera tutti gli allenamenti per un determinato utente
router.get("/:utenteId", getAllAllenamenti);  // Cambiato in :utenteId per chiarezza

// Recupera i dettagli di un allenamento specifico, con le serie collegate
router.get("/dettagli/:id", getAllenamentoDettagli);

// Crea un nuovo allenamento
router.post("/:utenteId", createAllenamento);

// Route per eliminare un allenamento
router.delete("/:id", deleteAllenamento);

router.put("/:id",aggiornaAllenamento);

module.exports = router;

