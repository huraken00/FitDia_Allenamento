const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema per Serie
const serieSchema = new Schema(
  {
    peso: {
      type: Number,
      required: false // Peso della serie (opzionale)
    },
    distanza: {
      type: Number,
      required: false // Distanza della serie (opzionale)
    },
    durata: {
      type: Number,
      required: false // Durata della serie (opzionale)
    },
    ripetizioni: {
      type: Number,
      required: false // Ripetizioni della serie (opzionale)
    },
    id_allenamento: { 
      type: Schema.Types.ObjectId, 
      ref: "Allenamento", 
      required: true // Riferimento all'allenamento a cui appartiene la serie
    },
    id_esercizio: { 
      type: Schema.Types.ObjectId, 
      ref: "Esercizio", 
      required: true // Riferimento all'esercizio associato alla serie
    }
  },
  { timestamps: true } // Aggiunge createdAt e updatedAt
);

module.exports = mongoose.model("Serie", serieSchema, "Serie");
