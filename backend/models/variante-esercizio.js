const mongoose = require("mongoose");

const VarianteEsercizioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descrizione: { type: String, required: true },
  utente: { type: mongoose.Schema.Types.ObjectId, ref: "Utente", required: true },
  validazione: {
    stato: {
      type: String,
      enum: ["in_attesa", "approvata", "scartata"],
      default: "in_attesa"
    },
    messaggio: { type: String }
  }
});

module.exports = mongoose.model("VarianteEsercizio", VarianteEsercizioSchema, "VarianteEsercizio");
