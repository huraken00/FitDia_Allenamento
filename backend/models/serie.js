const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema per Serie
const serieSchema = new Schema(
  {
    peso: {
      type: Number,
      required: false, // Peso è opzionale
    },
    distanza: {
      type: Number,
      required: false, // Distanza è opzionale
    },
    durata: {
      type: Number,
      required: false, // Durata è opzionale (ad esempio in secondi)
    },
    ripetizioni: {
      type: Number,
      required: false, // Ripetizioni sono opzionali
    },
    // Riferimento all'allenamento a cui appartiene questa serie
    allenamento: {
      type: Schema.Types.ObjectId,
      ref: "Allenamento", // Riferimento al modello Allenamento
      required: true,
    },
    // Riferimento all'esercizio
    esercizio: {
      type: Schema.Types.ObjectId,
      ref: "Esercizio", // Riferimento al modello Esercizio
      required: true,
    },
  },
  { timestamps: true } // Aggiunge createdAt e updatedAt
);

const Serie = mongoose.model("Serie", serieSchema,"Serie");

module.exports = Serie;
