const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const EsercioSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  descrizione: { type: String, required: true },
  sport: { type: String, required: true },
  parametro: { type: String, required: true },

});

module.exports = mongoose.model("Direttore", DirectorSchema, "Direttore");