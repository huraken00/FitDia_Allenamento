const mongoose = require("mongoose");

const SportEsercizioSchema = new mongoose.Schema({
  id_sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },
  id_esercizio: { type: mongoose.Schema.Types.ObjectId, ref: "Esercizio", required: true }
});

module.exports = mongoose.model("SportEsercizio", SportEsercizioSchema, "SportEsercizio");
