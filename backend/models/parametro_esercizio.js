const mongoose = require("mongoose");

const EsercizioParametroSchema = new mongoose.Schema({
  id_esercizio: { type: mongoose.Schema.Types.ObjectId, ref: "Esercizio", required: true },
  id_parametro: { type: mongoose.Schema.Types.ObjectId, ref: "Parametro" ,required:true }
});

module.exports = mongoose.model("EsercizioParametro", EsercizioParametroSchema, "EsercizioParametro");
