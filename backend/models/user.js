const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: false }, // Chiave primaria
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, unique: true, required: true, match: /^[^\s@]+@[^\s@]+.[^\s@]+$/ }, // Validazione email
  password: { type: String, required: true, minlength: 8 }, 
  Obiettivo_Kcal:{
    type: Number, 
    default: 0,
    required: false
  },
  Obiettivo_proteine:{
    type: Number, 
    default: 0,  
    required: false
  },
  Obiettivo_carboidrati:{
    type: Number, 
    default: 0,   
    required: false
  },
  Obiettivo_grassi:{
    type: Number, 
    default: 0,  
    required: false
  },
  scadenza_abbonamento: { type: Date, required: true }
},{versionKey: false});



// Creiamo il modello
const User = mongoose.model("User", userSchema,"Utente");

module.exports = User;