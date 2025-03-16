const mongoose = require("mongoose");

const ParametroSchema = new mongoose.Schema({
  nome: { type: String, required: true }
});

module.exports = mongoose.model("Parametro", ParametroSchema, "Parametro");
