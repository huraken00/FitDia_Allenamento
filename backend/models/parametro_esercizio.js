const mongoose = require("mongoose");

const ParametroEsercizioSchema = new mongoose.Schema({
  id_parametro: { type: mongoose.Schema.Types.ObjectId, ref: "Parametro", required: true },
  id_esercizio: { type: mongoose.Schema.Types.ObjectId, ref: "Esercizio", required: true }
});

module.exports = mongoose.model("ParametroEsercizio", ParametroEsercizioSchema, "parametro_esercizio");
