const mongoose = require("mongoose");

const EsercizioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descrizione: { type: String, required: true },
  id_esperto: { type: mongoose.Schema.Types.ObjectId, ref: "Esperto", required: true }
});

//modifica fatta 
//prima
//module.exports = mongoose.model("Esercizio", EsercizioSchema, "esercizi");

//dopo
module.exports = mongoose.model("Esercizio", EsercizioSchema, "Esercizio");