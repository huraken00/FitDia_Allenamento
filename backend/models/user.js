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
    min: 0, 
    max: 10000,  
    required: false
  },
  Obiettivo_proteine:{
    type: Number, 
    min: 0, 
    max: 1000,  
    required: false
  },
  Obiettivo_carboidrati:{
    type: Number, 
    min: 0, 
    max: 1000,  
    required: false
  },
  Obiettivo_grassi:{
    type: Number, 
    min: 0, 
    max: 1000,  
    required: false
  },
  scadenza_abbonamento: { type: Date, required: true }
},{versionKey: false});



// Creiamo il modello
const User = mongoose.model("User", userSchema,"Utente");

module.exports = User;