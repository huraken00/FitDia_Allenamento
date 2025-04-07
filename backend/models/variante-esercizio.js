const mongoose = require("mongoose");

const VarianteEsercizioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descrizione: { type: String, required: true },
  utente: { type: mongoose.Schema.Types.ObjectId, ref: "Utente", required: true },
});

module.exports = mongoose.model("VarianteEsercizio", VarianteEsercizioSchema,"VarianteEsercizio");