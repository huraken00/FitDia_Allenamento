const mongoose = require("mongoose");

const ParametroSchema = new mongoose.Schema({
  tipo: { type: String, required: true }
});

module.exports = mongoose.model("Parametro", ParametroSchema, "parametri");
