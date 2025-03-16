const mongoose = require("mongoose");

const EsercizioParametroSchema = new mongoose.Schema({
  esercizio_id: { type: mongoose.Schema.Types.ObjectId, ref: "Esercizio", required: true },
  parametri: [{ type: mongoose.Schema.Types.ObjectId, ref: "Parametro" }]
});

module.exports = mongoose.model("EsercizioParametro", EsercizioParametroSchema, "EsercizioParametro");
