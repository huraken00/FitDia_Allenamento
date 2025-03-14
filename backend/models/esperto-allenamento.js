const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const EspertoSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Esperto_allenamento", EspertoSchema, "Esperto_allenamento");