const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: false }, // Chiave primaria
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, unique: true, required: true, match: /^[^\s@]+@[^\s@]+.[^\s@]+$/ }, // Validazione email
  password: { type: String, required: true, minlength: 8 }, 
  scadenza_abbonamento: { type: Date, required: true }
},{versionKey: false});



// Creiamo il modello
const User = mongoose.model("User", userSchema,"Utente");

module.exports = User;