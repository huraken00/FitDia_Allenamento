const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true }, // Chiave primaria
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, unique: true, required: true, match: /^[^\s@]+@[^\s@]+.[^\s@]+$/ }, // Validazione email
  password: { type: String, required: true, minlength: 8 }, // Andrà criptata
  scadenza_abbonamento: { type: Date, required: true }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Creiamo il modello
const User = mongoose.model("User", userSchema,"Utente");

module.exports = User;